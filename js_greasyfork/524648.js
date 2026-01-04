// ==UserScript==
// @name         LinkedinClipper
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @license      MIT
// @description  Plugin for clipping people from Linkedin to Persona
// @author       You
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @match        https://www.linkedin.com/in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/524648/LinkedinClipper.user.js
// @updateURL https://update.greasyfork.org/scripts/524648/LinkedinClipper.meta.js
// ==/UserScript==

const BASIC_URL = 'https://personin4-backend.cml.team/';
let TOKEN = localStorage.getItem('persona-token') || '';
let CURRENT_LINKEDIN = '';
let isModalOpened = false;
let projectId = null;
let vacancyId = null;
let campaignId = null;
let isHr = localStorage.getItem('isHr') || false;
let isSales = localStorage.getItem('isSales') || false;

class PersonaApp {

    static login(login, password) {
        const url = BASIC_URL + 'auth/login';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const response = JSON.parse(xhr.responseText ?? "{\"status\": 404, \"message\": \"User not found with email: unknown\"}");
                    console.log("Token is ", response);
                    resolve(response);
                }
            };
            xhr.send(JSON.stringify({email: login, password: password}));
        });
    }

    static getProjects() {
        const url = BASIC_URL + 'api/v2/projects';
        if (TOKEN === '') {
            showPersonaAuthenticationModal();
            console.log("Token is not set GET PROJECTS");
            return;
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static getCampaigns() {
        const url = BASIC_URL + 'campaigns?page=0&pageSize=200&sort=CREATED%3BDESC';
        if (TOKEN === '') {
            showPersonaAuthenticationModal();
            console.log("Token is not set GET PROJECTS");
            return;
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static movePersonToCampaign(campaignId, personIds) {
        const url = BASIC_URL + `campaigns/${campaignId}/participants/import`;
        if (TOKEN === '') {
            showPersonaAuthenticationModal();
            console.log("Token is not set GET HIRING WORKFLOW");
            return;
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send(JSON.stringify(personIds));
        });
    }

    static ping() {
        const url = BASIC_URL + 'auth/current-user';
        return new Promise((resolve) => {
            const xhr = new gmxhr();

            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.status === 200);
                }
            };
            xhr.send();
        });
    }

    static clipApplicant(submitRequest) {
        const url = BASIC_URL + 'linkedin/applicant';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log(xhr);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static checkApplicantExistence(applicantExistsCheckRequest) {
        const url = BASIC_URL + 'linkedin/applicant/check_existence';
        if (TOKEN === '') {
            console.log("Token is not set CHECK APPLICANT EXISTENCE");
            return;
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log('xhr', xhr);
                if (xhr.readyState === 4) {
                    resolve(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(applicantExistsCheckRequest));
        });
    }

    static getExistingApplicant(linkedin) {
        const url = BASIC_URL + `linkedin/existing-applicant?linkedin=${linkedin}`;
        if (TOKEN === '') {
            console.log("Token is not set EXISTING APPLICANT");
            throw new Error('Token is not set');
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else if (xhr.status === 409) {
                        // reject(new Error('There are multiple applicants with this LinkedIn profile.'));
                        let clipBtn = document.getElementById('persona-clip-button');
                        clipBtn.disabled = true;
                        clipBtn.textContent = 'There are multiple applicants with this LinkedIn profile.';
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static updateApplicant(submitRequest) {
        const url = BASIC_URL + 'linkedin/existing-applicant';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log(xhr);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static clipPerson(request) {
        const url = BASIC_URL + 'attendee/clip';
        if (TOKEN === '') {
            console.log("Token is not set for ATTENDEES");
            throw new Error('Token is not set');
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log('xhr', xhr);
                if (xhr.readyState === 4) {
                    resolve(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(request));
        });
    }

    static addNoteToPerson(submitRequest) {
        const url = BASIC_URL + `api/v2/notes/persons/${submitRequest.personId}`;
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log(xhr);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static checkPersonExistence(personExistsCheckRequest) {
        const url = BASIC_URL + 'attendee/check_existence';
        if (TOKEN === '') {
            console.log("Token is not set CHECK APPLICANT EXISTENCE");
            return;
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                console.log('xhr', xhr);
                if (xhr.readyState === 4) {
                    resolve(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(personExistsCheckRequest));
        });
    }

    static getExistingPerson(personExistsCheckRequest) {
        const url = BASIC_URL + `attendee/existing`;
        if (TOKEN === '') {
            console.log("Token is not set EXISTING PERSON");
            throw new Error('Token is not set');
        }
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        // resolve(JSON.parse(xhr.responseText ?? "{\"status\": 404, \"message\": \"User not found with email: unknown\"}"));
                        console.log("Not found person");
                    }
                }
            };
            xhr.send(JSON.stringify(personExistsCheckRequest));
        });
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function isApplicantPresentInPersona() {
    let checkApplicantExistenceRequest = {
        linkedin: decodeURIComponent(window.document.URL)
    }
    let res = await PersonaApp.checkApplicantExistence(checkApplicantExistenceRequest);
    console.log('res', res);
    if (res === 409) {
        console.log("More than one applicant in Persona with this linkedin. Please fix it");
    }
    return res === 'true';
}

async function isPersonPresentInPersona() {
    let fullNameElement = document.querySelector('div.mt2.relative');
    let fullName = fullNameElement.querySelectorAll('div')[0].querySelector('div').querySelector('h1');
    fullName = fullNameElement ? fullNameElement.textContent.trim() : '';

    let linkedinLink = decodeURIComponent(window.document.URL);

    let companyPositions = [];
    let positionElements = document.querySelectorAll('.experience-section .pv-entity__summary-info');
    positionElements.forEach(element => {
        let titleElement = element.querySelector('.t-16.t-black.t-bold');
        let companyElement = element.querySelector('.pv-entity__secondary-title');
        if (titleElement && companyElement) {
            companyPositions.push({
                title: titleElement.textContent.trim(),
                company: companyElement.textContent.trim()
            });
        }
    });

    let checkPersonExistenceRequest = {
        fullName: fullName,
        linkedin: linkedinLink,
        companyPositions: []
    };

    let res = await PersonaApp.checkPersonExistence(checkPersonExistenceRequest);
    console.log('res', res);
    return res === 'true';
}

async function showPersonaAuthenticationModal() {
    function createSuccessMessage() {
        let successMessage = document.createElement('div');
        successMessage.textContent = 'You have successfully logged in!';
        successMessage.style.backgroundColor = '#8bc34a';
        successMessage.style.color = '#fff';
        successMessage.style.padding = '10px';
        successMessage.style.borderRadius = '4px';
        successMessage.style.marginTop = '15px';
        return successMessage;
    }

    function createBadCredentialsMessage() {
        let badCredentialsMessage = document.createElement('div');
        badCredentialsMessage.textContent = 'Wrong login or password';
        badCredentialsMessage.style.backgroundColor = '#9b0a0a';
        badCredentialsMessage.style.color = '#fff';
        badCredentialsMessage.style.padding = '10px';
        badCredentialsMessage.style.borderRadius = '4px';
        badCredentialsMessage.style.marginTop = '15px';
        return badCredentialsMessage;
    }

    let modalContainer = createModalContainer('myModal', false);
    let contentContainer = createContentContainer();
    let successMessage = createSuccessMessage();
    let badCredentialsMessage = createBadCredentialsMessage();

    let title = document.createElement('h2');
    title.textContent = 'Please login into your Persona account';

    let loginInput = createInput('Email:', 'text');
    let passwordInput = createInput('Password:', 'password');

    let loginButton = createButton('Login', async function () {
        const response = await PersonaApp.login(loginInput.querySelector('input').value, passwordInput.querySelector('input').value);

        console.log("Login response: ", response);

        function showSuccessMessage() {
            loginInput.style.display = 'none';
            passwordInput.style.display = 'none';
            loginButton.style.display = 'none';
            cancelButton.style.display = 'none';
            hrCheckbox.style.display = 'none';
            salesCheckbox.style.display = 'none';
            checkboxContainer.style.display = 'none';
            badCredentialsMessage.style.display = 'none';
            contentContainer.appendChild(successMessage);
            successMessage.style.display = 'block';
            setTimeout(function () {
                successMessage.style.display = 'none';
                modalContainer.style.display = 'none';
            }, 2000);
        }

        function showBadCredentialsMessage() {
            contentContainer.appendChild(badCredentialsMessage);
            badCredentialsMessage.style.display = 'block';
        }

        if (response === undefined || response.code === 404 || response.code === 400) {
            const loginButton = document.querySelector('#login');
            loginButton.style.backgroundColor = "#9b0a0a";
            loginButton.textContent = "Invalid credentials";
            setTimeout(function () {
                loginButton.style.backgroundColor = "none";
            }, 1000);
            showBadCredentialsMessage();
        } else {
            localStorage.setItem('persona-token', response.accessToken);
            localStorage.setItem('isHr', response.roles.includes('ROLE_HR') || response.roles.includes('ROLE_ADMIN') || response.roles.includes('ROLE_SUPER_ADMIN'));
            localStorage.setItem('isSales', response.roles.includes('ROLE_SALES') || response.roles.includes('ROLE_ADMIN') || response.roles.includes('ROLE_SUPER_ADMIN'));

            TOKEN = response.accessToken;
            isModalOpened = false;
            document.querySelector('#persona-clip-button').style.display = 'none';
            title.textContent = `You have successfully logged in!`;
            showSuccessMessage();
        }
    });

    let cancelButton = createButton('Cancel', function () {
        modalContainer.style.display = 'none';
    });

    let checkboxContainer = document.createElement('div');
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.flexDirection = 'row';
    checkboxContainer.style.gap = '10px';

    // let hrCheckbox = createCheckbox("Hr", () => updateLoginButtonState(loginButton));
    // let salesCheckbox = createCheckbox("Sales", () => updateLoginButtonState(loginButton));
    // checkboxContainer.appendChild(hrCheckbox);
    // checkboxContainer.appendChild(salesCheckbox);

    contentContainer.appendChild(title);
    contentContainer.appendChild(loginInput);
    contentContainer.appendChild(passwordInput);
    contentContainer.appendChild(checkboxContainer);
    contentContainer.appendChild(loginButton);
    contentContainer.appendChild(cancelButton);

    modalContainer.appendChild(contentContainer);
    document.body.appendChild(modalContainer);
}


function createModalContainer(containerId, isPresent) {
    let modalContainer = document.createElement('div');
    modalContainer.id = containerId;
    // if (isPresent) {
    //     modalContainer.style.position = 'relative';
    //     modalContainer.style.width = '49%';
    // } else {
        modalContainer.style.position = 'fixed';
        modalContainer.style.width = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    // }
    modalContainer.style.display = 'block';
    modalContainer.style.zIndex = '1';
    modalContainer.style.left = '0';
    modalContainer.style.top = '0';
    modalContainer.style.height = '100%';
    modalContainer.style.overflow = 'auto';
    modalContainer.style.borderRadius = '25px';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        modalContainer.style.color = 'white';
    }

    return modalContainer;
}

function createContentContainer(isPresent) {
    let contentContainer = document.createElement('div');
    contentContainer.style.backgroundColor = '#fff';
    contentContainer.style.margin = '15% auto';
    contentContainer.style.padding = '20px';
    contentContainer.style.borderRadius = '25px';
    contentContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    contentContainer.style.width = '700px';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        contentContainer.style.color = 'white';
        contentContainer.style.backgroundColor = 'rgb(33,33,37)';
    }

    return contentContainer;
}

