// ==UserScript==
// @name         SmartEdu pdf download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  pdf download from SmartEdu 
// @author       JackieZheng
// @match        https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document&contentId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509187/SmartEdu%20pdf%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/509187/SmartEdu%20pdf%20download.meta.js
// ==/UserScript==

GM_addStyle("#downBtn{border-radius: 6px;width: 45px;margin: 5px auto;}");
GM_addStyle("#downBtn>a{width: 45px;margin: 0;padding: 2px 0 2px 0;}");
GM_addStyle("#downBtn>a>i{height: 30px;width: 30px;background: #f6f7f9;display: block;border-radius: 6px;margin: 3px auto 13px auto;");

(function() {
    window.setTimeout(()=>{
        var matchReg = /(?<=file=).*?\.pdf/gi;
        let frameSrc=document.querySelector('iframe')?.src;
        let pdfUrl=frameSrc.match(matchReg)[0];
        console.log(pdfUrl);
        let pdf=pdfUrl.replace('-private','');
        console.log(pdf);
        document.querySelector('iframe').src=pdf;

        let toolBar=document.querySelector('div[class^=index-module_fn]');
        let clsName=toolBar.childNodes[0].className;
        var downloadBtn = document.createElement("div");
        downloadBtn.setAttribute("id", "downBtn");
        downloadBtn.onclick = function() {
            let fileName = pdf.substring(pdf.lastIndexOf('/') + 1);
            downloadFile(pdf,decodeURI(fileName)) ;
        }
        // download="'+pdf+'"  href="'+pdf+'"
        downloadBtn.innerHTML ='<a  class="'+clsName+'" ><i><svg viewBox="0 0 1210 1024" width="24" height="30"><path d="M186.181818 74.472727A111.709091 111.709091 0 0 0 74.472727 186.181818v651.636364A111.709091 111.709091 0 0 0 186.181818 949.527273h837.818182a111.709091 111.709091 0 0 0 111.709091-111.709091V186.181818A111.709091 111.709091 0 0 0 1024 74.472727H186.181818zM186.181818 0h837.818182a186.181818 186.181818 0 0 1 186.181818 186.181818v651.636364a186.181818 186.181818 0 0 1-186.181818 186.181818H186.181818a186.181818 186.181818 0 0 1-186.181818-186.181818V186.181818a186.181818 186.181818 0 0 1 186.181818-186.181818z m516.654546 642.327273v-65.163637a162.909091 162.909091 0 1 0-158.533819-199.819636 32.581818 32.581818 0 0 1-49.338181 20.014545A97.652364 97.652364 0 1 0 442.181818 577.163636h65.163637v65.163637H442.181818a162.909091 162.909091 0 1 1 50.920727-317.533091A226.769455 226.769455 0 0 1 702.836364 186.181818C828.555636 186.181818 930.909091 288.488727 930.909091 414.254545c0 125.765818-102.353455 228.072727-228.072727 228.072728z m23.04 42.123636a32.581818 32.581818 0 0 1 0 46.08l-97.745455 97.745455a32.581818 32.581818 0 0 1-46.08 0l-97.745454-97.745455a32.581818 32.581818 0 0 1 46.08-46.08l42.123636 42.123636V512a32.581818 32.581818 0 1 1 65.163636 0v214.574545l42.123637-42.123636a32.581818 32.581818 0 0 1 46.08 0z" fill="#2a6bed"></path></svg></i><p>下载PDF</p></a>';
        toolBar.insertBefore(downloadBtn,toolBar.childNodes[0])
    },5000);


})();

function downloadFile(url, fileName) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.target = "_blank";
        link.click();
    });
}
