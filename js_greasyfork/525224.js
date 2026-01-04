// ==UserScript==
// @name         CmlPersonaUpworkAutomation
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-02-19
// @description  Automate Upwork submission flow
// @author       yuriipiatkin@gmail.com
// @match        https://www.upwork.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/525224/CmlPersonaUpworkAutomation.user.js
// @updateURL https://update.greasyfork.org/scripts/525224/CmlPersonaUpworkAutomation.meta.js
// ==/UserScript==
const BASIC_URL = 'https://personin4-backend.cml.team/';
const PERSONA_AI_BASIC_URL = 'https://personin4.cml.team/';
let TOKEN = localStorage.getItem('persona-token');

const _includedJs = {};
const _includedCss = {};

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
                    resolve(JSON.parse(xhr.responseText ?? "{\"status\": 404, \"message\": \"User not found with email: unknown\"}"));
                }
            };
            xhr.send(JSON.stringify({email: login, password: password}));
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

    static checkProposalExistence(upworkId) {
        const url = BASIC_URL + 'upwork/' + upworkId;
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

    static createInitialProposal(createRequest) {
        const url = BASIC_URL + 'upwork';
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
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(createRequest));
        });
    }

    static submitProposal(proposalId, submitRequest) {
        const url = BASIC_URL + 'upwork/' + proposalId + '/submit';
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
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static enrichProposal(proposalId, enrichRequest) {
        const url = BASIC_URL + 'upwork/' + proposalId + '/enrich';
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
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(enrichRequest));
        });
    }

    static getTemplatesByDeveloperUpworkId(upworkId) {
        const url = BASIC_URL + 'upwork/' + upworkId;
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

    static getAllTemplates() {
        const url = BASIC_URL + 'templates?onlyAvailable=true';
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

    static getAllQuestions() {
        const url = BASIC_URL + 'questions?onlyAvailable=true';
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

    static generateAICoverLetter(aiCoverLetterRequest) {
        const url = BASIC_URL + 'upwork/ai-generate-cv';
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
                        reject(new Error('Bad request -> generateAICoverLetter'));
                    }
                }
            };
            xhr.send(JSON.stringify(aiCoverLetterRequest));
        });
    }

    static getUpdatedCoverLetter(proposalId) {
        const url = BASIC_URL + 'upwork/' + proposalId + '/cv-changes';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(new Error('Unable to receive data -> getUpdatedCoverLetter'));
                    }
                }
            };
            xhr.send();
        });
    }

    static updateCoverLetter(updateCoverLetterRequest, proposalId) {
        const url = BASIC_URL + 'proposals/ai/edit/' + proposalId;
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request -> updateCoverLetter'));
                    }
                }
            };
            xhr.send(JSON.stringify(updateCoverLetterRequest));
        });
    }

    static getProposalByUpworkId(upworkId) {
        const url = BASIC_URL + 'upwork/' + upworkId;
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
                        reject(new Error('Unable to receive data -> getProposalByUpworkId'));
                    }
                }
            };
            xhr.send();
        });
    }
}

async function  waitSelector(selector, emptyWhenNotFound) {
    console.info("WAIT SELECTOR", selector);

    function attempt() {
        const elts = $(selector);
        console.info("WAIT SELECTOR ATTEMPT", selector, elts.length);
        if (elts.length) {
            return elts;
        }
        return null;
    }

    try {
        return await waitCondition(
            attempt,
            emptyWhenNotFound ? null : `Can't find "${selector}"!`
        );
    } catch (e) {
        if (e.selectorTimeout && emptyWhenNotFound) {
            return $();
        }
        throw e;
    }
}

function waitCondition(conditionFn, alertErr) {
    return new Promise((resolve, reject) => {
        let i = 0;

        const int = setInterval(() => {
            const conditionResult = conditionFn();
            if (conditionResult) {
                clearInterval(int);
                resolve(conditionResult);
            }
            if (++i > 50) {
                // 5 sec
                clearInterval(int);
                if (alertErr) console.log(alertErr);
                reject({ selectorTimeout: true });
            }
        }, 100);
    });
}

function getFullNameFromProfileLogoPopup() {
    return $(".nav-dropdown-account-menu .nav-user-label").first().text().trim();
}