function createPhotoContainer(photoId, photo) {
    let photoContainer = document.createElement('div');
    photoContainer.id = photoId;
    photoContainer.style.width = '80px';
    photoContainer.style.height = '80px';
    photoContainer.style.borderRadius = '50%';
    photoContainer.style.backgroundColor = '#ddd';
    photoContainer.style.backgroundImage = `url(${photo})`;
    photoContainer.style.backgroundSize = 'cover';
    photoContainer.style.backgroundPosition = 'center';
    photoContainer.style.margin = '0 auto';
    if (photoId === 'existingPhoto') {
        photoContainer.addEventListener('click', function() {
            photoContainer.style.backgroundImage = `url(${document.querySelector('img.pv-top-card-profile-picture__image--show').src})`;
        });
    }
    return photoContainer;
}

function createHeading(headerText) {
    let heading = document.createElement('h2');
    heading.textContent = headerText;
    return heading;
}

function createForm(formId) {
    let form = document.createElement('form');
    form.id = formId;
    return form;
}

function createFirstNameInput(firstNameInputId, name) {
    let firstNameInput = document.createElement('input');
    firstNameInput.id = firstNameInputId;
    firstNameInput.type = 'text';
    firstNameInput.value = name;
    firstNameInput.style.marginBottom = '3px';
    firstNameInput.style.padding = '8px';
    firstNameInput.style.borderRadius = '4px';
    firstNameInput.style.border = '1px solid #ddd';
    firstNameInput.style.width = '100%';
    firstNameInput.style.color = 'black';
    return firstNameInput;
}

function createLastNameInput(lastNameInputId, name) {
    let lastNameInput = document.createElement('input');
    lastNameInput.id = lastNameInputId;
    lastNameInput.type = 'text';
    lastNameInput.value = name;
    lastNameInput.style.marginBottom = '3px';
    lastNameInput.style.padding = '8px';
    lastNameInput.style.borderRadius = '4px';
    lastNameInput.style.border = '1px solid #ddd';
    lastNameInput.style.width = '100%';
    lastNameInput.style.color = 'black';
    return lastNameInput;
}

function createFirstNameInputLabel(forFirstNameInput, labelText) {
    let firstNameLabel = document.createElement('label');
    firstNameLabel.textContent = labelText;
    firstNameLabel.htmlFor = forFirstNameInput;
    firstNameLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        firstNameLabel.style.color = 'white';
    } else {
        firstNameLabel.style.color = 'black';
    }
    return firstNameLabel;
}

function createLastNameInputLabel(forLastNameInput, labelText) {
    let lastNameLabel = document.createElement('label');
    lastNameLabel.textContent = labelText;
    lastNameLabel.htmlFor = forLastNameInput;
    lastNameLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        lastNameLabel.style.color = 'white';
    }
    return lastNameLabel;
}

function createNameContainer(firstNameInput, lastNameInput, firstNameLabel, lastNameLabel) {
    let nameContainer = document.createElement('div');
    nameContainer.style.display = 'flex';
    nameContainer.style.gap = '10px';
    nameContainer.style.marginBottom = '10px';

    let firstNameWrapper = document.createElement('div');
    firstNameWrapper.style.flex = '1';
    firstNameWrapper.appendChild(firstNameLabel);
    firstNameWrapper.appendChild(firstNameInput);

    let lastNameWrapper = document.createElement('div');
    lastNameWrapper.style.flex = '1';
    lastNameWrapper.appendChild(lastNameLabel);
    lastNameWrapper.appendChild(lastNameInput);

    nameContainer.appendChild(firstNameWrapper);
    nameContainer.appendChild(lastNameWrapper);

    return nameContainer;
}

function createLinkedinInput(lindeinIdInput, url) {
    let linkedinInput = document.createElement('input');
    linkedinInput.id = lindeinIdInput;
    linkedinInput.type = 'text';
    linkedinInput.value = url;
    linkedinInput.style.marginBottom = '3px';
    linkedinInput.style.padding = '8px';
    linkedinInput.style.borderRadius = '4px';
    linkedinInput.style.border = '1px solid #ddd';
    linkedinInput.style.width = '100%';
    linkedinInput.style.color = 'black';
    return linkedinInput;
}

function createApplicantPersonaLinkInput(value) {
    let applicantPersonaLink = document.createElement('a');
    applicantPersonaLink.href = value;
    applicantPersonaLink.textContent = value;
    applicantPersonaLink.style.display = 'block';
    applicantPersonaLink.target = '_blank';
    applicantPersonaLink.style.marginBottom = '3px';
    applicantPersonaLink.style.padding = '8px';
    applicantPersonaLink.style.borderRadius = '4px';
    applicantPersonaLink.style.border = '1px solid #ddd';
    applicantPersonaLink.style.width = '100%';
    applicantPersonaLink.style.textDecoration = 'none';
    applicantPersonaLink.style.color = '#000';
    return applicantPersonaLink;
}

function createApplicantPersonaLinkInputLabel(forApplicantPersonaLink) {
    let linkedinLabel = document.createElement('label');
    linkedinLabel.textContent = 'Applicant in Persona:';
    linkedinLabel.htmlFor = forApplicantPersonaLink;
    linkedinLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        linkedinLabel.style.color = 'white';
    }
    return linkedinLabel;
}

function createLinkedinInputLabel(forLinkedin) {
    let linkedinLabel = document.createElement('label');
    linkedinLabel.textContent = 'Linkedin:';
    linkedinLabel.htmlFor = forLinkedin;
    linkedinLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        linkedinLabel.style.color = 'white';
    }
    return linkedinLabel;
}

function createLocationInput(locationId, location) {
    let locationInput = document.createElement('input');
    locationInput.id = locationId;
    locationInput.type = 'text';
    locationInput.value = location
    locationInput.style.marginBottom = '3px';
    locationInput.style.padding = '8px';
    locationInput.style.borderRadius = '4px';
    locationInput.style.border = '1px solid #ddd';
    locationInput.style.width = '100%';
    locationInput.style.color = 'black';
    return locationInput;
}

function createLocationInputLabel(forLocation) {
    let locationLabel = document.createElement('label');
    locationLabel.textContent = 'Location:';
    locationLabel.htmlFor = forLocation;
    locationLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        locationLabel.style.color = 'white';
    }
    return locationLabel;
}

function createEmailInput(emailId, email) {
    let emailInput = document.createElement('input');
    emailInput.id = emailId;
    emailInput.type = 'text';
    emailInput.value = email
    emailInput.style.marginBottom = '3px';
    emailInput.style.padding = '8px';
    emailInput.style.borderRadius = '4px';
    emailInput.style.border = '1px solid #ddd';
    emailInput.style.width = '100%';
    emailInput.style.color = 'black';
    return emailInput;
}

function createEmailInputLabel(forEmail) {
    let emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    emailLabel.htmlFor = forEmail;
    emailLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        emailLabel.style.color = 'white';
    }
    return emailLabel;
}

function createPhoneInput(phoneId, phone) {
    let phoneInput = document.createElement('input');
    phoneInput.id = phoneId;
    phoneInput.type = 'text';
    phoneInput.value = phone
    phoneInput.style.marginBottom = '3px';
    phoneInput.style.padding = '8px';
    phoneInput.style.borderRadius = '4px';
    phoneInput.style.border = '1px solid #ddd';
    phoneInput.style.width = '100%';
    phoneInput.style.color = 'black';
    return phoneInput;
}

function createPhoneInputLabel(forPhone) {
    let phoneLabel = document.createElement('label');
    phoneLabel.textContent = 'Phone:';
    phoneLabel.htmlFor = forPhone;
    phoneLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        phoneLabel.style.color = 'white';
    }
    return phoneLabel;
}

function createDescriptionInput(descriptionId, description) {
    let noteInput = document.createElement('input');
    noteInput.id = descriptionId;
    noteInput.type = 'text';
    noteInput.value = description;
    noteInput.style.marginBottom = '3px';
    noteInput.style.padding = '8px';
    noteInput.style.borderRadius = '4px';
    noteInput.style.border = '1px solid #ddd';
    noteInput.style.width = '100%';
    noteInput.style.color = 'black';
    return noteInput;
}

function createDescriptionInputLabel(forDescription) {
    let noteLabel = document.createElement('label');
    noteLabel.textContent = 'Description:';
    noteLabel.htmlFor = forDescription;
    noteLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        noteLabel.style.color = 'white';
    }
    return noteLabel;
}

function createNoteInput(noteId, note) {
    let noteInput = document.createElement('input');
    noteInput.id = noteId;
    noteInput.type = 'text';
    noteInput.value = note;
    noteInput.style.marginBottom = '3px';
    noteInput.style.padding = '8px';
    noteInput.style.borderRadius = '4px';
    noteInput.style.border = '1px solid #ddd';
    noteInput.style.width = '100%';
    noteInput.style.color = 'black';
    return noteInput;
}

