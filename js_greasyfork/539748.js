// ==UserScript==
// @name         download lovable shit
// @namespace    http://tampermonkey.net/
// @version      2025-06-16
// @description  try to take over the lovable!
// @author       test4ment
// @match        https://lovable.dev/projects/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lovable.dev
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539748/download%20lovable%20shit.user.js
// @updateURL https://update.greasyfork.org/scripts/539748/download%20lovable%20shit.meta.js
// ==/UserScript==

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var was_clicked = false;
var zip = new JSZip();

function download() {
    var tree = document.getElementsByClassName("overflow-x-auto p-2")[0];
    if(tree === undefined){
        var but = document.getElementsByClassName("inline-flex items-center justify-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 pointer-events-auto h-7 rounded-lg bg-muted p-[2px] transition-colors duration-150 ease-in-out hover:bg-muted-hover")[0];
        but.click();
        setTimeout(download, 1000);
    } else {
        if(was_clicked){
            worker(tree.children);
        }
        else{
            clickall(tree.children);
            was_clicked = true;
            setTimeout(download, 100);
        }
    };
};

async function clickall(nodes, depth = 5){
    for (let index = 0; index < depth; index++) {
        for (const child of nodes) {
            if(isFile(child)){
                child.click();
            } else {
                workerClicker(child.children[1].children)
            }
        }
        await sleep(1);
    }
}

function workerClicker(nodes){
    for (const child of nodes){
        if(!isFile(child)){
            workerClicker(child.children[1].children);
        }
    }
};

async function worker(nodes, fullfilename = [zip], first_call = true){
    for (const child of nodes) {
        if(isFile(child)){
            child.click();
            await sleep(30);
            var file_name = child.children[0].children[2].textContent;

            var code_field = document.getElementsByClassName("cm-content")[0];
            var scroller = document.getElementsByClassName("cm-scroller")[0];

            var file_content = Array.from(code_field.children)
            .filter(e=>e.className !== "cm-gap")
            .map(e => e.outerText).filter(e => e !== "\n");

            const scrollval = 1500;

            if(scroller.scrollHeight > 1000){
                for(let i = 1; i <= scroller.scrollHeight / scrollval + 1; i++){
                    scroller.scrollTop = i*scrollval;
                    await sleep(200);
                    var lines = Array.from(code_field.children)
                    .filter(e=>
                            e.className !== "cm-activeLine cm-line"
                            && e.className !== "cm-gap")
                    .map(e => e.outerText)
                    .filter(e => e !== "\n");

                    // Find the maximum overlap between end of file_content and start of lines
                    let maxOverlap = 0;
                    const maxCheck = Math.min(file_content.length, lines.length);

                    for (let overlapSize = maxCheck; overlapSize > 0; overlapSize--) {
                        const fileSuffix = file_content.slice(-overlapSize);
                        const linePrefix = lines.slice(0, overlapSize);
                        if (fileSuffix.join("\n") === linePrefix.join("\n")) {
                            maxOverlap = overlapSize;
                            break; // Found the largest overlap
                        }
                    }

                    // Merge the lines without duplication
                    if (maxOverlap > 0 && maxOverlap !== maxCheck) {
                        file_content = file_content.concat(lines.slice(maxOverlap));
                    }

                    //for(let j = 0; j < lines.length; j++){
                    //    if(!(file_content.includes(lines[j]))){
                    //        file_content = file_content.concat(lines.slice(j));
                    //        break;
                    //    }
                    //}
                }
            }

            fullfilename[fullfilename.length - 1].file(file_name, file_content.join("\n"));
        }
        else{
            var folder_name = child.children[0].children[1].textContent;
            var folder = fullfilename[fullfilename.length - 1].folder(folder_name);
            await worker(child.children[1].children, fullfilename.slice().concat([folder]), false);
        }
    }
    if(first_call){
        await sleep(5);
        await zip.generateAsync({ type: "blob" })
            .then(function(content) {
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = document.getElementsByClassName("hidden truncate text-sm font-medium md:block")[0].outerText;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        await sleep(5);
        zip = new JSZip();
    }
};

function isFile(node) {
    if(node.children.length == 2) return false;
    node.children[0].click();
    if(node.children.length == 2) return false;
    else return true;
};

(function() {
    'use strict';

    window.onload = (event) => {
        // Create a new button element
        var btn = document.createElement('button');
        btn.innerHTML = 'download';
        btn.style.position = 'fixed'; // Position it fixed on the screen
        btn.style.top = '30px'; // Distance from top
        btn.style.right = '100px'; // Distance from right
        btn.style.zIndex = 9999; // Make sure it appears on top
        btn.style.padding = '10px 20px';
        btn.style.backgroundColor = 'white';
        btn.style.color = 'black';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', download);

        document.body.insertBefore(btn, document.body.firstChild)
    };
})();