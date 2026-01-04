// ==UserScript==
// @name            Softer SchoolSoft
// @description:sv  Ett stiländrande plugin till SchoolSoft
// @version         1.2.1
// @include         *://sms.schoolsoft.se*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @namespace https://greasyfork.org/users/229016
// @description Ett stiländrande plugin till SchoolSoft
// @downloadURL https://update.greasyfork.org/scripts/374898/Softer%20SchoolSoft.user.js
// @updateURL https://update.greasyfork.org/scripts/374898/Softer%20SchoolSoft.meta.js
// ==/UserScript==

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/// Move Question Mark
var helpButton = $(".TopMenu-Thick-Circle .help");
document.getElementById("header").appendChild(helpButton[0]);

/// Add Option Button
var button = `
<a href="#" id="style-options-button" onclick="openStyleOptions()"><div>
    <img id="style-options-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAEbklEQVR4Ae3aY4AkOxQF4LO2bXu3p3POs23btm3btm3btm3b9uvZPKyVSVK10/lR3/k3yO3bzE01ChMVCoVCoWBW5gHO7G1qkK7yorJ1xyyHVPFUWY9ciFTpLp8G+ChSpfe8GvgSiWok65f+zZGimqG+DdQYpKi8lKxnVkWKtJ13A3siRTrJtwGeixTxNu8GHkSK+JZ3A5+ifvVuwWv5qQ4f3cdx8+fQX7K+4RKOd7NeOoj3mJ3QGHnhoePL1vJGLYZplGflHbKBedjMgmloQV6jyvhqxyMf6jvVffumth/cFuOVuvIa2bjwOvXAeMPacGu9McXvKxyMPOj66ZT+hWeakQA30A+yGfKjtkQDM5Kn8pfp/PYuZGfmc5R/TzZ7+IHjd8sio0Z8VbZ64dtqgiy4jWx1w90Qb0wHfidb5fxqumSfsKoanoc4ZiTHyqaQchkx+KBsInky6oBENp1wbYQZ3EwfZi76HR/iKTxaF+ou/ZRxtc/UEiHMPpnK3aedS6Mxmf7NzRq8J9OaB8PfqI76NbrQXWYWzIBm592x6/KP0d3gS4tFFvmz7ucq19bfke9FS8FXub2+iCjxTXlWr9Xn0tcRq389vFPYFvq5sAKsNfPBk6jfA1d/rTQg+H2IZ4aUMLsjgFkuqIFLe7dADK2l3zxLvIRAutr3xWu2QDyO8Nvzm0UQqDRAFY+VP6wxiDd+1LuxzjKPIIKuqmtd3q12yIN2cd9b3BwRuI77TUH7ogHywqMdxSpjOiCC2jl3u6chT7zEUeoNRNKbjlWvRp5cWwA+AIfoDft9yJOedDRwBSLxSkcDT9RbA7oUkXRZTAP5P9j3I5Luj3tiRuA19f0i5nXIE89wvY2qXdyhjSr1czW5gfZlrawjayECN3OtybE8BA2Rndp5TFFXIQIfrWtdPjCqI7KpMV7DfcW9W4+f+vhJps2c2cL3qguvQSC97Lud5qaRl5V0qUeByINw7hY20AxuFrxb52uyQfld9L/mwNrA1V9S37BjlW9ixm6/oZ6KWZ1fltvHf2kgx2MVsy7/jDxWWRS+RnXXX7KRudN1sKU7468TBE0d5jDZDLnLrDnly65mlNmJD2Rac0+EUEt+JZspP/F2XcijdRof0g+yGfOhmiCMWU82oawQOQOkET6IGJo9kQYqZiTi6MIkGjgJsUwX/Vr1p893YzognvaUrXK2RBZqog+rev+/igbIRivEfE3DHf9VzHwz60TiJ55cGoYGZgv9lPFK5gYASzxTv8VNGR7MyKmG71e0ZakVxlMP3hh9868sdZ1sdN1B7045yqgv8sETxi/6t64uL4BpmFn0cPimbzrDYgMtxpsmzAo8BHlRE7MT7zUHjuruaHIJWe/85Xpum346gp/yGrVE/dLn3g28iRQFPI1uRYp4vncDJyJF3Nu3AbMtUsTVvRtYEimivMfzIUjR4La++3s0Qpo8v8TxLlLFx/0+g5EqXuTTAE9FQiJO9LgE0sWS2YcHuGJWwQSFQqFQKBT+AfVgCeOyGbjFAAAAAElFTkSuQmCC"/>
</div></a>`;
// modify template HTML with token replacement
document.getElementById("header").innerHTML += button;
document.getElementById("style-options-button").onclick = function openStyleOptions() {
    GM_config.open();
}