function createNoteInputLabel(forNote) {
    let noteLabel = document.createElement('label');
    noteLabel.textContent = 'Note:';
    noteLabel.htmlFor = forNote;
    noteLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        noteLabel.style.color = 'white';
    }
    return noteLabel;
}

function createCVInput(cvId, cv) {
    let cvInput = document.createElement('input');
    cvInput.id = cvId;
    cvInput.type = 'text';
    cvInput.value = cv
    cvInput.style.marginBottom = '3px';
    cvInput.style.padding = '8px';
    cvInput.style.borderRadius = '4px';
    cvInput.style.border = '1px solid #ddd';
    cvInput.style.width = '100%';
    cvInput.style.color = 'black';
    return cvInput;
}

function createCVInputLabel(forCV) {
    let cvLabel = document.createElement('label');
    cvLabel.textContent = 'CV:';
    cvLabel.htmlFor = forCV;
    cvLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        cvLabel.style.color = 'white';
    }
    return cvLabel;
}

function createDjinniInput(djinniId, djinni) {
    let djinniInput = document.createElement('input');
    djinniInput.id = djinniId;
    djinniInput.type = 'text';
    djinniInput.value = djinni;
    djinniInput.style.marginBottom = '3px';
    djinniInput.style.padding = '8px';
    djinniInput.style.borderRadius = '4px';
    djinniInput.style.border = '1px solid #ddd';
    djinniInput.style.width = '100%';
    djinniInput.style.color = 'black';
    return djinniInput;
}

function createDjinniInputLabel(forDjinni) {
    let djinniLabel = document.createElement('label');
    djinniLabel.textContent = 'Djinni:';
    djinniLabel.htmlFor = forDjinni;
    djinniLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        djinniLabel.style.color = 'white';
    }
    return djinniLabel;
}

function createDouInput(douId, dou) {
    let douInput = document.createElement('input');
    douInput.id = douId;
    douInput.type = 'text';
    douInput.value = dou;
    douInput.style.marginBottom = '3px';
    douInput.style.padding = '8px';
    douInput.style.borderRadius = '4px';
    douInput.style.border = '1px solid #ddd';
    douInput.style.width = '100%';
    douInput.style.color = 'black';
    return douInput;
}

function createDouInputLabel(forDou) {
    let douLabel = document.createElement('label');
    douLabel.textContent = 'Dou:';
    douLabel.htmlFor = forDou;
    douLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        douLabel.style.color = 'white';
    }
    return douLabel;
}

function createPortfolioInput(portfolioId, portfolio) {
    let portfolioInput = document.createElement('input');
    portfolioInput.id = portfolioId;
    portfolioInput.type = 'text';
    portfolioInput.value = portfolio;
    portfolioInput.style.marginBottom = '3px';
    portfolioInput.style.padding = '8px';
    portfolioInput.style.borderRadius = '4px';
    portfolioInput.style.border = '1px solid #ddd';
    portfolioInput.style.width = '100%';
    portfolioInput.style.color = 'black';
    return portfolioInput;
}

function createPortfolioInputLabel(forPortfolio) {
    let portfolioLabel = document.createElement('label');
    portfolioLabel.textContent = 'Portfolio:';
    portfolioLabel.htmlFor = forPortfolio;
    portfolioLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        portfolioLabel.style.color = 'white';
    }
    return portfolioLabel;
}

function createSkypeInput(skypeId, skype) {
    let skypeInput = document.createElement('input');
    skypeInput.id = skypeId;
    skypeInput.type = 'text';
    skypeInput.value = skype;
    skypeInput.style.marginBottom = '3px';
    skypeInput.style.padding = '8px';
    skypeInput.style.borderRadius = '4px';
    skypeInput.style.border = '1px solid #ddd';
    skypeInput.style.width = '100%';
    skypeInput.style.color = 'black';
    return skypeInput;
}

function createSkypeInputLabel(forSkype) {
    let skypeLabel = document.createElement('label');
    skypeLabel.textContent = 'Skype:';
    skypeLabel.htmlFor = forSkype;
    skypeLabel.style.marginBottom = '5px';
    // Check for dark theme
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        skypeLabel.style.color = 'white';
    }
    return skypeLabel;
}

function createTelegramInput(telegramId, telegram) {
    let telegramInput = document.createElement('input');
    telegramInput.id = telegramId;
    telegramInput.type = 'text';
    telegramInput.value = telegram;
    telegramInput.style.marginBottom = '3px';
    telegramInput.style.padding = '8px';
    telegramInput.style.borderRadius = '4px';
    telegramInput.style.border = '1px solid #ddd';
    telegramInput.style.width = '100%';
    telegramInput.style.color = 'black';
    return telegramInput;
}

function createTelegramInputLabel(forTelegram) {
    let telegramLabel = document.createElement('label');
    telegramLabel.textContent = 'Telegram:';
    telegramLabel.htmlFor = forTelegram;
    telegramLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        telegramLabel.style.color = 'white';
    }
    return telegramLabel;
}

function createStatusInput(statusId, status) {
    let statusInput = document.createElement('input');
    statusInput.id = statusId;
    statusInput.type = 'text';
    statusInput.value = status;
    statusInput.style.marginBottom = '3px';
    statusInput.style.padding = '8px';
    statusInput.style.borderRadius = '4px';
    statusInput.style.border = '1px solid #ddd';
    statusInput.style.width = '100%';
    statusInput.style.color = 'black';
    statusInput.disabled = 'true';
    return statusInput;
}

function createStatusInputLabel(forStatus) {
    let statusLabel = document.createElement('label');
    statusLabel.textContent = 'Status:';
    statusLabel.htmlFor = forStatus;
    statusLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        statusLabel.style.color = 'white';
    }
    return statusLabel;
}

function createSalaryInput(salaryId, salary) {
    let salaryInput = document.createElement('input');
    salaryInput.id = salaryId;
    salaryInput.type = 'text';
    salaryInput.value = status;
    salaryInput.style.marginBottom = '3px';
    salaryInput.style.padding = '8px';
    salaryInput.style.borderRadius = '4px';
    salaryInput.style.border = '1px solid #ddd';
    salaryInput.style.width = '100%';
    salaryInput.style.color = 'black';
    return salaryInput;
}

function createSalaryInputLabel(forSalary) {
    let salaryLabel = document.createElement('label');
    salaryLabel.textContent = 'Salary:';
    salaryLabel.htmlFor = forSalary;
    salaryLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        salaryLabel.style.color = 'white';
    }
    return salaryLabel;
}

function createSenioritySelect(seniorityId, selectedSeniority) {
    let senioritySelect = document.createElement('select');
    senioritySelect.id = seniorityId;
    senioritySelect.style.marginBottom = '3px';
    senioritySelect.style.borderRadius = '4px';
    senioritySelect.style.border = '1px solid #ddd';
    senioritySelect.style.width = '100%';
    senioritySelect.style.color = 'black';

    const seniorityLevels = [
        { value: '', text: 'Select Seniority' }, // Default null option
        { value: 'TRAINEE', text: 'TRAINEE' },
        { value: 'JUNIOR', text: 'JUNIOR' },
        { value: 'STRONG_JUNIOR', text: 'STRONG_JUNIOR' },
        { value: 'MIDDLE', text: 'MIDDLE' },
        { value: 'STRONG_MIDDLE', text: 'STRONG_MIDDLE' },
        { value: 'SENIOR', text: 'SENIOR' },
        { value: 'ARCHITECT', text: 'ARCHITECT' }
    ];

    seniorityLevels.forEach(level => {
        let option = document.createElement('option');
        option.value = level.value;
        option.textContent = level.text;
        if (level.value === selectedSeniority) {
            option.selected = true;
        }
        senioritySelect.appendChild(option);
    });

    return senioritySelect;
}

function createSeniorityInputLabel(forSeniority) {
    let seniorityLabel = document.createElement('label');
    seniorityLabel.textContent = 'Seniority:';
    seniorityLabel.htmlFor = forSeniority;
    seniorityLabel.style.marginBottom = '5px';
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        seniorityLabel.style.color = 'white';
    }
    return seniorityLabel;
}


function createProjectsDropdownLabel(projectsDropdown) {
    let locationLabel = document.createElement('label');
    locationLabel.textContent = 'Project:';
    locationLabel.htmlFor = projectsDropdown;
    locationLabel.style.marginBottom = '5px';
    // Check for dark theme
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        locationLabel.style.color = 'white'; // Change text color for dark theme
    }
    return locationLabel;
}

function createProjectsDropdown() {
    let projectsDropdown = document.createElement("select");
    projectsDropdown.id = "projectsDropdown";
    projectsDropdown.className = "custom-dropdown";
    projectsDropdown.name = "projects";
    projectsDropdown.style.border = "1px solid #ccc";
    projectsDropdown.style.width = "100%";
    projectsDropdown.style.borderRadius = "4px";
    projectsDropdown.style.backgroundColor = '#fff';
    projectsDropdown.style.color = '#000';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        projectsDropdown.style.backgroundColor = '#333';
        projectsDropdown.style.color = '#fff';
    }

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a project";
    defaultOption.selected = true;

    projectsDropdown.appendChild(defaultOption);

    return projectsDropdown;
}

function createProjectsDropdownExisting() {
    let projectsDropdown = document.createElement("select");
    projectsDropdown.id = "projectsDropdownExisting";
    projectsDropdown.className = "custom-dropdown";
    projectsDropdown.name = "projects";
    projectsDropdown.style.fontSize = "16px";
    projectsDropdown.style.border = "1px solid #ccc";
    projectsDropdown.style.width = "100%";
    projectsDropdown.style.color = 'black';

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a project";
    defaultOption.selected = true;

    projectsDropdown.appendChild(defaultOption);

    return projectsDropdown;
}

