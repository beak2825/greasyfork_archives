// ==UserScript==
// @name         BO/Supply-Owner Messages
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Significantly improves the daily life of Supply
// @author       Aurelien Delmas, David Walter
// @match        https://www.clickandboat.com/en/back-office/account/details/*
// @match        https://www.clickandboat.com/us/back-office/account/details/*
// @match        https://www.clickandboat.com/de/back-office/account/details/*
// @match        https://www.clickandboat.com/fr/back-office/account/details/*
// @match        https://www.clickandboat.com/es/back-office/account/details/*
// @match        https://www.clickandboat.com/it/back-office/account/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536995/BOSupply-Owner%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/536995/BOSupply-Owner%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- Customizable Values ---
    const englishRowColor = '#007bff'; // Bootstrap primary blue
    const spanishRowColor = '#FFA500'; // Orange
    const labelTextColor = 'black';
    const templateButtonWidth = '150px'

    // Function to add global CSS styles
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Custom button styles and row styles
    addGlobalStyle(`
        .btn-english {
            background-color: ${englishRowColor} !important;
            border-color: ${englishRowColor} !important;
            color: ${labelTextColor} !important;
        }
        .btn-spanish {
            background-color: ${spanishRowColor} !important;
            border-color:  ${spanishRowColor} !important;
            color: ${labelTextColor} !important;
        }
        .language-label {
            font-weight: bold;
            margin-bottom: 5px; /* Adjust spacing */
        }
        .template-popup button.btn { /* Target buttons inside the popup */
            width: ${templateButtonWidth};
            min-width: ${templateButtonWidth}; /* Ensure a minimum width */
            max-width: ${templateButtonWidth}; /* Ensure a maximum width */
            text-overflow: ellipsis; /* Truncate overflowing text */
            overflow: hidden;         /* Hide overflowing text */
            white-space: nowrap;       /* Prevent text from wrapping */
        }

        /* Optional: Add style to template list to display horizontal and scroll */
        .template-popup .template-list {
          display: flex; /* Flex container */
          flex-wrap: wrap; /* Wrap items to the next line if needed*/
          gap: 5px; /* Add 5px gaps between the elements */
        }

    `);

    // Votre SVG
    const customSvg = `
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="#1C274C" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5"/>
    <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="#1C274C" stroke-width="1.5"/>
    </svg>
    `;


    const svgBlob = new Blob([customSvg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);


        // WhatsApp setup
        const selectElements = document.getElementsByName('phonePrefixId');
        const selectElement = selectElements[0];
        const selectedIndex = selectElement.selectedIndex;
        const selectedText = selectElement.options[selectedIndex].text;
        let countryCodeWithoutParentheses = '';

        const match = selectedText.match(/\(\+\d+\)/);
        if (match) {
            const countryCode = match[0];
            countryCodeWithoutParentheses = countryCode.replace(/\(|\)/g, '');
        }

        const phoneNumberElement = document.querySelector('input[type="text"][name="phone"]');
        const phoneNumberWithoutCountry = phoneNumberElement ? phoneNumberElement.value : '';
        const tenantPhoneNumber = countryCodeWithoutParentheses + phoneNumberWithoutCountry;

        const firstNameElement = document.querySelector('input[type="text"][name="firstName"]');
        const firstName = firstNameElement ? firstNameElement.value : '';
        const lastNameElement = document.querySelector('input[type="text"][name="lastName"]');


        const colSm9Divs = document.querySelectorAll('.col-sm-9');
        colSm9Divs.forEach(function(div) {
            div.style.display = 'flex';
            div.style.alignItems = 'center';
        });


        const colSm7Divs = document.querySelectorAll('.col-sm-7');
        colSm7Divs.forEach(function(div) {
            div.style.display = 'flex';
            div.style.alignItems = 'center';
        });


        const emailElement = document.querySelector('input[type="email"][name="email"]');
        const email = emailElement ? emailElement.value : '';


        const phoneSection = document.querySelector('div.row.form-group > div.col-sm-7 > input[type="text"][name="phone"]');
        if (phoneSection) {
            const whatsappButton = createButton('Send WA Message', 'btn-success');
            whatsappButton.addEventListener('click', function(event) {
                event.preventDefault();
                createPopup('whatsapp', tenantPhoneNumber, firstName);
            });

            phoneSection.parentElement.appendChild(whatsappButton);
        }



        const copyNameButton = createButton("Copy Name", 'btn-secondary');
        copyNameButton.addEventListener('click', function(event) {
            event.preventDefault();

            const fullName = `${firstNameElement.value} ${lastNameElement.value}`;

            navigator.clipboard.writeText(fullName).then(function() {

                const originalText = copyNameButton.innerHTML;
                copyNameButton.innerHTML = '✔ Copied';


                setTimeout(function() {
                    copyNameButton.innerHTML = originalText;
                }, 600); // Réinitialise après 3 secondes
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });


        lastNameElement.parentNode.insertBefore(copyNameButton, lastNameElement.nextSibling);





        const copyEmailButton = createButton('Copy Email', 'btn-secondary');
        copyEmailButton.addEventListener('click', function(event) {
            event.preventDefault();

            navigator.clipboard.writeText(email).then(function() {

                const originalText = copyEmailButton.innerHTML;
                copyEmailButton.innerHTML = '✔ Copied';


                setTimeout(function() {
                    copyEmailButton.innerHTML = originalText;
                }, 600);
            }, function(err) {
                // Échec de la copie
                console.error('Could not copy text: ', err);
            });
        });


        emailElement.parentNode.insertBefore(copyEmailButton, emailElement.nextSibling);




        if (emailElement) {
            const emailButton = createButton('Send Email', 'btn-info');
            emailButton.addEventListener('click', function(event) {
                event.preventDefault();
                createPopup('email', email, firstName);
            });
            emailElement.parentNode.insertBefore(emailButton, copyEmailButton.nextSibling);
        }




        var callButton = document.createElement('a');
        callButton.setAttribute('href', 'tel:' + tenantPhoneNumber);
        callButton.setAttribute('class', 'btn btn-secondary btn-flat');
        callButton.textContent = 'Call with Aircall';
        callButton.style.marginLeft = '10px';


        var phoneInput = document.querySelector('input[name="phone"]');

        phoneInput.parentNode.insertBefore(callButton, phoneInput.nextSibling);


        function createButton(text, className) {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.className = `btn ${className} btn-flat`;
            button.style.marginLeft = '10px';
            return button;
        }

        function createPopup(type, contact, firstName) {
            const popupType = type === 'whatsapp' ? 'WhatsApp' : 'Email';
            const popup = document.createElement('div');
            popup.className = 'communication-popup';
            popup.style = "position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background-color: #fff; border: 1px solid #ccc; padding: 20px; z-index: 10001; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 600px;";

            const title = document.createElement('h3');
            title.innerText = `Send ${popupType} Message`;
            title.style = "margin-top: 0;";

            const closeButton = document.createElement('span');
            closeButton.innerHTML = '&times;';
            closeButton.style = "cursor: pointer; position: absolute; top: 10px; right: 20px; font-size: 24px;";
            closeButton.onclick = function() {
                document.body.removeChild(popup);
                removeOverlay();
            };
            const templatesContainer = document.createElement('div');
            templatesContainer.style.display = 'flex';
            templatesContainer.style.flexDirection = 'column';

            const firstRow = document.createElement('div');
            const secondRow = document.createElement('div');
            secondRow.style = "margin-top: 10px";
            // --- Add "English" Label to First Row ---
            const englishLabel = document.createElement('div');
            englishLabel.innerText = "English Templates:";
            englishLabel.className = 'language-label';
            firstRow.appendChild(englishLabel);

            //----------------------------------
            //----------- TEMPLATE 1 -----------
            //----------------------------------
            const template1Btn = document.createElement('button');
            template1Btn.className = 'btn btn-english';
            template1Btn.innerText = 'Normal OB';
            template1Btn.style = "margin-right: 10px";
            template1Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello ${firstName}, insert your message here`);
                } else {
                    sendEmail(contact, 'Activate Your Boats on Click&Boat – Important Information and Requirements', `The Email Message is in your clipboard, Delete this and paste the content!!`);
                    const emailBody = `Good day ${firstName},

Thank you once again for taking the time for our phone conversation and for your interest in collaborating with Click&Boat.
Below you'll find a summary of the main details of our collaboration, as well as the documentation required to publish your boats on the Click&Boat platform.

⚓ Collaboration Conditions
· Click&Boat's commission is 21% of the total booking amount.
· Renters pay directly to Click&Boat. After deducting our commission, the remaining amount will be transferred to you.
· Click&Boat will issue an invoice for our commission. You must invoice the renter for the full amount of the reservation.
· Click&Boat is not responsible for insurance or cancellations. Managing the security deposit is your responsibility.

⚡ Activation of Instant Booking
Your fleet has been activated with the Instant Booking option, allowing customers to book directly without prior message exchange.
This feature increases your visibility and booking potential, but it is essential to keep your calendar up to date.
🔔 In case of a double booking caused by incorrect availability, a penalty will apply to your next confirmed booking.


🚀 How to Make the Most of Click&Boat
· Respond to all messages as quickly as possible to maintain smooth communication and build trust.
· Quick replies increase your chances of securing bookings.
· Avoid cancellations, as they negatively affect your ranking on the platform.
· Always keep your calendar updated to avoid duplicate bookings or unnecessary cancellations.

❗ Important Notes

· Exchanging contact details with the renter is not allowed before the booking is confirmed.
· Once confirmed, you may communicate directly with the client and manage the rental contract.
· You can review the Owner Cancellation Policies here 👉 https://help.clickandboat.com/hc/en-gb/articles/9514891034386-Owner-s-Cancellation-Penalties
· You'll have support from our customer service team of more than 30 people from 5 nationalities, always ready to assist you.
· Customer service phone number: +34 911 232 190

📑 Required Documentation to Activate Your Account
To complete your profile verification, please send us the following documents:

· Company registration certificate with VAT number.
· Copy of the ID card of the owner or administrator.
· Official document showing IBAN and account holder's name (photo of bank book or screenshot from online banking).
· Seaworthiness certificate
· RNAAT
👉 Without this documentation, we cannot publish your boats on the platform.

I remain at your disposal for any questions you may have and thank you in advance for your cooperation.

Best regards,

`; // Use backticks

                navigator.clipboard.writeText(emailBody).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template1Btn.innerText; // Store original text
                    template1Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template1Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
                }
            };

            //----------------------------------
            //----------- TEMPLATE 2 -----------
            //----------------------------------
            const template2Btn = document.createElement('button');
            template2Btn.className = 'btn btn-english';
            template2Btn.innerText = 'DWS';
            template2Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello ${firstName},TO DEFINED`);
                } else {
                    sendEmail(contact, 'Activa tus embarcaciones en Click&Boat – Información importante y requisitos', `The Email Message is in your clipboard, Delete this and paste the content!!`);
                    const emailBody = `Good day ${firstName},

Thank you once again for taking the time to speak with us and for your interest in collaborating with Click&Boat.
As we confirmed during our call, you’ll soon be able to offer hourly rentals and unique experiences to users on our platform.
Before we can publish your boats and activities, we need to gather some information to verify your profile and properly create your experiences.


📌 Important notes

· It is not allowed to exchange contact details with renters before the booking is confirmed
· After confirmation, you may contact the client directly and manage the rental contract
· You can review the Owner Cancellation Policies here 👉 https://help.clickandboat.com/hc/en-gb/articles/9514891034386-Owner-s-Cancellation-Penalties
· You'll have the support of our customer service team of over 30 people from 5 different nationalities
· Customer support phone number: +34 911 232 190

📝 1. Documents required to validate your account
Please send us the following documents:

· Company registration certificate with VAT number.
· Copy of the ID card of the owner or administrator.
· Official document showing IBAN and account holder's name (photo of bank book or screenshot from online banking).
· Seaworthiness certificate
· RNAAT

🛥️ 2. Information to create your activities
You’ll find an attached Excel file where we’ve already pre-filled some of the details we discussed by phone.
Please review the file and feel free to correct or modify anything.
For each tour (maximum 5 per boat), we need to confirm:

· Name and duration of the tour
· Total price (or separate prices: boat, skipper, fuel)
· Check-in time
· Itinerary
· Languages spoken by the skipper
· What’s included? (drinks, beers, snorkel gear, etc.)
· How far in advance should clients book?
· Can we activate the Instant Booking option?

💰 Commission structure

· Boat: 21%
· Skipper: 2%
· Fuel: 2%
(You may add 2% to the skipper and fuel prices if you’d like to cover those commissions.)

For yachts:
Fuel is not included in the price, and we use the APA (Advance Provisioning Allowance) system.
Please let us know the APA amount you currently use.

Once we have all the necessary information and documents, we’ll activate your boats and let you know so you can review them.
We remain at your disposal for any questions or adjustments you may need.`; // Use backticks

                navigator.clipboard.writeText(emailBody).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template2Btn.innerText; // Store original text
                    template2Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template2Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
            };
                };

            //----------------------------------
            //----------- TEMPLATE 3 -----------
            //----------------------------------
            const template3Btn = document.createElement('button');
            template3Btn.className = 'btn btn-english';
            template3Btn.innerText = 'NA';
            template3Btn.style = "margin-left: 10px";
            template3Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello there ${firstName}, I'm David from Click&Boat.
I tried to call you to welcome you, but I couldn't reach you.
We need to schedule a call to explain the service and be able to publish your boat. Without this prior call, we cannot activate the ad or make the account visible on the platform.
Do you have a moment this week to talk? Let me know when it's convenient for you and we'll coordinate :)`);
                    const WA_Message = `Hello there ${firstName}, I'm David from Click&Boat.

