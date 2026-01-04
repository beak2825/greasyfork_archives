// ==UserScript==
// @name         CopyMaster
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Tool for copying raw text and formated text
//               Advanced tools : formats PDF, DOCX, LibreOffice (ODT),  Excel/CSV/ODS,  audio, vidéo, images, tabs, etc.
// @author       yglsan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @license      Gpl-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/525652/CopyMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/525652/CopyMaster.meta.js
// ==/UserScript==

/*
  Copyright (C) 2025 Benjamin Moine (yglsan)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(function() {
    'use strict';

    // Création du bouton flottant moderne
    const button = document.createElement('button');
    button.innerText = '📋 Copier Formaté';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.background = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.zIndex = '1000';
    button.style.transition = 'background 0.3s';
    button.addEventListener('mouseover', () => button.style.background = '#0056b3');
    button.addEventListener('mouseout', () => button.style.background = '#007bff');
    button.addEventListener('click', copyWithStyles);
    document.body.appendChild(button);

    // Fonction pour copier le contenu formaté avec styles et médias
    async function copyWithStyles() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        const clonedSelection = range.cloneContents();

        // Ajout des styles inline
        clonedSelection.querySelectorAll('*').forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            el.style.cssText = computedStyle.cssText;
        });

        // Gestion des images
        await Promise.all(
            Array.from(clonedSelection.querySelectorAll('img')).map(async (img) => {
                if (img.src.startsWith('data:')) return;
                try {
                    const response = await fetch(img.src);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        img.src = reader.result;
                    };
                    reader.readAsDataURL(blob);
                } catch (e) {
                    console.error('Erreur de téléchargement de l\'image', img.src, e);
                }
            })
        );

        // Gestion des éléments audio et vidéo
        clonedSelection.querySelectorAll('audio, video').forEach(media => {
            if (media.src && !media.src.startsWith('data:')) {
                fetch(media.src)
                    .then(res => res.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            media.src = reader.result;
                        };
                        reader.readAsDataURL(blob);
                    })
                    .catch(err => console.error('Erreur lors du téléchargement du média', media.src, err));
            }
        });

        // Gestion des liens
        clonedSelection.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
        });

        // Reconnaissance avancée de la mise en forme
        clonedSelection.querySelectorAll('code, pre').forEach(block => {
            block.innerText = '```' + block.innerText + '```'; // Format Markdown
        });

        // Gestion des tableaux
        clonedSelection.querySelectorAll('table').forEach(table => {
            table.style.borderCollapse = 'collapse';
            table.querySelectorAll('td, th').forEach(cell => {
                cell.style.border = '1px solid black';
                cell.style.padding = '4px';
            });
        });

        // Formatage des éléments textuels
        clonedSelection.querySelectorAll('b, strong').forEach(el => {
            el.innerText = '**' + el.innerText + '**';
        });
        clonedSelection.querySelectorAll('i, em').forEach(el => {
            el.innerText = '*' + el.innerText + '*';
        });
        clonedSelection.querySelectorAll('u').forEach(el => {
            el.innerText = '__' + el.innerText + '__';
        });

        // Conversion en HTML complet
        const div = document.createElement('div');
        div.appendChild(clonedSelection);
        GM_setClipboard(div.innerHTML, 'text/html');

        // Notification de réussite
        GM_notification({
            text: 'Contenu copié avec succès dans le presse-papiers !',
            title: 'CopyMasterX',
            timeout: 3000
        });
    }

    // Fonction pour exporter en PDF
    function exportToPDF(content) {
        const jsPDF = window.jsPDF;
        const doc = new jsPDF();
        doc.html(content, {
            callback: function (doc) {
                doc.save('export.pdf');
            },
            margin: [10, 10, 10, 10],
            autoPaging: true
        });
    }

    // Fonction pour exporter en DOCX
    function exportToDOCX(content) {
        const PizZip = window.PizZip;
        const Docxtemplater = window.Docxtemplater;

        const zip = new PizZip();
        const doc = new Docxtemplater(zip);
        doc.setData({ content });
        doc.render();
        const out = doc.getZip().generate({ type: 'blob' });
        GM_download(out, 'export.docx');
    }

    // Fonction pour exporter en ODT (LibreOffice)
    function exportToODT(content) {
        const odf = window.odf; // Assurez-vous d'avoir la bibliothèque js-odf importée dans votre projet
        const odtDoc = new odf.OdtDocument();
        odtDoc.addText(content);
        const blob = odtDoc.save();
        GM_download(blob, 'export.odt');
    }

    // Fonction pour exporter en CSV
    function exportToCSV(table) {
        let csv = '';
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowData = [];
            cells.forEach(cell => {
                rowData.push('"' + cell.textContent.replace(/"/g, '""') + '"');
            });
            csv += rowData.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        GM_download(blob, 'export.csv');
    }

    // Fonction pour exporter en Excel
    function exportToExcel(table) {
        const XLSX = window.XLSX; // Assurez-vous d'avoir la bibliothèque xlsx importée dans votre projet
        const wb = XLSX.utils.table_to_book(table);
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        GM_download(blob, 'export.xlsx');
    }

    // Fonction pour exporter en ODS (LibreOffice)
    function exportToODS(table) {
        const ODS = window.ODS; // Assurez-vous d'avoir la bibliothèque js-ods importée dans votre projet
        const odsDoc = new ODS.Document();
        const sheet = odsDoc.addSheet('Sheet1');

        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            cells.forEach((cell, cellIndex) => {
                sheet.write(cellIndex, rowIndex, cell.textContent);
            });
        });

        const blob = odsDoc.save();
        GM_download(blob, 'export.ods');
    }

    // Fonction utilitaire pour convertir le binaire en tableau
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // Ajout de la gestion de la touche de raccourci
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') copyWithStyles();
    });
})();