function createVacanciesDropdownLabel(vacanciesDropdown) {
    let locationLabel = document.createElement('label');
    locationLabel.textContent = 'Vacancy:';
    locationLabel.htmlFor = vacanciesDropdown;
    locationLabel.style.marginBottom = '5px';
    // Check for dark theme
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        locationLabel.style.color = 'white'; // Change text color for dark theme
    }
    return locationLabel;
}

function createVacanciesDropdown() {
    let vacanciesDropdown = document.createElement("select");
    vacanciesDropdown.id = "vacanciesDropdown";
    vacanciesDropdown.className = "custom-dropdown";
    vacanciesDropdown.name = "vacancies";
    vacanciesDropdown.style.border = "1px solid #ccc";
    vacanciesDropdown.style.width = "100%";
    vacanciesDropdown.disabled = true;
    vacanciesDropdown.style.color = 'black';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        vacanciesDropdown.style.backgroundColor = '#333';
        vacanciesDropdown.style.color = '#fff';
    }

    return vacanciesDropdown;
}

function createVacanciesDropdownExisting() {
    let vacanciesDropdown = document.createElement("select");
    vacanciesDropdown.id = "vacanciesDropdownExisting";
    vacanciesDropdown.className = "custom-dropdown";
    vacanciesDropdown.name = "vacancies";
    vacanciesDropdown.style.fontSize = "16px";
    vacanciesDropdown.style.border = "1px solid #ccc";
    vacanciesDropdown.style.width = "100%";
    vacanciesDropdown.style.color = 'black';
    return vacanciesDropdown;
}

async function createCampaignsDropdown() {
    let campaignsDropdown = document.createElement("select");
    campaignsDropdown.id = "campaignsDropdown";
    campaignsDropdown.style.border = "1px solid #ccc";
    campaignsDropdown.style.width = "100%";
    campaignsDropdown.style.borderRadius = "4px";
    campaignsDropdown.style.backgroundColor = '#fff';
    campaignsDropdown.style.color = '#000';
    campaignsDropdown.style.maxHeight = '150px';
    campaignsDropdown.style.overflowY = 'auto';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        campaignsDropdown.style.backgroundColor = '#333';
        campaignsDropdown.style.color = '#fff';
    }

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "No campaign";
    defaultOption.selected = true;
    campaignsDropdown.appendChild(defaultOption);

    try {
        const campaignsResponse = await PersonaApp.getCampaigns();
        const campaigns = campaignsResponse.campaigns;

        campaigns.forEach(campaign => {
            let option = document.createElement("option");
            option.value = campaign.id;
            option.textContent = campaign.name;
            campaignsDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
    }

    campaignsDropdown.addEventListener('change', function () {
        campaignId = campaignsDropdown.value;
        console.log('Selected campaignId:', campaignId);
    });

    return campaignsDropdown;
}

async function createConfirmButton(isPresentInApplication) {
    let clipButton = document.createElement('button');
    clipButton.id = "confirm-btn";
    clipButton.textContent = isPresentInApplication ? 'Update' : 'Clip';
    clipButton.style.padding = '7px 11px';
    clipButton.style.backgroundColor = '#0a66c2';
    clipButton.style.color = '#fff';
    clipButton.style.border = 'none';
    clipButton.style.borderRadius = '25px';
    clipButton.style.cursor = 'pointer';
    clipButton.style.fontFamily = 'inherit';
    clipButton.style.fontWeight = '800';
    clipButton.style.fontSize = 'var(--artdeco-reset-base-font-size-hundred-percent)';
    clipButton.style.marginTop = '10px';
    clipButton.style.width = '80px';
    return clipButton;
}

async function createLoadingButton() {
    let button = document.createElement('button');
    button.textContent = 'Loading...';
    button.style.padding = '7px 11px';
    button.style.backgroundColor = '#0a66c2';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.fontFamily = 'inherit';
    button.style.fontWeight = '700';
    button.style.fontSize = 'var(--artdeco-reset-base-font-size-hundred-percent)';
    button.style.marginLeft = '24px';
    button.style.marginBottom = '12px';
    button.disabled = true; // Disable the button to prevent clicks
    return button;
}

function createHideModalButton(modalContainer) {
    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '25px';
    cancelButton.style.backgroundColor = '#ddd';
    cancelButton.style.border = 'none';
    cancelButton.style.marginTop = '10px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.width = '80px';
    cancelButton.addEventListener('click', function () {
        isModalOpened = false;
        document.body.removeChild(modalContainer);
    });
    return cancelButton;
}

function createHideModalButtonExisting() {
    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '25px';
    cancelButton.style.backgroundColor = '#ddd';
    cancelButton.style.border = 'none';
    cancelButton.style.marginTop = '10px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.width = '80px';
    cancelButton.addEventListener('click', function () {
        isModalOpened = false;
        document.body.removeChild(document.getElementById('mixContainer'));
        // document.getElementById('persona-clip-button').remove();
    });
    return cancelButton;
}

function createButtonContainer() {
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.alignSelf = 'center';
    buttonContainer.style.padding = '0 15%';
    return buttonContainer;
}

function createMixContainer(modalContainer, modalContainerExisting) {
    let mixContainer = document.createElement('div');
    mixContainer.id = 'mixContainer';
    mixContainer.style.display = 'flex';
    mixContainer.style.position = 'fixed';
    mixContainer.style.zIndex = '1';
    mixContainer.style.left = '0';
    mixContainer.style.top = '0';
    mixContainer.style.width = '100%';
    mixContainer.style.height = '100%';
    mixContainer.style.overflow = 'auto';
    mixContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    mixContainer.style.borderRadius = '25px';
    mixContainer.style.justifyContent = 'space-between';

    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        mixContainer.style.color = 'white';
    }

    mixContainer.appendChild(modalContainer);
    mixContainer.appendChild(modalContainerExisting);

    return mixContainer;
}

