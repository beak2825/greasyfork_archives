// ==UserScript==
// @name           APEX favicon
// @namespace      iminglei.blogspot.com
// @description    customize favicon of websites built by Oracle APEX, mainly for APEX Env.
// @author         Ming (Tim) Lei

// @compatible     chrome Works with Chrome and Tampermonkey

// *** if you want to define regexp include and exclude rules, 
// *** please refer to https://wiki.greasespot.net/Include_and_exclude_rules

// @include        http://apexdev:*/ords/f?p=4* 
// @include        https://apex.oracle.com/pls/apex/f?p=4* 

// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/30566/APEX%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/30566/APEX%20favicon.meta.js
// ==/UserScript==

// canvas https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// gco: default setting for canvas property globalCompositeOperation
// fs:  default setting for canvas property fill style

// fav: default Favicon Data URL, supporting HTML img tag src source file format
var gco = "destination-over",
    fs = "rgba(0, 0, 0, 0)",
    apexFav = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACVklEQVQ4T4WTTWgTURSFz8tMOo3F0mhbWyuCdGKFgAUrIkgpVhQqFNOF8WehuHGl0IWCFIWC4lYRXVlFQTd1o6uCC//AbppWpCrYZGhSLaRRkpLEJvPz5sq8aaZGUh2YzeOe75137r0MAGiy/zgI42haUlj4s+Gc/eszzg9Ng9geX6lwjHliUB5AIxYzCouuD4l9mI3vfnBTRbEAEIHR+36CI5YoDI5vusGhtGZrOpmcmk5IPqnT5hw9d68B3JxlNB6uQ0erDjgcG5A2ALwIbNlYz0ITeuUpJx4txAd3lNU2ZCDLMvx+WTuwb6/KRAYOZOtmFwKCjiAUyiJRWKoPHU3o0YepuOSDurBs4uTOMu1qyM0f7uvtdLQCsAYJ6oIBQskAAgpDdO5pwhGncqaoszhpU5dCakXnATxIe5Pn5GLyFjJWG1I5S9Rzm7TYH+IqB1VO2hv1C/MVsSlMcRvazOW1m2s6qBxGxpJxiUFdyLniNjmN593DkLa1VgVb00HkfjLucwLLror9abzoHgZTmuEzfiCxkhfB1nQQGUvNMdihVNYSN1s2aR/3n+5kzBYNKlkKAnIJaDG9OfFCzL++8+5MYrA3uXozJ9I+XelSKdbjR5GMSotLuo1AoAFI58XEunNAYPm392z+6yf6Zk+JtL+MdHmtciHchbA6EC/DlJtRl84oArD86vZ3e2W5Q5BgvwkOXj/49zKJYWuRVlvszopbD2Dg3Ag9GZIWN81I29noqL3eJgonBcN1Qs5vRdnA2atHJh7fePm/FfbmxIHky4YQH/r67DfkFioTnFQxhgAAACF0RVh0Qm9va21hcmsgRmF2aWNvbiBDaGFuZ2VyADIwQ0JGOUUxrigt7wAAAABJRU5ErkJggg==",
    apexFav_blueBrown = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEElEQVQ4T4WTy2sTURTGvzOTTMZXIqaR4qLVpJHEKIqoZSi1CY3+Ae50qWDFRUUF0aUK4msfl6LgY1NnUV0US5Km1WpLRdBGneiuiAoK9ZVMHlfuZGacMZHM7s493+9855x7CAAmFAwJQC79FMTPnb7xm94nBChrVrIkWWIGLBPg7wTZumPX9PnjLwfW+mFko8cKGBenfQhOVlAlj4Thgt7Wyc49yixrsH7RI+DaqTmIAhaMQA6xbP+sA6tE4F8nPUfGFuX3arybPqFaq6Km67Nzz6YVO5MTsgwJIUHH4EyzJz2H1SJRIyYFN0Eu3sa6H6/m89mJ3fzOZZVDRAI8BIg+GdDLOBhT34CxmNQVNk0KJe3KtqjluKXWwgCYASBgNJzBR+8GWGIGQStdTmx2Tqlts54Pgo1GbpjiSDOeSNMubXGJW0qwyL1Hx4sAi/m6uJjQrS8h82I/EpONloQtP3pHHrrFlSVkFvbhS4UhJDEksu6+uQAbjz1aBBCXzMwE0sZmonbDfosyVtTLLogNODkcyD6I3kv6Qn3mcEh7ezFi1Pw69fedkCTj+68y+gtNJzbgRCrA1vtF3No+z6NL7y6E7cxOSLkOyCLwue5FaqpKBuB0OqAFV4t9TRrLnVO/pdotlNOJ6x1cv5tjtfsHPpxVv5oz+/8+OiECkKSrd6aGzhzam++0ws57DuHieBb5P3i5rtYizuGBAAAAIXRFWHRCb29rbWFyayBGYXZpY29uIENoYW5nZXIARDhFRUZCMTj5qkd1AAAAAElFTkSuQmCC",
    apexFav_orangeBlue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACWElEQVQ4T32TS0wTURSG/3vvzHRKSqWg1Y1tXZkgSkBoS62JQnQpGreYGB9LTbe6MDEh6kKSRpfGhYnxnVBJSIwNpJiWPjDY6EqErWAIpiJindc1M9OWVoG7nHv+7/z3n3MIzBN5OwGwfmhyBIUjWevbNkd8kCjB0HbozS0jpCYGsSVUDCN9NL+Vvruzg3+6eA1wuQFCQBCZ4DDFXDgGoqckkULRlD5kTuT+hYR7urihGyCMYvbKMMCknwTRyRAM5CwIIYC2Dggu4NdyFMWzmSrkxfm9RmLBQb7BC1XXoKkapmdmTQVgQTi1ISCQeAkK9cAtsdDqZKTw8oJPVzROfR4Jz+dkfF73IDmVtrSVh1chQsUJIIsEZcXAq/1DhqrbYrNYYEQLjsyLVWcbgKoTiBUnFPf8MXjFJfg9dr1IofaMLEj12TQCahA5dz8Qg1dYgr9VtDqLlKjdd+cbxI1PqMMmLvk0VQfzt9q2F9XdOP0xDqP0NYriYC3YTQGvq+K2DfFgMQ7+ZwVc2gV3Ew2uvuma2TSDsctmZ8ICbbZtgRLlUPaJVP07slBGWXcCGu9D5rA1J7UMmgdi5UeBUce+SmdT3HFnzoH+6SA0R96uJJAlhvLvNQAtYaQP5G3AmWed7pV3RebaiamDTyFQKO23vzhqsZgQXc5b/QwFYE6I+jJUvidsAdzHr3LW5LEm0eC0/GP8hvO/XYhmQ2DOHAitXNmTawHGHw7zc6M6vq8ZvUjdfL/lIg586IXOCrWx5zRJxh7fip0auh7fdn/rL02IIRbAaRKp9pN/AZDl1NpQpNojAAAAIXRFWHRCb29rbWFyayBGYXZpY29uIENoYW5nZXIAOUVDODM5Q0TUpETAAAAAAElFTkSuQmCC",
    apexFav_greenBlue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACVklEQVQ4T32TX0hTURzHv+ece+/uRJdztXpprqfALNF0m2tBKfWYRa8GUfZY7LUegkCqh4RRj9FDEP0HlyBEosxQ98ewUU+ZvpYhxjKzdf+dOPduaxPXPW+/8/t8+J4fv0sAIIo3kwDrM6BGcziSFrX/ffflZMGCsaPJbB4hZRggNkMhR2ZwNFtP0NHVzi9+vIpGeEDEiWKSC5hDOkZgpmSFwtC03lmcyGyVdEc6uWlZYITi8sIwGJSfJIapsAVkhEQcA5uQ0IhfWI3lcXa2LDn/fK+1nHQRfPPD1A3ohoH5uQVi5xYSDmpL7DRKAVTzQvGw8NR6NHfhRcA0NE69AQWLz1RsfvJiemLGZp2HVyRSKQkgqwRa0cL+l4OWqTuw6GYSMUZCS3KZqwjKEkAuJaFovRuH7F+Bt9XppzL0ke5lpXo2NYJ/EjUTvBeH5F9Bi4CJgIl+p2upBq55QrV1KBkwTB2spdWJrX/djQ+nEyhYX2J5DFQGu61g6JUD+6rg/EACf/gaFL4LDR4aer3eOb/tDC6NCZgwX7AUWyJa+tBjJwYIJLUIs+iGAd47i8P2nlRm0N8ULwYfjrp8+5x+KhHtdvuiqw9zIQOurNNIoKgMv4sbAJojMzjg1M/gacea522+ke3EweknoBK0W22fXeWYQmJCzQqBBQ0MbpjyKri+J2ILjnuu8AbmtTeRW7Q4/uO6e+sax5AOM7gzBLR05WyuLXgwPsxHz5nY+G71pHDjXb0fqR/ve0ywXHntOegEeTR2Mz546lqiHrS1LiQW5JyAU2g7+Repf9TaglyqzwAAACF0RVh0Qm9va21hcmsgRmF2aWNvbiBDaGFuZ2VyADUzRTE5MTdGEwlZ8AAAAABJRU5ErkJggg==",
    apexFav_pinkBlue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACLElEQVQ4T4WTz08TQRTHv7PTXVutNUVbT3ZR0dAQDAqkgWJ3kZsX/QOIRuRkJOHsARPDQQ8aoicPmngRSVQOVg9GpaWFNDE0hJDW2CUcxagBDdGy7e6Y/cGWTdHO7c287+d9Z94bAmO97ZFASQoD88SMGyz++cM5AL1sr08mjpjgF4AAzv0fcrrtVHb5xnAcAT9ACAje9zIY4u8/Qwgd2BI4HqqU3tVJrKMzx5geIxxFfnwEoFzeSvxgQkwiflcBvwdIzLkgT49cKiT3rEa/hoFKVYNareRy+Y89taRU3IYAwgaDGuSAs1nz/FnkckFjLBoRgpjyfsan4ObCu2ymyzhzW521ISDwEh5lXcXU4MmiznRTbCRTcEps5d6J7Xeuv2umz3LCAfdHRYTXeIh80Mz3gCjdO8T1Drax833swWgzwmseiHyTXZkoXSt3ncr/dgDgReRKUQdaRcESfzlcwcWJJejdqTrHdRsvI0NFHaxVFA464gsTi2A/tsBCAtA569K4gmnxakEHizbzlpgDUTomcy1WiwFv2YOyTwPO1ObEAey/Ls88eXVcPmpXpiBKe+mOdeeFBDMJBoQKKG/+AeJWix1A4FqC0UN+pCfbYYjbSrfdD5aXrO6oOuCj4L9pqAxkjNEDAiNyiTbtazEmkXFIbYwl+3f9T4sSA2fXtCfXjF6PP2KD2vTq+s3ksUY/EUtybewpZPLm1mPp/NhQuqFwZ8JyPwOFjOhM+i+c0rKbbLvcigAAACF0RVh0Qm9va21hcmsgRmF2aWNvbiBDaGFuZ2VyADUzQjM0NDlE8OBsvAAAAABJRU5ErkJggg==",
    apexFav_greenPurple = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJElEQVQ4T4WTS2gTURSG/5tMGqNu1C6iO8GJkPjCgkXTJpOCQtHiC4rZCF24qyCoIIWugusi6spKXeheV+4yU5OoFBsCJkU0YBoQSpWJ1WoekztH5k4eDqlmYGBm7nzfedx7GAC8Pk1R4tDCScas937XtcsNFQSlVmUKa8MgGwur/5fk8ll1/u4hZfMnQASwzBiRBVtgRiFq8DpiqW1bZvIu9/YVAxvl3MSD2SGYHJr4MROzJWQC7u0A3wRG0s5MnpTj+f21syGs+yFJEjyegdSJoVORTqR0xJaIe1cdpHsxmrElC6uTBQZ38LtRhly7gp36waVo5MywteZINT1CVllC0kAVXubDx2eTKy64gxVjVfTIBC/ePLAktxvdU2sq3M2kNHcdTf86Ks0WTM3iLXm5A/dk0LamThJ9npu2YRGZROTbctYB/1PwuHSxALiCFaMsYGnNj6M3niO2LPVk3PNhvnShwOAK6i3YI+AX8A4yNL66oGSdu+MQPCqdzzNyhXRRs7Up/NNwPCczk4nNaXqrkKo+KLmupCNQ7/9Qi+euKrpR6sB3AvmAVad2vNvYulmFb4cPkTe2pCPQHm7Qr28c7+NR0bCZwIqjYdoxW8IGAF4jSIMGIqrXtiTvbXz5XeH7xCEwoU0kdse2Gij1SCuT1lkRs2A9T82M0yX307WJxJ69/SZRPdw69lYwDoVNzY5HFxIvF/uBf68nQ0QWPPaBLf4BR6gBCttrc5sAAAAhdEVYdEJvb2ttYXJrIEZhdmljb24gQ2hhbmdlcgA4RjkzREFGOQtGGXwAAAAASUVORK5CYII=",
    apexFav_pinkAqua = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4T4WTT2gTQRTGv9lsGqNe1B6iN8FESNSKBYu2TTYFhaLFf1DMRejBm0JBBSn0FDwXUU9W6kHvevKWTU2iUmwImBTRgElAKFVSq9X82Z19MrubtUsqGdjD8N7vm+99O8MA4Ay9iXFQOsWGmdj3Wlfa11UClAZrKqwDk02pPUSK+YJ678i88gubIBDYGOVIwAJUKEe81UZmR3xbJ4V371+DsVFucMwOPgSHkTYb47aIAcJOeLAJjiwbcYnUEk+LzXMHI2sBQJZlePu8mcHTJ6NOU5SyphPx7WkBdR8hx0bNenVyoQQPC2u1H2heDaJ+ePdS9GxsSNRcp4xQloSEmUejDeb34fnkpxV4pLBWXbdS4kb50NKtYCforlmHKeM4mbtZQWBNh27DpBvl4PJtB+5y0FE9RRmau/HFhM2ThSVulIP5Oy74vwKVS09KkBDWaha8GpAx/WIAy3L33+kaoXJxvgRJBFa3YS+mXw6gn/nwTWojzxQX49pULjwuksQietWCwelzojAUNJhoI/gaOhp+GYUtIo7Ag5+qev5aWdEq/+BQ8W5IzHmC0k6wRqOFXX4/3jLrCjgCjzbS9J3/RiL2wQwstDLjCuy4LdIHhiZx9GsyVF/U9Ib7G6mv6/zPAXEDDCCd3DsR3+5BHSPVdCKWdenIcjAzPkWeZ5dXk/sm9vd6iUdtEQFzQGGz41Ox5KuFxV7g1nqEUiTgj2xs8S9MmwEKzG6Z/gAAACF0RVh0Qm9va21hcmsgRmF2aWNvbiBDaGFuZ2VyADI3NkUwMzZGC/DnPwAAAABJRU5ErkJggg==";