$("#logo_image a img").attr("src", "https://i.imgur.com/WFnkDwl.png");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/clipboard__pencil.png"}).addClass("document-img");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/document__pencil.png"}).addClass("document-img");
$(".document-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABVklEQVR4Ae3SMTJAQRCE4ScBIAUAAGDmZkAEqVgETgAgByABriEBACAUQu/TtVX9zwG2v6pNfpJSSinVXuF9tumX/oGdjRHGt+XbvL2j02mE+iw/AgbzCTYBjOUTvMRf/SNigo9AQ/kEOwg1l0Sw8zCAJCER/D4UACTwASCBDwAJfABI4ANIBH8IBQAJfABI4ANAAh8AEvgAkMAHkAj2GAoAEvgAkMAHgAQ+ACTwASSCPaUI+AEhKsAXIUrAFyECwM8JfAAOx/JnKkAAAQQQ4EUAAQSIG/Ca7gMCCCBAygB7E0AAGMA8AeIHvAsggABRA9J+QAABBBBAgAgAxBMgdkCGAAIIEDcg8Wsq4BoG2CkTYGc4YJwKGIcBXY32Rpv/5pUJns3SAFNJiDzXzjj/vz4rCZMX2Zq9/+v4d1tsy09C1l3dM2TbfpX6+Evf8P6f/X2llFLqE2R935bpkKNZAAAAAElFTkSuQmCC");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/printer.png"}).addClass("print-img");
$(".print-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABQklEQVR4Ae3agUaDURjG8fcW0sLWkgGh1s773EVWu4SaAmDsZnYDu4SCupGxC9hEg1ZT2AnC9sHZyvpO/P8P4AU/tgM+IyIiIqLNU9zt8gAAAAAAAAAAAAAAAACAiE72w60eNPK54t/OXzXSve7O9uynhWMN9KlY7vxDg2bdtq/V0UIxky1aHdsu9RQzW882z9u+zA3gy3BlmxVqelPMcO/nh7ZJPlTMcz60dM2GYr5rNixV6CuWvEnrQhVV/FKT4i30LZUeS/6ZzFS171TVS+H6ZKl8XDKgayv5TeE6tlRlv0CnR+svYgEwTwNiuQu1tSelXrxnD9C1reTdfwfw59U/sc+yBCQ29XY4UMXbmirmD0gPAAAAAABkDLBfBgAAAAAAAAAAkBMg1a4BtusEAAAAAAD4YguAAAAAAICIiIiIvgD7CiM2CSPHiwAAAABJRU5ErkJggg==");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/users.png"}).addClass("users-img");
$(".users-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACQ0lEQVR4AezZNZAUURSF4a7NyHB3t5npd08RIRHukOLu7k6GS4ITQoa7Q4i7a4o7rO/DZce6b+2pjt534r/67qzveo7jOI7jOI7jOI7jaDSvZEbgMO7LZ/mE+3LQjIhVIPTRMPWwCQWwpSd52Bivze/p/D7Ihc2wXL8Pv6fCFNjsk4n8nkZ6SkngASWmN6XnMzXxBTZ48ileldDzyQ7YkNtO6NniDWDDTopNTULPZabDhp8ZS+i5cEJzgOwn9FzySHXAdULPhS+qA15yewL5rDrgBbcnwGPVATe4PYGc1H8S8noCzNB/GeT1BLGGmm9EiVrsngA7Q5+wjd8TJGrpfxhj9gSmd4jHl/id+D2NTAt6PMbzeyrpn/VXwu78ng519b+UM3uKVhX//7MIDmFkrAK/dxzHcRy2HMRkjKyX3XIZr2B/7xUuyG5ZL2Mk7uV4oaCvvAjuaRJNMVfOyTMUwGaf5MsznMU8v4kXwHTDF3WvJ3FZipuw+uHW9zLmZYF28knRa8UqYJE8hC3b5CEWZf45x3RAQaheK15V1uIrLGlfZW2m37LMYH0f/MqvQS4seblYk/6VlIO6PoAMxIfkmLYPMjDtPz5yFX12GEc4U/0/MCxX9+nJRMaJ+hNQGQWEN8EMgo1mZrCXRHar+2TNK+E9bER737ySVwrGq/tkZiFsdDMLvVL8Nuo+Ga7xztP/BwY11H0y5MJGuFyvlNrl1H0y2GhX1ud/a38OBAAAABgG+Vvf4yuDBAQEBAQEvgIAAAAQM/51H4xXwfgaAAAAAElFTkSuQmCC");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/calendar-clock.png"}).addClass("schedule-img");
$("img").filter(function() {return $(this).attr("src") === "../../images/icon/schedule.png"}).addClass("schedule-img");
$(".schedule-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABMElEQVR4Ae3bP04CYRCG8bGi4QIWYLMdNM57NLG1NdRWegaDR5DOygSuYUVI/A981jbGgQ07m32et9/kl2z5jRFRLJXfy/Y9AADqDQAAAOOBLnyulcqRt/K5X44Hdkijvt/7TqW5+U4Po77tV9XTs0rz82XVs33yG5Uc8zuLp1Nt0gC2XsUBVyqJdm3R/CkTwJdxwEsmgF4tmt5UMg0AgOgAvHcbAACAfwCodQDsyAnAZ6sBAAAA0Fe7AQAAAPgG0HEAgE09AJX/rWYAAAAAfNtuAAAAAHatBgAAAEAFAAAAAAIlAwAAcNJxAAAAprVKoq0tmi/a/vR4mgowtWjnZ77N8/xeQ4vnt6kOIOJVPV8kPUEJHAHNmj4C8tmob4ekoSbNnGHpUZO//n0iIiIi+gHupOrg8Gp+xwAAAABJRU5ErkJggg==");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/balloon.png"}).addClass("message-img");
$(".message-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABJUlEQVR4Ae3asU3DUBSF4dulyQpJ5S6p7l2N9O4iVsgQZAQyAt7EQkJU9qNGQjpOkPBB+v+7wPle/YKIiOinjrs85a3GaivfmLc8HXdxT4dtXXOu5nM51/WwjWV1mxyq+V0O3SaWlJdqnpeX0GWXky1gyi5Uda5mfOdQ5ZszIIdQ1aczoD40oH2/WCGxB8CfBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA9tVWvfdfAbJ3/HImAE7zq+Xz3QCr+VPtHwRk7/3xVQCyd/56LAAe83POl8M24gHA6vPHeq2n2sfSxEv04Z7/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fJH/fNF/mk9ERPQFfJPWPISQzXwAAAAASUVORK5CYII=");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/clock.png"}).addClass("clock-img");
$(".clock-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAFnUlEQVR4Ae2bU4DkShSGz3q0todXPZ1Nnf/atm3btn3f1rZt27Zt297ta52umSTdlck+9FfPhT8pnvqLEpgjQYIECRLYOeo+vMcNeACmYRm24iSOYCuWYir3R331Lt+DLDoTObskP86tsQER58Rr0FI9bKXSmUIdxc1wGBGPaT+aIEzBEirOj2EqIrEnnqQepqIUBOeU5695GyLxJ96EL+wyVKAUUs9hFyLmEm/np6mgsHIxzVDDRXfic8l/+F4+iohP6TDfTr5SGD85fsdjmMjN+R11Sx2VWzM9qUayVcO27Vv5HW6GiXzMMf/3VIj8ASk8IN+ql/PXuCa7BOVDepJ9tfqGl+crok96EplHVcScPJu+W/1o5XocRz/z7jzLmxEqR2ZBFq/Nc119pUZybH8Ur+RVKlba6WSO3JrYrG38aW4oG+8NK5Ub8GmthPWqmrHOw2u0zV+rrjJS/lX68rHsnPIUP+lJmK9tfq9QGhkilMbdtBJmh4pTvKCxpuCT/AwZhp/GSU1N9Sk+cJum0EPqevIBdT0OaWq7kWLHqqSZ6g4zyCcYfDR6lxTHSOCOiMik7iQf4Yc0/6AtxYZ9taaw78hn8F10rfal5J3sElgtC+LB7vcp/81HXijEg2W9WIpi5BV+LXpelhOnMQFiUsUyWbd6mTxSFJvlqotziPwRIFHnydWZ13g8eKpnERGpCZF/AiTcFLL+p8gLcsPLe+wyBSkgXJb3yA5M7lFXQur/kshfARJ8KdugrnSfuZ34/gdCaQUtwC7DB4SEdu63uHI9/JnIfwES/CxaccRlNE/dJ39eODMIAZwt26HuIzegvtzUEgUhgAizRVduQG7geSLbB4EJeF98ygXkTKgcIiKFAxMQlm1xcdhX18kVgCgoAURyO6+uIyfwqlDdI0gB6C5a86pzlnriD3wd6B/4Wgio55xlqMjyaJAC8Kj4nEPJCRmDsC8IUoA6X3zO+eSEjJVZGUEKsDJkLMrzuEeFIAWggozCkhPyKJGeFKSA9CQh4BQ5ISP4oeJBCggVl7cP5AR2mu9CGGinm+lC2ElO8BrzgxgRPopv05MMDOI1BTuNihkEd5NH7Au8T6NDRbWPUUzw7bqgOQ/15pXgx0T+Id5PA99SjGSXUJ/jSPQlIP/gvjPhW+9biddFhT0pDlRt7q29fbmfXIEeojWvOWe5Md7ttISvxUpNZxplnU2OyOCKfYMLDwRkVVb8phB8rIn9H+dfkEL5wJbM4yo6ggUi2/tkAKuG7hqJN/JD7o+UPI/cwI3krS0ZQl2JpRoR4/LqTDwzpgsnfkgfVjEBiuE9PgAp4oRurgtnxhhWsVJxRB/YMgOqRt/88A/OgS0+6tqmxu1laNG0Icm+lBf9p4bV2SWcQ4vchtyCaxDRn4wNUgRvYt9fXeMqF6fhCF/h5Zpnhci+N1yWjGNV4jZ8Gi10oV3sleF18xccRlCXoDRFgSayfq+WtKK8SV4x2TYVEGzJcyE2e/Y2qjcQEWmBwzpozjmxSNbNr8UyY6/SX7P6TCEeGn3NGpO3FNcEctH9rcYdcAnFBnfQSHiAfETdp6mxXRxRGd4ui+OjdS4kn7Av0Fg6d3gPK8jTgUz7fbPb7Nd0n+v9MTw9fQYbnmRsjOdqLWcdzU2q2aW4va4OzEpPMrLgY3Uepr8rzZwSeK1505+wXfImve0S9eO1XaK+s+3SX+PrWrwagPHVvPUY4eCtx87m7yFO5m/76vjN39w/Pck3+z3/gohDOo6J3Oxv+z1SaiTn1vzXfo/j+efm0/jO5/0WHsAR/x9A+ArC/j9B8ZtC/ALv8f8RkO/PsLDDSPM348twWQqCUHH1RJzdaSIepaIULGC0CPwpooHt2GPuH4NyK+fHoIE9x+V7//8cl4/+8Rx3mh/PcRMkSJAgQYJfAf033UhihKTyAAAAAElFTkSuQmCC");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/plate-cutlery.png"}).addClass("plate-img");
$(".plate-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABjUlEQVR4Ae3WNVIFQRSF4cY9x9197i12QMqL0AXgEctAE9x1H/gGIMEiXBPch/Di2tWPrjr/ZKP9jSuEEEJIkth9Oele/nUZEY6HmmiCt2R7awCcx4N8KVtbBXCyaUa2swyQGsTtfM+upYDCIt6QLawDUI2cewsB1CjrWgjgMnq0GMDxfMWuxQCaY9diANWwazPAl3asBlAJu3YDpiwH8KrtgFvbAe7/AwAAAAAAAAAAAADQGbv6Jjo3D1jTCeAN84AZnQBaNA/o0AoYNg5winUCHI9xQGoQnWsDXOYEGgNI1K0LQN1KMgfgKLrRMvwbjjIKkKhL//k3CuBQXvozYDk2xDhA4ng++dPwT3LjlGQOIHEeHfz65jksyFGSWYBUmEjrvwJsOAlKMg+QMiKohe9+NPhbas0PU8rrAKkwjUa+94dKZzRSmKYkbwOkxGCninto9oMH+4hmudepSgxWkj6A3nQdAgAAADC6dwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIYQQegIwyvChyzBOyAAAAABJRU5ErkJggg==");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/light_bulb.png"}).addClass("light-bulb-img");
$(".light-bulb-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABNUlEQVR4AezBoQ2DUBCA4avA4NGs8O7+AZiCIdgFwRxswQSsgMZjMFdR06ZpgyF5L7nvkxBCCCGEcBebbJJSUTHjODOVlIfaFvzVFmopizas+NtVGymHtrbhn23TVsqQku34d9tTkvxpx4H/eGgneaPnxP886SVfDPiFg2TpwYhfPD7bq2MCAGEgCILYxb8BLFzBEIq9F5BsNf9Fa7gBt2NoDXcMtwGt4QBuAq31dtw8WsMB3ABawwHcAFrDAdwAWuvd/0XL48bR8rhptDxuHi2Pm0ZL4gbQorh5tChuHi2Im0dL4+bR8rh5tDxuHi2Pm0fL4+bR8rh5tDxuHi2Pm0fL4+bROo/b11+93l4BBRTgr4AChoePBhRQQAEFFFBAAQUUUEABBRRQQAEFFNBaa6211lprD5PMWSV1nyUyAAAAAElFTkSuQmCC");

