// ==UserScript==
// @name         YHUU Embed
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Download film information from Filmweb
// @author       TheWorstSuppEver
// @match        https://www.filmweb.pl/film*
// @match        https://www.filmweb.pl/serial*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=probot.io
// @downloadURL https://update.greasyfork.org/scripts/452644/YHUU%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/452644/YHUU%20Embed.meta.js
// ==/UserScript==

var response = "";

(async function() {

    if (window.location.href.indexOf("https://www.filmweb.pl/") != -1)
    {
        setTimeout(function()
                   {
            if(document.getElementsByClassName("ws__skipButton")[0] != undefined)
            {
                document.getElementsByClassName("ws__skipButton")[0].click();
            }

            // zwiastun
            if(document.getElementsByClassName("videoItem")[0] != undefined)
            {
                var link = document.getElementsByClassName("videoItem")[0].children[0].children[1].children[0].href;
                console.log(document.getElementsByClassName("videoItem")[0].children[0].children[1].children[0].href);

                var request = new XMLHttpRequest();

                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        response = this.responseText;
                    }
                };

                request.open('GET', link);
                request.send();
            }
            else
            {
                response = "-";
            }

            var yhuu_embed = document.createElement ('div');
            yhuu_embed.innerHTML = '<center style="margin-bottom:5px;font-weight:bold;">LINK DO FILMU:</center>' +
                '<input id="yhuuu_link" type="textbox" style="width:100%;margin-bottom:1em;" /><br>' +
                '<select id="yhu_jezyk" style="width:50%;">' +
                '<option>Napisy PL</option>' +
                '<option>Lektor PL</option>' +
                '<option>Dubbing PL</option>' +
                '<option>Oryginalny</option></select>' +

                '<select id="yhu_wersja" style="width:50%;">' +
                '<option>CAM</option>' +
                '<option>CAMHD</option>' +
                '<option>360p</option>' +
                '<option>480p</option>' +
                '<option>720p</option>' +
                '<option>1080p</option></select>' +
                '<input id="embed_send" type="button" value="wyślij" style="width:100%;margin-top:15px;height:20px;" />';
            yhuu_embed.setAttribute ('id', 'yhuu_embed_div_id');
            yhuu_embed.setAttribute ('style', 'width:100%;border: 1px black solid;padding:10px;background-color:orange;');
            document.getElementsByClassName("filmRatingSection__filmActionBox")[0].appendChild(yhuu_embed);

            document.getElementById ("embed_send").addEventListener (
                "click", discord_msg, false
            );

            var tytul;
            var gatunek;
            var czas_trwania;
            var streszczenie;
            var zwiastun_url;
            var okladka;
            var ocena;

            tytul = document.title.substr(0,document.title.length-10) + " ";
            gatunek = document.getElementsByClassName("filmInfo__info")[2].innerText;
            czas_trwania = document.getElementsByClassName("filmCoverSection__duration")[0].innerText;
            streszczenie = document.getElementsByClassName("filmPosterSection__plot clamped")[0].innerText;
            zwiastun_url;
            okladka = document.getElementsByClassName("filmPosterSection__link")[0].children[0].src;
            ocena = document.getElementsByClassName("filmRating__rate")[0].children[1].innerText;

            localStorage.setItem('tytul', tytul);
            localStorage.setItem('gatunek', gatunek);
            localStorage.setItem('czas_trwania', czas_trwania);
            localStorage.setItem('streszczenie', streszczenie);
            localStorage.setItem('zwiastun_url', zwiastun_url);
            localStorage.setItem('okladka', okladka);
            localStorage.setItem('ocena', ocena);
        },5000);
    }

    if(document.getElementsByClassName("page__header page__header--left ")[0] != undefined)
    {
        document.getElementsByClassName("page__header page__header--left ")[0].scrollIntoView();
    }

    function FilmwebDownload()
    {
        var search_name = document.getElementById("embed_embedname").value;
        search_name = search_name.replaceAll(" ","+");
        window.open("https://www.filmweb.pl/search?q=" + search_name,"yhuu_filmweb","width=400,height=800,location=no,scrollbars=yes,status=no");
    }



})();

