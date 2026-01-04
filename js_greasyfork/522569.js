// ==UserScript==
// @name        Mangaupdates Manga search v2
// @namespace   MangaupdatesMangaSearch
// @match       *://www.mangaupdates.com/series/*
// @grant       none
// @author      UnknownSkyrimPasserby
// @description Adds search links for manga/novel websites on Mangaupdates.
// @version     2.0.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/522569/Mangaupdates%20Manga%20search%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/522569/Mangaupdates%20Manga%20search%20v2.meta.js
// ==/UserScript==

var searchMangas = function() {
    var muMain = document.getElementById("mu-main");
    var titleDiv = muMain.getElementsByClassName('releasestitle tabletitle')[0]

    var title = titleDiv.innerHTML.replace(/\(.+\)\s*$/,"").trim();
    var titleEncoded = encodeURI(title);

    var div =  titleDiv.parentElement.parentElement
    var child = div.children[1]
    var newDiv = document.createElement("div");

    var node = document.createElement('style');
    node.innerHTML = 'div#searchscript img{padding:0px 5px 0px 5px;}'
    document.body.appendChild(node);

    newDiv.innerHTML = `
    <div id="searchscript">
    <h3>Search</h3>
    <a href="https://asuracomic.net/series?page=1&name=`+titleEncoded+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAV1BMVEVHcEw5OUEhISEjISU5OUElJSY5OUEtMjM5OUE5OUEcIBQjIyQgISA5OUE5OUEgICAdHxgqITUZHw8yMjhZLYNJKWkrKy47JVJmMJgGBwIAAADBwcBycHToNOWMAAAADnRSTlMA1NqU2f6iHvyTpKLV2kgHe3sAAACcSURBVBiVNU9bEoQwCKva2lZdgT5sXff+51xAzQcTQmCIMQwfbQif6M2DeX8w3/0g/ICD6/DOMyCqwh4vc0ytJszMvInqL6V2dEyjsVxdp4TUiak1gWvDL8CZGtOgAu3Xfl4/UoFXMjZxkFy1cvTAigDQwMlRzwZSASrmzO+vgEX71BOs8uqGJYmAhbY7zFLpFpY3rp9G58ZJ4/8BckMMR1/l5/sAAAAASUVORK5CYII=">Asura</a>
    <a href="http://mangakatana.com/?search=`+titleEncoded+`&search_by=book_name"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAM1BMVEVHcEwbqeNCuOhRveoAnt8kreQysuYAn98Al9wVo+oKp+Jiwuuw3fPI6fiV0vCk2fJ3xuxaL/dgAAAACnRSTlMA////////7wQOX11N2gAAAHtJREFUGJVdzNESwyAIRFHEXdKqoP//tcUmzUw6vniPghSSZqaqtdbeTZ5gkPev9dsvkfOHbTAcIgdNs3s2gZTShheG0xs9ZcMkfdrEwAkzWDxa7PcTdOno8OgXjBzqNQfuEVuLCwGEbmCxBpQ81w7yut7w6L0DT/hrfAAdjAW2x5ZR5AAAAABJRU5ErkJggg==">MangaKatana</a>
    <a href="https://mangadex.org/titles?q=`+titleEncoded+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaElEQVQ4jXWTS0iUURTHf/d+M874CE2alLDxNaj5Cl8tKsSUiJJqVaCEBSVRm7AIDN1VIC0k2yToQmithBBEpIsgaBHVOHySmYiDlVH5wMc43/jd28IcH41ndTn8z++c/zlcwY7ILy4vRdlXEeIk4AUQMKW1fi0M1fs5EAhs1YuNh8/ncxnuPV1o3QxIt9PB2aIc+v3jKK03ZArodhBpMU3TigJ8Pp/LcCW9BGpyPXvpqC7gUEo8q5V1VN5o2zkkIIYdWKdN07QkgBGX+BioaTpSyGBZEkVr86w03ePXn9kYxQC61sbZCWAUlJSUgOxpqMgX7Ym/kdYq4doLqLSDJL8dJMeTyvsfc6xG1nZSKtI8af1Gy+07fckOmffIs4QMh9b5KftwDzzFOTNFfmSWS4UZ+CNOpueXtgKkFsIS/pFAKDvd4066fxlhhXcZGX7WN1Pb3olt25tGwJTpaftd2hWPdfxczEI7MZkZbzGy6gTlZYe3rxIypVLrJwqfasQ6egaE2CZaOpDLTF0jiyur3LzeTFJ8/HaIfyQQysr0uqPGZoI4Jk3E0gKLngzCOaVIw4HLFUfcosWzrh66Xg1ELTiCweBYVqY3OptK92Kle9FasxYKgW2jlI2tFCsJBv3mu83uWg/Jr+MTbbZS/3kXG1aEwDAMpBA8eNjB9Lfv0V5KGt0C4G5r2/Pl5eXzMbf4L+bm5vnw8dNmQusnY6P+Ww6AqonhhvrkuG6nFJm7EhKAYykARJSeerFgtV4c3fKZAHRzXR5SXQEtY1OEQsk+0TP0JZrZKdHXqrNxGqkx6yP2rOh9M7k19ReTjOAHa5i1agAAAABJRU5ErkJggg==">Mangadex</a>
    <a href="https://www.toongod.org/?s=`+titleEncoded+`&post_type=wp-manga"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB6ElEQVQ4jWWTzWoUQRSFv1tTMToTf4LoTlRQ8QH0AVzoC8SVKC70MSSLkJdw7S6YKCJZ6QsILgUhEpyFxkTIQDLTMqbrHhdV3dODDdXVt6vu4dxzzzX7sHUFYx1jBaNPEBjtkgGhictZoMLYAFYjYh14XK6BGwrG3KP2lXcxAJ5iEHFWMEJJxxDXdcBZ/rQpOBzbab6HSwgDFyVjJRY08MxhgcRa2OBe+EIqqD2cjye3eebPOTnTz/W4wFiKuUjRBTE55k5TiJlDStikAvWgv1hEEWbbb9QVyIK45XtcmI4yrOWyRlpkJy3jIcBSP4MYHvECFjJipMeTmw+4MzhLcgeDngU+He6z9vUzckfjKlPrLxJbpTyDBMHdc+e5f/HyXCPc66yIwFxoUoFENDGndm3wcneHg+MjHl27gSReDb/xbm9I8hmgJcGkIqBcPmUlF5u/frL9ex8QAt7/GLI13CW5srOa+559UMQrTBwIETuVlTaENVZsqc46N2ujd0C6xuvGc/8a0TULuiB/kzOaTst3aik3jm1ALLx+O8YYdL2gAMsLkasGqmuGkzGjeoo1Q9YOF0cRsUk7TMVdDqOTmsNUQzXBUsLCf451xGZEvCgnD4F+pqFMphfRYAkmY/DUlGpAhbOBafUfBE/oaKgl5rUAAAAASUVORK5CYII=">Toongod</a>
    <a href="https://manga4life.com/search/?name=`+titleEncoded+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEVAQEBtr+Y/PDpOZnt8eXbY2NhXgqhAQD89PT3W1tY/PTpaWlpsrOI9Ni4wMDBpptk1NTVmns1GUVxQa4JdiK5oo9VilcFTcYxgYGBMX3Fuseq+vr1ES1FVfqHMzMyurq7/Nh4iAAAAfUlEQVQYlW3PwQ7CIBAEUKgF2nVgQSnVqvT//1Kw0RR1kjnMy15WiN8YY179bCKqpaGkbDpILDZA6l6pY5GugDwx0MAZFcY3MCJ4D1NgJLmHBMQGNKYGeJZpg4vY4LrECmpUN1+Awx2z5kefc159ObHW2I5sNzjn/J9fv/MEjMEHGQhRG1oAAAAASUVORK5CYII=">Manga4Life</a>
    <a href="http://www.mangahere.cc/search?title=`+titleEncoded+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUElEQVQ4jWP4//8/I7E4JavY+/iRI67IYkwMDAwMAoIiIgH+QRoMeAC7sTeTqppC3ao1ayOQxZkYGBgYPn/+4Pf1+5dzK5YvW9O2eq2L04zFLOgG1OUme105c9Ls/oP7PmvWrBZAMeDfX4Ybe/fs+7Rz154gxls3d6VK8J+ZdfpqlvOyYxIMDAwMXKqeTI4GmlVmZuYMnj6+Yro6ui5wk2F+YWBgieXl5f2/fv2G/9+/f///9++f/88+fP64Yf+RjWYOHvWLFy/9u37bzptxcfEPP378OB8lDCCAd9nnz593TJ48iYGJiYlh2cbN/x7fus5jqaXiF+hu13DmxGGm7bc+1pw9e3rNz18/jTBcAHEFgyYDA8PXZcuW/X//+ctXFeegTndf/7eJySn/yyuqnqpWzeHn5OQI37B+/Wu4HvSoYmBgmKipofF/1coV/wPS8zczsLDLC4iIbvSPjJsIlbeuq6v7jM8AeSYmpo/u7h7/YyPD/uoV9VkyMDCwMjBw8ELljcPCwu5jCQO4lx79+/dvw69fPxlKKyqZotT4Y/7////n///vXxgYGBh4eHhkjh07tg0lGrGAJadOnWL49fsvgwgnuwVMcPLkyWyKiop6pqamdXgNYGJkPPPt69dX9+/fZ+BlZ+GbO3M6GwMDA4O6uvo/ExOTrnXr1r3DGgtoYXG4u7v7f0tH90l8+QMjycIAJyfnl2PHjjGwsLLNw6UGpxdSYuL5ODjYtTZv3jxDRloKrwEYLli2bJmYiIxE2ocPH3P+/fu3BZ9mBgYGBgDQmXSqEfk4bAAAAABJRU5ErkJggg==">MangaHere</a>
    <a href="https://manganelo.net/search/story/`+title.replace(/\s/gm,"_")+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAk1BMVEV/xsrwXVUiICEAAAA6T1GF0dUgGxxdLy7///8bHiD+YVnw8PD9U0nwY1zvWlLX19dUAAD/1tP+9vXvST8PLzJZWFits7P8x8T84N93x8vG0tOUkpLg4ODx3t35ysjvUUeNzNBramusq6tAAAD/u7j0nprw+/zyg30dQ0bBwMBbCADZ7e7I7vAvSkwXEBFeKCX/sa2uGEK+AAAAf0lEQVQYlZXPyQKCMAwE0MqApAYEwVbqBriv6P9/nT0EvOoc3yEzUconCsdBoOPJyEf9DICOk3Q6ADJGPivKHuZsCHZR9eCWK6zNJt3WAg2j3fH+cJQb7tTCksmrs0BDF/AVt0Jq3f3x7Aj6RaUARaGxfse7/g7r4Jcm//0ywAdJKAho9fZzKAAAAABJRU5ErkJggg==">MangaNelo</a>
    <a href="https://mangapark.net/search?word=`+titleEncoded+`"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVQ4ja3TsWtUURDF4W/CksJCRKwkSMoUIaQUixQi4WEpQTZWQSxSpBJfJ1Z2mz/AUkT0IiIWQR5WkkKsLCxFLCWVWCwhBNmx2Gf2bTRF0NPdM8Nvzh3ujcwM/6CZ40ZVl15Vl6W/+AtVXeaO+71Jw/PZzLgZkXeJuepeWWq2+3st7D6uYwf9ExLEfIRHxLJ0QbjRFm5jDWewWtVl/qQrfMHHMQtsVHWZkd6So7bnnDwCTwOaQX8kfejUlrEorBLdQbequvT+ALSTr3ROPWxhA/vyqGexhU8DqrpcxAIOO5A7OCtzUxi23qzxTo4lSJdxHg8x6kB2RRS86XhrVV1mpwHhKn7gpfFCf+tpM+j/xJOcLPMSVo4AVV1mcA1D7Emv28YDma/GCXM3Mr52ks9NEmQutNQeesJj7ONds73+HZrt9SEtjBd4xuQlrkgjYQcH+Cw9EL6ZUhQsYqsZ9A8hMjOqumziUzPov3dKxX//jafVL63odS/kwxJ1AAAAAElFTkSuQmCC">MangaPark</a>
    <a href="https://www.novelupdates.com/series-finder/?sf=1&sh=`+titleEncoded+`&sort=sdate&order=desc"><img src="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEWFjZW2ur+iqK5QXWqrr7WwtbqepKrv8PHa3N/FyMwtP1EcMkcYMEUiN0r///+0uLwAJT0AACZzuHDZAAAACnRSTlP7+Pf7+vz4+vv51JBAVwAAAExJREFUGJWlzlEKgEAIBFCr3dRG3br/ZQsilD5rwJ83gtL2Cn0F4J4HvHWg9QTTYKggNyiCZVgBniIKYOVjrmAqy07kedau0v3f6yUnRm4J7ylIXjAAAAAASUVORK5CYII=">NovelUpdates</a>

    <a href="https://manhuaplus.com/?s=`+titleEncoded+`&post_type=wp-manga">ManhuaPlus</a>
    </div>
    `;
    newDiv.classList.add("p-1", "col-12", "d-flex", "align-items-center");


    // <a href="https://manga4life.com/search/?name=`+titleEncoded+`"><img src="data:image/x-icon;base64,">Manga4Life</a>

    if (child.nextSibling) {
        div.insertBefore(newDiv, child.nextSibling);
    } else {
        div.appendChild(newDiv);
    }
};

searchMangas();

var timeout2 = setTimeout(searchMangas,2000);