$("img").filter(function() {return $(this).attr("src") === "../../images/icon/calendar_month.png"}).addClass("calendar-img");
$(".calendar-img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABEUlEQVR4Ae3bAQYCURSF4YCBWUIVPGASc8/Sag1pCbWGtIZqAWlaSCQSqBeAkPcyNDf+cwAY98PA4/QIIXlRfK/37wMA0C4AAACY9DW1nS6KHfeirWbjwVfHV6XW9lT0U3tqXZWZ54dCB0WHPYQiC2BLRZ+1Zc75wR5uAQ8LSUA9V/Tbep4E6OgZYE0acPcM0C0NiL4LAAAAAAAAAPhlATh9kwXQPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4KrouNckwBrPADslAVp4BmiRBNQjzzMsDf97CLfKnCL6/A+sCUX2GNQ23sagtqnK3jcZDzSzvc6dH3+2/ec5LiHkBbdmsmy+6lKEAAAAAElFTkSuQmCC");

$(".expand_image").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgAgMAAACf9p+rAAAACVBMVEUAAAAyMjIzMzMmhMtFAAAAAnRSTlMAgJsrThgAAABcSURBVHgBYhgxYBSMglGQtQoKVqJJSMEklqBJsAHam0MjAEAggGHHZozIyKgYOgDmaytinGcsYxdBBAkBCQEJAQkBQQRBBEEUQQRBBEEEQRRBBEEEQQRBTNP0vwu7s0JpRPs+OAAAAABJRU5ErkJggg==");
$(".btn.abilitychanges").click(function(){window.setTimeout(function() {
    console.log("Yeees");

    /*
    var x = document.getElementsByTagName("table");
    var y = x.childNodes;

    for(var i = 0; i < y.length; i++) {
        if(y[i].style.backgroundColor == "red") {
            y[i].classList.add("red");
        }
    }*/
    $("div").each(function(index, element) {
        if(element.style.borderColor == "red") {
        console.log(element);
           element.classList.add("red");
           //element.parentElement.classList.add("red");
        }
    });
}, 100)});