async function showApplicantClipModal(photo, firstName, lastName, location, technology, seniority, existingApplicant) {
    let isPresent = await isApplicantPresentInPersona();
    isModalOpened = true;
    let modalContainer = createModalContainer('myModal', isPresent);
    let contentContainer = createContentContainer(isPresent);
    let photoContainer = createPhotoContainer('newPhoto', photo);
    let heading = createHeading('New applicant info:');
    let form = createForm('newApplicantForm');

    let firstNameInput = createFirstNameInput('newFirstName', firstName);
    let firstNameLabel = createFirstNameInputLabel(firstNameInput, 'Applicant first name:');

    let lastNameInput = createLastNameInput('newLastName', lastName);
    let lastNameLabel = createLastNameInputLabel(lastNameInput, 'Applicant last name:');

    let nameContainer = createNameContainer(firstNameInput, lastNameInput, firstNameLabel, lastNameLabel);

    let emailInput = createEmailInput('newEmail', '');
    let emailLabel = createEmailInputLabel(emailInput);

    let linkedinInput = createLinkedinInput('newLinkedin', decodeURIComponent(window.document.URL).replace('/about/', ''));
    let linkedinLabel = createLinkedinInputLabel(linkedinInput);

    let locationInput = createLocationInput('newLocation', location);
    let locationLabel = createLocationInputLabel(locationInput);

    let seniorityInput = createSenioritySelect('newSeniority', seniority);
    let seniorityLabel = createSeniorityInputLabel(seniorityInput);

    let modalContainerExisting, contentContainerExisting, photoContainerExisting, headingExisting, formExisting, linkedinInputExisting, linkedinLabelExisting, locationInputExisting, locationLabelExisting, firstNameInputExisting,
        firstNameLabelExisting, lastNameInputExisting, lastNameLabelExisting, nameContainerExisting, applicantInPersonaLinkInput, applicantInPersonaLinkLabel, emailInputExisting, emailLabelExisting,
        phoneInputExisting, phoneLabelExisting, cvInputExisting, cvLabelExisting, djinniInputExisting, djinniLabelExisting, douInputExisting, douLabelExisting, portfolioInputExisting, portfolioLabelExisting,
        skypeInputExisting, skypeLabelExisting, telegramInputExisting, telegramLabelExisting, statusInputExisting, statusLabelExisting, salaryInputExisting, salaryLabelExisting,
        projectsDropdownLabelExisting, projectsDropdownExisting, vacanciesDropdownExisting, vacanciesDropdownLabelExisting, seniorityInputExisting, seniorityLabelExisting;
    console.log("EXISTING APPLICANT", existingApplicant);
    if (isPresent && existingApplicant) {
        modalContainerExisting = createModalContainer('myModalExisting', isPresent);
        contentContainerExisting = createContentContainer(isPresent);
        photoContainerExisting = createPhotoContainer('existingPhoto', existingApplicant?.avatars.find(avatar => avatar.main === true)?.photoUrl);
        headingExisting = createHeading('Existing applicant info:');
        formExisting = createForm('existingApplicantForm');

        linkedinInputExisting = createLinkedinInput('existingLinkedin', existingApplicant?.linkedinLink);
        linkedinLabelExisting = createLinkedinInputLabel(linkedinInputExisting);

        locationInputExisting = createLocationInput('existingLocation', existingApplicant?.country);
        locationLabelExisting = createLocationInputLabel(locationInputExisting);

        firstNameInputExisting = createFirstNameInput('existingFirstName', existingApplicant?.firstName);
        firstNameLabelExisting = createFirstNameInputLabel(firstNameInputExisting, 'Applicant first name:');
        lastNameInputExisting = createLastNameInput('existingLastName', existingApplicant?.lastName);
        lastNameLabelExisting = createLastNameInputLabel(lastNameInputExisting, 'Applicant last name:');
        nameContainerExisting = createNameContainer(firstNameInputExisting, lastNameInputExisting, firstNameLabelExisting, lastNameLabelExisting);

        applicantInPersonaLinkInput = createApplicantPersonaLinkInput('https://personin4.cml.team/applicant/'+ existingApplicant?.id);
        applicantInPersonaLinkLabel = createApplicantPersonaLinkInputLabel(applicantInPersonaLinkInput);

        emailInputExisting = createEmailInput('existingEmail', existingApplicant?.email);
        emailLabelExisting = createEmailInputLabel(emailInputExisting);

        phoneInputExisting = createPhoneInput('existingPhone', existingApplicant?.phone);
        phoneLabelExisting = createPhoneInputLabel(phoneInputExisting);

        cvInputExisting = createCVInput('existingCV', existingApplicant?.cvLink);
        cvLabelExisting = createCVInputLabel(cvInputExisting);

        djinniInputExisting = createDjinniInput('existingDjinni', existingApplicant?.djinniLink);
        djinniLabelExisting = createDjinniInputLabel(djinniInputExisting);

        douInputExisting = createDouInput('existingDou', existingApplicant?.douLink);
        douLabelExisting = createDouInputLabel(douInputExisting);

        portfolioInputExisting = createPortfolioInput('existingPortfolio', existingApplicant?.portfolioLink);
        portfolioLabelExisting = createPortfolioInputLabel(portfolioInputExisting);

        skypeInputExisting = createSkypeInput('existingSkype', existingApplicant?.skype);
        skypeLabelExisting = createSkypeInputLabel(skypeInputExisting);

        telegramInputExisting = createTelegramInput('existingTelegram', existingApplicant?.telegram);
        telegramLabelExisting = createTelegramInputLabel(telegramInputExisting);

        statusInputExisting = createStatusInput('existingStatus', existingApplicant?.status);
        statusLabelExisting = createStatusInputLabel(statusInputExisting);

        salaryInputExisting = createSalaryInput('existingSalary', existingApplicant?.salary);
        salaryLabelExisting = createSalaryInputLabel(salaryInputExisting);

        seniorityInputExisting = createSenioritySelect('newSeniorityExisting', existingApplicant?.seniority);
        seniorityLabelExisting = createSeniorityInputLabel(seniorityInputExisting);

        projectsDropdownExisting = createProjectsDropdownExisting();
        projectsDropdownLabelExisting = createProjectsDropdownLabel(projectsDropdownExisting);

        vacanciesDropdownExisting = createVacanciesDropdownExisting();
        vacanciesDropdownLabelExisting = createVacanciesDropdownLabel(vacanciesDropdownExisting);
        if (existingApplicant?.project.id == null || existingApplicant?.project.id === '') {
            vacanciesDropdown.disabled = true;
        }

        projectVacancyActionExisting(existingApplicant?.project.id, existingApplicant?.vacancy.id, projectsDropdownExisting, vacanciesDropdownExisting);
    }

    const projects = await getProjects();

    let projectsDropdown = createProjectsDropdown();
    let projectsDropdownLabel = createProjectsDropdownLabel(projectsDropdown);

    let vacanciesDropdown = createVacanciesDropdown();
    let vacanciesDropdownLabel = createVacanciesDropdownLabel(vacanciesDropdown);

    projectVacancyAction(projects, projectsDropdown, vacanciesDropdown);

    let clipButton = await createConfirmButton(isPresent);

    clipButton.addEventListener('click', async () => {
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value
        const linkedin = linkedinInput.value;
        const location = locationInput.value;
        const email = emailInput.value || null;
        const request = {
            firstName: firstName,
            lastName: lastName,
            phone: null,
            projectId: Number(projectId),
            vacancyId: Number(vacancyId),
            country: location,
            applicationSource: 'LINKED_IN',
            email: email,
            linkedinLink: linkedin,
            portfolioLink: null,
            technologies: technology,
            seniority: seniority,
            avatarUrl: photo
        }
        console.log('request', request);
        let response = await PersonaApp.clipApplicant(request);
        if (response) {
            clipButton.style.backgroundColor = '#4BB543';
            clipButton.style.width = '100px';
            clipButton.textContent = 'Success!'
            setTimeout(function () {
                document.body.removeChild(modalContainer);
            }, 1000);
        } else {
            clipButton.textContent = 'Error';
            clipButton.style.backgroundColor = '#c20a0a';
        }
    });

    clipButton.disabled = true;
    clipButton.style.backgroundColor = '#b4c4d4';
    clipButton.style.cursor = 'not-allowed';

    form.appendChild(photoContainer);
    form.appendChild(nameContainer);
    form.appendChild(linkedinInput);
    form.insertBefore(linkedinLabel, linkedinInput);
    form.appendChild(emailInput);
    form.insertBefore(emailLabel, emailInput);
    form.appendChild(locationInput);
    form.insertBefore(locationLabel, locationInput);
    form.appendChild(seniorityInput);
    form.insertBefore(seniorityLabel, seniorityInput);
    form.appendChild(projectsDropdown);
    form.insertBefore(projectsDropdownLabel, projectsDropdown);
    form.appendChild(vacanciesDropdown);
    form.insertBefore(vacanciesDropdownLabel,vacanciesDropdown);

    contentContainer.appendChild(heading);
    contentContainer.appendChild(form);
    if (!isPresent) {
        let cancelButton = createHideModalButton(modalContainer);
        let buttonContainer = createButtonContainer();
        buttonContainer.appendChild(clipButton);
        buttonContainer.appendChild(cancelButton);
        contentContainer.appendChild(buttonContainer);
    }

    if (await isApplicantPresentInPersona()) {
        let formElements = form.elements;
        for (var i = 0, len = formElements.length; i < len; ++i) {
            formElements[i].disabled = true;
        }
        formExisting.appendChild(photoContainerExisting);

        formExisting.appendChild(applicantInPersonaLinkInput);
        formExisting.insertBefore(applicantInPersonaLinkLabel, applicantInPersonaLinkInput);

        formExisting.appendChild(nameContainerExisting);

        formExisting.appendChild(linkedinInputExisting);
        formExisting.insertBefore(linkedinLabelExisting, linkedinInputExisting);

        formExisting.appendChild(locationInputExisting);
        formExisting.insertBefore(locationLabelExisting, locationInputExisting);

        formExisting.appendChild(projectsDropdownExisting);
        formExisting.insertBefore(projectsDropdownLabelExisting, projectsDropdownExisting);

        formExisting.appendChild(vacanciesDropdownExisting);
        formExisting.insertBefore(vacanciesDropdownLabelExisting, vacanciesDropdownExisting);

        formExisting.appendChild(emailInputExisting);
        formExisting.insertBefore(emailLabelExisting, emailInputExisting);

        formExisting.appendChild(phoneInputExisting);
        formExisting.insertBefore(phoneLabelExisting, phoneInputExisting);

        formExisting.appendChild(cvInputExisting);
        formExisting.insertBefore(cvLabelExisting, cvInputExisting);

        formExisting.appendChild(djinniInputExisting);
        formExisting.insertBefore(djinniLabelExisting, djinniInputExisting);

        formExisting.appendChild(douInputExisting);
        formExisting.insertBefore(douLabelExisting, douInputExisting);

        formExisting.appendChild(portfolioInputExisting);
        formExisting.insertBefore(portfolioLabelExisting, portfolioInputExisting);

        formExisting.appendChild(skypeInputExisting);
        formExisting.insertBefore(skypeLabelExisting, skypeInputExisting);

        formExisting.appendChild(telegramInputExisting);
        formExisting.insertBefore(telegramLabelExisting, telegramInputExisting);

        formExisting.appendChild(statusInputExisting);
        formExisting.insertBefore(statusLabelExisting, statusInputExisting);

        formExisting.appendChild(salaryInputExisting);
        formExisting.insertBefore(salaryLabelExisting, salaryInputExisting);

        formExisting.appendChild(seniorityInputExisting);
        formExisting.insertBefore(seniorityLabelExisting, seniorityInputExisting);

        let clipButtonExisting = await createConfirmButton(isPresent);

        clipButtonExisting.addEventListener('click', async () => {
            const firstName = firstNameInputExisting.value || null;
            const lastName = lastNameInputExisting.value || null;
            const linkedin = linkedinInputExisting.value || null;
            const location = locationInputExisting.value || null;
            const email = emailInputExisting.value || null;
            const phone = phoneInputExisting.value || null;
            const cv = cvInputExisting.value || null;
            const djinni = djinniInputExisting.value || null;
            const dou = douInputExisting.value || null;
            const portfolio = portfolioInputExisting.value || null;
            const skype = skypeInputExisting.value || null;
            const telegram = telegramInputExisting.value || null;
            const salary = salaryInputExisting.value || null
            const project = projectsDropdownExisting.value || null;
            const vacancy = vacanciesDropdownExisting.value || null;
            const seniority = seniorityInputExisting.value || null;
            const avatar = document.getElementById('existingPhoto').currentStyle || window.getComputedStyle(document.getElementById('existingPhoto'), false).backgroundImage.slice(4, -1) || null;;

            const updateRequest = {
                id: existingApplicant.id,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                projectId: Number(project),
                vacancyId: Number(vacancy),
                country: location,
                applicationSource: 'LINKED_IN',
                email: email,
                linkedinLink: linkedin,
                portfolioLink: portfolio,
                cv: cv,
                skype: skype,
                telegram: telegram,
                salary: Number(salary),
                technologies: technology,
                seniority: seniority,
                avatarUrl: avatar
            }
            console.log('updateRequest', updateRequest);
            let response = await PersonaApp.updateApplicant(updateRequest);
            if (response) {
                clipButtonExisting.style.backgroundColor = '#4BB543';
                clipButtonExisting.style.width = '100px';
                clipButtonExisting.textContent = 'Success!'
                setTimeout(function () {
                    document.body.removeChild(document.getElementById('mixContainer'));
                }, 1000);
            } else {
                clipButtonExisting.textContent = 'Error';
                clipButtonExisting.style.backgroundColor = '#c20a0a';
            }
        });

        let cancelButtonExisting = createHideModalButtonExisting();
        let buttonContainerExisting = createButtonContainer();
        buttonContainerExisting.appendChild(clipButtonExisting);
        buttonContainerExisting.appendChild(cancelButtonExisting);
        contentContainerExisting.appendChild(buttonContainerExisting);

        contentContainerExisting.appendChild(headingExisting);
        contentContainerExisting.appendChild(formExisting);
        contentContainerExisting.appendChild(buttonContainerExisting);

        modalContainer.appendChild(contentContainer);
        modalContainerExisting.appendChild(contentContainerExisting);

        document.body.appendChild(createMixContainer(modalContainer, modalContainerExisting));
    } else {
        modalContainer.appendChild(contentContainer);
        document.body.appendChild(modalContainer);
    }
}