async function getTextOfCollapsibleElt($elt) {
    const $moreBtn = $elt.find("button:contains('more'):visible");
    if ($moreBtn.length) {
        $moreBtn.click().remove();
        await sleep(10);
    }
    $elt.find("button:contains('more')").remove(); // remove even if hidden - it pollutes text with "more" word
    return $elt.text().trim();
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function prepareRequiredProposalDataForPersona() {
    const numberRegex = /[+-]?\d+(\.\d+)?/g;

    const description = await getTextOfCollapsibleElt($(".description"));
    if (!description) {
        throw "Can't determine description!";
    }

    // const $location = $('h4:contains("Location")').first();
    // const country = $location.find("+ span").text().trim();
    // const location = $location.find("+ span +span").text().trim();

    let hourlyRate = "";
    let receiveRate = "";
    if ($('strong.mb-0:contains("Hourly rate")').length > 0){
        hourlyRate = $('strong.mb-0:contains("Hourly rate")').next('div').next('div').text().trim();
        const hourlyRateNumbers = hourlyRate.match(numberRegex);
        if (hourlyRateNumbers && hourlyRateNumbers.length > 0) {
            hourlyRate = parseFloat(hourlyRateNumbers[0]) || 0;
        }
        receiveRate = $('strong.mb-0:contains("You\'ll receive")').next('div').next('div').text().trim();
        const receiveRateNumbers = receiveRate.match(numberRegex);
        if (receiveRateNumbers && receiveRateNumbers.length > 0) {
            receiveRate = parseFloat(receiveRateNumbers[0]);
        }
    } else if($('strong.mb-0:contains("Total price of project")').length > 0){
        hourlyRate = parseFloat($('strong.mb-0:contains("Total price of project")').next('div').next('div').text().trim().replace(/[^0-9.]/g, ''));
        receiveRate = parseFloat($('strong.mb-0:contains("You\'ll receive")').next('div').next('div').text().trim().replace(/[^0-9.]/g, ''));
        console.log('hourlyRate', hourlyRate)
        console.log('receiveRate', receiveRate)
    }

    const $coverLetterSection = $('h2:contains("Cover letter")').closest('div').find('section [data-ev-sublocation] > p');

    if (!$coverLetterSection.length) {
        throwError("Can't find coverLetterSection!");
    }
    const coverLetter = await getTextOfCollapsibleElt($coverLetterSection);
    console.log("coverLetter ", coverLetter);

    const questions = await Promise.all(
        $('header:contains("Cover Letter") ~ section .up-c-collapse ul > li')
            .toArray()
            .map(async (li) => {
                const $ans = $(li);
                const title = $ans.find("> strong").text().trim();
                const answer = await getTextOfCollapsibleElt($ans.find("> span")); // TODO: looks like this can be truncated
                return { title, answer };
            })
    );

    const offerLink = window.location.href.replace("?success", "");
    console.log("offerLink ", offerLink);

    const technologiesRaw = $("h4:contains('Skills and expertise')")?.next("ul")?.find("li");
    const technologies = technologiesRaw.map(function () {
        return $(this).text().trim();
    }).get();

    // let upworkUserId = 'test-vlad';
    // console.log('dev name: ', developerFullName)

    const upworkUserId = localStorage.getItem("last-used-upwork-user-id");

    let developerFullName = $("div:contains('Business Manager:')").prev()?.find("a")?.last().text().trim();
    if (developerFullName) {
        const fullNameLines = developerFullName
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');

        if (fullNameLines.length >= 2) {
            const firstName = fullNameLines[0];
            const lastName = fullNameLines[1];
            developerFullName = `${firstName} ${lastName}`;
        } else {
            console.error("developerFullName was not found");
        }
    } else {
        console.error("Can't find element");
    }

    return {
        description,
        coverLetter,
        questions,
        hourlyRate,
        receiveRate,
        offerLink,
        technologies,
        upworkUserId
    };
}

async function enhanceProposalInfoScreen() {
    await commonInitializationCode();

    const $tmpBtn = $(
        `<button id='persona-submit-button' class='button' style='margin-left: 1em; cursor: pointer'>SAVE TO PERSONA</button>
        <span id='persona-submit-success' style="font-weight: 500; color: green; display: none">✓ SUCCESS</span>`
    );
    $tmpBtn.click(function() {
        try {
            submitToPersona();
            $tmpBtn.hide();
            $('#persona-submit-success').show();
        } catch (e) {
        $("#persona-submit-button").prop("disabled", false);
        showErr("submitToTrelloCard", e);
    }
    });
    (await waitSelector('h1:contains("Proposal details")')).append($tmpBtn);
}

async function submitToPersona() {
    try {
        $("#persona-submit-button").prop("disabled", true);

        const proposalData = await prepareRequiredProposalDataForPersona();
        console.info("proposalData", proposalData);
        const jobId = await inferJobId();
        await PersonaApp.submitProposal(jobId, proposalData);

    } catch (e) {
        $("#persona-submit-button").prop("disabled", false);
        showErr("submitToTrelloCard", e);
    }
}

function showErr(message, e) {
    console.error("Oops:", e);
    const asJson = JSON.stringify(e, null, 2);
    alert(
        "Oops (" +
        message +
        "):\n\nerr: " +
        (typeof e === "string" || "{}" === asJson ? e : asJson)
    );
}

async function inferJobId() {
    const jobLink = await waitSelector("a:contains('View job posting')"); // /jobs/JOB_ID
    if (!jobLink.length) {
        throwError("Unable to find job link");
    } else {
        console.log('jobLink', jobLink.attr("href"));
        return jobLink.attr("href").match(/~([a-fA-F0-9]+)/)[1];
    }
}

async function commonInitializationCode() {
    await includeAssets();
    $.fn.valAngular = function (value) {
        const $this = $(this);
        const elt = $this[0];
        if (elt) {
            elt.value = value;
            elt.dispatchEvent(new Event("input"));
            setTimeout(() => {
                elt.dispatchEvent(new Event("blur"));
            }, 100);
        }
    };
}

async function includeAssets() {
    await includeAll([
        "https://code.jquery.com/jquery-3.3.1.min.js",
        "https://cdn.jsdelivr.net/npm/jsqry@1.2.1/jsqry.js",
    ]);
    // after jquery
    await includeAll([
        "https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-beta.1/js/select2.min.js", // TODO update version
        "https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-beta.1/css/select2.min.css",
    ]);
}

async function includeAll(assets) {
    await Promise.all(assets.map(include));
}

async function include(asset) {
    if (asset.endsWith(".js") || asset.indexOf(".js?") > 0) {
        await includeJs(asset);
    } else if (asset.endsWith(".css")) {
        await includeCss(asset);
    } else {
        throw "not js/css: " + asset;
    }
}

async function includeJs(src) {
    if (_includedJs[src]) {
        return;
    }
    _includedJs[src] = 1;
    return new Promise(function (resolve, reject) {
        const script = document.createElement("script");
        script.onload = resolve;
        script.onerror = () => {
            reject("ERROR loading " + src);
        };
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", src);
        document.getElementsByTagName("head")[0].appendChild(script);
    });
}

async function includeCss(href) {
    if (_includedCss[href]) {
        return;
    }
    _includedCss[href] = 1;
    return new Promise(function (resolve, reject) {
        const link = document.createElement("link");
        link.onload = resolve;
        link.onerror = () => {
            reject("ERROR loading " + href);
        };
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", href);
        document.getElementsByTagName("head")[0].appendChild(link);
    });
}

async function enhanceApplyJobScreen() {
    console.log("Enhancing Apply Job Screen");
    try {
        await commonInitializationCode();
        await prepareCoverLettersAndQuestions();
    } catch (error) {
        console.error("Error in enhanceApplyJobScreen:", error);
    }
}

async function prepareCoverLettersAndQuestions() {
    console.log("Preparing Cover Letters and Questions");
    try {
        const [templates, questions] = await Promise.all([PersonaApp.getAllTemplates(), PersonaApp.getAllQuestions()]);
        await prepareCoverLetterReplies(templates);
        await prepareQuestionsReplies(questions.questions);
    } catch (error) {
        console.error("Error in prepareCoverLettersAndQuestions:", error);
    }
}

async function prepareCoverLetterReplies(coverLetterCards) {
    console.log("Preparing Cover Letter Replies");
    const $coverLetterLabel = await waitSelector(
        "label:contains('Message to Client'), label:contains('Cover Letter'), h2:contains('Cover Letter')"
    );
    const $coverLetterTextarea = await waitSelector(
        "textarea[aria-labelledby='cover_letter_label']"
    );

    if (!$coverLetterTextarea.length) {
        console.error("Can't find cover letter textarea!");
        return;
    }

    // const $proposalSettings = await waitSelector(
    //     "h2:contains('Proposal settings')"
    // );

    $coverLetterLabel.after(createSelectedCoverLetterClientPreview());
    $coverLetterLabel.after(createCVButtons());

    $("#generate-cv").click(function () {
        (async () => {
            try {
                const aiCoverLetterRequest = {
                    upworkUserId: inferCandidateUpworkUserId(),
                    upworkId: inferJobIdFromUrl()
                }
                console.log('aiCoverLetterRequest: ', aiCoverLetterRequest);

                const proposalId = await PersonaApp.generateAICoverLetter(aiCoverLetterRequest);
                console.log("proposalId", proposalId);
                window.open(PERSONA_AI_BASIC_URL + "/generate-answer?proposalId=" + proposalId);

                let intervalId;

                intervalId = setInterval(async () => {
                    try {
                        const coverLetter = await PersonaApp.getUpdatedCoverLetter(proposalId);
                        if (coverLetter === undefined) {
                            console.log('Updated cover letter:', coverLetter);
                        } else {
                            console.log('Cover letter is ' + coverLetter + '. Stopping the interval.');
                            $("#coverLetterClientPreview")
                                .show()
                                .find("div")
                                .html(prepareClientPreviewText(coverLetter));
                            $coverLetterTextarea.valAngular(coverLetter);
                            clearInterval(intervalId);
                        }
                    } catch (error) {
                        console.error('Error updating cover letter:', error);
                    }
                }, 2000);

            } catch (e) {
                showErr("Generate proposal error", e);
            }
        })();
    });

    // $proposalSettings.after(
    //     createSelectOfCards(coverLetterCards, $coverLetterTextarea, ({ value, title, content }) => {
    //         $("#put-original-cv").click(function () {
    //             console.info("Selected: ", value, title, content);
    //             content = content.replaceAll('<p>', '').replaceAll('</p>', '');
    //             content = fillPlaceholders(content);
    //             $("#coverLetterClientPreview")
    //                 .show()
    //                 .find("div")
    //                 .html(prepareClientPreviewText(content));
    //             $coverLetterTextarea.valAngular(content);
    //             (async () => {
    //                 const updateCoverLetterRequest = {
    //                     content: content
    //                 }
    //                 const proposal = await PersonaApp.getProposalByUpworkId(inferJobIdFromUrl());
    //                 console.log("proposal:->", proposal);
    //                 const coverLetter = await PersonaApp.updateCoverLetter(updateCoverLetterRequest, proposal.id);
    //             })();
    //         });
    //         $("#generate-cv").click(function () {
    //             (async () => {
    //                 try {
    //                     const aiCoverLetterRequest = {
    //                         developerFullName: 'Victor Husak',
    //                         upworkId: inferJobIdFromUrl()
    //                     }
    //                     console.log('aiCoverLetterRequest: ', aiCoverLetterRequest);

    //                     const proposalId = await PersonaApp.generateAICoverLetter(aiCoverLetterRequest);
    //                     console.log("proposalId", proposalId);
    //                     window.open(PERSONA_AI_BASIC_URL + "/generate-answer?proposalId=" + proposalId);

    //                     let intervalId;

    //                     intervalId = setInterval(async () => {
    //                         try {
    //                             const coverLetter = await PersonaApp.getUpdatedCoverLetter(proposalId);
    //                             if (coverLetter === undefined) {
    //                                 console.log('Updated cover letter:', coverLetter);
    //                             } else {
    //                                 console.log('Cover letter is ' + coverLetter + '. Stopping the interval.');
    //                                 $("#coverLetterClientPreview")
    //                                     .show()
    //                                     .find("div")
    //                                     .html(prepareClientPreviewText(coverLetter));
    //                                 $coverLetterTextarea.valAngular(coverLetter);
    //                                 clearInterval(intervalId);
    //                             }
    //                         } catch (error) {
    //                             console.error('Error updating cover letter:', error);
    //                         }
    //                     }, 2000);

    //                 } catch (e) {
    //                     showErr("Generate proposal error", e);
    //                 }
    //             })();
    //         });
    //     })
    // );
}

const FREELANCER_NAME_PLACEHOLDER = "%FREELANCER_NAME%";
const CLIENT_NAME_PLACEHOLDER = "%CLIENT_NAME%";

function fillPlaceholders(str, jobTrelloCard) {
    if (str) {
        if (str.indexOf(FREELANCER_NAME_PLACEHOLDER) >= 0) {
            str = str.split(FREELANCER_NAME_PLACEHOLDER).join(inferCandidateName());
        }

        if (str.indexOf(CLIENT_NAME_PLACEHOLDER) >= 0) {
            str = str
                .split(CLIENT_NAME_PLACEHOLDER)
                .join(inferClientName(jobTrelloCard));
        }
    }
    return str;
}

function inferClientName(jobTrelloCard) {
    if (jobTrelloCard) {
        const cfi = jsqry.first(
            jobTrelloCard.customFieldItems,
            "[_.idCustomField===?]",
            CUSTOMER_NAME_CUSTOM_FIELD_ID
        );
        if (cfi) {
            return cfi.value.text;
        }
    }
    return "There";
}

function inferCandidateUpworkUserId() {
    const fullNameElement = document.querySelector('.up-fe-contractor-selector .air3-dropdown-toggle-label').textContent.trim();
    const upworkUserId = fullNameElement ? fullNameElement.match(/\(([^)]+)\)/)[1] : null;
    localStorage.setItem("last-used-upwork-user-id", upworkUserId);
    return upworkUserId;
}