$("#subject_menuoff").click(function() {
    $("#subject_menu").removeClass("collapsed");
    console.log("turn on");
});
$("#subject_menuon").click(function() {
    $("#subject_menu").addClass("collapsed");
    $("#subject_menu").css("display", "");
    console.log("turn off");
});



// 0,          1,    2,      3,            4,    5,       6,            7,              8,            9,             10          11
// Background, Logo, Header, Button Hover, Text, Borders, Logo Filters, Header Filters, Matrix Green, Matrix Yellow, Matrix Red, Success;

var colorSchemes = {
    "Ice Blue": ["#ffffff", "#438FFA", "#3c80e1", "#3673CA", "#000000", "#cccccc", "", "", "#2AC940", "#FEFF54", "#FF4040", "#4FFD07"],
    "Banana Yellow": ["#ffffff", "#FFF900", "#E5E000", "#CEC900", "#000000", "#cccccc", "contrast(0) brightness(2)", "", "#2AC940", "#FEFF54", "#FF4040", "#4FFD07"],
    "Cotton Candy": ["#ffffff", "#ff75ff", "#E569E5", "#CE5ECE", "#000000", "#cccccc", "contrast(0) brightness(2)", "", "#2AC940", "#FEFF54", "#FF4040", "#4FFD07"],
    "NTI Purple": ["#ffffff", "url(https://i.imgur.com/2w19IIw.png) ", "rgba(0,0,0,0.0)", "rgba(0,0,0,0.5)", "#000000", "#cccccc", "", "", "#2AC940", "#FEFF54", "#FF4040", "#4FFD07"]
};

