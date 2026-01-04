// ==UserScript==
// @name         Auto Check Companies on Button Click with Button Insertion and Info Block
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Match companies and update checkboxes on button click, with dynamic button insertion and info block display, and close functionality for info blocks
// @author       You
// @match        *://dodopizza.design-terminal.io/admin/users/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534616/Auto%20Check%20Companies%20on%20Button%20Click%20with%20Button%20Insertion%20and%20Info%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/534616/Auto%20Check%20Companies%20on%20Button%20Click%20with%20Button%20Insertion%20and%20Info%20Block.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("🚀 Tampermonkey script started");

    function getCompaniesFromTable() {
        let companies = new Set();
        document.querySelectorAll(".admin-user-view__auth-provider-details table tbody tr td:nth-child(3) a.link").forEach((a) => companies.add(a.textContent.trim()));
        console.log("✅ Companies found:", Array.from(companies));
        return companies;
    }

    function updateCheckboxes(companies) {
        let uncheckedCompanies = [];
        let notFoundCompanies = [];
        let matchedCompanies = [];

        document.querySelectorAll("form table tbody tr").forEach((row) => {
            let companyElement = row.querySelector("td:nth-child(2) a.link");
            let checkbox = row.querySelector('input[type="checkbox"]');

            if (companyElement && checkbox) {
                let companyName = companyElement.textContent.trim();
                if (companies.has(companyName)) {
                    checkbox.checked = true;
                    matchedCompanies.push(companyName);
                } else {
                    if (checkbox.checked) {
                        uncheckedCompanies.push(companyName);
                        row.style.background = "#feeef1";
                    }
                    checkbox.checked = false;
                }
            }
        });

        // Для определения компаний из второй таблицы, которых нет в первой
        document.querySelectorAll(".admin-user-view__auth-provider-details table tbody tr td:nth-child(3) a.link").forEach((companyElement) => {
            let companyName = companyElement.textContent.trim();
            if (!companies.has(companyName)) {
                notFoundCompanies.push(companyName);
            }
        });

        return { uncheckedCompanies, notFoundCompanies, matchedCompanies };
    }

    function createInfoBlock(companies, uncheckedCompanies, notFoundCompanies, matchedCompanies) {
        const previousInfoBlock = document.querySelector(".info-block");
        if (previousInfoBlock) previousInfoBlock.remove();

        const infoBlock = document.createElement("div");
        infoBlock.classList.add("info-block");
        Object.assign(infoBlock.style, {
            backgroundColor: "#faf8d7",
            padding: "16px",
            marginTop: "20px",
            border: "1px solid #d2bf7d",
            borderRadius: "5px",
            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: "9999",
            maxHeight: "calc(100vh - 60px)",
            overflowY: "auto",
            width: "400px",
        });

        infoBlock.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px;">Найдено совпадений: ${matchedCompanies.length}</div>
    <div style="font-weight: bold; margin-top: 15px;">Активированные компании:</div>
    <ul style="list-style: unset; padding-left: 20px;">
        ${matchedCompanies.length ? matchedCompanies.map((c) => `<li>${c}</li>`).join("") : "<li>Нет</li>"}
    </ul>
    <div style="font-weight: bold; margin-top: 15px;">Какие чекбоксы снял:</div>
    <ul style="list-style: unset; padding-left: 20px;">
        ${uncheckedCompanies.length ? uncheckedCompanies.map((c) => `<li>${c}</li>`).join("") : "<li>Нет</li>"}
    </ul>
    <div style="font-weight: bold; margin-top: 15px;">Каких компании из Third-party auth не нашел в списке компаний:</div>
    <ul style="list-style: unset; padding-left: 20px;">
        ${notFoundCompanies.length ? notFoundCompanies.map((c) => `<li>${c}</li>`).join("") : "<li>Все найдены</li>"}
    </ul>`;

        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        Object.assign(closeButton.style, {
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
        });
        closeButton.addEventListener("click", () => infoBlock.remove());
        infoBlock.appendChild(closeButton);
        document.body.appendChild(infoBlock);
    }

    function main() {
        console.log("🎯 Button clicked, starting sync...");
        let companies = getCompaniesFromTable();
        let { uncheckedCompanies, notFoundCompanies, matchedCompanies } = updateCheckboxes(companies);
        createInfoBlock(companies, uncheckedCompanies, notFoundCompanies, matchedCompanies);

        // Прокрутка к концу страницы
        console.log("🔄 Начинаем прокрутку...");
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            console.log("✅ Прокрутка выполнена");
        }, 0);
    }

    function findAndInsertButton() {
        let attempts = 0;
        const checkInterval = 500;
        const maxAttempts = 60;

        let interval = setInterval(() => {
            let headers = document.querySelectorAll("h2.section__headline");
            headers.forEach((header) => {
                let span = header.querySelector("span");
                if (span && span.textContent.trim() === "Third-party auth") {
                    if (!document.querySelector(".third-party-auth-button")) {
                        const button = document.createElement("button");
                        button.type = "button";
                        button.textContent = "Sync Companies";
                        button.className = "third-party-auth-button";
                        button.style.marginLeft = "10px";
                        button.addEventListener("click", main);
                        header.appendChild(button);
                        console.log("🎉 Button added");
                    }
                    clearInterval(interval);
                }
            });
            if (++attempts >= maxAttempts) clearInterval(interval);
        }, checkInterval);
    }

    findAndInsertButton();
})();
