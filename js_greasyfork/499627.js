// ==UserScript==
// @name              ChatGPT Code Export Button
// @name:en           ChatGPT Code Export Button
// @name:zh-CN        ChatGPT 代码导出按钮
// @name:es           Botón de Exportación de Código de ChatGPT
// @name:hi           चैटजीपीटी कोड निर्यात बटन
// @name:fr           Bouton d'Exportation de Code ChatGPT
// @name:ar           زر تصدير الكود في ChatGPT
// @name:bn           চ্যাটজিপিটি কোড রপ্তানি বাটন
// @name:ru           Кнопка экспорта кода ChatGPT
// @name:pt           Botão de Exportação de Código do ChatGPT
// @name:ur           چیٹ جی پی ٹی کوڈ برآمد بٹن
// @namespace         http://tampermonkey.net/
// @version           2024/10/05
// @license           MIT
// @description       Adds Export button to code blocks in ChatGPT responses, prompts user to save code as file with predefined filename based on coding language detected from the code block's class name.
// @description:en    Adds Export button to code blocks in ChatGPT responses, prompts user to save code as file with predefined filename based on coding language detected from the code block's class name.
// @description:zh-CN 为 ChatGPT 响应中的代码块添加导出按钮，提示用户根据代码块的类名检测到的编程语言将代码保存为文件。
// @description:es    Agrega un botón de exportación a los bloques de código en las respuestas de ChatGPT, solicitando al usuario que guarde el código como archivo con un nombre predefinido según el lenguaje de programación detectado del nombre de la clase del bloque de código.
// @description:hi    चैटजीपीटी प्रतिक्रियाओं में कोड ब्लॉक्स में निर्यात बटन जोड़ता है, उपयोगकर्ता को कोड को फ़ाइल के रूप में सहेजने के लिए प्रीडिफ़ाइन्ड फ़ाइलनाम पर प्रोम्प्ट करता है जोड़ता है। कोड ब्लॉक के क्लास नाम से डिटेक्ट किया गया।
// @description:fr    Ajoute un bouton d'exportation aux blocs de code dans les réponses de ChatGPT, invite l'utilisateur à enregistrer le code sous forme de fichier avec un nom prédéfini basé sur le langage de programmation détecté à partir du nom de classe du bloc de code.
// @description:ar    يضيف زر التصدير إلى كتل الكود في ردود ChatGPT ، ويطلب من المستخدم حفظ الكود كملف باسم محدد مسبقًا بناءً على لغة البرمجة المكتشفة من اسم الفئة لكتلة الكود.
// @description:bn    ChatGPT রেসপন্সে কোড ব্লকের জন্য রপ্তানি বাটন যোগ করে, ব্যবহারকারীকে কোডটি ক্লাস নাম থেকে ডিটেক্ট করে পূর্বনির্ধারিত ফাইলনেমের মধ্যে সংরক্ষণ করতে বলে।
// @description:ru    Добавляет кнопку экспорта в блоки кода в ответах ChatGPT, предлагает пользователю сохранить код в файл с предопределенным именем на основе обнаруженного языка программирования из имени класса блока кода.
// @description:pt    Adiciona um botão de exportação aos blocos de código nas respostas do ChatGPT, solicitando ao usuário que salve o código como arquivo com um nome predefinido com base na linguagem de programação detectada a partir do nome da classe do bloco de código.
// @description:ur    چیٹ جی پی ٹی ردعملات میں کوڈ بلاکس میں برآمد بٹن شامل کرتا ہے، صارف کو کوڈ کو فائل کے طور پر محفوظ کرنے کے لیے پہلے سے تعین شدہ فائل نام پر پرومپٹ کرتا ہے جو کوڈ بلاک کے کلاس کے نام سے دریافت کیا گیا ہے
// @author       Muffin & Arcadie
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499627/ChatGPT%20Code%20Export%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/499627/ChatGPT%20Code%20Export%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add "Export" button to existing code headers
    function addExportButtonToHeaders() {
        const codeHeaders = document.querySelectorAll('.flex.items-center.text-token-text-secondary.bg-token-main-surface-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9');

        codeHeaders.forEach(header => {
            // Check if "Export" button is already added
            if (header.querySelector('.export-button')) {
                return; // Skip if already added
            }

            const textNode = Array.from(header.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            const language = textNode ? textNode.textContent.trim() : '';

            // Create the "Export" button
            const exportButton = document.createElement('button');
            exportButton.classList.add('export-button', 'flex', 'items-center', 'gap-1', 'text-xs', 'p-1', 'rounded');
            exportButton.setAttribute('title', 'Export Code');

            // Create the SVG icon
            const exportIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            exportIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            exportIcon.setAttribute('viewBox', '0 0 1000 1000'); // Adjust viewBox as needed
            exportIcon.classList.add('h-4', 'w-4');

            // Adding <defs> and <style> block
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
            style.textContent = `.cls-1`;
            defs.appendChild(style);
            exportIcon.appendChild(defs);

            // Adding your actual SVG paths
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'm423.2,668.89l9.44-5.45c-7.66-2.87-15.26-5.91-22.81-9.15,4.38,5.04,8.84,9.89,13.37,14.61Z');
            path1.setAttribute('class', 'cls-1');
            exportIcon.appendChild(path1);

            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', 'm233.24,672.15c-1.31-.31-2.62-.6-3.92-.95-37.87-10.15-70.17-34.9-89.82-68.84-17.33-29.94-23.57-65.02-17.64-99.1,1.17.7,3.2,1.95,4.67,2.79l57.28,33.08c-4.17-20.96-6.91-42.43-8.22-64.38l-23.3-13.46c-33.92-19.64-58.66-51.93-68.81-89.79-10.15-37.86-4.87-78.19,14.68-112.16,17.25-29.98,44.5-52.93,76.98-64.85,0,1.35-.08,3.75-.08,5.41v181.53c-.03,4.53,1.15,8.99,3.42,12.92,2.27,3.93,5.54,7.18,9.48,9.42l1.47.85c7.69-10.62,18.1-19.33,30.52-24.99,2.2-1,4.44-1.88,6.71-2.67v-177.06c.02-28.1,8.04-55.61,23.12-79.32,15.09-23.71,36.61-42.62,62.06-54.54,25.45-11.92,53.76-16.34,81.63-12.75,27.87,3.59,54.14,15.05,75.73,33.03-1.2.65-3.28,1.8-4.67,2.64l-157.13,90.76c-3.94,2.24-7.22,5.49-9.49,9.42-2.27,3.92-3.45,8.39-3.42,12.92l-.09,183.24c3.17,2.08,6.2,4.38,9.07,6.94,6.16,5.49,12.16,10.9,18.02,16.19l.14.12c2.98,2.69,5.92,5.34,8.83,7.96v-70.78l85.44-49.35,85.44,49.32v98.67l-76.55,44.18c12.49,7.4,25.07,14.01,37.79,19.84l38.73-22.36v37.58c11.85,3.9,23.84,7.18,35.99,9.84v-166.9l66.42,38.35c.35.17.65.43.87.75.23.32.37.69.42,1.07v38.04c3.9-2.91,8.08-5.5,12.55-7.65,10.38-4.99,21.96-7.63,33.49-7.63,1.88,0,3.75.08,5.61.22v-21.06c.04-4.53-1.13-8.98-3.38-12.91s-5.51-7.18-9.44-9.44l-191.84-110.77,66.42-38.34c.33-.22.7-.35,1.09-.38.39-.04.78.03,1.15.18l158.86,91.71c24.34,14.06,44.17,34.76,57.17,59.68,13,24.92,18.63,53.02,16.23,81.03-.51,5.98-1.41,11.91-2.63,17.74l43.84,35.07c9.59-27.52,13.09-56.95,10-86.23-4.4-41.89-22-81.29-50.24-112.54,8.85-26.57,11.92-54.72,9-82.56-2.92-27.85-11.74-54.75-25.9-78.91-20.98-36.54-53.03-65.47-91.52-82.62-38.49-17.15-81.43-21.62-122.63-12.78-18.58-20.94-41.42-37.67-66.99-49.08C430.26,6.13,402.55.33,374.55.5c-42.12-.1-83.19,13.18-117.28,37.92-34.09,24.74-59.44,59.67-72.4,99.75-27.44,5.62-53.36,17.03-76.04,33.48-22.67,16.45-41.57,37.55-55.43,61.89-21.15,36.44-30.17,78.66-25.78,120.56,4.4,41.9,21.99,81.33,50.24,112.59-8.85,26.57-11.92,54.71-9,82.56,2.92,27.85,11.74,54.75,25.9,78.91,20.98,36.54,53.03,65.47,91.52,82.62,26.61,11.86,55.35,17.64,84.16,17.17-2.63-3.43-5.24-6.9-7.82-10.42-10.78-14.71-20.58-29.85-29.39-45.38ZM570.51,114.04c28.07,1.21,55.21,10.38,78.25,26.44,23.04,16.07,41.03,38.36,51.87,64.28,10.83,25.92,14.07,54.38,9.31,82.07-1.16-.72-3.2-1.94-4.67-2.78l-157.14-90.76c-3.92-2.29-8.37-3.49-12.9-3.49s-8.99,1.21-12.91,3.49l-191.84,110.77v-76.7c-.02-.39.05-.78.22-1.14.17-.35.42-.66.73-.9l158.85-91.64c24.33-14.03,52.16-20.84,80.23-19.64Z');
            path2.setAttribute('class', 'cls-1');
            exportIcon.appendChild(path2);

            const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path3.setAttribute('d', 'm502.87,730.73c19.95,11.06,41.04,19.95,63.33,26.7,2.81-1.83,5.6-3.71,8.33-5.69,20.27-14.71,37.41-33.04,50.73-53.9-21.31-.2-42.35-1.47-62.99-3.79-.2.2-.38.41-.58.61-16.64,16.65-36.85,28.9-58.81,36.07Z');
            path3.setAttribute('class', 'cls-1');
            exportIcon.appendChild(path3);

            const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path4.setAttribute('d', 'm959.11,704.34l-284.19-227.36c-6.75-5.4-15.23-8.38-23.88-8.38-5.7,0-11.42,1.3-16.55,3.77-13.16,6.32-21.66,19.85-21.66,34.45v75.19c-28.92-1.03-57.02-4.48-83.72-10.3-69.87-15.24-134.55-48.71-197.73-102.3-11.95-10.13-23.61-20.66-35.95-31.8l-.14-.12c-5.77-5.21-11.75-10.6-17.83-16.02-7.01-6.24-16.04-9.68-25.43-9.68-5.5,0-10.84,1.16-15.85,3.45-13.77,6.28-22.55,20.12-22.36,35.26,1.14,90.66,28.18,172.74,80.36,243.95,80.72,110.16,188,174.2,319.04,190.48v76.37c0,14.6,8.5,28.12,21.66,34.45,5.14,2.47,10.86,3.77,16.55,3.77,8.65,0,17.13-2.98,23.88-8.38l283.8-227.1c9.11-7.29,14.34-18.17,14.34-29.84s-5.23-22.55-14.34-29.84Zm-269.46,177.41v-31.76c0-20.26-15.84-37.02-36.06-38.16-125.38-7.08-222.78-60.26-297.76-162.59-23.24-31.72-40.44-66.31-51.37-103.25,65.99,51.32,134.41,84.25,208.36,100.38,37.68,8.22,77.51,12.39,118.38,12.39,5.52,0,11.13-.08,16.69-.23,3.4-.09,6.1-.54,7.72-.81l.23-.04c.19-.03.39-.07.62-.1,18.7-2.68,32.8-18.94,32.8-37.83v-33.42l184.8,147.85-184.41,147.57Z');
            path4.setAttribute('class', 'cls-1');
            exportIcon.appendChild(path4);

            // Append the SVG icon to the button
            exportButton.appendChild(exportIcon);

            // Add the button text
            const buttonText = document.createElement('span');
            buttonText.textContent = 'Export';
            exportButton.appendChild(buttonText);

            // Create the tooltip
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip', 'flex', 'items-center', 'gap-1', 'text-xs', 'p-1', 'rounded', 'absolute', 'bg-black', 'text-white', 'hidden');
            tooltip.style.top = '110%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.whiteSpace = 'nowrap';

            // Create the tooltip text
            const tooltipText = document.createElement('span');
            tooltipText.textContent = 'Export Code';
            tooltip.appendChild(tooltipText);

            // Append the tooltip to the button
            exportButton.appendChild(tooltip);

            // Find the element containing "Copy code"
            let copyCodeDiv = null;
            const elements = header.querySelectorAll('.flex.items-center.relative.text-token-text-secondary.bg-token-main-surface-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md div');
            elements.forEach(element => {
                if (element.innerHTML.includes('Copy code')) {
                    copyCodeDiv = element;
                }
            });

            // Insert "Export" button before the found element or append to header if not found
            if (copyCodeDiv) {
                copyCodeDiv.parentNode.insertBefore(exportButton, copyCodeDiv);
            } else {
                header.appendChild(exportButton);
            }

            // Add hover event listener for the "Export" button to show tooltip
            exportButton.addEventListener('mouseenter', () => {
                tooltip.classList.remove('hidden');
            });

            // Add hover event listener for the "Export" button to hide tooltip
            exportButton.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });

            // Add click event listener for the "Export" button
            exportButton.addEventListener('click', () => {
            // Get the grandparent element (pre > div > header)
            const preElement = header.parentElement.parentElement; // This navigates to the 'pre' element
            // Now find the <code> block inside the <pre> tag
            const codeBlock = preElement.querySelector('code');
            // Now you have the code content inside the 'codeBlock' element as text
            console.log(codeBlock.textContent); // This will log the code content to the console
            // Call export function with the updated code block and language
            exportCode(codeBlock, language);
            });
        });
    }

    // Function to open File Explorer for saving the code as file
    async function exportCode(codeBlock, language) {
        let fileName;
        let fileExtension;
        let mimeType;

        // Determine filename, extension, and MIME type based on language
        switch (language) {
            case 'javascript':
            case 'js':
                fileName = 'script';
                fileExtension = '.js';
                mimeType = 'application/javascript';
                break;
            case 'html':
                fileName = 'index';
                fileExtension = '.html';
                mimeType = 'text/html';
                break;
            case 'css':
                fileName = 'styles';
                fileExtension = '.css';
                mimeType = 'text/css';
                break;
            case 'python':
            case 'py':
                fileName = 'main';
                fileExtension = '.py';
                mimeType = 'text/x-python';
                break;
            case 'json':
                fileName = 'manifest';
                fileExtension = '.json';
                mimeType = 'application/json';
                break;
            case 'java':
                fileName = 'Main'; // Entry point for Java programs
                fileExtension = '.java';
                mimeType = 'text/x-java-source';
                break;
            case 'c':
                fileName = 'program';
                fileExtension = '.c';
                mimeType = 'text/x-c';
                break;
            case 'cpp':
            case 'c++':
                fileName = 'program';
                fileExtension = '.cpp';
                mimeType = 'text/x-c++';
                break;
            case 'csharp':
            case 'cs':
                fileName = 'Program';
                fileExtension = '.cs';
                mimeType = 'text/x-csharp';
                break;
            case 'ruby':
                fileName = 'script';
                fileExtension = '.rb';
                mimeType = 'text/x-ruby';
                break;
            case 'php':
                fileName = 'script';
                fileExtension = '.php';
                mimeType = 'application/php';
                break;
            case 'swift':
                fileName = 'main';
                fileExtension = '.swift';
                mimeType = 'text/x-swift';
                break;
            case 'go':
                fileName = 'main';
                fileExtension = '.go';
                mimeType = 'text/x-go';
                break;
            default:
                fileName = 'code';
                fileExtension = '.txt';
                mimeType = 'text/plain';
                break;
        }

        // Create a Blob object with the code content
        const blob = new Blob([codeBlock.innerText], { type: mimeType });

        try {
            if (window.showSaveFilePicker) {
                // Use File System Access API if available
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName + fileExtension,
                    types: [
                        {
                            description: language,
                            accept: {
                                [mimeType]: [fileExtension],
                            },
                        },
                    ],
                });

                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else {
                // Fallback for browsers that do not support showSaveFilePicker
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = fileName + fileExtension;
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                document.body.removeChild(downloadLink);
            }
        } catch (error) {
            console.error('Save file dialog was canceled or failed', error);
        }
    }

    // Observe the document for changes and add "Export" button to new code headers
    const observer = new MutationObserver(addExportButtonToHeaders);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial processing of existing code headers
    addExportButtonToHeaders();

    // Add custom CSS styles if needed
    const style = document.createElement('style');
    style.textContent = `
        .export-button:hover .tooltip {
  display: block;
  opacity: 1;
}
.export-button:hover svg {
  fill: #333;
}
.export-button:hover {
  background-color: #c7c7c7;
  color: #333;
}
.export-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    color: rgb(180, 180, 180);
    transition: background-color 0.3s ease, color 0.3s ease;
}
.export-button svg {
    width: 16px;
    height: 16px;
    fill: rgb(180, 180, 180);
    transition: fill 0.3s ease;
}
.export-button span {
    margin-left: 0px;
    font-size: 12px;
    font-weight: 420;
    color: inherit;
}
.export-button .tooltip {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10;
}
/* Style for the container with specific padding and spacing */
.flex.items-center.text-token-text-secondary.bg-token-main-surface-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9 {
    padding-right: 7rem; /* Adjusted padding */
}
    `;
    document.head.appendChild(style);
})();