var nightSchemes = {
    "Ice Blue": ["#111111", "#3572C8", "#3066B4", "3673CA", "#eeeeee", "#333333", "contrast(0) brightness(2)", "", "#21a033", "#CCA300", "#CC3333", "#3FCA05"],
    "Banana Yellow": ["#111111", "#CCC700", "#B7B300", "CEC900", "#eeeeee", "#333333", "contrast(0) brightness(2)", "", "#21a033", "#CCA300", "#CC3333", "#3FCA05"],
    "Cotton Candy": ["#111111", "#CC5DCC", "#B754B7", "CE5ECE", "#eeeeee", "#333333", "brightness(0.7)", "", "#21a033", "#CCA300", "#CC3333", "#3FCA05"],
    "NTI Purple": ["#160016", "url(https://i.imgur.com/2w19IIw.png)", "rgba(0,0,0,0.0)", "rgba(0,0,0,0.5)", "#eeeeee", "#432243", "", "brightness(0.9)", "#21a033", "#CCA300", "#CC3333", "#3FCA05"]
}


var css = `
/* Night Mode */
body {
    background-color: COLOR_SCHEME_0 !important;
}

img {
    background: rgba(0,0,0,0) !important;
}

.h2 {
    padding-left: 0 !important;
}

.schedule span {
    color: #000000 !important;
}

.alert-success {
    background-color: COLOR_SCHEME_11;
}
.alert .message-text {
    color: #ffffff !important;
}

#date-week option {
    color: #000000 !important;
}

#weekcal_con * {
    background: rgba(0,0,0,0) !important;
}

.table-striped * {
    background: COLOR_SCHEME_0 !important;
}

#date-week {
    padding-top: 2px;
    padding-bottom: 7px;
}

.schedulecell-full {
    background-color: #dddddd;
}

.active a {
    background-image: none !important;
    background-color: COLOR_SCHEME_5 !important;
}

.leftmenu * {
    /*background-color: COLOR_SCHEME_0;*/
    color: COLOR_SCHEME_4 !important;
    border-color: COLOR_SCHEME_5 !important;
    border-radius: 0 !important;
    text-shadow: #000000 0 0 0 !important;
    box-shadow: #000000 0 0 0 !important;
}

.menu_header .expand_image {
    background-color: rgba(0,0,0,0) !important;
}

.leftmenu .green {
    background-color: COLOR_SCHEME_8 !important;
    background-image: none !important;
    height: 50px;
}

.leftmenu .green strong {
    background-color: COLOR_SCHEME_8 !important;
    background-image: none !important;
}

.leftmenu .yellow {
    background-color: COLOR_SCHEME_9 !important;
    background-image: none !important;
    height: 50px;
}

.leftmenu .yellow strong {
    background-color: COLOR_SCHEME_9 !important;
    background-image: none !important;
}

.leftmenu .red {
    background-color: COLOR_SCHEME_10 !important;
    background-image: none !important;
    height: 50px;
}

.leftmenu .red strong {
    background-color: COLOR_SCHEME_10 !important;
    background-image: none !important;
}

td < table < tbody < tr < td < .leftmenu .green {
    background-color: COLOR_SCHEME_8 !important;
}


/* Options */
#ss-config input {
    margin: 8px;
}

#ss-config .field_label {
    font-size: 16px;
    margin: 8px;
}

#style-options-button {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 1vw;
    margin: 10px;
    z-index: 1;
    filter: opacity(0.1) invert(1) brightness(1.5);
    transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
}

#style-options-button:hover {
    filter: opacity(1) invert(1) brightness(1.5);
    transform: rotate(90deg);
}

#style-options-image {
    width: 100%;
    height: 100%;
}



/* Main Code */
body {
    background: COLOR_SCHEME_0;
    max-width: 100vw;
    overflow-x: hidden;
    font-family: "Lato", sans-serif;
}

html, body
{
    height: 100%;
    min-height: 100%;
}

* {
    font-family: "Lato", sans-serif !important;
}

.h1 {
    font-size: 30px;
}


.h3_bold, .h3 {
    font-size: 16px;
}

#menu td {
    background: none;
}

#menu {
    background: COLOR_SCHEME_2;
    width: 85vw;
    text-align: center;
}

#menu > table {
    width: 50%;
}

#top_content_wrapper {
    padding: 0;
    top: 0;
    left: 0;
    position: relative;
    float:left;
}

.TopMenu-Thick-Left, .TopMenu-Thick-Bg-Left, .TopMenu-Menu-Left-Bg, .TopMenu-MenuActive-Left {
    width: 0;
}

#startmenu a {
    padding: 10% 30%;
}
#startmenu {
    transition: all 0.1s ease-in-out;
}
#startmenu:hover {
    background: COLOR_SCHEME_3;
}

.h2_box_icon {
    margin-left: -8px !important;
}

#school a {
    padding: 10% 30%;
}
#school {
    transition: all 0.1s ease-in-out;
}
#school:hover {
    background: COLOR_SCHEME_3;
}

#profile a {
    padding: 10% 30%;
}
#profile {
    transition: all 0.1s ease-in-out;
}
#profile:hover {
    background: COLOR_SCHEME_3;
}

.formtable {
    border-radius: 0px !important;
}

#content .pull-right {
    margin-bottom: 0px;
    top: 17px;
    position: relative;
}
#content .pull-right li a {
    transition: background-color 0.2s ease-in-out;
    -moz-transition: background-color 0.2s ease-in-out;
    -o-transition: background-color 0.2s ease-in-out;
    -webkit-transition: background-color 0.2s ease-in-out;
}

.help {
    content: url(http://materialdesignicons.com/api/download/62675A10-D453-40EB-8AED-A789A39EEF11/FFFFFF/1/FFFFFF/0/48);
    height: 25px;
    width: 25px;
    position: absolute;
    right: 4vw;
    top: 0;
    margin: 12.5px;
    z-index: 1;
    filter: opacity(0.1) brightness(1.5);
    transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out;
}

.help:hover {
    filter: opacity(1) brightness(1.5);
}

#header {
    background: COLOR_SCHEME_1;
    padding-left: 15vw;
    height: auto;
    max-width: 85vw;
}

#top {
    overflow: hidden;
    height: auto;
    width: 85vw;
    background: COLOR_SCHEME_2;
}

#top_content > .top-gray-bar-info {
    width: 0;
}

#top_left {
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    margin: 0 !important;
}

#logo {
    float:left;
    border-radius: 8px;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
}

#logo_image {
    padding: 0 !important;
}

#logo_image img {
    background-size: 14vw;
    margin-top: 30px;
    margin-left: 0.5vw;
    width: 14vw;
    /*padding: 1.65vw 7vw 1.65vw 7vw;*/
    visibility: visible;
    filter: COLOR_SCHEME_6;
}

#top_content {
    padding: 0;
}

.top-gray-bar-info img {
	visibility: hidden;
}

#container {
    background: none;
}

#top_content .divider {
    margin: 0;
    width: 0;
}

#header_header_ {
    border-bottom: none;
}

.menu_item {
    transition: all 0.2s ease-in-out;
}
.menu_item:hover {
    background-color: COLOR_SCHEME_0 !important;
}

#top_content .text {
    float: none;
	top: 16px;
    position: relative;
    padding: 18px 27px 18px 27px;
}
/* HEADER END */

#leftMenu {
    margin: 0;
}

.leftmenu .col2 {
    left: -15vw;
}

#select {
    border-radius: 0px;
}

.leftmenu .col1 {
    margin: 0;
    margin-left: 0;
}

#leftMenu, #menu_left {
    width: 15vw;
}

.cal-lesson {
    border-radius: 0;
    background: #8ad82e;
    padding: 8px;
}
.cal-test, .cal-preschool {
    border-radius: 0;
    background: #993333;
    padding: 8px;
}

.dayViewTopRight {
    padding: 0;
}

.dayviewtable td {
    height: 30px;
}

#footer {
    height: 0;
}

#main {
    margin: 0;
    padding: 0;
}

#main #content {
    width: 82vw;
    padding: 1vw;
}


.leftmenu .colright {
    left: 15vw;
}

.h2_box {
    background-image: none;
}

.btn {
    border-radius: 0 !important;
    background-image: none;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.btn:hover {
    background-color: #E2E2E2;
}

#absence_con {
    margin-top: 28.6px;
}

.menu_header {
    padding: 4px;
    padding-top: 8px;
}

.menu_item {
    padding: 5px;
    padding-top: 8px;
    padding-left: 15px;
}
.menu_item:hover {
    padding: 5px;
    padding-top: 8px;
    padding-left: 20px;
}

.expand_image {
    width: 40px;
    height: 40px;
    bottom: 12px;
    position: relative;
    left: 12px;
}

.collapsed {
    height: 0px !important;
    overflow-y: hidden;
}

#subject_menuoff .expand_image, #linksoff .expand_image {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    background-size: 100%;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgAgMAAACf9p+rAAAACVBMVEUAAAAyMjIzMzMmhMtFAAAAAnRSTlMAgJsrThgAAABcSURBVHgBYhgxYBSMglGQtQoKVqJJSMEklqBJsAHam0MjAEAggGHHZozIyKgYOgDmaytinGcsYxdBBAkBCQEJAQkBQQRBBEEUQQRBBEEEQRRBBEEEQQRBTNP0vwu7s0JpRPs+OAAAAABJRU5ErkJggg==");
}

#subject_menu {
    transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    overflow: hidden;
    height: 236.4px;
    top: -15px;
    position: relative;
    width: 100%;
}

#monTab a, #tueTab a, #wedTab a, #thuTab a, #friTab a, #satTab a, #sunTab a, #weekTab a {
    padding-left: 0;
    padding-right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 50px;
    text-align:center;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

table[style] {
    width: 100% !important;
}

#week ul, #week li, #date0 ul, #date0 li, #date1 ul, #date1 li, #date2 ul, #date2 li, #date3 ul, #date3 li, #date4 ul, #date4 li, #date5 ul, #date5 li, #date6 ul, #date6 li {
    margin-bottom: 0;
}
.nav-tabs > li > a {
    border-radius: 0;
    margin: 0;
}

.h2_container .h2_box .h3[style] {
    padding-left: 0 !important;
    margin-top: 4px !important;
}

.h2_box_icon img {
    padding-right: 8px;
}

#show_this .h2_innerno_pad td {
}

#news_con_content .h3_bold {
    visibility: hidden;
    height: 0;
    margin: 0 !important;
    padding: 0 !important;
}


/* Main Page End */

.accordion-heading, .accordion-group {
    background-image: none !important;
    border-radius: 0;
}

#search {
    padding-top: 0;
    padding-bottom: 0;
    height: 30px;
    border-radius: 0;
}

.input {
    padding-left: 0;
}

#content form table {
    margin-bottom: 5px;
}

.input div .btn {
    position: relative;
    top: 0px;
    height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input div {
    padding-bottom: 0 !important;
}

#news_con_content .accordion-toggle {
	padding: 10px;
    height: 18px;
}

#news_con_content .h3_bold {
    margin-bottom: 10px;
}

.in, .collapse_new {
    -moz-transition: all 0.3s ease-in-out !important;
    -o-transition: all 0.3s ease-in-out !important;
    -webkit-transition: all 0.3s ease-in-out !important;
    transition: all 0.3s ease-in-out !important;
}`;