function inferCandidateName() {
    const fullName = $(".up-fe-contractor-selector span:not(:has('*'))")
        .text()
        .trim();

    if (fullName.indexOf("Select") !== 0) {
        if (fullName) {
            console.info("fullName:", fullName);
            return firstName(fullName);
        }

        const fullName1 = $('[aria-label="Account Settings"] img.nav-avatar').attr(
            "alt"
        );
        if (fullName1) {
            console.info("fullName1:", fullName1);
            return firstName(fullName1);
        }

        const fullName2 = getFullNameFromProfileLogoPopup();

        if (fullName2) {
            console.info("fullName2:", fullName2);
            return firstName(fullName2);
        }
    } else {
        alert("Please select a freelancer to use his name in template!");
        return "";
    }
    alert("Unable to infer candidate name!");
    return "";
}

function firstName(fullName) {
    return fullName.split(" ")[0];
}

function getTextareaAfterLabel($label) {
    let $textarea = $label.find("~ textarea");

    if (!$textarea.length) {
        $textarea = $label.find("~ * > textarea");
    }

    return $textarea;
}

function prepareClientPreviewText(s) {
    if (!s) return "";
    const max = 230;
    return s.length <= max ? s : s.substring(0, 230) + "...";
}

function createSelectedCoverLetterClientPreview() {
    return $(`<div id="coverLetterClientPreview" style="padding: 5px;border: 1px dotted #999; position: relative; background-color: #f8fbf6">
<b style="font-weight: 500">Client preview will look like:</b>
<div>cover letter placeholder</div>
</div>`).hide();
}

