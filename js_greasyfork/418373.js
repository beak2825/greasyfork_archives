// ==UserScript==
// @name		office_online_viewer
// @description		View office documents in your browser with Microsoft Office Online
// @namespace		liudonghua123
// @version        	0.0.1
// @include        	*
// @exclude        	http*://view.officeapps.live.com/*
// @exclude        	http*://docs.google.com/*
// @exclude        	http*://mail.google.com/*
// @exclude        	http*://viewer.zoho.com/*
// @exclude        	http*://office.live.com/*
// @downloadURL https://update.greasyfork.org/scripts/418373/office_online_viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/418373/office_online_viewer.meta.js
// ==/UserScript==

(function process() {
    const pageLinks = [...document.links];
    const officeWordExtension = ["doc", "docx"],
        officeExcelExtension = ["xls", "xlsx"],
        officePowerpointExtension = ["ppt", "pps", "pptx"];
    const officeExtension = [...officeWordExtension, ...officeExcelExtension, ...officePowerpointExtension];
    const viewOfficeUrl = "https://view.officeapps.live.com/op/view.aspx";
    const isOfficeLink = (link) => {
        const { pathname: path, text } = link;
        const pathExtension = path.lastIndexOf('.') > 0 ? path.substr(path.lastIndexOf('.') + 1).toLowerCase() : '';
        const textExtension = text.lastIndexOf('.') > 0 ? text.substr(text.lastIndexOf('.') + 1).toLowerCase() : '';
        return officeExtension.includes(pathExtension) || officeExtension.includes(textExtension);
    };
    const linkIcon = (link) => {
        const { pathname: path, text } = link;
        const pathExtension = path.lastIndexOf('.') > 0 ? path.substr(path.lastIndexOf('.') + 1).toLowerCase() : '';
        const textExtension = text.lastIndexOf('.') > 0 ? text.substr(text.lastIndexOf('.') + 1).toLowerCase() : '';
        if (officeWordExtension.includes(pathExtension) || officeWordExtension.includes(textExtension)) return "https://docs.microsoft.com/zh-cn/javascript/api/overview/images/logo-word.svg";
        else if (officeExcelExtension.includes(pathExtension) || officeExcelExtension.includes(textExtension)) return "https://docs.microsoft.com/zh-cn/javascript/api/overview/images/logo-excel.svg";
        else if (officePowerpointExtension.includes(pathExtension) || officePowerpointExtension.includes(textExtension)) return "https://docs.microsoft.com/zh-cn/javascript/api/overview/images/logo-powerpoint.svg";
        else return '';
    };
    const addOfficeBadge = (link) => {
        const officeLink = document.createElement('a');
        officeLink.href = `${viewOfficeUrl}?src=${encodeURIComponent(link.href)}`;
        officeLink.isParsed = true;
        officeLink.target = "_blank";
        const ico = document.createElement("img");
        ico.src = linkIcon(link);
        ico.style.marginLeft = "5px";
        ico.style.height = "25px";
        officeLink.appendChild(ico);
        link.parentNode.insertBefore(officeLink, link.nextSibling);
    }
    const officeLinks = pageLinks.filter(isOfficeLink);
    for (const link of officeLinks) {
        console.info(`process ${link.href}`);
        addOfficeBadge(link);
    }
})();