I tried to call you to welcome you, but I couldn't reach you.

We need to schedule a call to explain the service and be able to publish your boat. Without this prior call, we cannot activate the ad or make the account visible on the platform.

Do you have a moment this week to talk? Let me know when it's convenient for you and we'll coordinate :)`
                     navigator.clipboard.writeText(WA_Message).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template1Btn.innerText; // Store original text
                    template1Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template1Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
                } else {
                    sendEmail(contact, 'Follow-up on Your Boat Listing – Action Required', `Hello dear Boat Owner,

I'm David and I'm contacting you on behalf of Click&Boat, the boat rental platform.
You recently registered on our platform and today I tried to call you to welcome you, but I couldn't reach you.
I would like to schedule a call to explain how our service works and to be able to publish your fleet online. Without this prior call, unfortunately, the boats cannot be uploaded to the platform and we would have to deactivate your account until we hear from you.

I look forward to hearing from you.

Best regards,
                    `);
                }
            };

            //----------------------------------
            //----------- TEMPLATE 4 -----------
            //----------------------------------
            const template4Btn = document.createElement('button');
            template4Btn.className = 'btn btn-english';
            template4Btn.innerText = 'ProDocs';
            template4Btn.style = "margin-left: 10px";
            template4Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello ${firstName},
I was reviewing your account and to publish your boat on Click&Boat, I just need a few documents from you:
· Company registration with VAT number
· Copy of your ID (DNI)
· A doc showing your IBAN + account holder name (like a bank screenshot)
· Registry sheet or seaworthiness certificate of your boat
· RNAAT

Once I have these, I can publish your boat. Let me know if you have any questions!
                    `);
                } else {
                    sendEmail(contact, "Required Documents to Publish Your Boat on Click&Boat", `Good day ${firstName},
Upon reviewing your account, I noticed that some important documents are still missing for the verification process. In order to publish your boat on the platform, I kindly ask you to send the following:

· Company Registration Certificate. including your company’s VAT number.
· A copy of the ID (DNI) of the company owner or administrator.
· An official document (such as a photo of a bank book or a screenshot from online banking) clearly showing the IBAN and the account holder’s name.
· Registry sheet or seaworthiness certificate
· RNAAT

Once I receive these documents, I’ll be able to proceed with the publication of your boat on Click&Boat.
Please don’t hesitate to reach out if you have any questions. I’m here to help.

Best regards,
                    `);
                }
            };

            //----------------------------------
            //----------- TEMPLATE 5 -----------
            //----------------------------------
            const template5Btn = document.createElement('Online');
            template5Btn.className = 'btn btn-english';
            template5Btn.innerText = 'Online';
            template5Btn.style = "margin-left: 10px";
            template5Btn.onclick = function() {
                 if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello ${firstName},I have uploaded your listing on the platform, this change may take up to 24h to be visible. Please take a moment to review your listings and make sure all the information is correct.
                    It is very important to keep the profile updated, especially photos and prices. Have a nice day!`);
                } else {
                sendEmail(contact, 'Your Listings Are Now Live on Click&Boat', `Good day ${firstName},
I'm writing to confirm that I have now published your listing on Click&Boat. It takes up to 24h until your lisitng will be visible on the platform.
Please take a moment to review the listings in your account to make sure all the information is correct. It's very important to keep your profile updated—especially photos and prices—as these details directly impact customer interest and the number of bookings you can receive.

If you’d like to make any changes or add more details, you can do so directly from your account.

Best regards,`);
                    }
};
            //----------------------------------
            //----------- TEMPLATE 6 -----------
            //----------------------------------
            const template6Btn = document.createElement('button');
            template6Btn.className = 'btn btn-english';
            template6Btn.innerText = 'FU';
            template6Btn.style = "margin-left: 10px";
            template6Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hello ${firstName}, Good news! We have just published your boat on the Click&Boat platform. We recommend checking the listing directly from your profile and make sure all the information is correct and up to date. Have a nice day!`);
                } else {
                sendEmail(contact, 'Your Listings Are Now Live on Click&Boat', `Good day ${firstName},
Good news! We’ve just published your boat <boatname> on the Click&Boat platform.
We recommend checking the listing directly from your profile to make sure all the information is correct and up to date. A strong description, attractive photos, and a well-managed calendar will boost your chances of getting bookings.
Thank you for trusting Click&Boat.
We’re here to help with anything you need!

Best regards,
`);
                    }
            };
            // --- Add "Spanish" Label to Second Row ---
            const spanishLabel = document.createElement('div');
            spanishLabel.innerText = "Spanish Templates:";
            spanishLabel.className = 'language-label';
            secondRow.appendChild(spanishLabel);
            //----------------------------------
            //----------- TEMPLATE 7 -----------
            //----------------------------------
            const template7Btn = document.createElement('button');
            template7Btn.className = 'btn btn-spanish';
            template7Btn.innerText = 'Normal OB';
            template7Btn.style = "margin-right: 10px";
            template7Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hola ${firstName},
