// ==UserScript==
// @name         IMVU _contents.json Viewer with Zip Download
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @auther       heapsofjoy
// @description  Show previews, organize image types, and allow ZIP download with proper naming
// @match        https://userimages-akm.imvu.com/productdata/*/*/_contents.json
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/532738/IMVU%20_contentsjson%20Viewer%20with%20Zip%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/532738/IMVU%20_contentsjson%20Viewer%20with%20Zip%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let files;
    try {
        files = JSON.parse(document.body.innerText);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        return;
    }

    const baseUrl = window.location.href.replace(/\/_contents\.json$/, '');
    const parts = window.location.pathname.split('/');
    const prodId = parts[2];
    const rev = parts[3];
    const zipFilename = `${prodId}_rev${rev}_files.zip`;

    // Basic styling
    document.body.innerHTML = '';
    document.body.style.background = '#111';
    document.body.style.color = '#eee';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.padding = '20px';

    const heading = document.createElement('h1');
    heading.textContent = '📦 Product Files';
    heading.style.marginBottom = '10px';
    document.body.appendChild(heading);

    // Download ZIP button
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.textContent = '⬇ Download All as ZIP';
    downloadAllBtn.style.marginBottom = '25px';
    downloadAllBtn.style.padding = '10px 20px';
    downloadAllBtn.style.fontSize = '16px';
    downloadAllBtn.style.backgroundColor = '#ff69b4';
    downloadAllBtn.style.color = 'white';
    downloadAllBtn.style.border = 'none';
    downloadAllBtn.style.borderRadius = '8px';
    downloadAllBtn.style.cursor = 'pointer';

    downloadAllBtn.onclick = async () => {
        downloadAllBtn.disabled = true;
        downloadAllBtn.textContent = 'Zipping...';

        const zip = new JSZip();

        for (const file of files) {
            const originalName = file.name || file.url;
            if (isExcluded(originalName)) continue;

            const url = `${baseUrl}/${file.url || file.name}`;
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                let adjustedName = originalName;

                // Check MIME type and adjust the file extension accordingly
                const mime = blob.type;

                // If it's an image, we will try to adjust the extension based on the mime type
                if (mime.startsWith('image/')) {
                    // Handle PNG and JPEG files
                    if (mime === 'image/png') {
                        adjustedName = originalName.replace(/\.(jpe?g|gif|bmp|tga)$/i, '.png');
                    } else if (mime === 'image/jpeg' || mime === 'image/jpg') {
                        adjustedName = originalName.replace(/\.(png|gif|bmp|tga)$/i, '.jpg');
                    } else if (mime === 'image/gif') {
                        adjustedName = originalName.replace(/\.(png|jpeg|bmp|tga)$/i, '.gif');
                    } else if (mime === 'image/bmp') {
                        adjustedName = originalName.replace(/\.(png|jpeg|gif|tga)$/i, '.bmp');
                    } else if (mime === 'image/tga') {
                        // Handle .tga files
                        adjustedName = originalName.replace(/\.tga$/i, '.png');  // You can decide on a default format like PNG
                    }
                    // Add other image formats here if necessary
                } else {
                    // Non-image files should be left as-is
                    // This handles non-image files or files with unrecognized mime types
                    adjustedName = originalName;
                }

                // Add the file to the zip with the adjusted name
                zip.file(adjustedName, blob);
            } catch (e) {
                console.error('Failed to fetch:', originalName, e);
            }
        }

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = zipFilename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            downloadAllBtn.textContent = '⬇ Download All as ZIP';
            downloadAllBtn.disabled = false;
        });
    };
    document.body.appendChild(downloadAllBtn);

    // Layout containers
    const imageGrid = document.createElement('div');
    imageGrid.style.display = 'grid';
    imageGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    imageGrid.style.gap = '15px';
    imageGrid.style.marginBottom = '50px';
    document.body.appendChild(imageGrid);

    const otherImagesSection = document.createElement('div');
    otherImagesSection.style.marginTop = '30px';
    document.body.appendChild(otherImagesSection);

    const fileList = document.createElement('div');
    fileList.style.paddingTop = '20px';
    fileList.style.borderTop = '1px solid #444';
    fileList.style.marginTop = '30px';
    document.body.appendChild(fileList);

    const imageBoxColor = [
      //String.fromCharCode(120, 109, 102),
      //String.fromCharCode(120, 115, 102)
    ];

    const isExcluded = (filename) => {
        return imageBoxColor.some(ext => filename.toLowerCase().endsWith(ext));
    };

    const isPreviewImage = (filename) => {
    return (
        /\.(png|jpe?g|gif|webp|bmp|tga)$/i.test(filename) ||
        !/\.[^/.]+$/.test(filename) // no extension, treat as image
    );
};

    const isOtherImageType = (filename) => /\.(dds)$/i.test(filename);