GM_config.init(
{
  'id': 'ss-config', // The id used for this instance of GM_config
  'fields': // Fields object
  {
    'color-scheme': // This is the id of the field
    {
      'label': 'Color Scheme', // Appears next to field
      'type': 'radio', // Makes this setting a text field
      'options': ['Ice Blue', 'Cotton Candy', 'Banana Yellow', 'NTI Purple'], // Possible choices
      'default': 'Ice Blue' // Default value if user doesn't change it
    },
    'show-logo':
    {
      'label': 'Show Logo',
      'type': 'checkbox',
      'default': true
    },
    'night-mode':
    {
      'label': 'Night Mode',
      'type': 'checkbox',
      'default': false
    }
  },
  'css': css,
  'events': {
      'save': function() {location.reload();}
  }
});

var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');
var mainStyleSheet = $('link[href="../../style/mainSheet.css?rev=3.0"]')[0].sheet;

var colorScheme = colorSchemes[GM_config.get('color-scheme')];
$(".print-img").css("width", "16px");
if(GM_config.get('night-mode')) {
    colorScheme = nightSchemes[GM_config.get('color-scheme')];
    $(".document-img").css("filter", "brightness(10)");
    $(".print-img").css("filter", "brightness(10)");
    $(".users-img").css("filter", "brightness(10)");
    $(".schedule-img").css("filter", "brightness(10)");
    $(".message-img").css("filter", "brightness(10)");
    $(".clock-img").css("filter", "brightness(10)");
    $(".plate-img").css("filter", "brightness(10)");
    $(".light-bulb-img").css("filter", "brightness(10)");
    $(".calendar-img").css("filter", "brightness(10)");
}
else {
    $(".document-img").css("filter", "brightness(0)");
    $(".print-img").css("filter", "brightness(0)");
    $(".users-img").css("filter", "brightness(0)");
    $(".schedule-img").css("filter", "brightness(0)");
    $(".message-img").css("filter", "brightness(0)");
    $(".clock-img").css("filter", "brightness(0)");
    $(".plate-img").css("filter", "brightness(0)");
    $(".light-bulb-img").css("filter", "brightness(0)");
    $(".calendar-img").css("filter", "brightness(0)");
}