A completar
`);
                } else {
                    sendEmail(contact, 'Activa Tus Barcos en Click&Boat – Información y Requisitos Importantes', `El mensaje del correo electrónico está en tu portapapeles, ¡borra esto y pega el contenido!`);
                    const emailBody = `Hola ${firstName},

Gracias nuevamente por tomarte el tiempo para nuestra  conversación telefónica y por tu interés en colaborar con Click&Boat.
A continuación, encontrarás un resumen de los principales detalles de nuestra colaboración, así como la documentación necesaria para poder publicar tus embarcaciones en la plataforma de Click&Boat.

⚓ Condiciones de colaboración

· La comisión de Click&Boat es del 21% sobre el importe total de la reserva.
· Los arrendatarios realizan el pago directamente a Click&Boat. Una vez deducida nuestra comisión, el importe restante te será transferido.
· Click&Boat te emitirá una factura por nuestra comisión. Tú deberás facturar al arrendatario por el total de la reserva.
· Click&Boat no se responsabiliza de seguros ni cancelaciones. La gestión del depósito de seguridad corre a tu cargo.

⚡ Activación de la Reserva Instantánea

Tu flota ha sido activada con la opción de Reserva Instantánea, lo que permite a los clientes reservar directamente sin intercambio previo de mensajes.
Esta funcionalidad mejora tu visibilidad y el potencial de reservas, pero es imprescindible mantener el calendario actualizado.
🔔 En caso de una doble reserva provocada por disponibilidad incorrecta, se aplicará una penalización en tu próxima reserva confirmada.

