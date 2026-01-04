// ==UserScript==
// @name         니마갤 쿠폰 자동입력툴
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  쿠폰 편하게 적자
// @author       니마갤파딱
// @match        *://www.blablalink.com/cdk*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527705/%EB%8B%88%EB%A7%88%EA%B0%A4%20%EC%BF%A0%ED%8F%B0%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%ED%88%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/527705/%EB%8B%88%EB%A7%88%EA%B0%A4%20%EC%BF%A0%ED%8F%B0%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%ED%88%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHEET_ID = '1iN8RiOLftZMtxM-AjdmY2BT0SpgSnacurpDl1oTV6UQ';
    const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    let normalCoupons = [];
    let normalCouponsText = [];
    let resetCoupons = [];
    let resetCouponsText = [];

    function fetchSpreadsheetData() {
        fetch(API_URL)
            .then(response => response.text())
            .then(data => {
                try {
                    const jsonData = JSON.parse(data.substr(47).slice(0, -2));
                    const rows = jsonData.table.rows;
                    normalCoupons = rows.map(row => row.c[0]?.v || "").filter(Boolean);
                    normalCouponsText = rows.map(row => row.c[1]?.v || "").filter(Boolean);
                    resetCoupons = rows.map(row => row.c[2]?.v || "").filter(Boolean);
                    resetCouponsText = rows.map(row => row.c[3]?.v || "").filter(Boolean);
                    console.log("📜 일반 쿠폰 리스트:", normalCoupons);
                    console.log("🔄 리세용 쿠폰 리스트:", resetCoupons);
                    displayCouponButtons();
                } catch (error) {
                    console.error("🚨 JSON 파싱 오류:", error);
                }
            })
            .catch(error => console.error("🚨 스프레드시트 데이터를 가져오는 중 오류 발생:", error));
    }

    function getUsedCoupons() {
        const usedCouponsContainer = document.querySelector('div[data-cname="infinite-scroll"]');
        let usedCoupons = new Set();

        if (usedCouponsContainer) {
            const couponDivs = usedCouponsContainer.children;

            for (let i = 0; i < couponDivs.length; i++) {
                try {
                    const couponDiv = couponDivs[i];
                    if (couponDiv) {
                        const firstDiv = couponDiv.querySelector("div");
                        if (firstDiv) {
                            const couponNumberDiv = firstDiv.querySelector("div");
                            if (couponNumberDiv && couponNumberDiv.textContent) {
                                usedCoupons.add(couponNumberDiv.textContent.trim().toUpperCase());
                            }
                        }
                    }
                } catch (error) {
                    console.warn("⚠️ 쿠폰 파싱 중 오류:", error);
                }
            }
        } else {
            console.warn("❌ 사용된 쿠폰 컨테이너를 찾을 수 없습니다.");
        }

        console.log("🎟️ 사용된 쿠폰 리스트:", usedCoupons);
        return usedCoupons;
    }

    function displayCouponButtons() {
        const usedCoupons = getUsedCoupons();

        let couponContainer = document.getElementById("coupon-buttons-container");
        if (!couponContainer) {
            couponContainer = document.createElement("div");
            couponContainer.id = "coupon-buttons-container";
            couponContainer.style.marginTop = "10px";
            const autoButton = document.getElementById("auto-input-btn");
            if (autoButton) {
                autoButton.parentNode.insertBefore(couponContainer, autoButton.nextSibling);
            } else {
                document.body.appendChild(couponContainer);
            }
        }

        couponContainer.innerHTML = "";

        const showResetCheckbox = document.getElementById("reset-coupon-checkbox");
        const showReset = showResetCheckbox ? showResetCheckbox.checked : false;

        if(showReset && resetCoupons.length > 0){
            let resetCount = 0;
            resetCoupons.forEach(coupon => {
                if (coupon && coupon.trim() !== "") {
                    const button = document.createElement("button");
                    const resetText = resetCouponsText[resetCount] || "";
                    button.textContent = coupon + (resetText ? " (" + resetText + ")" : "");
                    button.style.display = "block";
                    button.style.margin = "5px auto";
                    button.style.padding = "8px 12px";
                    button.style.backgroundColor = "#ffbb00";
                    button.style.border = "none";
                    button.style.cursor = "pointer";
                    button.style.width = "80%";
                    button.style.borderRadius = "5px";
                    button.style.textAlign = "center";
                    button.addEventListener("click", () => insertCoupon(coupon));
                    couponContainer.appendChild(button);

                    if (usedCoupons.has(coupon.toUpperCase())) {
                        button.style.textDecoration = "line-through";
                        button.style.color = "gray";
                    }
                }
                resetCount++;
            });
        }

        let couponCount = 0;
        normalCoupons.forEach(coupon => {
            if (coupon && coupon.trim() !== "") {
                const button = document.createElement("button");
                const normalText = normalCouponsText[couponCount] || "";
                button.textContent = coupon + (normalText ? " (" + normalText + ")" : "");
                button.style.display = "block";
                button.style.margin = "5px auto";
                button.style.padding = "8px 12px";
                button.style.backgroundColor = "#ffcc00";
                button.style.border = "none";
                button.style.cursor = "pointer";
                button.style.width = "80%";
                button.style.borderRadius = "5px";
                button.style.textAlign = "center";
                button.addEventListener("click", () => insertCoupon(coupon));
                couponContainer.appendChild(button);

                if (usedCoupons.has(coupon.toUpperCase())) {
                    button.style.textDecoration = "line-through";
                    button.style.color = "gray";
                }
            }
            couponCount++;
        });
    }

    function insertCoupon(coupon) {
        const textarea = document.querySelector("textarea[placeholder='CDK를 입력하세요.']");
        if (textarea) {
            textarea.value = coupon;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("✅ 쿠폰 입력 완료:", coupon);
            setTimeout(clickConfirmButton, 500);
        } else {
            console.warn("❌ 입력할 textarea를 찾을 수 없습니다.");
        }
    }

    function clickConfirmButton() {
        const confirmButton = document.querySelector("div[data-cname='index'].cursor-pointer");
        if (confirmButton) {
            confirmButton.click();
            console.log("✅ 확인 버튼 클릭 완료");
            waitForPopupAndContinue();
        } else {
            console.warn("❌ 확인 버튼을 찾을 수 없습니다.");
        }
    }

    function waitForPopupAndContinue() {
        const observer = new MutationObserver((mutations, obs) => {
            const closeButton = [...document.querySelectorAll("div[data-cname='index']")].find(btn => btn.textContent.includes("닫기"));
            if (closeButton) {
                setTimeout(() => {
                    closeButton.click();
                    console.log("✅ 팝업 닫기 완료");
                    obs.disconnect();
                }, 500);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addUIElements() {
        const confirmButton = document.querySelector("div[data-cname='index'].cursor-pointer");
        if (!confirmButton || document.getElementById("auto-input-btn")) return;

        const reportLink = document.createElement("div");
        reportLink.textContent = "만료 쿠폰 등 제보";
        reportLink.className = confirmButton.className;
        reportLink.style.marginTop = "10px";
        reportLink.style.backgroundColor = "#ffaa00";
        reportLink.style.color = "white";
        reportLink.addEventListener("click", () => window.open("https://gall.dcinside.com/mgallery/board/view?id=gov&no=2733748"));

        const autoButton = document.createElement("div");
        autoButton.textContent = "쿠폰 가져오기";
        autoButton.className = confirmButton.className;
        autoButton.id = "auto-input-btn";
        autoButton.style.marginTop = "10px";
        autoButton.style.backgroundColor = "#ffcc00";
        autoButton.style.color = "white";
        autoButton.addEventListener("click", fetchSpreadsheetData);

        const checkboxContainer = document.createElement("div");
        checkboxContainer.style.display = "flex";
        checkboxContainer.style.alignItems = "center";
        checkboxContainer.style.marginTop = "5px";
        checkboxContainer.style.justifyContent = "flex-start";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "reset-coupon-checkbox";
        checkbox.style.marginRight = "5px";
        checkbox.style.width = "16px";
        checkbox.style.height = "16px";
        checkbox.addEventListener("change", displayCouponButtons);

        const label = document.createElement("label");
        label.htmlFor = "reset-coupon-checkbox";
        label.textContent = "리세용 쿠폰 표시";
        label.style.fontSize = "14px";
        label.style.color = "Black";

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        confirmButton.parentNode.insertBefore(reportLink, confirmButton.nextSibling);
        confirmButton.parentNode.insertBefore(autoButton, confirmButton.nextSibling);
        confirmButton.parentNode.insertBefore(checkboxContainer, autoButton.nextSibling);
    }

    const observer = new MutationObserver(addUIElements);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("load", addUIElements);
})();