function toExistingTechnology(inputString) {
    const technologies = ['Full Stack',
                          '.NET', 'React', 'Sales', 'Front end', 'Frontend', 'Front-end', 'Backend', 'Java', 'PHP', 'Angular', 'JavaScript', 'Blockchain', 'Cryptocurrency',
                          'React Native', 'Web3', 'Laravel', 'iOS', 'Python', 'Django', 'Web Development', 'Web UI', 'Widget', 'WhatsApp', 'Wix',
                          'Rust', 'Flutter', 'ASP.NET', 'C#', 'Ruby', 'C++', 'UX & UI Design', 'Landing Page', 'Kotlin', 'AI Bot', 'AI Chatbot', 'AI Content Creation',
                          'AJAX', 'Android', 'Apache Kafka', 'ASP.NET', 'C ', 'ChatGPT', 'CI/CD', 'Dart', 'DevOps', 'DNS', 'Docker', 'Dynamo DB', 'FinTech', 'Firebase', 'Game',
                          'German', 'Git', 'GitHub', 'GitLab', 'Gradle', 'Healthcare', 'Hibernate', 'Heroku', 'HR', 'HTML', 'J2EE', 'Jakarta EE', 'Jest', 'JUnit', 'Kubernetes', 'Web Design',
                          'LeadGen', 'Linux', 'MariaDB', 'Microservice', 'mobile', 'MongoDB', 'MySQL', 'NFT', 'NFC', 'Node.js', 'Oracle', 'Vue.js', 'VueJs', 'TypeScript',
                          'PayTech', 'Perl', 'PostgreSQL', 'Product Design', 'Project Analysis', 'Project Management', 'QA Testing', 'RabbitMQ', 'Redis', 'Redux', 'SaaS', 'Scala',
                          'Scrum', 'Selenium', 'Shopify', 'Spring Boot', 'Spring Framework', 'Spring Security', 'SQL', 'Swing', 'Tailwind UI', 'Telegram', 'TensorFlow', 'Terraform',
                         'Test Automation', 'Test Management', 'Thymeleaf', 'Unity', 'Unit Testing', 'User Experience Design', 'User Interface Design', 'UX & UI', 'Visual Basic', 'Virtual Reality'];
    const lowerCaseInput = inputString.toLowerCase();
    const projectManager = lowerCaseInput.toLowerCase().includes('project manager') ? ['Project Management'] : [];
    const productManager = lowerCaseInput.toLowerCase().includes('product manager') ? ['Project Management'] : [];
    const qa = lowerCaseInput.toLowerCase().includes('qa') ? ['QA Testing'] : [];
    const productDesigner = lowerCaseInput.toLowerCase().includes('product designer') ? ['Product Design'] : [];
    const uiux = lowerCaseInput.toLowerCase().includes('ui/ux') || lowerCaseInput.toLowerCase().includes('ui ux') ? ['UX & UI Design'] : [];
    const webDeveloper = lowerCaseInput.toLowerCase().includes('web developer') ? ['Web Development'] : [];
    const businessAnalyst = lowerCaseInput.toLowerCase().includes('business analyst') || lowerCaseInput.toLowerCase().includes('business analytics')? ['Business Analysis'] : [];
    const node = lowerCaseInput.toLowerCase().includes('node') ? ['Node.js'] : [];
    const next = lowerCaseInput.toLowerCase().includes('next') ? ['Next.js'] : [];
    const nest = lowerCaseInput.toLowerCase().includes('nest') ? ['Nest.js'] : [];
    const backend = lowerCaseInput.toLowerCase().includes('back end') || lowerCaseInput.toLowerCase().includes('back-end') ? ['Backend'] : [];
    const foundTechnologies = technologies.filter(tech => lowerCaseInput.includes(tech.toLowerCase()));

    const combinedTechnologies = [...projectManager, ...productManager, ...qa, ...productDesigner, ...backend,
                                  ...uiux, ...webDeveloper, ...businessAnalyst, ...node, ...next, ...nest, ...foundTechnologies];

    return combinedTechnologies;
}

function extractSeniority(inputString) {
    let seniority = null;
    const lowerCaseInput = inputString.toLowerCase();
    if (lowerCaseInput.toLowerCase().includes('trainee')){
        return 'TRAINEE';
    }
    if (lowerCaseInput.toLowerCase().includes('strong junior')){
        return 'STRONG_JUNIOR';
    }
    if (lowerCaseInput.toLowerCase().includes('junior')){
        return 'JUNIOR';
    }
    if (lowerCaseInput.toLowerCase().includes('strong middle')){
        return 'STRONG_MIDDLE';
    }
    if (lowerCaseInput.toLowerCase().includes('middle')){
        return 'MIDDLE';
    }
    if (lowerCaseInput.toLowerCase().includes('senior')){
        return 'SENIOR';
    }
    if (lowerCaseInput.toLowerCase().includes('architect')){
        return 'ARCHITECT';
    }

    return seniority;
}

function showProfileInfo(existingApplicant) {
    let photoElement = document.querySelector('img.pv-top-card-profile-picture__image--show');
    let photo = photoElement ? photoElement.src : '';

    let fullNameElement = document.querySelector('div.mt2.relative');
    let fullName = fullNameElement.querySelectorAll('div')[0].querySelector('div').querySelector('h1');
    fullName = fullNameElement ? fullNameElement.textContent.trim() : '';

    let [firstName, ...lastNameParts] = fullName.split(' ');
    let lastName = lastNameParts[0];

    let locationElement = document.querySelector('span.text-body-small.inline.t-black--light.break-words');
    let location = locationElement ? locationElement.textContent.trim().split(',').pop().trim() : '';

    let headlineElement = document.querySelector('div.text-body-medium.break-words');
    let headline = headlineElement ? headlineElement.textContent.trim() : '';

    let technology = toExistingTechnology(headline);
    let seniority = extractSeniority(headline);

    showApplicantClipModal(photo, firstName, lastName, location, technology, seniority, existingApplicant);
}

async function createClipButton() {
    let isAuthenticated = await PersonaApp.ping();
    let isPresentInApplication = await isApplicantPresentInPersona();
    let button = document.createElement('button');
    button.id = 'persona-clip-button';
    button.textContent = 'Loading...';
    button.style.padding = '7px 11px';
    button.style.backgroundColor = '#0a66c2';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.fontFamily = 'inherit';
    button.style.fontWeight = '700';
    button.style.fontSize = 'var(--artdeco-reset-base-font-size-hundred-percent)';
    button.style.marginLeft = '24px';
    button.style.marginBottom = '12px';
    button.id = 'persona-clip-button';
    if (!isAuthenticated) {
        button.textContent = 'Login to Persona';
    } else if (isPresentInApplication) {
        button.textContent = 'Update Applicant';
    } else {
        button.textContent = 'Clip Applicant';
    }

    button.onclick = async function () {
        if (isAuthenticated && isModalOpened) {
            if(isPresentInApplication) {
                let linkedinUrl = decodeURIComponent(window.document.URL).replace("http://", "");
                console.log('linkedinUrl', linkedinUrl);
                let existingApplicant = await PersonaApp.getExistingApplicant(decodeURIComponent(window.document.URL));
                console.log('existingApplicant', existingApplicant);
                await showProfileInfo(existingApplicant);
            }
            await showProfileInfo(null);
        } else {
            await showPersonaAuthenticationModal();
        }
    };

    return button;
}

function createInput(labelText, type) {
    let inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '15px';

    let label = document.createElement('label');
    label.textContent = labelText;

    // Check for dark theme
    let htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.classList.contains('theme--dark')) {
        label.style.color = 'white';
    }

    let input = document.createElement('input');
    input.type = type;
    input.style.padding = '8px 12px';
    input.style.width = '100%';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.backgroundColor = '#fff';
    input.style.color = '#000';

    if (htmlElement.classList.contains('theme--dark')) {
        input.style.backgroundColor = '#333';
        input.style.color = '#fff';
    }

    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    return inputContainer;
}

function createButton(text, onClick) {
    let button = document.createElement('button');
    button.textContent = text;
    button.id = text.toLowerCase();
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#ddd';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.marginRight = '8px';
    button.addEventListener('click', onClick);
    return button;
}

async function getProjects() {
    const projectsResponse = await PersonaApp.getProjects();

    const projects = projectsResponse.projects.map(project => {
        return {
            ...project,
            vacancies: project.vacancies.filter(vacancy => vacancy.isActive)
        };
    });
    return projects;
}

async function addDropdownWithProjects() {
    const projects = await getProjects();

    let projectsDropdown = createProjectsDropdown();
    let vacanciesDropdown = createVacanciesDropdown();

    projectVacancyAction(projects, projectsDropdown, vacanciesDropdown);

    projectsDropdown.dispatchEvent(new Event('change'));
}

