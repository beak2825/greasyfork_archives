// ==UserScript==
// @name        VFS Portugal AutoFill
// @namespace   http://tampermonkey.net/
// @version     0.6
// @description Script para preenchimento automático do formulário de solicitação de visto do VFS Global para Portugal.
// @author      monkay
// @match       https://*.vfsglobal.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/508391/VFS%20Portugal%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/508391/VFS%20Portugal%20AutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dados para o preenchimento
    var formData = {
        email: "preencher ",
        password: "preencher e",
        passportNumber: "",
        firstName: "nhola",
        lastName: "mbala",
        dateOfBirth: "02/11/1964",
        passportExpiryDate: "08/09/2021",
        nationality: "Angolana",
        gender: "Female",
        visaNumber: "123456789",
        visaPlace: "Lisboa",
        visaDuration: "NATIONAL",
        mobile: "número"
    };

    // Função para preencher o formulário
    function fillForm() {
        // Email e senha
        if (document.querySelector("#EmailId")) {
            document.querySelector("#EmailId").value = formData.email;
        }
        if (document.querySelector("#Password")) {
            document.querySelector("#Password").value = formData.password;
        }

        // Passaporte e informações pessoais
        if (document.querySelector("#PassportNumber")) {
            document.querySelector("#PassportNumber").value = formData.passportNumber;
        }
        if (document.querySelector("#FirstName")) {
            document.querySelector("#FirstName").value = formData.firstName;
        }
        if (document.querySelector("#LastName")) {
            document.querySelector("#LastName").value = formData.lastName;
        }
        if (document.querySelector("#DateOfBirth")) {
            document.querySelector("#DateOfBirth").value = formData.dateOfBirth;
        }
        if (document.querySelector("#PassportExpiryDate")) {
            document.querySelector("#PassportExpiryDate").value = formData.passportExpiryDate;
        }

        // Nacionalidade
        if (document.querySelector("#NationalityId")) {
            let nationalityOptions = document.querySelectorAll("#NationalityId option");
            nationalityOptions.forEach(option => {
                if (option.text.includes(formData.nationality)) {
                    option.selected = true;
                }
            });
        }

        // Gênero
        if (document.querySelector("#GenderId")) {
            let genderOptions = document.querySelectorAll("#GenderId option");
            genderOptions.forEach(option => {
                if (option.text.includes(formData.gender)) {
                    option.selected = true;
                }
            });
        }

        // Informações do visto (se aplicável)
        if (document.querySelector("#VisaNumber")) {
            document.querySelector("#VisaNumber").value = formData.visaNumber;
        }
        if (document.querySelector("#PlaceOfIssuance")) {
            document.querySelector("#PlaceOfIssuance").value = formData.visaPlace;
        }
        if (document.querySelector("#Duration")) {
            document.querySelector("#Duration").value = formData.visaDuration;
        }

        // Telefone
        if (document.querySelector("#Mobile")) {
            document.querySelector("#Mobile").value = formData.mobile;
        }

        // Submissão automática (opcional)
        // document.querySelector("#submitbuttonId").click();  // Descomente esta linha para submissão automática
    }

    // Executar a função de preenchimento assim que a página estiver pronta
    window.onload = function() {
        fillForm();
    };

})();