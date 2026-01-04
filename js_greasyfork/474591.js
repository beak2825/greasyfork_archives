// ==UserScript==
// @name         蝦皮票券管理
// @namespace    https://greasyfork.org/zh-TW/scripts/474591
// @version      1.0.2
// @description  取出所有蝦皮票券，支援匯出，方便管理
// @author       Danny H.
// @match        https://shopee.tw/*
// @icon         https://freepngimg.com/save/109004-shopee-logo-free-transparent-image-hq/128x128
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474591/%E8%9D%A6%E7%9A%AE%E7%A5%A8%E5%88%B8%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/474591/%E8%9D%A6%E7%9A%AE%E7%A5%A8%E5%88%B8%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    // Create UI elements
    const btn = createButton();
    const modal = createModal();

    document.body.appendChild(btn);
    document.body.appendChild(modal);

    btn.addEventListener("click", async () => {
        modal.style.display = "block";
        const tickets = await fetchTickets();
        updateModalContent(modal, tickets);
    });

    function createButton() {
        const btn = document.createElement("BUTTON");
        btn.innerHTML = "顯示所有票券";
        btn.style.position = "fixed";
        btn.style.top = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";

        // 添加自定義樣式
        btn.style.backgroundColor = "#FF5700";
        btn.style.color = "white";
        btn.style.padding = "10px 20px";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.fontSize = "16px";
        btn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        btn.style.cursor = "pointer";

        // 添加 hover 效果
        btn.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#FF4500";
        });

        btn.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#FF5700";
        });

        return btn;
    }

    function createModal() {
        const modal = document.createElement("DIV");
        const modalContent = document.createElement("DIV");
        modal.id = "myModal";
        modalContent.id = "modalContent";
        Object.assign(modal.style, {
            position: "fixed",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "none",
            zIndex: "10000"
        });
        Object.assign(modalContent.style, {
            backgroundColor: "#fff",
            margin: "5% auto",
            padding: "20px",
            width: "50%",
            maxHeight: "80%",
            overflowY: "scroll"
        });
        modal.appendChild(modalContent);
        return modal;
    }

    async function fetchTickets() {
        const ticketNum = await fetch("/digital-product/api/my-ticket/list?page_size=15&state=1")
            .then(r => r.json())
            .then(data => data['data']['total']);
        const ticketData = await fetch(`/digital-product/api/my-ticket/list?page_size=${ticketNum}&state=1`)
            .then(r => r.json());
        const ticketInfoList = ticketData['data']['ticket_info_list'];

        const fetchPromises = ticketInfoList.map(ticket =>
            fetch(`/digital-product/api/my-ticket/detail?ticket_id=${ticket['ticket_id']}`)
            .then(r => r.json())
        );
        const ticketDetails = await Promise.all(fetchPromises);
        return ticketDetails;
    }

    function addBOM(csvContent) {
        return "\uFEFF" + csvContent;
    }

    function convertToCSV(ticketDetails) {
        const header = ["Expire Date", "Item Name", "URL"];
        const rows = ticketDetails.map(detail => {
            const {
                expire_time,
                item_name
            } = detail['data']['ticket_detail'];
            const url = detail['data']['ticket_detail']['evoucher_ticket_detail']['code_url'];
            const formattedDate = formatDate(new Date(expire_time * 1000));
            return [formattedDate, item_name, url];
        });

        let csvContent = header.join(",") + "\n";
        csvContent += rows.map(row => row.join(",")).join("\n");
        return addBOM(csvContent);
    }

    function updateModalContent(modal, ticketDetails) {
        const modalContent = modal.querySelector("#modalContent");
        const modalClose = createModalCloseButton();

        // 添加匯出CSV按鈕
        const exportCSVButton = document.createElement("BUTTON");
        exportCSVButton.innerHTML = "匯出CSV";
        exportCSVButton.style.marginBottom = "10px";
        exportCSVButton.addEventListener("click", function() {
            const csvContent = convertToCSV(ticketDetails);
            const blob = new Blob([csvContent], {
                type: 'text/csv;charset=utf-8;'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = 'ticket_details.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        modalContent.innerHTML = "";
        modalContent.appendChild(modalClose);
        modalContent.appendChild(exportCSVButton);
        modalContent.insertAdjacentHTML("beforeend", generateTicketListHTML(ticketDetails));

        modalClose.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }


    function createModalCloseButton() {
        const modalClose = document.createElement("SPAN");
        modalClose.innerHTML = "&times;";
        Object.assign(modalClose.style, {
            float: "right",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333"
        });
        return modalClose;
    }

    function formatDate(shopeeDateStr) {
        const date = new Date(shopeeDateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function generateTicketListHTML(ticketDetails) {
        const ticketListHtml = `<div style="font-weight: bold; margin-bottom: 10px;">總共有 ${ticketDetails.length} 張票券尚未使用:</div><ul style="list-style-type: none; padding-left: 0;">`;
        const ticketItems = ticketDetails.map(detail => {
            const {
                expire_time,
                item_name
            } = detail['data']['ticket_detail'];
            const url = detail['data']['ticket_detail']['evoucher_ticket_detail']['code_url'];

            // 使用 formatDate 函數將日期轉換為 yyyy-MM-dd 格式
            const formattedDate = formatDate(new Date(expire_time * 1000));

            return `
        <li style="border: 1px solid #eaeaea; margin: 8px 0; padding: 10px; border-radius: 4px;">
            <span style="font-weight: bold;">${formattedDate}</span>,
            <span>${item_name}</span>,
            <a href="${url}" target="_blank" style="color: #FF5700;">點我開啟</a>
        </li>`;
        }).join("");
        return ticketListHtml + ticketItems + "</ul>";
    }

})();