// ==UserScript==
// @name HCMUS Fit Adjusted Grade
// @description
// @include *.fit.hcmus.edu.vn/vn/Default.aspx?tabid=409
// @version 0.0.1.20160215032714
// @namespace https://greasyfork.org/users/14513
// @description Adjusted Grade
// @downloadURL https://update.greasyfork.org/scripts/22960/HCMUS%20Fit%20Adjusted%20Grade.user.js
// @updateURL https://update.greasyfork.org/scripts/22960/HCMUS%20Fit%20Adjusted%20Grade.meta.js
// ==/UserScript==
(function() {
    document.addEventListener("keyup", function(e) {
        var keyCode = e.which;
        currentMS = document.evaluate('//*[contains(@name, "ViewXemDiemSinhVien$txtMSSV")]').iterateNext();
		if(currentMS === document.activeElement) return;
        // '>' key
        if (keyCode == 39) {
            currentMS.value = parseInt(currentMS.value) + 1;
        }
        // '<' key
        else if (keyCode == 37) {
            currentMS.value = parseInt(currentMS.value) - 1;
        } else {
            return;
        }
        clickBtn = document.evaluate('//*[contains(@id, "ViewXemDiemSinhVien_btnXemKetQua")]').iterateNext();
        clickBtn.click();
    }, false);
})();

(function() {
    tcElements = document.evaluate('.//div/table/tbody/tr/td[5]');
    gradeElements = document.evaluate('.//div/table/tbody/tr/td[9]');
    var data = [];
    while (true) {
        nTCE = tcElements.iterateNext();
        gradeE = gradeElements.iterateNext();
        if (nTCE === null || gradeE === null) break;
        nTC = nTCE.innerHTML;
        grade = gradeE.innerHTML.replace(',', '.');
        if (isNaN(nTC) || isNaN(grade)) continue;
        if (parseFloat(grade) < 5) continue;
        data.push({
            nTC,
            grade
        });
    }
    nTCtotal = 0;
    nGradeTotal = 0;
    for (var e in data) {
        nTC = parseInt(data[e].nTC);
        nTCtotal += nTC;
        nGradeTotal += parseFloat(data[e].grade) * nTC;
    }
    averageGrade = nGradeTotal / nTCtotal;
    resultElement = document.evaluate("//table[contains(@id,'ViewXemDiemSinhVien_tblKetQuaHP')]/tbody/tr[2]/td").iterateNext();
    resultElement.innerHTML = resultElement.innerHTML + "Adjusted Grade " + averageGrade;
})();