async function projectVacancyActionExisting(existingProjectId, existingVacancyId, projectsDropdownExisting, vacanciesDropdownExisting) {
    let projectExistingId, vacancyExistingId;
    console.log('existingVacancyId', existingVacancyId);
    const projects = await getProjects();
    console.log('projects', projects);
    projects.forEach(project => {
        let option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;

        projectsDropdownExisting.appendChild(option);

    /*    if (project.id === existingProjectId) {
            project.vacancies.forEach(vacancy => {
                let vacOption = document.createElement("option");
                vacOption.value = vacancy.id;
                vacOption.textContent = vacancy.title;
                vacanciesDropdownExisting.appendChild(vacOption);
            })
        }*/
    });

    localStorage.setItem('selectedProjectIdExisting', existingProjectId);
    localStorage.setItem('selectedVacancyIdExisting', existingVacancyId);
    let savedProjectId = localStorage.getItem('selectedProjectIdExisting');

    for (let project of projects) {
        if (project.id === existingProjectId) {
            for (let vacancy of project.vacancies) {
                let vacOption = document.createElement("option");
                vacOption.value = vacancy.id;
                vacOption.textContent = vacancy.title;
                vacanciesDropdownExisting.appendChild(vacOption);
                if (vacancy.id === existingVacancyId) {
                    vacanciesDropdownExisting.value = vacancy.id;
                    console.log('vacanciesDropdownExisting.value', vacancy);
                }
            }
        }
    }

    if (savedProjectId) {
        projectId = savedProjectId;
        projectsDropdownExisting.value = existingProjectId;
    }
    projectsDropdownExisting.addEventListener('change', async function () {
        projectExistingId = projectsDropdownExisting.value;
        console.log('projectExistingId', projectExistingId)
        localStorage.removeItem("selectedVacancyIdExisting");
        localStorage.setItem('selectedProjectIdExisting', projectExistingId);

        vacanciesDropdownExisting.innerHTML = "";
        let defaultVacancyOption = document.createElement("option");
        defaultVacancyOption.value = "";
        defaultVacancyOption.textContent = "Select a vacancy";
        vacanciesDropdownExisting.appendChild(defaultVacancyOption);
        vacanciesDropdownExisting.disabled = true;

        const selectedProject = projects.find(project => project.id.toString() === projectExistingId);
        if (selectedProject && selectedProject.vacancies) {
            selectedProject.vacancies.forEach(vacancy => {
                let option = document.createElement("option");
                option.value = vacancy.id;
                option.textContent = vacancy.title;
                vacanciesDropdownExisting.appendChild(option);
            });

            vacanciesDropdownExisting.disabled = false;

            let savedVacancyId = localStorage.getItem('selectedVacancyIdExisting');

            if (savedVacancyId) {
                vacancyExistingId = savedVacancyId;
                vacanciesDropdownExisting.value = existingVacancyId;
            }
        }
    });

    vacanciesDropdownExisting.addEventListener('change', function () {
        vacancyId = vacanciesDropdownExisting.value;
        localStorage.setItem('selectedVacancyIdExisting', existingVacancyId);
        let clipBtn = document.getElementById('persona-clip-button');
        let confirmBtn = document.getElementById('confirm-btn');
        console.log('vacancyId', vacancyId);
        if (vacancyId != null && vacancyId !== '') {
            clipBtn.disabled = false;
            clipBtn.style.backgroundColor = '#0a66c2';
            clipBtn.style.cursor = 'pointer';
            confirmBtn.disabled = false;
            confirmBtn.style.backgroundColor = '#0a66c2';
            confirmBtn.style.cursor = 'pointer';
        } else {
            clipBtn.disabled = true;
            clipBtn.style.cursor = 'pointer';
            clipBtn.style.backgroundColor = '#b4c4d4';
            confirmBtn.disabled = true;
            confirmBtn.style.cursor = 'pointer';
            confirmBtn.style.backgroundColor = '#b4c4d4';
        }
    });
}

function projectVacancyAction(projects, projectsDropdown, vacanciesDropdown) {
    projects.forEach(project => {
        let option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;
        projectsDropdown.appendChild(option);
    });

    projectsDropdown.addEventListener('change', async function () {
        projectId = projectsDropdown.value;
        localStorage.removeItem("selectedVacancyId");
        localStorage.setItem('selectedProjectId', projectId);

        vacanciesDropdown.innerHTML = "";
        let defaultVacancyOption = document.createElement("option");
        defaultVacancyOption.value = "";
        defaultVacancyOption.textContent = "Select a vacancy";
        vacanciesDropdown.appendChild(defaultVacancyOption);
        vacanciesDropdown.disabled = true;

        const selectedProject = projects.find(project => project.id.toString() === projectId);
        if (selectedProject && selectedProject.vacancies) {
            selectedProject.vacancies.forEach(vacancy => {
                let option = document.createElement("option");
                option.value = vacancy.id;
                option.textContent = vacancy.title;
                vacanciesDropdown.appendChild(option);
            });

            vacanciesDropdown.disabled = false;

            let savedVacancyId = localStorage.getItem('selectedVacancyId');
            if (savedVacancyId) {
                vacancyId = savedVacancyId;
                vacanciesDropdown.value = savedVacancyId;
            }
        }

        updateButtonState();
    });

    vacanciesDropdown.addEventListener('change', function () {
        vacancyId = vacanciesDropdown.value;
        localStorage.setItem('selectedVacancyId', vacancyId);
        updateButtonState();
    });

    function updateButtonState() {
        const clipBtn = document.getElementById('persona-clip-button');
        const confirmBtn = document.getElementById('confirm-btn');

        const isVacancySelected = vacancyId != null && vacancyId !== '' && vacanciesDropdown.title !== 'Select a vacancy';
        if (isVacancySelected) {
            enableButton(clipBtn);
            enableButton(confirmBtn);
        } else {
            disableButton(clipBtn);
            disableButton(confirmBtn);
        }
    }

    function enableButton(button) {
        button.disabled = false;
        button.style.backgroundColor = '#0a66c2';
        button.style.cursor = 'pointer';
    }

    function disableButton(button) {
        button.disabled = true;
        button.style.backgroundColor = '#b4c4d4';
        button.style.cursor = 'not-allowed';
    }
}

async function showPersonModal(photo, firstName, lastName, location, existingPerson) {
    let isPresent = await isPersonPresentInPersona();
    isModalOpened = true;
    let modalContainer = createModalContainer('personModal', isPresent);
    let contentContainer = createContentContainer(isPresent);
    let photoContainer = createPhotoContainer('personPhoto', photo);
    let heading = createHeading('New Person info:');
    let form = createForm('newPersonForm');

    let firstNameInput = createFirstNameInput('personFirstName', firstName);
    let firstNameLabel = createFirstNameInputLabel(firstNameInput, 'Lead first name:');

    let lastNameInput = createLastNameInput('personLastName', lastName);
    let lastNameLabel = createLastNameInputLabel(lastNameInput, 'Lead last name:');

    let nameContainer = createNameContainer(firstNameInput, lastNameInput, firstNameLabel, lastNameLabel);

    let linkedinInput = createLinkedinInput('personLinkedin', decodeURIComponent(window.document.URL).replace('/about/', ''));
    let linkedinLabel = createLinkedinInputLabel(linkedinInput);

    let emailInput = createEmailInput('personEmail', '');
    let emailLabel = createEmailInputLabel(emailInput);

    let phoneInput = createPhoneInput('personPhone', '');
    let phoneLabel = createPhoneInputLabel(phoneInput);

    let locationInput = createLocationInput('personLocation', location);
    let locationLabel = createLocationInputLabel(locationInput);

    let descriptionInput = createDescriptionInput('personDescription', '');
    let descriptionLabel = createDescriptionInputLabel(descriptionInput);

    let noteInput = createNoteInput('personNote', '');
    let noteLabel = createNoteInputLabel(noteInput);

    let campaignsDropdown = await createCampaignsDropdown();
    let campaignsDropdownLabel = document.createElement('label');

    campaignsDropdownLabel.textContent = 'Campaign:';
    campaignsDropdownLabel.htmlFor = 'campaignsDropdown';
    campaignsDropdownLabel.style.marginBottom = '5px';
    if (document.getElementsByTagName('html')[0].classList.contains('theme--dark')) {
        campaignsDropdownLabel.style.color = 'white';
    }

    let modalContainerExisting, contentContainerExisting, photoContainerExisting, headingExisting, formExisting, firstNameInputExisting,
    firstNameLabelExisting, lastNameInputExisting, lastNameLabelExisting, nameContainerExisting, linkedinInputExisting, linkedinLabelExisting,
    emailInputExisting, emailLabelExisting, phoneInputExisting, phoneLabelExisting, locationInputExisting, locationLabelExisting, noteInputExisting,
    noteLabelExisting;
    console.log("EXISTING PERSON", existingPerson);
    // if (isPresent && existingPerson) {
    //     modalContainerExisting = createModalContainer('personModalExisting', isPresent);
    //     contentContainerExisting = createContentContainer(isPresent);
    //     photoContainerExisting = createPhotoContainer('existingPersonPhoto', existingPerson?.photoUrl);
    //     headingExisting = createHeading('Existing Person info:');
    //     formExisting = createForm('existingPersonForm');

    //     // Add existing person details to the form
    //     firstNameInputExisting = createFirstNameInput('existingPersonFirstName', existingPerson?.firstName);
    //     firstNameLabelExisting = createFirstNameInputLabel(firstNameInputExisting, 'Lead first name:');
    //     lastNameInputExisting = createLastNameInput('existingPersonLastName', existingPerson?.lastName);
    //     lastNameLabelExisting = createLastNameInputLabel(lastNameInputExisting, 'Lead last name:');
    //     nameContainerExisting = createNameContainer(firstNameInputExisting, lastNameInputExisting, firstNameLabelExisting, lastNameLabelExisting);

    //     linkedinInputExisting = createLinkedinInput('existingPersonLinkedin', existingPerson?.linkedin);
    //     linkedinLabelExisting = createLinkedinInputLabel(linkedinInputExisting);

    //     emailInputExisting = createEmailInput('existingPersonEmail', existingPerson?.email);
    //     emailLabelExisting = createEmailInputLabel(emailInputExisting);

    //     phoneInputExisting = createPhoneInput('existingPersonPhone', existingPerson?.phone);
    //     phoneLabelExisting = createPhoneInputLabel(phoneInputExisting);

    //     locationInputExisting = createLocationInput('existingPersonLocation', existingPerson?.location);
    //     locationLabelExisting = createLocationInputLabel(locationInputExisting);

    //     noteInputExisting = createNoteInput('existingPersonNote', existingPerson?.description);
    //     noteLabelExisting = createNoteInputLabel(noteInputExisting);

    // }

    let clipButton = await createConfirmButton(isPresent);

    clipButton.addEventListener('click', async () => {
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const linkedin = linkedinInput.value;
        const location = locationInput.value;
        const description = descriptionInput.value;
        const note = noteInput.value;
        // const email = emailInput.value || "";
        const request = {
            fullName: `${firstName} ${lastName}`,
            linkedin: linkedin,
            location: location,
            photoUrl: photo,
            companyPositions: [],
            description: description,
            experience: null,
            campaignId: campaignId,
        };
        console.log('request', request);
        let response = await PersonaApp.clipPerson(request);
        let parsedResponse = JSON.parse(response);

        if (parsedResponse.id) {
            clipButton.style.backgroundColor = '#4BB543';
            clipButton.style.width = '100px';
            clipButton.textContent = 'Success!';
            if (note) {
                const comment = `<p>${note}</p>\n`;
                const noteRequest = {
                    attachments: [],
                    personId: parsedResponse.id,
                    source: "COMMENT",
                    text: comment
                }
                console.log("NOTE: ", noteRequest);
                await PersonaApp.addNoteToPerson(noteRequest);
            }
            setTimeout(function () {
                document.body.removeChild(modalContainer);
            }, 1000);
        } else {
            clipButton.textContent = 'Error!';
            clipButton.style.backgroundColor = '#c20a0a';
            clipButton.style.width = '300px';
        }
    });

    form.appendChild(photoContainer);
    form.appendChild(nameContainer);
    form.appendChild(linkedinInput);
    form.insertBefore(linkedinLabel, linkedinInput);
    form.appendChild(emailInput);
    form.insertBefore(emailLabel, emailInput);
    form.appendChild(phoneInput);
    form.insertBefore(phoneLabel, phoneInput);
    form.appendChild(locationInput);
    form.insertBefore(locationLabel, locationInput);
    form.appendChild(descriptionInput);
    form.insertBefore(descriptionLabel, descriptionInput);
    form.appendChild(noteInput);
    form.insertBefore(noteLabel, noteInput);
    form.appendChild(campaignsDropdown);
    form.insertBefore(campaignsDropdownLabel, campaignsDropdown);

    contentContainer.appendChild(heading);
    contentContainer.appendChild(form);

    let cancelButton = createHideModalButton(modalContainer);
    let buttonContainer = createButtonContainer();
    buttonContainer.appendChild(clipButton);
    buttonContainer.appendChild(cancelButton);
    contentContainer.appendChild(buttonContainer);

    // if (await isApplicantPresentInPersona()) {
    //     let formElements = form.elements;
    //     for (var i = 0, len = formElements.length; i < len; ++i) {
    //         formElements[i].disabled = true;
    //     }

    //     formExisting.appendChild(photoContainerExisting);

    //     formExisting.appendChild(nameContainerExisting);

    //     formExisting.appendChild(linkedinInputExisting);
    //     formExisting.insertBefore(linkedinLabelExisting, linkedinInputExisting);

    //     formExisting.appendChild(emailInputExisting);
    //     formExisting.insertBefore(emailLabelExisting, emailInputExisting);

    //     formExisting.appendChild(phoneInputExisting);
    //     formExisting.insertBefore(phoneLabelExisting, phoneInputExisting);

    //     formExisting.appendChild(locationInputExisting);
    //     formExisting.insertBefore(locationLabelExisting, locationInputExisting);

    //     formExisting.appendChild(noteInputExisting);
    //     formExisting.insertBefore(noteLabelExisting, noteInputExisting);

    //     formExisting.appendChild(clipButtonExisting);
    //     formExisting.appendChild(cancelButtonExisting);
    //     contentContainerExisting.appendChild(buttonContainerExisting);

    //     modalContainer.appendChild(contentContainer);
    //     modalContainerExisting.appendChild(contentContainerExisting);

    //     let clipButtonExisting = await createConfirmButton(isPresent);

    //     let cancelButtonExisting = createHideModalButtonExisting();
    //     let buttonContainerExisting = createButtonContainer();
    //     buttonContainerExisting.appendChild(clipButtonExisting);
    //     buttonContainerExisting.appendChild(cancelButtonExisting);
    //     contentContainerExisting.appendChild(buttonContainerExisting);

    //     contentContainerExisting.appendChild(headingExisting);
    //     contentContainerExisting.appendChild(formExisting);
    //     contentContainerExisting.appendChild(buttonContainerExisting);

    //     document.body.appendChild(createMixContainer(modalContainer, modalContainerExisting));
    // } else {
    modalContainer.appendChild(contentContainer);
    document.body.appendChild(modalContainer);
    // }
}