// user configuration for regexp rule and favicon rendering properties
// env: name for different env
// matchURL: URI regexp. *note*: add subset-regexp in advance
// dataURL: apex favicon URL, checking support img format from CanvasRenderingContext2D.drawImage()
// canvasGCO: setting for canvas property globalCompositeOperation; 
//            here default is "destination-over", which will add setting color as background of default apexFav
// canvasFillStyle: setting for canvas property fill style, work with canvasGCO to render favicon
var userConfig = [
    { env: "DEV", matchURL: "^https?:\\/\\/apexdev:50086\\/ords\\/f\\?p=4.*", canvasFillStyle: "green" },
    { env: "UAT", matchURL: "^https?:\\/\\/apexdev:50080\\/ords\\/f\\?p=4.*", canvasFillStyle: "orange" },
    { env: "PRD", matchURL: "^https?:\\/\\/apexdev:50088\\/ords\\/f\\?p=4.*", canvasFillStyle: "red" },
    { env: "apex.oracle.com", matchURL: "^https?:\\/\\/apex\\.oracle\\.com\\/pls\\/apex\\/f\\?p=4.*", dataURL: apexFav_blueBrown, canvasGCO: "source-in", canvasFillStyle: "red" }
];

// remove original favicon
// if you want to change this script for other website without APEX and jQuery
// you could add require for jQuery , and change apex.jQuery to $
apex.jQuery("link[rel*='icon']").remove();

var link = document.createElement("link");
link.setAttribute("rel", "shortcut icon");
document.head.appendChild(link);

function transFav(g, s) {
    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(favicon, 0, 0);
    ctx.globalCompositeOperation = g;
    ctx.fillStyle = s;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fill();
    link.type = "image/png";
    link.href = canvas.toDataURL();
}

var favicon = document.createElement("img");

// match, set and then break
for (var i = 0; i < userConfig.length; i++) {
    var re = new RegExp(userConfig[i].matchURL, "i");
    if (document.location.href.match(re)) {
        var g = (userConfig[i].canvasGCO) ? userConfig[i].canvasGCO : gco;
        var s = (userConfig[i].canvasFillStyle) ? userConfig[i].canvasFillStyle : fs;
        favicon.addEventListener("load", function() { transFav(g, s); });
        favicon.src = (userConfig[i].dataURL) ? userConfig[i].dataURL : apexFav;
        break;
    }
}