⚡ ¿Activamos la opción de Reserva Instantánea?

Click&Boat ofrece la opción de Reserva Instantánea, que permite a los clientes reservar directamente sin necesidad de enviar un mensaje previo.
Esta función puede aumentar considerablemente la visibilidad de tus anuncios y el volumen de reservas.
🔔 Si decides activarla, es muy importante mantener tu calendario actualizado para evitar reservas duplicadas. En caso de una doble reserva, se aplicará una penalización en tu próxima reserva confirmada.
¿Te gustaría que activáramos esta opción para tu flota?

🚀 Cómo aprovechar al máximo Click&Boat

· Responde a todos los mensajes lo antes posible para mantener una comunicación fluida y generar confianza.
· Las respuestas rápidas aumentan tus posibilidades de conseguir reservas.
· Evita cancelaciones, ya que afectan negativamente tu posicionamiento en la plataforma.
· Asegúrate de que tu calendario esté siempre actualizado para evitar reservas duplicadas o cancelaciones innecesarias.

❗ Notas importantes

· No está permitido el intercambio de datos de contacto con el arrendatario antes de que la reserva esté confirmada.
· Una vez confirmada, podrás comunicarte directamente con el cliente y gestionar el contrato de alquiler.
· Aquí puedes consultar la Política de cancelación 👉 https://help.clickandboat.com/hc/es/articles/9514891034386-Penalizaciones-por-cancelaci%C3%B3n-del-propietario
· Contarás con el apoyo de nuestro equipo de atención al cliente, formado por más de 30 personas de 5 nacionalidades, siempre dispuesto a ayudarte.
· Numero de Telefono para el equipo de atención  al cliente: +34 911 232 190

