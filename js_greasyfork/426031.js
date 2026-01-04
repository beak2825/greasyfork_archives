// ==UserScript==
// @name        文档在线预览与下载更名
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.3
// @license MIT
// @description 2024/11/6
// @downloadURL https://update.greasyfork.org/scripts/426031/%E6%96%87%E6%A1%A3%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88%E4%B8%8E%E4%B8%8B%E8%BD%BD%E6%9B%B4%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/426031/%E6%96%87%E6%A1%A3%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88%E4%B8%8E%E4%B8%8B%E8%BD%BD%E6%9B%B4%E5%90%8D.meta.js
// ==/UserScript==

/**
 * @file
 * Checks for document links in web pages and inserts
 * an icon beside the links to enable opening with
 * online services like Google Docs viewer.
 *
 * @author Deekshith Allamaneni
 * @copyright 2015 Docs Online Viewer
 */
//现在很多文件下载链接不是明文的a开头的标签了，所以这个预览方式和改文件名方式都不是那么好用了。

(function(){
var docLinks = document.links;
const supportedFileExtList = ["pdf","doc","docx","xls","xlsx","ppt","pps","pptx","xps","odt","odp","rtf","ods","wpd"];
var doCheck = true;
const dov_host_exclude =/(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/
// Include paths to exclude showing icon
const dov_href_exclude = /(https:\/\/github.com\/.*\/.*\/blob\/.*|file:\/\/\/.*)/
const dovIconImgPath = "https://dov.parishod.com/assets/images/beside-link-icon.svg";


var DocLink = function (docLink) {
    this._docLink = docLink;
};
DocLink.prototype = {
    get hasSupportedExtension () {
        return supportedFileExtList.some( thisFileType => {
            var url = this._docLink.pathname.toLowerCase();
            if (url.endsWith('.' + thisFileType))
                return true;
        });
    },
    get isSupported () {
        return (!((this._docLink.host).match(dov_host_exclude))
            && !((this._docLink.href).match(dov_href_exclude))
            && this.hasSupportedExtension
            && this._docLink.textContent.trim().length > 0); // Issue #6: No blank innerText
    },
    get isProcessed () {
        return this._docLink.docView;
    },
    get iconLink () {
        var viewLink = document.createElement('a');
      console.log("original link="+this._docLink.href);
      console.log("encoded link="+encodeURIComponent(this._docLink.href));
      console.log("viewLink="+"https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(this._docLink.href));
      viewLink.href = "https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(this._docLink.href);
      /*
            Parameter description:
                embedded= <true>: to open google docs in embedded mode
                dov=1: If opened by Docs Online Viewer. Set by this script.
        */
        //viewLink.docView=true; -> This line is removed in this version but still doubt if it can really be removed.
        viewLink.title=`View this in Office`;
        var ico = document.createElement("img");
        ico.src =  "https://raw.githubusercontent.com/adeekshith/Docs-Online-Viewer/165389071f4c792241c4d7d4079d103369e413f7/src/images/beside-link-icon.svg";
        // Adjusts the margin of the icon to the given number of pixels (3 to 5px is advisable)
        ico.style.marginLeft = "3px";
        ico.style.width = "16px";
        ico.style.height = "16px";
        viewLink.appendChild(ico);
        // Disabled opening link in new tab by default.
        viewLink.setAttribute("target", "_blank");
        return viewLink;
    },
  get iconLink2 () {
        var viewLink = document.createElement('a');
       viewLink.href = `https://docs.google.com/viewer?url=${encodeURIComponent(this._docLink.href)}&embedded=true`;
    //上面这个目前是2号备用
        viewLink.title=`View this in Xdoc`;
        var ico = document.createElement("img");
        ico.src =  "https://raw.githubusercontent.com/adeekshith/Docs-Online-Viewer/165389071f4c792241c4d7d4079d103369e413f7/src/images/beside-link-icon.svg";
        ico.style.marginLeft = "3px";
        ico.style.width = "16px";
        ico.style.height = "16px";
        viewLink.appendChild(ico);
        viewLink.setAttribute("target", "_blank");
        return viewLink;
    },
    get fileExtension () {
        var fUrl = this._docLink.pathname;
        //fUrl=fUrl.toUpperCase();
        // Returns file extension. Returns "" if no valid extension
        // Ref: http://stackoverflow.com/a/1203361/3439460
        return fUrl.substr((~-fUrl.lastIndexOf(".") >>> 0) + 2);
    },
    get queryStripped() {
        // remove any ?query in the URL
        return `${this._docLink.origin}${this._docLink.pathname}`;
    }

};


function checkLinks()
{
    for (var i = 0; i < docLinks.length; ++i)
    {
        var thisDocLink = new DocLink(docLinks[i]);
        if ( thisDocLink.isSupported && !thisDocLink.isProcessed)
        {
          //console.log("find a link to change!");
          //docLinks[i].download=docLinks[i].text+docLinks[i].href.substring(docLinks[i].href.lastIndexOf("."));
          docLinks[i].download=docLinks[i].text;
          console.log("修改下载文件名为:"+docLinks[i].download);
          //上两行是我加的，用于把下载文件名改为链接文字加扩展名，因为原先的下载文件名总是全数字
          if ( thisDocLink.fileExtension !== "pdf") {
            docLinks[i].parentNode.insertBefore(thisDocLink.iconLink2 , docLinks[i].nextSibling);
          docLinks[i].parentNode.insertBefore(thisDocLink.iconLink , docLinks[i].nextSibling);
          // Append the icon beside the link,pdf除外
          }
        }
    // The link which is checked is flagged so that it is not repeatedly checked again.
    docLinks[i].docView=true;
   }
}

// Execute these functions
// to append icon beside document links and
// add listener for new nodes
checkLinks();

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (doCheck)
            {
                doCheck = false;
                setTimeout(function(){checkLinks();doCheck = true;}, 1000);
            }
        });
    });

    // pass in the target node, as well as the observer options
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree:true
    });
})();