function createCVButtons() {
    const $container = $("<div class='cv-buttons'></div>");
    $container.css({
        width: '50%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    });
    // const $originalBtn = createPutOriginalCVButton();
    const $generateProposalBtn = createGenerateProposalButton();
    // $container.append($originalBtn);
    $container.append($generateProposalBtn);

    return $container;
}

// function createPutOriginalCVButton() {

//     const $originalBtn = $("<button id='put-original-cv'>Put original CV</button>");
//     $originalBtn.css({
//         padding: '10px 20px',
//         fontSize: '16px',
//         backgroundColor: '#8538FC',
//         color: '#ffffff',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s',
//         display: 'inline-block'
//     });
//     $originalBtn.hover(
//         function () {
//             $(this).css('background-color', '#7116FF');
//         },
//         function () {
//             $(this).css('background-color', '#8538FC');
//         }
//     );
//     return $originalBtn;
// }

function createGenerateProposalButton(){
    const $generateProposalBtn = $("<button id='generate-cv'>Generate proposal</button>");
    $generateProposalBtn.css({
        padding: '10px 20px',
        marginBottom: '10px',
        fontSize: '16px',
        backgroundColor: '#14A800',
        border: '0',
        borderRadius: '10px',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    });
    $generateProposalBtn.hover(
        function () {
            $(this).css('background-color', '#108a00');
        },
        function () {
            $(this).css('background-color', '#14A800');
        }
    );

    return $generateProposalBtn;
}

function createSelectOfCards(cards, $coverLetterTextarea, onSelect) {
    const $selector = $("<select style='width: 100%'><option></option></select>");

    for (const { id, title, description, technologies } of cards) {
        const $option = $("<option/>");
        $option.css({
            backgroundColor: 'black',
        })
        const name1 = title === "generic" ? "" : title;
        $option.attr("value", id);
        $option.text(
            [(technologies || []).map((l) => l.title.toUpperCase()).join(" / "), name1]
                .filter((s) => s)
                .join(" - ")
        );
        $option.data("name", name1);
        $option.data("content", description);
        $option.data("labels", technologies);
        $selector.append($option);
    }
    $selector.change(async function () {
        const $option = $(this).find("option:selected");
        let jobId = inferJobIdFromUrl();
        console.log('jobId', jobId);
        const enrichRequest = {
            templateId: $option.attr("value")
        }

        console.log('Title : ', enrichRequest)
        $("#coverLetterClientPreview").hide();
        $coverLetterTextarea.valAngular("");
        await PersonaApp.enrichProposal(jobId, enrichRequest)
        onSelect({
            value: $option.attr("value"),
            title: $option.text().trim(),
            content: $option.data("content"),
        });
    });

    setTimeout(() => {
        const htmlElement = document.getElementsByTagName('html')[0];
        const isDarkTheme = htmlElement.classList.contains('theme--dark');

        $selector.select2({
            placeholder: "Select...",
            templateResult: function (state) {
                const $opt = $(state.element);
                const labels = $opt.data("labels") || [];
                return $(
                    [
                        labels
                            .map(
                                (l) =>
                                `<span style="
                                    font-weight: bold;
                                    display: inline-block;
                                    padding:4px;
                                    border-radius: 4px;
                                    color:#fff;
                                    background-color: ${l.labelColor}"
                                >
                                    ${l.title}
                                </span>`
                            ).join(" "),
                        "<span>" + $opt.data("name") + "</span>",
                    ].join(" ")
                );
            },
            dropdownCssClass: isDarkTheme ? 'select2-dark-theme' : 'select2-light-theme',
            containerCssClass: isDarkTheme ? 'select2-dark-theme' : 'select2-light-theme',
        });

        // Add custom styles for select2
        const style = document.createElement('style');
        style.innerHTML = `
            .select2-light-theme .select2-selection,
            .select2-light-theme .select2-dropdown,
            .select2-light-theme .select2-results__option {
                background-color: #fff;
                color: #000;
            }
            .select2-dark-theme .select2-selection,
            .select2-dark-theme .select2-dropdown,
            .select2-dark-theme .select2-results__option {
                background-color: green;
                color: #fff;
            }
        `;
        document.head.appendChild(style);
    }, 10);
    return $selector;
}

function createSelectOfQuestionCards(cards, onSelect) {
    console.log('cards inside createSelectOfCards: ', cards)
    const $selector = $("<select style='width: 100%'><option></option></select>");
    for (const { id, title, answer, technologies } of cards) {
        const $option = $("<option/>");
        const name1 = title === "generic" ? "" : title;
        $option.attr("value", id);
        $option.text(
            [(technologies || []).map((l) => l.title.toUpperCase()).join(" / "), name1]
                .filter((s) => s)
                .join(" - ")
        );
        $option.data("name", name1);
        $option.data("content", answer);
        $option.data("labels", technologies);
        $selector.append($option);
    }
    $selector.change(function () {
        const $option = $(this).find("option:selected");
        onSelect({
            value: $option.attr("value"),
            title: $option.text().trim(),
            content: $option.data("content"),
        });
    });

    setTimeout(() => {
        $selector.select2({
            placeholder: "Select...",
            templateResult: function (state) {
                // console.info(222, state);
                const $opt = $(state.element);
                const labels = $opt.data("labels") || [];
                return $(
                    [
                        labels
                            .map(
                                (l) =>
                                    `<span style="font-weight: bold;
display: inline-block; padding:0 8px; border-radius: 4px; color:#fff; background-color: ${
                                        l.labelColor
                                    }">${l.title}</span>`
                            )
                            .join(" "),
                        "<span>" + $opt.data("name") + "</span>",
                    ].join(" ")
                );
            },
        });
    }, 10);
    return $selector;
}

function prepareQuestionsReplies(questionCards) {
    const cardsById = listToMap(questionCards, (card) => [card.id, card]);
    const cardsByName = listToMap(questionCards, (card) => [card.title, card]);

    for (const questionLabel of $(".questions-area label")) {
        const $questionLabel = $(questionLabel);
        const $questionTextarea = getTextareaAfterLabel($questionLabel);
        if (!$questionTextarea.length) {
            alert("Can't find question textarea!");
            return;
        }
        const question = $questionLabel.text().trim();

        const $repliesDiv = $("<div style='position:relative'></div>");
        $questionLabel.after($repliesDiv);
        const $questionSelector = createSelectOfQuestionCards(
            questionCards,
            ({ value, title, content }) => {
                $repliesDiv.empty();
                if (value) {
                    const id = value;
                    const card = cardsById[id];
                    // $repliesDiv.append(
                    //     $(
                    //         "<div style='position: absolute; top:-55px; right: 0; padding: 4px'><a href='https://trello.com/c/" +
                    //         id +
                    //         "' target='_blank'>Do we need link to Persona question block?</a></div>"
                    //     )
                    // );//todo figure out can we use it with Persona or not?
                    let replyEntries = card.answers.map((answer) => {
                        return [answer.title, answer.description];
                    });
                    if (!replyEntries.length) {
                        replyEntries = [["", content]];
                    }
                    for (const [tag, text] of replyEntries) {
                        const $previewTextDiv = $(
                            "<div style='padding: 5px 5px 5px 102px;border: 1px dotted #999; white-space:pre-wrap; " +
                            "position: relative; background-color: #f8fbf6'></div>"
                        );
                        const $useReplyButton = $(
                            "<button type='button' style='cursor: pointer; position: absolute; top: 10px; left: 10px'>Use reply</button>"
                        );
                        $useReplyButton.click(function () {
                            $questionTextarea.valAngular(
                                ($questionTextarea.val() + "\n\n" + text).trim()
                            );
                        });
                        if (tag) {
                            $previewTextDiv.append($("<b></b>").text(tag));
                            $previewTextDiv.append($("<br/>"));
                        }
                        $previewTextDiv.append(
                            $("<span style='font-size: 0.75em'></span>").text(text)
                        );
                        $previewTextDiv.append($("<br>"));
                        $previewTextDiv.append($useReplyButton);
                        $repliesDiv.append($previewTextDiv);
                    }
                }
            }
        );
        $questionLabel.after($questionSelector);
        const exactQuestionMatchedCard = cardsByName[question];
        if (exactQuestionMatchedCard) {
            $questionSelector.val(exactQuestionMatchedCard.id);
            $questionSelector.trigger("change");
        }
    }
}

function listToMap(list, keyValPairF) {
    return Object.fromEntries((list || []).map((e) => keyValPairF(e)));
}

async function showPersonaAuthenticationModal() {
    function createModalContainer() {
        let modalContainer = document.createElement('div');
        modalContainer.id = 'myModal';
        modalContainer.style.display = 'block';
        modalContainer.style.position = 'fixed';
        modalContainer.style.zIndex = '9999';
        modalContainer.style.left = '0';
        modalContainer.style.top = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.overflow = 'hidden';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        modalContainer.style.backdropFilter = 'blur(4px)';
        return modalContainer;
    }

    function createContentContainer() {
        let contentContainer = document.createElement('div');
        contentContainer.style.margin = '10% auto';
        contentContainer.style.padding = '30px';
        contentContainer.style.borderRadius = '12px';
        contentContainer.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        contentContainer.style.width = '400px';
        contentContainer.style.textAlign = 'center';
        contentContainer.style.transition = 'transform 0.3s ease-in-out';

        let htmlElement = document.getElementsByTagName('html')[0];
        if (htmlElement.classList.contains('theme--dark')) {
            contentContainer.style.color = 'white';
            contentContainer.style.backgroundColor = '#2d2d2d';
        } else {
            contentContainer.style.color = '#333';
            contentContainer.style.backgroundColor = '#f9f9f9';
        }

        return contentContainer;
    }

    function createInput(labelText, type) {
        let inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '20px';
        inputContainer.style.textAlign = 'left';

        let label = document.createElement('label');
        label.textContent = labelText;
        label.style.color = '#666';
        label.style.fontSize = '14px';
        label.style.display = 'block';
        label.style.marginBottom = '5px';

        let input = document.createElement('input');
        input.type = type;
        input.style.padding = '10px';
        input.style.width = '100%';
        input.style.fontSize = '14px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '6px';
        input.style.boxSizing = 'border-box';

        let htmlElement = document.getElementsByTagName('html')[0];
        if (htmlElement.classList.contains('theme--dark')) {
            input.style.backgroundColor = '#2d2d2d';
        } else {
            contentContainer.style.backgroundColor = '#f9f9f9';
        }

        inputContainer.appendChild(label);
        inputContainer.appendChild(input);

        return inputContainer;
    }

    function createButton(text, onClick) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '12px 20px';
        button.style.fontSize = '14px';
        button.style.color = '#fff';
        button.style.backgroundColor = '#007bff';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s ease';
        button.style.margin = '5px';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0056b3';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007bff';
        });

        button.addEventListener('click', onClick);

        return button;
    }

    function createMessage(text, color) {
        let message = document.createElement('div');
        message.textContent = text;
        message.style.backgroundColor = color;
        message.style.color = '#fff';
        message.style.padding = '12px';
        message.style.borderRadius = '6px';
        message.style.marginTop = '15px';
        message.style.display = 'none';
        return message;
    }

    let modalContainer = createModalContainer();
    let contentContainer = createContentContainer();
    let successMessage = createMessage('You have successfully logged in!', '#28a745');
    let badCredentialsMessage = createMessage('Wrong login or password', '#dc3545');

    let title = document.createElement('h2');
    title.textContent = 'Login to Your Persona Account';
    title.style.marginBottom = '20px';
    title.style.fontSize = '20px';

    let loginInput = createInput('Email:', 'text');
    let passwordInput = createInput('Password:', 'password');

    let loginButton = createButton('Login', async function () {
        const response = await PersonaApp.login(loginInput.querySelector('input').value, passwordInput.querySelector('input').value)
        function showSuccessMessage() {
            loginInput.style.display = 'none';
            passwordInput.style.display = 'none';
            loginButton.style.display = 'none';
            cancelButton.style.display = 'none';
            badCredentialsMessage.style.display = 'none';
            contentContainer.appendChild(successMessage);
            successMessage.style.display = 'block';
            setTimeout(function () {
                successMessage.style.display = 'none';
                modalContainer.style.display = 'none';
                console.log('Logged in!');
                window.location.reload();
            }, 1000);
        }

        function showBadCredentialsMessage() {
            contentContainer.appendChild(badCredentialsMessage);
            badCredentialsMessage.style.display = 'block';
        }

        if (response === undefined || response.status === 404 || response.status === 400) {
            showBadCredentialsMessage();
        } else {
            localStorage.setItem('persona-token', response.accessToken);
            TOKEN = response.accessToken;
            $("#persona-sign-in-btn").hide();
            $("#persona-clip-btn").show();
            showSuccessMessage();
        }
    });

    let cancelButton = createButton('Cancel', function () {
        modalContainer.style.display = 'none';
    });

    contentContainer.appendChild(title);
    contentContainer.appendChild(loginInput);
    contentContainer.appendChild(passwordInput);
    contentContainer.appendChild(loginButton);
    contentContainer.appendChild(cancelButton);

    modalContainer.appendChild(contentContainer);
    document.body.appendChild(modalContainer);
}