console.log(colorScheme);
for(var c = colorScheme.length - 1; c >= 0; c--) {
    console.log("COLOR_SCHEME_" + c);
    css = replaceAll(css, "COLOR_SCHEME_" + c, colorScheme[c]);
}

if(GM_config.get('color-scheme') == "NTI Purple") {
    $("#logo_image a img").attr("src", "http://gymnasievalet.ntigymnasiet.se/wp-content/uploads/2018/04/NTI_logo-black.png");
    $("#logo_image a img").css("filter", "invert(1) brightness(1.5)");
}

if(!GM_config.get('show-logo')) {
    $("#logo_image a img").css("visibility", "hidden");
}

//console.log($(".accordion-toggle").css("data-toggle", "collapse"));


///// Code start

/// Add Stylesheet
style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
}
else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);

$(".collapse.in").addClass("news-entry");

if (mainStyleSheet) { // all browsers, except IE before version 9
    for (var i=0; i < mainStyleSheet.cssRules.length; i++) {
        if (mainStyleSheet.cssRules[i].selectorText === '.collapse.in') {
            //console.log(sheet.cssRules[i]);
            mainStyleSheet.deleteRule (i);
        }
    }
}
else
{ // Internet Explorer before version 9
    for (var n = 0; i < mainStyleSheet.rules.length; n++) {
        if (mainStyleSheet.rules[n].selectorText === '.collapse.in') {
            // console.log(sheet.cssRules[i]);
            mainStyleSheet.removeRule (n);
        }
    }
}

$("*").each(function(index) {
    if($(this).css("background-color").length > 0) {
        var color = $(this).css("background-color").replace("rgb(", "").replace("rgba(", "").replace(")", "").replace(" ", "");
        var red = parseInt(color.split(",")[0]);
        var green = parseInt(color.split(",")[1]);
        var blue = parseInt(color.split(",")[2]);

        console.log("yeet?");
        if(red == green && red == blue && red > 0) {
            console.log("yeet");
            $(this).css("background", "none");
        }
    }
});

$(".schedulecell").each(function(index) {
    if($(this).find('a.schedule').length !== 0) {
        $(this).addClass("schedulecell-full");
    }
});

var menu_item_heights = 0;
$("#subject_menu").find("a").each(function(index, element) {
    menu_item_heights += $(element).height();
});
$("#subject_menu").css("height", menu_item_heights);

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