📑 Documentación necesaria para activar tu cuenta

Para completar la verificación de tu perfil, por favor envíanos la siguiente documentación:
· Certificado de inscripción de la empresa (modelo 036/037 si eres autónomo) con número de IVA.
· Copia del DNI del propietario o administrador.
· Documento oficial con el IBAN y nombre del titular (foto de libreta bancaria o captura de pantalla del banco online).
· Documentación de lista 6ª (hoja de asiento o certificado de navegabilidad), o despacho de Capitanía si el barco tiene bandera extranjera.
· Declaración de responsabilidad de charter (solo en caso de embarcaciones en Baleares).
👉 Sin esta documentación no podremos publicar tus barcos en la plataforma.

Quedo a tu disposición para cualquier duda que puedas tener y agradezco de antemano tu colaboración.
Un cordial saludo,

`; // Use backticks

                 navigator.clipboard.writeText(emailBody).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template2Btn.innerText; // Store original text
                    template2Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template2Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
            };
                };

            //----------------------------------
            //----------- TEMPLATE 8 -----------
            //----------------------------------
            const template8Btn = document.createElement('button');
            template8Btn.className = 'btn btn-spanish';
            template8Btn.innerText = 'DWS';
            template8Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hola ${firstName},A DEFINIR`);
                } else {
                    sendEmail(contact, 'Activa tus embarcaciones en Click&Boat – Información importante y requisitos', `El mensaje del correo electrónico está en tu portapapeles, ¡borra esto y pega el contenido!`);
                    const emailBody = `Hola ${firstName},

Gracias una vez más por tomarte el tiempo de hablar con nosotros y por tu interés en colaborar con Click&Boat.
Como confirmamos durante nuestra llamada, pronto podrás ofrecer alquileres por horas y experiencias únicas a los usuarios de nuestra plataforma.
Antes de que podamos publicar tus barcos y actividades, necesitamos recopilar información para verificar tu perfil y crear adecuadamente tus experiencias.


📌 Notas importantes

· No está permitido intercambiar datos de contacto con los arrendatarios antes de que se confirme la reserva
· Después de la confirmación, puedes ponerte en contacto directamente con el cliente y gestionar el contrato de alquiler
· Puedes revisar las Políticas de Cancelación del Propietario aquí 👉 https://help.clickandboat.com/hc/es/articles/9514891034386-Penalizaciones-por-cancelaci%C3%B3n-del-propietario
· Contarás con el apoyo de nuestro equipo de atención al cliente de más de 30 personas de 5 nacionalidades diferentes
· Número de teléfono de atención al cliente: +34 911 232 190

📝 1. Documentos necesarios para validar tu cuenta
Por favor, envíanos los siguientes documentos:

· Certificado de inscripción de la empresa (modelo 036/037 si eres autónomo) con número de IVA.
· Copia del DNI del propietario o administrador.
· Documento oficial con el IBAN y nombre del titular (foto de libreta bancaria o captura de pantalla del banco online).
· Documentación de lista 6ª (hoja de asiento o certificado de navegabilidad), o despacho de Capitanía si el barco tiene bandera extranjera.
· Declaración de responsabilidad de charter (solo en caso de embarcaciones en Baleares).

🛥️ 2. Información para crear tus actividades
Encontrarás un archivo de Excel adjunto donde ya hemos rellenado algunos de los detalles que comentamos por teléfono.
Por favor, revisa el archivo y siéntete libre de corregir o modificar cualquier cosa.
Para cada tour (máximo 5 por barco), necesitamos confirmar:

· Nombre y duración del tour
· Precio total (o precios separados: barco, patrón, combustible)
· Hora de registro
· Itinerario
· Idiomas hablados por el patrón
· ¿Qué está incluido? (bebidas, cervezas, equipo de snorkel, etc.)
· ¿Con cuánta antelación deben reservar los clientes?
· ¿Podemos activar la opción de Reserva Inmediata?

💰 Estructura de comisiones

· Barco: 21%
· Patrón: 2%
· Combustible: 2%
(Puedes añadir un 2% a los precios del patrón y el combustible si deseas cubrir esas comisiones).

Para yates:
El combustible no está incluido en el precio, y utilizamos el sistema APA (Advance Provisioning Allowance).
Por favor, haznos saber la cantidad de APA que utilizas actualmente.

Una vez que tengamos toda la información y los documentos necesarios, activaremos tus barcos y te avisaremos para que puedas revisarlos.
Quedamos a tu disposición para cualquier pregunta o ajuste que necesites.`; // Use backticks

                 navigator.clipboard.writeText(emailBody).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template2Btn.innerText; // Store original text
                    template2Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template2Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
            };
                };

            //----------------------------------
            //----------- TEMPLATE 9 -----------
            //----------------------------------
            const template9Btn = document.createElement('button');
            template9Btn.className = 'btn btn-spanish';
            template9Btn.innerText = 'NA';
            template9Btn.style = "margin-left: 10px";
            template9Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Buen dia ${firstName}, soy David de Click&Boat.

