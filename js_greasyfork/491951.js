// ==UserScript==
// @name               SUP 預留查詢：列出庫存
// @description        增加一顆用於列出產品庫存的按鈕及對應的快捷鍵。
// @icon               data:image/webp;base64,UklGRr4CAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSHMAAAABcNxIkiJpnvtaM/bAgjOGwQC+J5rMVKrDga1jkCJiAowrU2gCp4F61KMdNfWoRz3qUY961KMe71+sF90rQAigrQRBKIGO92WzouVstlgtVruUATYAL6bL7+dXtZiIkcP/DyYO2kzB1JgoZL436Dm3HDsFAFZQOCAkAgAAEAwAnQEqQABAAD6NOJZHpSMiITAWDfigEYljPnHAF6A5grgAv3zADdblrHTAj+laq/XfpvmlcHsim1ODKSAMMbXS0xDNZLgcNjioFinpE0tKec6io7VPimcrh21S4ogF/5v3Z5A7wgxgAP78ExgFe+EEDTZZwxF1+jiNJj+Yi3K3ucqYltsgtyD0ngO43j9Oir1LEKh5U5JekF7pwOdm7kOiWNTAwX0H9YpSqckvjuu4AjzP5UW+HZQQ3cHnVn208hmRu9HVPyFSmucisiP8L6doLps7/MaTj3oflfAQCTc6qy8aBIHm6Kjms3TwDNtZpqS6R/+h8l8ZaITSQzVj6PYTIdtpkefBLEYV+qLNZqW5vT4N8GpRgxACAW3Ucf0f0/OBfkl6bqEA5XgLlHnL5aD13SZWSDHogklN8bJDAvOTpDE5PrRq/DCgyR2iF8ErPxND3RqezhY+zj/ukQ8Q8Sx9dk9bdVklmOYJ91mwDJLYUo8NDICK+EfiS9Hmf49OtmxJQT9/CuLaCNwYk+/RBGWmxlDfWEg/4RZbAEQCg70ozP2+hDmX8NhjWZ0LLRxPwcAuNeAtufL5vCr80TsvF65eREmZXvoXyUcts70f7iZkBAM6fQHxaOfhwUj5SONzdBO/wAavhuCl/ghAb9y7q5BK5wF4y+KvOsaGy2hx8c/tcSjqtZ6F7STv3tnKYggDHam8HT+qZ1OQ0bdX7nG7q1chkAA=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.2
// @license            MIT
// @match              http://reserve.erp.sup.services/UserPages/result-item.aspx?*
// @run-at             document-end
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/491951/SUP%20%E9%A0%90%E7%95%99%E6%9F%A5%E8%A9%A2%EF%BC%9A%E5%88%97%E5%87%BA%E5%BA%AB%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/491951/SUP%20%E9%A0%90%E7%95%99%E6%9F%A5%E8%A9%A2%EF%BC%9A%E5%88%97%E5%87%BA%E5%BA%AB%E5%AD%98.meta.js
// ==/UserScript==

document.querySelector(".ibox .table > thead > tr > th:nth-of-type(5)").style.width = "240px";

const branches = Array.from(document.querySelectorAll(".ibox .table > tbody > tr > td:nth-of-type(5) div[title]"));
branches.forEach((branch) =>
{
    branch.dataset.name = branch.innerText;
    branch.dataset.quantity = branch.title;
});

const quantityToggle = document.createElement("button");
quantityToggle.classList.add("btn", "btn-white", "btn-sm");
quantityToggle.type = "button";
quantityToggle.title = "列出庫存 (F5)";
quantityToggle.innerHTML = `<i class="fa fa-cubes"></i>`;
quantityToggle.addEventListener("click", () =>
{
    if (quantityToggle.classList.toggle("active"))
    {
        branches.forEach((branch) => { branch.replaceChildren(`${branch.dataset.name}（${branch.dataset.quantity}）`); });
    }
    else
    {
        branches.forEach((branch) => { branch.replaceChildren(branch.dataset.name); });
    }
});

const buttons = document.querySelector(".ibox > .ibox-title > .btn-group");
buttons.insertBefore(quantityToggle, buttons.querySelector(":first-child"));

document.addEventListener("keydown", (event) =>
{
    if (event.code === "F5")
    {
        event.preventDefault();
        quantityToggle.click();
    }
});
