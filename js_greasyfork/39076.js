// ==UserScript==
// @name         pochta.ru extend download blanks name
// @name:ru      Расширенное имя скачиваемого извещения с pochta.ru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  blanks.pdf -> YearMonthDate_blanks_TrackNumber.pdf (Example 180224_blanks_RA123456789CN.pdf)
// @description:ru  blanks.pdf -> ГодМесяцДата_blanks_НомерТрека.pdf (Например 180224_blanks_RA123456789CN.pdf)
// @author       KiberInfinity
// @match        https://www.pochta.ru/form*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39076/pochtaru%20extend%20download%20blanks%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/39076/pochtaru%20extend%20download%20blanks%20name.meta.js
// ==/UserScript==

(function() {
    $("body").on("submit","form[action*=generate]", function(e){
        function q2ajx(e) {
            if (!e)
                return {};
            var t = {}
            , o = function(e) {
                try {
                    return decodeURIComponent(e)
                } catch (t) {
                    return e
                }
            };
            return e = e.split("&"),
                $.each(e, function(e, n) {
                var i = n.split("=");
                if (i[0]) {
                    var r = o(i[1] + "");
                    if ("[]" == i[0].substr(i.length - 2)) {
                        var a = o(i[0].substr(0, i.length - 2));
                        t[a] || (t[a] = []),
                            t[a].push(r)
                    } else
                        t[o(i[0])] = r
                        }
            }),
                t
        }
        e.preventDefault();
        var post_data = ($( this ).serialize());
        var data = q2ajx(post_data);
        var url =  $(this).attr('action');
        console.log(data, post_data);
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "binary",
            type: "POST",
            data: post_data,
            success: function(bin) {
                var blobUrl =  URL.createObjectURL(bin);
                var link = document.createElement("a"); // Or maybe get it from the current document
                link.href = blobUrl;
                var dt = new Date(); dt = (''+dt.getFullYear()).substr(-2) + ('0'+(dt.getMonth()+1)).substr(-2) + ('0'+(dt.getDate())).substr(-2)
                link.download = dt + "_blanks_"+data.PostId+".pdf";
                document.body.appendChild(link);
                link.click();
                setTimeout(function(){
                    link.parentNode.removeChild(link);
                },300);
                console.log('Response:', bin)
            }
        });
    });

})();