function prepareInitProposalRequest() {
    const jobId = inferJobIdFromUrl();
    console.log('jobId', jobId);

    const clientInfo = $(".cfe-ui-job-about-client");

    const isCardVerified = !clientInfo.find("span:contains('not verified')")?.length;
    console.log('isCardVerified ', isCardVerified);

    const locationElement = clientInfo.find("li[data-qa='client-location'] strong")?.first();
    const location = locationElement ? locationElement.text() : "";
    console.log('location ', location);
    let jobsPosted = null;
    if ($("li[data-qa='client-job-posting-stats'] strong")?.get().length > 0) {
        const jobsPostedElement = clientInfo.find("li[data-qa='client-job-posting-stats'] strong")?.first();
        jobsPosted = jobsPostedElement ? jobsPostedElement.text().match(/\d+/g).join('') : "";
    }
    console.log('jobsPosted ', jobsPosted);

    let finalTotalSpentValue = null;
    if ($("strong[data-qa='client-spend']")?.get().length > 0) {
        const parsedTotalSpentElement = clientInfo.find("strong[data-qa='client-spend']")?.first();
        const parsedTotalSpent = parsedTotalSpentElement ? parsedTotalSpentElement.text().replace(/[^\dK]/g, '') : "";

        const numberValue = parseFloat(parsedTotalSpent);
        finalTotalSpentValue = 0;
        if (parsedTotalSpent.endsWith('K')) {
            finalTotalSpentValue = numberValue * 1000;
        } else if (!isNaN(numberValue)) {
            finalTotalSpentValue = numberValue;
        }
    }
    console.log('finalTotalSpentValue ', finalTotalSpentValue);

    let hires = null;
    let activeHires = null;
    if ($("div[data-qa='client-hires']")?.get().length > 0) {
        const hiresElement = clientInfo.find("div[data-qa='client-hires']")?.first();
        hires = hiresElement?.text().trim().split(' ')[0].replace(',', '') || "";
        activeHires = hiresElement?.text().trim().split(' ')[2] || "";
    }
    console.log('hires ', hires);
    console.log('activeHires ', activeHires);

    let hourlyRate = null;
    if($("strong[data-qa='client-hourly-rate']")?.get().length > 0){
        const avgHourlyRateElement = clientInfo.find("strong[data-qa='client-hourly-rate']")?.first();
        const avgHourlyRate = avgHourlyRateElement ? avgHourlyRateElement.text().trim() : "";
        const extractedRate = avgHourlyRate.match(/\$\S+/);
        hourlyRate = extractedRate ? extractedRate[0].slice(1) : "0.0";
    }
    console.log('hourlyRate ', hourlyRate);

    let totalHoursValue = null;
    if ($("div[data-qa='client-hours']")?.get().length > 0){
        const totalHoursElement = clientInfo.find("div[data-qa='client-hours']")?.first();
        const totalHours = totalHoursElement ? totalHoursElement.text().trim() : "";
        const totalHoursMatch = totalHours.match(/\d+/g);
        totalHoursValue = totalHoursMatch ? totalHoursMatch.join('') : "";
    }
    console.log('totalHoursValue ', totalHoursValue);

    let field = null;
    if ($("strong[data-qa='client-company-profile-industry']")?.get().length > 0){
        const fieldElement = clientInfo.find("strong[data-qa='client-company-profile-industry']")?.first();
        field = fieldElement ? fieldElement.text().trim() : "";
    }
    console.log('field ', field);

    let companySize = null;
    if ($("div[data-qa='client-company-profile-size']")?.get().length > 0){
        const companySizeElement = clientInfo.find("div[data-qa='client-company-profile-size']")?.first();
        const companySize = companySizeElement ? companySizeElement.text().trim() : "";
    }
    console.log('companySize ', companySize);

    let rating = null;
    if ($("div.text-light-on-muted.rating.mb-4 span")?.get().length > 0){
        const rawRatingElement = clientInfo.find("div.text-light-on-muted.rating.mb-4 span")?.first();
        const rawRatingText = rawRatingElement?.text().trim() || "";
        const ratingStartIndex = rawRatingText.indexOf('is') + 3;
        const rawRatingValue = parseFloat(rawRatingText.slice(ratingStartIndex));
        rating = isNaN(rawRatingValue) ? "0.00" : rawRatingValue.toFixed(2);
        rating = isNaN(rating) ? "0" : rating;
    }
    console.log('rating ', rating);

    let reviewsAmount = null;
    if ($("span.nowrap")?.get().length > 0){
        const rawReviewsAmount = clientInfo.find("span.nowrap")?.first()?.text().trim() || "";
        reviewsAmount = parseInt(rawReviewsAmount.slice(rawReviewsAmount.indexOf('of') + 3)) || 0;
    }
    console.log('reviewsAmount ', reviewsAmount);

    let membershipDate = null;
    if ($("li[data-qa='client-contract-date']")?.get().length > 0){
        const rawMembershipDate = clientInfo.find("li[data-qa='client-contract-date']")?.first()?.text().trim() || "";
        membershipDate = rawMembershipDate.split("since ")[1] ? new Date(rawMembershipDate.split("since ")[1]).getTime() : null;
    }
    console.log('membershipDate ', membershipDate);

    let connectionsUsed = null;
    if ($("div[data-test='connects-auction']") != null){
        const connectionsUsedRaw = $("div[data-test='connects-auction']")?.first()?.text().trim();
        const match = connectionsUsedRaw.match(/Send a proposal for:\s*(\d+)/);
        if (match && match[1]) {
            connectionsUsed = parseInt(match[1], 10);
        }
    }
    console.log('connectionsUsed ', connectionsUsed);

    const technologiesRaw = [...document.querySelectorAll("h4")].find(h4 => h4.textContent.includes("Skills and Expertise"));
    let technologies;
    if (technologiesRaw) {
        const container = technologiesRaw.parentElement;
        technologies = new Set([...container.querySelectorAll("button, span")].map(tech => tech.innerText));
        console.log([...technologies]);
    }
    console.log('technologies ', technologies);

    const description = $("div[data-test='Description']").text();
    console.log('description ', description);

    const type = isJobInvitationPage() ? 'INVITATION' : 'OFFER';
    console.log('type ', type);

    return {
        title: document.title,
        description,
        offerLink: window.location.href,
        upworkId: jobId,
        connectionsUsed,
        type,
        client: {
            isCardVerified,
            location,
            jobsPosted,
            totalSpent: finalTotalSpentValue,
            hires,
            activeHires,
            avgHourlyRate: hourlyRate,
            totalHours: totalHoursValue,
            field,
            companySize,
            membershipDate,
            rating,
            reviewsAmount
        }
    };
}