Intenté llamarte para darte la bienvenida, pero no pude contactarte.
Necesitamos programar una llamada para explicar el servicio y poder publicar tu barco. Sin esta llamada previa, no podemos activar el anuncio ni hacer que la cuenta sea visible en la plataforma.
¿Tienes un momento esta semana para hablar? Avísame cuándo te conviene y coordinaremos :)`);

                    const WA_Message = `Buen dia ${firstName}, soy David de Click&Boat.
Intenté llamarte para darte la bienvenida, pero no pude contactarte.
Necesitamos agendar una llamada para explicarte el servicio y poder publicar tu embarcación. Sin esta llamada previa, no podemos activar el anuncio ni dejar la cuenta visible en la plataforma.

Tienes un momento esta semana para hablar? Dime cuándo te viene bien y coordinamos :)`

                     navigator.clipboard.writeText(WA_Message).then(function() {
                    // Success!
                    console.log('Text copied to clipboard'); // For debugging

                    // Button Text Feedback
                    const originalText = template1Btn.innerText; // Store original text
                    template1Btn.innerText = '✔ Copied to Clipboard'; // Set confirmation text

                    setTimeout(function() {
                        template1Btn.innerText = originalText; // Revert to original text after 2 seconds
                    }, 2000);

                }, function(err) {
                    console.error('Could not copy text: ', err);
                    alert('Error copying text to clipboard: ' + err);
                });
                    //Code above is copy to clipboard
                } else {
                    sendEmail(contact, 'Seguimiento de tu anuncio de barco – Acción requerida', `Hola estimado propietario de barco,

