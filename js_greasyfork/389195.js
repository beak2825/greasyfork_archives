// ==UserScript==
// @name         Fokse's Gold calculator
// @version      0.1
// @namespace calculatord2jspgold
// @description  Adds to d2jsp forum a calc to send form
// @author       Fokse
// @match        https://forums.d2jsp.org/gold.php?i=*
// @match        http://forums.d2jsp.org/gold.php?i=*
// @require https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/389195/Fokse%27s%20Gold%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/389195/Fokse%27s%20Gold%20calculator.meta.js
// ==/UserScript==
(function() {
    function expr(expr) {

        var chars = expr.split("");
        var n = [],
            op = [],
            index = 0,
            oplast = true;

        n[index] = "";

        // Parse the expression
        for (var c = 0; c < chars.length; c++) {

            if (isNaN(parseInt(chars[c])) && chars[c] !== "." && !oplast) {
                op[index] = chars[c];
                index++;
                n[index] = "";
                oplast = true;
            } else {
                n[index] += chars[c];
                oplast = false;
            }
        }

        // Calculate the expression
        expr = parseFloat(n[0]);
        for (var o = 0; o < op.length; o++) {
            var num = parseFloat(n[o + 1]);
            switch (op[o]) {
                case "+":
                    expr = expr + num;
                    break;
                case "-":
                    expr = expr - num;
                    break;
                case "*":
                    expr = expr * num;
                    break;
                case "/":
                    expr = expr / num;
                    break;
            }
        }

        return expr.toFixed(2);
    }
    $('#givegold > tbody > tr:nth-child(2)').before('<tr><td align="right">Calculator:<div class="desc">(Example 100*50.50)</div></td><td><input id="calculator" size="12" autocomplete="off"></td></tr>');
    $('#calculator').on('input', function() {
        var result = expr($('#calculator').val())
        if (!isNaN(result)) {
            $('#givegold > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=number]').val(result)
        }
    });
})();