async function enhanceJobDetailsPage() {
    await includeAssets();
    const jobId = inferJobIdFromUrl();

    const h1 = $("div[data-test=FlagButton]");

    // Create and append the loading message
    const loadingMessage = $("<span id='loading-message'>Loading...</span>")
        .css({
            fontWeight: '500',
            fontSize: '20px',
            color: '#007BFF',
            display: 'block',
            marginBottom: '10px'
        });
    h1.append(loadingMessage);

    const clipMeBtn = $(
        "<button id='persona-clip-btn'>Clip me to Persona!</button>"
    )
        .css({
            padding: '8px 12px',
            fontSize: '16px',
            fontWeight: '700',
            backgroundColor: '#007BFF',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        })
        .hover(
            function () {
                $(this).css('background-color', '#0056b3');
            },
            function () {
                $(this).css('background-color', '#007BFF');
            }
        )
        .click(async function () {
            const initialProposalRequest = prepareInitProposalRequest();
            await PersonaApp.createInitialProposal(initialProposalRequest);
            clipMeBtn.hide();
            clippedSpan.show();
        })
        .hide();

    const clippedSpan = $(
        "<span id='persona-clip-success' style=\"font-weight: 500; color: green; display: none\"></br>✓ CLIPPED</span>"
    ).hide();

    const signInBtn = $(
        "<button id='persona-sign-in-btn'>Sign in to Persona!</button>"
    )
        .css({
            padding: '8px 12px',
            fontSize: '16px',
            fontWeight: '700',
            backgroundColor: '#007BFF',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        })
        .hover(
            function () {
                $(this).css('background-color', '#0056b3');
            },
            function () {
                $(this).css('background-color', '#007BFF');
            }
        )
        .click(async function(){
            showPersonaAuthenticationModal();
        })
        .hide();

    h1.append(signInBtn);
    h1.append(clipMeBtn);
    h1.append(clippedSpan);

    const isAuthenticated = await PersonaApp.ping();
    const isProposalAlreadyInDb = await PersonaApp.checkProposalExistence(jobId);

    // Hide the loading message once the authentication check is complete
    loadingMessage.hide();

    if (isAuthenticated) {
        if (isProposalAlreadyInDb) {
            clippedSpan.show();
        } else {
            clipMeBtn.show();
        }
    } else {
        signInBtn.show();
    }
}

