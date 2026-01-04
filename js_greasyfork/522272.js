// ==UserScript==
// @name         下载道客巴巴里面的文章
// @namespace    Aice.Fu_gwTools
// @version      0.0.1
// @description  下载道客巴巴里面的文章工具
// @author       Aice.Fu
// @match        https://www.doc88.com/p-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522272/%E4%B8%8B%E8%BD%BD%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%E9%87%8C%E9%9D%A2%E7%9A%84%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/522272/%E4%B8%8B%E8%BD%BD%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%E9%87%8C%E9%9D%A2%E7%9A%84%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

[
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.0/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.js'
].forEach(link => {
    let script = document.createElement('script');
    script.src = link;
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
});

(function() {
    var $ = window.$;

    let btn = `<button id="download-pngs" style="position:fixed; bottom:1rem;left:1rem;z-index:99999;">Download As PNGs</button>`,
        form = `
             <form id="download-pdf" style="position:fixed;bottom:3rem;left:1rem;z-index:99999;padding:3px;border:1px solid black;background:white;">
                 <section style="margin:1rem 0rem;">
                     <input type="radio" id="paper-size-raw" name="paper-size" value="raw" required checked>
                     <label for="paper-size-a4">原始比例</label>
                     <input type="radio" id="paper-size-a4" name="paper-size" value="a4" required>
                     <label for="paper-size-a4">A4 大小</label>
                 </section>
                 <button type="submit">
                     download as PDF
                 </button>
             </form>
        `;

    $('body').append(btn).append(form);

    $(`#download-pngs`).click(() => {
        document.getElementById("download-pngs").disabled = true;
        let zip = window.JSZip();
        $('canvas[id^="page_"]').each((index, page) => {
            let base64 = page.toDataURL();
            let blob = atob(base64.split(',')[1]);
            zip.file(`${index.toString()}.png`, blob, {binary: true});
        });
        zip.generateAsync({type:"blob"})
            .then((content) => {
                window.saveAs(content, `${$('title').text()}.zip`);
                document.getElementById("download-pngs").disabled = false;
            });
    });

    $(`#download-pdf`).submit((e) => {
        e.preventDefault();
        if(confirm(`请确认你已将文章所有的页面都加载出来了！`)){
            let is_ask_for_raw_proportion = $(`#paper-size-raw`).is(':checked'),
                orientation = $('#page_1').width() > $('#page_1').height() ? 'l' : 'p',
                { jsPDF } = window.jspdf;

            let doc = is_ask_for_raw_proportion ?
                new jsPDF(orientation, 'mm', [$('#page_1').attr('height'), $('#page_1').attr('width')]) :
                new jsPDF(orientation, 'mm', 'a4');

            let width = doc.internal.pageSize.getWidth(),
                height = doc.internal.pageSize.getHeight();
            $('[id^="page_"]').each((index, page) => {
                doc.addImage(page.toDataURL(), 'JPEG', 0, 0, width, height);
                if (index !== ($('[id^="page_"]').length - 1)) {
                    doc.addPage();
                }
            });
            doc.save(`${$('title').text()}.pdf`);

        }
    });
})();