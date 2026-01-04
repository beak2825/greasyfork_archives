// ==UserScript==
// @name               SUP 預留查詢：鍵盤導覽
// @description        使用鍵盤瀏覽 SUP 預留查詢。
// @icon               data:image/webp;base64,UklGRr4CAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSHMAAAABcNxIkiJpnvtaM/bAgjOGwQC+J5rMVKrDga1jkCJiAowrU2gCp4F61KMdNfWoRz3qUY961KMe71+sF90rQAigrQRBKIGO92WzouVstlgtVruUATYAL6bL7+dXtZiIkcP/DyYO2kzB1JgoZL436Dm3HDsFAFZQOCAkAgAAEAwAnQEqQABAAD6NOJZHpSMiITAWDfigEYljPnHAF6A5grgAv3zADdblrHTAj+laq/XfpvmlcHsim1ODKSAMMbXS0xDNZLgcNjioFinpE0tKec6io7VPimcrh21S4ogF/5v3Z5A7wgxgAP78ExgFe+EEDTZZwxF1+jiNJj+Yi3K3ucqYltsgtyD0ngO43j9Oir1LEKh5U5JekF7pwOdm7kOiWNTAwX0H9YpSqckvjuu4AjzP5UW+HZQQ3cHnVn208hmRu9HVPyFSmucisiP8L6doLps7/MaTj3oflfAQCTc6qy8aBIHm6Kjms3TwDNtZpqS6R/+h8l8ZaITSQzVj6PYTIdtpkefBLEYV+qLNZqW5vT4N8GpRgxACAW3Ucf0f0/OBfkl6bqEA5XgLlHnL5aD13SZWSDHogklN8bJDAvOTpDE5PrRq/DCgyR2iF8ErPxND3RqezhY+zj/ukQ8Q8Sx9dk9bdVklmOYJ91mwDJLYUo8NDICK+EfiS9Hmf49OtmxJQT9/CuLaCNwYk+/RBGWmxlDfWEg/4RZbAEQCg70ozP2+hDmX8NhjWZ0LLRxPwcAuNeAtufL5vCr80TsvF65eREmZXvoXyUcts70f7iZkBAM6fQHxaOfhwUj5SONzdBO/wAavhuCl/ghAb9y7q5BK5wF4y+KvOsaGy2hx8c/tcSjqtZ6F7STv3tnKYggDHam8HT+qZ1OQ0bdX7nG7q1chkAA=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              http://reserve.erp.sup.services/UserPages/*
// @run-at             document-end
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/491948/SUP%20%E9%A0%90%E7%95%99%E6%9F%A5%E8%A9%A2%EF%BC%9A%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491948/SUP%20%E9%A0%90%E7%95%99%E6%9F%A5%E8%A9%A2%EF%BC%9A%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD.meta.js
// ==/UserScript==

window.addEventListener("unload", () => {});

document.addEventListener("keydown", (event) =>
{
    if (event.code === "F3")
    {
        event.preventDefault();

        if (history.length > 1)
        {
            history.back();
        }
        else
        {
            location.replace("http://reserve.erp.sup.services/UserPages/search.aspx");
        }
    }

    if ((location.pathname === "/UserPages/search.aspx") && (event.code === "F8"))
    {
        document.getElementById("Btn_Submit_Search").click();
    }
});

if (location.pathname === "/UserPages/search.aspx")
{
    const isbnField = document.getElementById("TB_Nums");
    isbnField.focus();
    isbnField.select();
}