function isJobDetailsPage() {
    return (
        location.href.indexOf("/jobs/") >= 0 && location.href.indexOf("~") >= 0
    );
}

function isJobApplyPage() {
    return (
        location.href.indexOf("/apply/") >= 0
    );
}

function isJobInvitationPage() {
    return (
        location.href.indexOf("/interview/") >= 0
    );
}

function isSuccessPage() {
    return (
        location.href.indexOf("?success") >= 0
    );
}

function inferJobIdFromUrl() {
    if (isJobDetailsPage()) {
        const parts = location.href.split("~");
        const jobId = parts[parts.length - 1];
        return jobId.split("/")[0];
    } else if (isJobApplyPage()) {
        const parts = location.href.split("~");
        const jobId = parts[parts.length - 1];
        return jobId.replace("/apply/", "");
    } else if (isJobInvitationPage()) {
        const parts = location.href.split("~");//todo ask Vlad about page and find upwork id there
        const jobId = parts[parts.length - 1];//todo ask Vlad about page and find upwork id there
        return jobId.replace("/apply/", "");//todo ask Vlad about page and find upwork id there
    }
    throwError("Unable to inferJobIdFromUrl");
}

function throwError(err) {
    throw err;
}

(async () => {
    if (location.host === "www.upwork.com") {
        try {
            await sleep(0);
            const isAuthenticated = await PersonaApp.ping();
            if(!isAuthenticated) {
                localStorage.removeItem("persona-token");
                showPersonaAuthenticationModal()
            }
            if (isJobDetailsPage()) {
                await enhanceJobDetailsPage();
            } else if (isJobApplyPage()) {
                await enhanceApplyJobScreen();
            } else if (isSuccessPage()) {
                await enhanceProposalInfoScreen();
            }
        } catch (e) {
            console.log('Error ', e);
        }
    }
})();

// https://github.com/damoclark/gmxhr

/**
 * xmlHttpRequest API wrapper for GM_xmlhttpRequest
 *
 * @returns {gmxhr} An instance with a compatible API to xmlHttpRequest
 */
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