Soy David y me comunico contigo en nombre de Click&Boat, la plataforma de alquiler de barcos.
Recientemente te registraste en nuestra plataforma y hoy intenté llamarte para darte la bienvenida, pero no pude contactarte.
Me gustaría programar una llamada para explicar cómo funciona nuestro servicio y poder publicar tu flota en línea. Sin esta llamada previa, lamentablemente, los barcos no se pueden subir a la plataforma y tendríamos que desactivar tu cuenta hasta que tengamos noticias tuyas.

Espero tener noticias tuyas.

Saludos cordiales,

                    `);
                }
            };

            //----------------------------------
            //----------- TEMPLATE 10 -----------
            //----------------------------------
            const template10Btn = document.createElement('button');
            template10Btn.className = 'btn btn-spanish';
            template10Btn.innerText = 'ProDocs';
            template10Btn.style = "margin-left: 10px";
            template10Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hola ${firstName},
Estaba revisando tu cuenta y para publicar tu barco en Click&Boat, solo necesito algunos documentos tuyos:
· Registro de la empresa con número de IVA
· Copia de tu documento de identidad (DNI)
· Un documento que muestre tu IBAN + nombre del titular de la cuenta (como una captura de pantalla bancaria)
· Hoja de registro o certificado de navegabilidad de tu barco
· RNAAT

Una vez que tenga esto, puedo publicar tu barco. ¡Avísame si tienes alguna pregunta!
                    `);
                } else {
                    sendEmail(contact, "Documentos necesarios para publicar tu barco en Click&Boat", `Hola ${firstName},
Al revisar tu cuenta, noté que faltan algunos documentos importantes para el proceso de verificación. Para publicar tu barco en la plataforma, te pido amablemente que envíes lo siguiente:

· Certificado de registro de la empresa, incluido el número de IVA de tu empresa.
· Una copia del documento de identidad (DNI) del propietario o administrador de la empresa.
· Un documento oficial (como una foto de una libreta bancaria o una captura de pantalla de la banca en línea) que muestre claramente el IBAN y el nombre del titular de la cuenta.
· Hoja de registro o certificado de navegabilidad
· RNAAT

Una vez que reciba estos documentos, podré proceder con la publicación de tu barco en Click&Boat.
Por favor, no dudes en ponerte en contacto si tienes alguna pregunta. Estoy aquí para ayudar.

Saludos cordiales,
                    `);
                }
            };

            //----------------------------------
            //----------- TEMPLATE 11 -----------
            //----------------------------------
            const template11Btn = document.createElement('Online');
            template11Btn.className = 'btn btn-spanish';
            template11Btn.innerText = 'Online';
            template11Btn.style = "margin-left: 10px";
            template11Btn.onclick = function() {
                 if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hola ${firstName}, \nte informo que he subido tu anuncio / tus actividades a la plataforma. Este cambio puede tardar hasta 24 horas en ser visible. Tómate un momento para revisar tus anuncios y asegúrate de que toda la información sea correcta.
Es muy importante mantener el perfil actualizado, especialmente las fotos y los precios. \nQue tengas un buen día!`);
                } else {
                sendEmail(contact, 'Tus anuncios ya están activos en Click&Boat', `Hola ${firstName},
Te escribo para confirmar que ahora he publicado tu anuncio en Click&Boat. Tu anuncio tardará hasta 24 horas en ser visible en la plataforma.
Tómate un momento para revisar los anuncios en tu cuenta y asegurarte de que toda la información sea correcta. Es muy importante mantener tu perfil actualizado, especialmente las fotos y los precios, ya que estos detalles impactan directamente el interés del cliente y la cantidad de reservas que puedes recibir.

Si deseas realizar algún cambio o agregar más detalles, puedes hacerlo directamente desde tu cuenta.

Saludos cordiales,`);
                    }
};

            //----------------------------------
            //----------- TEMPLATE 12 -----------
            //----------------------------------
            const template12Btn = document.createElement('button');
            template12Btn.className = 'btn btn-spanish';
            template12Btn.innerText = 'FU';
            template12Btn.style = "margin-left: 10px";
            template12Btn.onclick = function() {
                if (type === 'whatsapp') {
                    openWhatsApp(contact, `Hola ${firstName}, \nBuenas noticias! Acabamos de publicar tu barco en la plataforma Click&Boat. Te recomendamos revisar el anuncio directamente desde tu perfil y asegurarte de que toda la información sea correcta y esté actualizada. \nQue tengas un buen día!`);
                } else {
                sendEmail(contact, 'Tus anuncios ya están activos en Click&Boat', `Hola ${firstName},
¡Buenas noticias! Acabamos de publicar tu barco <nombre del barco> en la plataforma Click&Boat. Los cambios duran hasta 24h hasta que son efectivos.
Te recomendamos revisar el anuncio directamente desde tu perfil para asegurarte de que toda la información sea correcta y esté actualizada. Una descripción sólida, fotos atractivas y un calendario bien gestionado aumentarán tus posibilidades de obtener reservas.
Gracias por confiar en Click&Boat.
¡Estamos aquí para ayudarte con todo lo que necesites!

Saludos cordiales,
`);
                    }
            };



    firstRow.appendChild(template1Btn);
    firstRow.appendChild(template2Btn);
    firstRow.appendChild(template3Btn);
    firstRow.appendChild(template4Btn);
    firstRow.appendChild(template5Btn);
    firstRow.appendChild(template6Btn);
            secondRow.appendChild(template7Btn);
            secondRow.appendChild(template8Btn);
            secondRow.appendChild(template9Btn);
            secondRow.appendChild(template10Btn);
            secondRow.appendChild(template11Btn);
            secondRow.appendChild(template12Btn);

    templatesContainer.appendChild(firstRow);
    templatesContainer.appendChild(secondRow);


    popup.appendChild(title);
    popup.appendChild(closeButton);
    popup.appendChild(document.createElement('hr'));
    popup.appendChild(templatesContainer);

    document.body.appendChild(popup);
    createOverlay();
        }

        function openWhatsApp(number, message) {
            const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
        }

        function sendEmail(to, subject, body) {
            const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        }

        function createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 10000;";
            document.body.appendChild(overlay);
        }

        function removeOverlay() {
            const overlay = document.getElementById('overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }

})();