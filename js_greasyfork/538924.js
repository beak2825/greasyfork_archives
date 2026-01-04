// ==UserScript==
// @name         Esprit Moyenne
// @namespace    http://tampermonkey.net/
// @version      2025-06-12
// @description  Better moyenne experience
// @author       NotSoHealthy
// @match        https://esprit-tn.com/esponline/Etudiants/Resultat2021.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=esprit-tn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538924/Esprit%20Moyenne.user.js
// @updateURL https://update.greasyfork.org/scripts/538924/Esprit%20Moyenne.meta.js
// ==/UserScript==

(async function() {
    const style = document.createElement('style');
    style.innerHTML = `
    .row{
        margin: 0;
    }

    .table-header {
        color: white;
        background-color: #A80000;
        font-weight: bold;
    }

    .moyenne-high {
        background-color: green;
        color: white;
    }

    .moyenne-low {
        background-color: red;
        color: white;
    }

    #ContentPlaceHolder1_GridView1 {
        width: 100%;
        border-collapse: collapse;
    }

    #ContentPlaceHolder1_GridView1 th,
    #ContentPlaceHolder1_GridView1 td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    #ContentPlaceHolder1_GridView1 tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    #ContentPlaceHolder1_GridView1 tr:hover {
        background-color: #ddd;
    }

    #ContentPlaceHolder1_GridView1 .table-header:hover {
        background-color: #A80000;;
    }

    #downloadButton {
        margin-bottom: 10px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        background-color: #A80000;
        color: white;
        border: none;
        border-radius: 5px;
        transition: transform 0.2s ease;
    }

    #downloadButton:hover {
        transform: scale(1.05);
        background-color: #CC0000;
    }
    `;
    document.head.appendChild(style);

    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script ${src}`));
            document.head.appendChild(script);
        });
    }

    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

    function getStudentDetails() {
        const nameElement = document.getElementById('Label2');
        const classElement = document.getElementById('Label3');
        const studentName = nameElement ? nameElement.textContent.trim() : 'Unknown Student';
        const studentClass = classElement ? classElement.textContent.trim() : 'Unknown Class';
        return { studentName, studentClass };
    }

    function getLogoImage() {
        const logoElement = document.querySelector('.img-responsive img');
        return logoElement ? logoElement.src : null;
    }

    function tableToJson(table) {
        const data = [];
        const headers = Array.from(table.rows[0].cells).map(cell =>
            cell.innerText.toLowerCase().replace(/ /g, '')
        );
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row.cells[index].innerText;
            });
            data.push(rowData);
        }
        data.forEach(item => {
            item.coef = parseFloat(item.coef.replace(',', '.'));
            item.note_exam = parseFloat(item.note_exam.replace(',', '.'));
            item.note_cc = parseFloat(item.note_cc.replace(',', '.'));
            item.note_tp = parseFloat(item.note_tp.replace(',', '.'));
        });
        return data;
    }

    const table = document.getElementById('ContentPlaceHolder1_GridView1');
    const data = tableToJson(table);

    const sumCoef = data.reduce((sum, item) => sum + item.coef, 0);

    function calculMoyenne(dataSet, totalCoef) {
        let total = 0;
        dataSet.forEach(item => {
            const { note_exam, note_cc, note_tp, coef } = item;
            let moyenne = 0;
            if (isNaN(note_tp)) {
                if (isNaN(note_cc)) {
                    moyenne = note_exam;
                } else {
                    moyenne = note_exam * 0.6 + note_cc * 0.4;
                    if (item.designation == 'Génie logiciel & atelier GL'){
                        moyenne = note_exam * 0.4 + note_cc * 0.6;
                    }
                }
            } else if (isNaN(note_cc)) {
                moyenne = note_exam * 0.8 + note_tp * 0.2;
            } else {
                moyenne = note_exam * 0.5 + note_cc * 0.3 + note_tp * 0.2;
            }
            item.moyenne = moyenne;
            total += moyenne * coef;
        });
        dataSet.push({
            designation: 'Moyenne',
            coef: totalCoef,
            nom_ens: '',
            note_cc: '',
            note_tp: '',
            note_exam: '',
            moyenne: total / totalCoef,
        });
        return dataSet;
    }

    const newData = calculMoyenne(data, sumCoef);

    function populateTable(dataSet) {
        let title = document.querySelector(".col-xs-10 > center > h1") ;
        title.innerHTML = title.innerHTML + ": " + (document.querySelectorAll("tr").length-1).toString();
        document.querySelectorAll(".row ~ br").forEach((e)=>e.remove());
        let tableContent = `
            <tr class="table-header">
                <th scope="col">DESIGNATION</th>
                <th scope="col">COEF</th>
                <th scope="col">NOM_ENS</th>
                <th scope="col">NOTE_CC</th>
                <th scope="col">NOTE_TP</th>
                <th scope="col">NOTE_EXAM</th>
                <th scope="col">Moyenne</th>
            </tr>`;
        dataSet.forEach(item => {
            const moyenneClass = !isNaN(item.moyenne)
                ? item.moyenne >= 8 ? 'moyenne-high' : 'moyenne-low'
                : '';
            tableContent += `
                <tr>
                    <td>${item.designation}</td>
                    <td>${item.coef}</td>
                    <td>${item.nom_ens}</td>
                    <td>${isNaN(item.note_cc) ? '' : item.note_cc}</td>
                    <td>${isNaN(item.note_tp) ? '' : item.note_tp}</td>
                    <td>${isNaN(item.note_exam) ? '' : item.note_exam}</td>
                    <td class="${moyenneClass}">${!isNaN(item.moyenne) ? item.moyenne.toFixed(2) : ''}</td>
                </tr>`;
        });
        const tbody = table.querySelector('tbody') || table;
        tbody.innerHTML = tableContent;
        addDownloadButton();
    }

    function addDownloadButton() {
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download as PDF';
        downloadButton.id = 'downloadButton';
        downloadButton.type = 'button';
        table.parentNode.insertBefore(downloadButton, table);
        downloadButton.addEventListener('click', function(event) {
            event.preventDefault();
            generatePDF();
        });
    }

    populateTable(newData);

    async function generatePDF() {
        try {
            const { studentName, studentClass } = getStudentDetails();
            const logoSrc = getLogoImage();
            const element = document.getElementById('ContentPlaceHolder1_GridView1');
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
            pdf.setFontSize(16);
            pdf.text(`Student Name: ${studentName}`, 20, 20);
            pdf.setTextColor(204, 0, 0);
            pdf.text(`Class: ${studentClass}`, 20, 40);
            if (logoSrc) {
                const logoImage = new Image();
                logoImage.src = logoSrc;
                pdf.addImage(logoImage, 'PNG', pdf.internal.pageSize.getWidth() - 80, 10, 60, 60);
            }
            pdf.setTextColor(0, 0, 0);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 70, pdfWidth, pdfHeight);
            pdf.save(`${studentName}_Grades.pdf`);
        } catch (error) {
            console.error('Could not generate PDF:', error);
            alert('Could not generate PDF: ' + error.message);
        }
    }
    function newDropCheck(dataset) {
        let tableList = Array.from(document.querySelectorAll('#ContentPlaceHolder1_GridView1 tr td:nth-child(1)'));
        tableList.pop()
        let oldDrop = JSON.parse(localStorage.getItem('oldDrop')) || [];
        dataset.pop();
        let newDrop = dataset.map((e) => e.designation);
        localStorage.setItem('oldDrop', JSON.stringify(newDrop));
        let newItems = newDrop.filter(n => !oldDrop.includes(n))
        newItems.forEach((item)=>{
            tableList.forEach((element)=>{
                if (element.textContent === item){
                    element.textContent += ' 🔴'
                }
            })
        })
    }
    newDropCheck(newData);
})();