function showPersonInfo(existingPerson) {
    let photoElement = document.querySelector('img.pv-top-card-profile-picture__image--show');
    let photo = photoElement ? photoElement.src : '';

    let fullNameElement = document.querySelector('div.mt2.relative');
    let fullName = fullNameElement.querySelectorAll('div')[0].querySelector('div').querySelector('h1');
    fullName = fullNameElement ? fullNameElement.textContent.trim() : '';

    let [firstName, ...lastNameParts] = fullName.split(' ');
    let lastName = lastNameParts[0];

    let locationElement = document.querySelector('span.text-body-small.inline.t-black--light.break-words');
    let location = locationElement ? locationElement.textContent.trim().split(',').pop().trim() : '';

    showPersonModal(photo, firstName, lastName, location, existingPerson);
}

async function createPersonButton() {
    let isAuthenticated = PersonaApp.ping();
    let isPresentInApplication = await isPersonPresentInPersona();
    let fullNameElement = document.querySelector('div.mt2.relative');
    let fullName = fullNameElement.querySelectorAll('div')[0].querySelector('div').querySelector('h1');
    fullName = fullNameElement ? fullNameElement.textContent.trim() : '';

    let linkedinLink = decodeURIComponent(window.document.URL);
    let button = document.createElement('button');
    button.id = 'person-clip-button';
    button.textContent = isPresentInApplication ? 'Update Person' : 'Clip Person';
    button.style.backgroundColor = '#0a66c2';
    button.style.padding = '7px 11px';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.fontFamily = 'inherit';
    button.style.fontWeight = '700';
    button.style.fontSize = 'var(--artdeco-reset-base-font-size-hundred-percent)';
    button.style.marginLeft = '24px';
    button.style.marginBottom = '12px';

    let checkPersonExistenceRequest = {
        fullName: fullName,
        linkedin: linkedinLink,
        companyPositions: []
    };

    button.onclick = async function () {
        if (isAuthenticated) {
            // if(isPresentInApplication) {
                // let linkedinUrl = decodeURIComponent(window.document.URL).replace("http://", "");
                // console.log('linkedinUrl', linkedinUrl);
                // let existingApplicant = await PersonaApp.getExistingPerson(checkPersonExistenceRequest);
                // console.log('existingPerson', existingApplicant);
                // await showPersonInfo(existingApplicant);
            // } else {
            await showPersonInfo(null);
            // }
        }
    };

    return button;
}

async function initialize() {
    let applicantButton = await createClipButton();
    let personButton = await createPersonButton();
    const isAuthenticated = await PersonaApp.ping();
    if(!isAuthenticated) {
        localStorage.removeItem("persona-token");
        localStorage.removeItem("isHr");
        localStorage.removeItem("isSales");
        showPersonaAuthenticationModal()
        document.querySelector('div.ph5').parentNode.appendChild(applicantButton);
    } else {
        let isProfilePage = window.document.URL.includes('/in/');
        if (isProfilePage) {
            if (TOKEN && ((!isHr && !isSales) || (isHr !== 'true' && isSales !== 'true'))) {
                localStorage.removeItem("persona-token");
                window.location.reload();
            }
            if (isSales === 'true') document.querySelector('div.ph5').parentNode.appendChild(personButton);
            if (isHr === 'true') document.querySelector('div.ph5').parentNode.appendChild(applicantButton);
        }
    }
}

(async () => {
    const loadingButton = await createLoadingButton();
    document.querySelector('div.ph5').parentNode.appendChild(loadingButton);

    if (window.document.URL.includes('/in/')) {
        await sleep(1000);
        await initialize();
    }

    document.querySelector('div.ph5').parentNode.removeChild(loadingButton);
})();

function gmxhr() {
  this.type = null;
  this.url = null;
  this.async = null;
  this.username = null;
  this.password = null;
  this.status = null;
  this.headers = {};
  this.readyState = null;
}

gmxhr.prototype.abort = function () {
  this.readyState = 0;
};

gmxhr.prototype.getAllResponseHeaders = function (name) {
  if (this.readyState != 4) return "";
  return this.responseHeaders;
};

gmxhr.prototype.getResponseHeader = function (header) {
  var value = null;
  if (this.responseHeaders) {
    var regex = new RegExp("^" + header + ": (.*)$", "igm");
    var match = regex.exec(this.responseHeaders);
    var result = [];
    while (match != null) {
      result.push(match[1]);
      match = regex.exec(this.responseHeaders);
    }
    if (result.length > 0) {
      value = result.join(", ");
    }
  }
  return value;
};

gmxhr.prototype.open = function (type, url, async, username, password) {
  this.type = type ? type : null;
  this.url = url ? url : null;
  this.async = async ? async : null;
  this.username = username ? username : null;
  this.password = password ? password : null;
  this.readyState = 1;
};

gmxhr.prototype.setRequestHeader = function (name, value) {
  this.headers[name] = value;
};

gmxhr.prototype.send = function (data) {
  this.data = data;
  const that = this;
  // Detect if using older GM API (or other userscript engines)
  const agent =
      typeof GM_xmlhttpRequest === "undefined"
          ? GM.xmlHttpRequest
          : GM_xmlhttpRequest;
  // https://wiki.greasespot.net/GM.xmlHttpRequest
  agent({
    method: this.type,
    url: this.url,
    headers: this.headers,
    data: this.data,
    onload: function (rsp) {
      // Populate wrapper object with returned data
      // including the Greasemonkey specific "responseHeaders"
      const responseKeys = [
        "readyState",
        "responseHeaders",
        "finalUrl",
        "status",
        "statusText",
        "response",
        "responseText",
      ];
      for (const k of responseKeys) {
        that[k] = rsp[k];
      }
      // now we call onreadystatechange
      that.onreadystatechange();
      that.onload();
    },
    onerror: function (rsp) {
      const responseKeys = [
        "readyState",
        "responseHeaders",
        "finalUrl",
        "status",
        "statusText",
        "response",
        "responseText",
      ];
      for (const k of responseKeys) {
        that[k] = rsp[k];
      }
      // now we call onreadystatechange
      that.onreadystatechange();
    },
  });
};
