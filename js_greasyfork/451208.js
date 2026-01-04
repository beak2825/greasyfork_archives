// ==UserScript==
// @name TAssistant
// @name:sk TAsistent
// @namespace TAssistant
// @version 1.2
// @description An assistant for exams in Easistent
// @description:sk Pomočnik za teste v Easistentu
// @author Nejc Živic
// @grant none
// @match https://www.easistent.com/urniki/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451208/TAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/451208/TAssistant.meta.js
// ==/UserScript==

(function () {
    function GetExam(subject) {
        let exam;
        switch (subject) {
            case "M": {
                exam = "MAT"
                break;
            }
            case "F": {
                exam = "FIZ"
                break;
            }
            case "K": {
                exam = "KEM"
                break;
            }
            case "B": {
                exam = "BIO"
                break;
            }
            case "Z": {
                exam = "ZGO"
                break;
            }
            case "S": {
                exam = "SLO"
                break;
            }
            case "N": {
                exam = "NEM"
                break;
            }
            case "A": {
                exam = "ANG"
                break;
            }
            case "P": {
                exam = "PSH"
                break;
            }
            case "Š": {
                exam = "ŠVZ"
                break;
            }
            case "G": {
                exam = "GEO"
                break;
            }
            case "S": {
                exam = "SOC"
                break;
            }
            case "I": {
                exam = "INF"
                break;
            }
            case "FI": {
                exam = "FIL"
                break;
            }
            case "PE": {
                exam = "PED"
                break;
            }
            case "T": {
                exam = "TSV-Pra"
                break;
            }
            case "IT": {
                exam = "ITA"
                break;
            }
            case "O": {
                exam = "OTI-Ekn"
                break;
            } 
            case "IK": {
                exam = "IKT-Pok"
                break;
            }
            case "ŠI": {
                exam = "ŠIS"
                break;
            }
            case "TS": {
                exam = "TSV-Nem"
                break;
            }
        }
        return exam;
    }

    function MarkRed(date, subject) {
        const elements = [];

        for (let i = 0; i <= 12; i++) {
            elements.push(document.getElementById(`ednevnik-seznam_ur_teden-td-${i}-${date}`));
        }

        elements.forEach(el => {
            if (el) {
                if (el.innerText.includes(subject)) {
                    const child1 = el.children.item(0).children.item(0);
                    const child2 = el.children.item(0).children.item(1);
                    child1.style.color = "red";
                    child2.style.color = "red";
                }
            }
        });
    }

    function MarkBlue(date, subject) {
        const elements = []

        for (let i = 0; i <= 12; i++) {
            elements.push(document.getElementById(`ednevnik-seznam_ur_teden-td-${i}-${date}`));
        }

        elements.forEach(el => {
            if (el) {
                if (el.innerText.includes(subject)) {
                    const child1 = el.children.item(0).children.item(0);
                    const child2 = el.children.item(0).children.item(1);
                    child1.style.color = "blue";
                    child2.style.color = "blue";
                }
            }
        });
    }

    function Download(file) {
        const a = document.createElement("a");
        a.href = file;
        a.download = "testi.json";
        a.click();
    }

    function Export() {
        const data = {
            exams: [],
            spra: []
        };

        const exams = localStorage.getItem("exams");
        const spra = localStorage.getItem("spra");

        if (exams) {
            data.exams = JSON.parse(exams);
        }

        if (spra) {
            data.spra = JSON.parse(spra);
        }

        const json = JSON.stringify(data);

        const file = URL.createObjectURL(new Blob([json], { type: "application/json" }));

        Download(file);
    }

    function Import() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                const data = JSON.parse(e.target.result);
                localStorage.setItem("exams", JSON.stringify(data.exams));
                localStorage.setItem("spra", JSON.stringify(data.spra));
            };
            reader.readAsText(file);
        };
        input.click();
    }

    const tabs = document.getElementsByClassName("horizontal_tabs");

    const subject = document.createElement("input");
    subject.placeholder = "Predmet";
    subject.classList.add("horizontal_tab");
    subject.classList.add("subject");
    subject.hidden = true;

    const date = document.createElement("input");
    date.type = "date";
    date.classList.add("horizontal_tab");
    date.classList.add("date");
    date.hidden = true;

    const confirm = document.createElement("button");
    confirm.classList.add("horizontal_tab");
    confirm.classList.add("confirm");
    confirm.innerText = "Potrdi";
    confirm.hidden = true;
    confirm.onclick = () => {
        const addButton = document.getElementById("addButton");

        if (addButton.innerText == "Dodaj Test") {
            if (subject.value && date.value) {
                let predmet;

                if (subject.value.toUpperCase().startsWith("PE") || subject.value.toUpperCase().startsWith("FI") || subject.value.toUpperCase().startsWith("IK") || subject.value.toUpperCase().startsWith("ŠI") || subject.value.toUpperCase().startsWith("TS") || subject.value.toUpperCase().startsWith("IT")) {
                    predmet = subject.value.substring(0, 2).toUpperCase();
                }

                predmet = subject.value.substring(0, 1).toUpperCase();
                const exams = localStorage.getItem("exams");
                if (exams) {
                    const ex = JSON.parse(exams);
                    ex.push({
                        subject: predmet,
                        date: date.value
                    });
                    localStorage.setItem("exams", JSON.stringify(ex));
                } else {
                    const ex = [
                        {
                            subject: predmet,
                            date: date.value
                        }
                    ];
                    localStorage.setItem("exams", JSON.stringify(ex));
                }
                MarkRed(date.value, GetExam(subject.value));

                alert("Uspešno dodano!");
            }
            else {
                alert("Vnesite predmet in datum!");
            }
        }

        else {
            if (subject.value && date.value) {
                const predmet = subject.value.substring(0, 1).toUpperCase();
                const exams = localStorage.getItem("spra");
                if (exams) {
                    const ex = JSON.parse(exams);
                    ex.push({
                        subject: predmet,
                        date: date.value
                    });
                    localStorage.setItem("spra", JSON.stringify(ex));
                } else {
                    const ex = [
                        {
                            subject: predmet,
                            date: date.value
                        }
                    ];
                    localStorage.setItem("spra", JSON.stringify(ex));
                }
                MarkRed(date.value, GetExam(subject.value));

                alert("Uspešno dodano!");
            }
            else {
                alert("Vnesite predmet in datum!");
            }
        }

    }

    const button = document.createElement("a");
    button.innerText = "Dodaj Test";
    button.id = "addButton";
    button.classList.add("horizontal_tab");
    button.onclick = () => {
        const subject = document.getElementsByClassName("subject")[0];
        const date = document.getElementsByClassName("date")[0];

        if (subject.hidden) {
            subject.hidden = false;
            date.hidden = false;
            confirm.hidden = false;
        }
        else {
            subject.hidden = true;
            date.hidden = true;
            confirm.hidden = true;
        }
    }

    const delExam = document.createElement("a");
    delExam.innerText = "Izbriši Ocenjevanja";
    delExam.classList.add("horizontal_tab");
    delExam.onclick = () => {
        localStorage.removeItem("exams");
        localStorage.removeItem("spra");
        alert("Uspešno izbrisano!");
    }

    const switcher = document.createElement("a");
    switcher.innerText = "Zamenjaj vnos";
    switcher.classList.add("horizontal_tab");
    switcher.onclick = () => {
        const add = document.getElementById("addButton");

        if (add.innerText == "Dodaj Test") {

            add.innerText = "Dodaj Spraševanje";
        }
        else {
            add.innerText = "Dodaj Test";
        }
    }

    const exportButton = document.createElement("a");
    exportButton.innerText = "Izvozi Ocenjevanja";
    exportButton.classList.add("horizontal_tab");
    exportButton.onclick = () => {
        Export();
    };

    const importButton = document.createElement("a");
    importButton.innerText = "Uvozi Ocenjevanja";
    importButton.classList.add("horizontal_tab");
    importButton.onclick = () => {
        Import();
    };

    tabs[0].appendChild(button);
    tabs[0].appendChild(subject);
    tabs[0].appendChild(date);
    tabs[0].appendChild(confirm);
    tabs[0].appendChild(delExam);
    tabs[0].appendChild(switcher);
    tabs[0].appendChild(exportButton);
    tabs[0].appendChild(importButton);

    const exams = localStorage.getItem("exams");
    const spra = localStorage.getItem("spra");

    if (exams) {
        for (const exam of JSON.parse(exams)) {
            const date = new Date();
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate() + 1;
            let week = date.getDate() + 7;
            let weeks = date.getDate() + 14;

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            if (week < 10) week = "0" + week;

            if (exam.date == `${year}-${month}-${weeks}`) {
                alert(`Čez 2 tedna imate test za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${week}`) {
                alert(`Čez 1 teden imate test za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${day}`) {
                alert(`Jutri imate test za ${GetExam(exam.subject)}!`);
            }
        }
    }

    if (spra) {
        for (const exam of JSON.parse(spra)) {
            const date = new Date();
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate() + 1;
            let week = date.getDate() + 7;
            let weeks = date.getDate() + 14;

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            if (week < 10) week = "0" + week;

            if (exam.date == `${year}-${month}-${weeks}`) {
                alert(`Čez 2 tedna imate spraševanje za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${week}`) {
                alert(`Čez 1 teden imate spraševanje za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${day}`) {
                alert(`Jutri imate spraševanje za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${date.getDate()}`) {
                alert(`Danes imate spraševanje za ${GetExam(exam.subject)}!`);
            }
        }
    }

    setInterval(() => {
        const exams = localStorage.getItem("exams");
        const spras = localStorage.getItem("spra");

        if (spras) {
            for (const spra of JSON.parse(spras)) {
                const subject = GetExam(spra.subject);
                MarkBlue(spra.date, subject)
            }
        }

        if (exams) {
            for (const exam of JSON.parse(exams)) {
                const subject = GetExam(exam.subject);
                MarkRed(exam.date, subject);
            };
        }
    }, 1000);
})();