function discord_msg()
{
    function hexToDecimal(hex) {
        return parseInt(hex.replace("#",""), 16)
    }

    var zwiastun = "";
    var temp;
    if(response != "-")
    {
        temp = getFromBetween.get(response,'contentUrl" content="','" style=');
        zwiastun = temp[0];
    }
    else
    {
        zwiastun = "-";
    }

   // var original_name = document.getElementsByClassName("filmInfo__group filmInfo__group--originalTitle")[0].nextElementSibling.children[1].children[0].previousSibling.textContent;
    var original_name;

    if(document.getElementsByClassName("filmCoverSection__originalTitle")[0] != undefined)
    {
        original_name = "*" + document.getElementsByClassName("filmCoverSection__originalTitle")[0].innerText + "*";
    }
    else
    {
        original_name = "";
    }

    var wersja = document.getElementById("yhu_wersja").selectedOptions[0].value;
    var jezyk = document.getElementById("yhu_jezyk").selectedOptions[0].value
    console.log(zwiastun[0]);

    var myEmbed = {
        title: localStorage.getItem('tytul') + " " + jezyk + " `" + wersja + "`\r\n" + original_name,
        fields: [
            {
                name: "Oryginalny tytuł:",
                value: document.getElementsByClassName("filmCoverSection__originalTitle")[0].innerText,
                inline: false
            },
            {
                name: ":movie_camera: Możesz obejrzeć na:",
                value: document.getElementById("yhuuu_link").value,
                inline: false
            },
            // {
            //     name: "Sezon 1 , 1-15",
            //     value: ":tv: | E01.  https://yhuu.pl/12345\r\n" +
            //     ":tv: | E01. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E02. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E03. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E04. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E05. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E06. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E07. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E08. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E09. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E10. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E11. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E12. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E13. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E14. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E15. https://yhuu.pl/12345\r\n",
            //     inline: false
            // },
            // {
            //     name: "Sezon 1 , 16-30",
            //     value:
            //     ":tv: | E16. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E17. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E18. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E19. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E20. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E21. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E22. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E23. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E24. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E25. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E26. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E27. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E28. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E29. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E30. https://yhuu.pl/12345\r\n",
            //     inline: false
            // },
            //  {
            //     name: "Sezon 1 , 31-45",
            //     value:
            //     ":tv: | E32. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E33. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E34. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E35. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E36. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E37. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E38. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E39. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E40. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E41. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E42. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E43. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E44. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E45. https://yhuu.pl/12345\r\n" +
            //     ":tv: | E46. https://yhuu.pl/12345\r\n",
            //     inline: false
            // },
            {
                name: ":point_right: Gatunek",
                value: localStorage.getItem('gatunek'),
                inline: true
            },
            {
                name: ":alarm_clock: Czas trwania",
                value: localStorage.getItem('czas_trwania'),
                inline: true
            },
            {
                name: ":bookmark_tabs: Streszczenie",
                value: localStorage.getItem('streszczenie'),
                inline: false
            },
            {
                name: ":arrow_forward: Zwiastun",
                value: zwiastun,
                inline: false
            }
        ],
        thumbnail: {
            url: "https://yhuu.pl/img/logo-white.png"
        },
        image: {
            url: localStorage.getItem('okladka')
        },
        footer: {
            text: "Ocena z Filmweb.pl - " + localStorage.getItem('ocena').replace(",",".") + " ⭐",
            icon_url: "https://i.postimg.cc/tT236C2q/filmweb.png"
        },
        color: hexToDecimal("#FF7500")
    }

    var request = new XMLHttpRequest();
    request.open("POST", "WEBHOOK");
    request.setRequestHeader('Content-type', 'application/json');

    var params = {
        username: "Grande Poster",
        embeds: [ myEmbed ]
    }

    request.send(JSON.stringify(params));
}


var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};