files.forEach(async (file) => {
    const name = file.name || file.url || 'Unnamed';
    const urlPart = file.url || file.name;

    if (isExcluded(name)) return;

    const fileUrl = `${baseUrl}/${urlPart}`;

    try {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        const mime = blob.type;

        const isImage = mime.startsWith('image/');
        const lowerName = name.toLowerCase();
        const isCommonImage = mime.startsWith('image/') &&
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'].includes(mime);

        const isRealTGA = lowerName.endsWith('.tga') && (mime === 'application/octet-stream' || mime === 'image/x-icon');

        // If it's a real TGA file (not displayable), show in "other" section
        if (isRealTGA) {

            const otherImageEntry = document.createElement('div');
            otherImageEntry.style.marginBottom = '10px';

            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = name;
            link.textContent = name;
            link.style.color = '#ff69b4';
            link.style.textDecoration = 'none';
            link.style.wordBreak = 'break-all';
            otherImageEntry.appendChild(link);

            otherImagesSection.appendChild(otherImageEntry);
        } else if (isImage && isPreviewImage(name)) {
            const container = document.createElement('div');
            container.style.background = '#222';
            container.style.padding = '10px';
            container.style.borderRadius = '10px';
            container.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            container.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            img.alt = name;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.width = 'auto';  // Ensures the image maintains its aspect ratio
            img.style.height = 'auto'; // Keeps the height flexible based on the width
            img.style.minWidth = '150px'; // Sets a minimum width for the image box
            img.style.display = 'block';
            img.style.margin = '0 auto 10px';
            container.appendChild(img);

            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = name;
            link.textContent = name;
            link.style.color = '#ff69b4';
            link.style.textDecoration = 'none';
            link.style.wordBreak = 'break-all';
            container.appendChild(link);

            const mimeInfo = document.createElement('div');
            mimeInfo.textContent = `(${mime})`;
            mimeInfo.style.color = '#999';
            mimeInfo.style.fontSize = '12px';
            mimeInfo.style.marginTop = '5px';
            container.appendChild(mimeInfo);

            imageGrid.appendChild(container);
        } else if (/\.xml$/i.test(name)) {
            // If it's an XML file, add preview functionality
            const fileEntry = document.createElement('div');
            fileEntry.style.marginBottom = '10px';

            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = name;
            link.textContent = name;
            link.style.color = '#ff69b4';
            link.style.textDecoration = 'none';
            link.style.wordBreak = 'break-all';
            fileEntry.appendChild(link);

            // Create a preview button for XML files
            const previewBtn = document.createElement('button');
            previewBtn.textContent = '↓';
            previewBtn.style.marginLeft = '10px';
            previewBtn.style.padding = '2px 8px';
            previewBtn.style.fontSize = '12px';
            previewBtn.style.background = '#333';
            previewBtn.style.color = '#fff';
            previewBtn.style.border = '1px solid #666';
            previewBtn.style.borderRadius = '4px';
            previewBtn.style.cursor = 'pointer';

            // Create a preview box for XML file content
            const previewBox = document.createElement('pre');
            previewBox.style.display = 'none';
            previewBox.style.background = '#1e1e1e';
            previewBox.style.color = '#ccc';
            previewBox.style.padding = '10px';
            previewBox.style.marginTop = '5px';
            previewBox.style.border = '1px solid #333';
            previewBox.style.borderRadius = '6px';
            previewBox.style.maxHeight = '300px';
            previewBox.style.overflowY = 'auto';
            previewBox.style.whiteSpace = 'pre-wrap';

            // Toggle preview box visibility when clicking the preview button
            previewBtn.onclick = async () => {
                if (previewBox.style.display === 'none') {
                    previewBtn.textContent = '↑';
                    if (!previewBox.textContent) {
                        try {
                            const res = await fetch(fileUrl);
                            const text = await res.text();
                            previewBox.textContent = text;
                        } catch (err) {
                            previewBox.textContent = '[Error loading XML]';
                        }
                    }
                    previewBox.style.display = 'block';
                } else {
                    previewBtn.textContent = '↓';
                    previewBox.style.display = 'none';
                }
            };

            fileEntry.appendChild(previewBtn);
            fileEntry.appendChild(previewBox);

            fileList.appendChild(fileEntry);
        } else {
            // For non-image files, no preview
            const fileEntry = document.createElement('div');
            fileEntry.style.marginBottom = '10px';

            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = name;
            link.textContent = name;
            link.style.color = '#ff69b4';
            link.style.textDecoration = 'none';
            link.style.wordBreak = 'break-all';
            fileEntry.appendChild(link);

            fileList.appendChild(fileEntry);
        }
    } catch (e) {
        console.error('Failed to fetch or analyze file:', name, e);
    }
});
})();
