// ==UserScript==
// @name         SHIP_Damage_info
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Info about packages moved into one of DAMAGE zone
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/damage_check
// @match        https://hooks.chime.aws
// @icon         https://thumbs.dreamstime.com/z/damage-icon-thin-line-icons-website-design-development-app-development-premium-pack-damage-glyph-colour-vector-icon-154980997.jpg
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445856/SHIP_Damage_info.user.js
// @updateURL https://update.greasyfork.org/scripts/445856/SHIP_Damage_info.meta.js
// ==/UserScript==



GM_config.init(
    {
        'id': 'SHIP_Damage_info',
        'title': 'SHIP_Damage_info',
        'fields':
        {
            'Czy_alert':
            {
                'label': 'czy alert',
                'type': 'checkbox',
                'title': '',
                'default': false
            },
            'Wiadomosc':
            {
                'label': 'jaka wiadomosc',
                'type': 'text',
                'title': '',
                'default': ''
            },
             'chime_webhook':
            {
                'label': 'jaki webhook',
                'type': 'text',
                'title': '',
                'default': ''
            }
        }
    });


var tablica_dropzone = [
    ["a4c06607-6b84-2926-1f24-cbbe02004b42","BAG SORT DAMAGE DROPZONE"],
    ["b0c065ff-6259-1351-fe36-012e843a4906","DAMAGE MANUAL DROPZONE"],
    ["3cc06607-0df2-a83b-944b-15f667f117e5","EDDK DAMAGE DROPZONE"],
    ["f0c06607-a867-0945-b6b9-e38cca4ee447","FLAT DOCK DAMAGE DROPZONE"],
    ["6ac06607-d673-5271-c1f7-2042ef31d978","FLAT TSO DAMAGE DROPZONE"],
    ["36c06608-230e-d8c9-3588-fdde984814cd","INDUCT TSO DAMAGE DROPZONE"],
    ["aec06607-fd44-1ca8-5155-62ff2edc901c","KO DAMAGE DROPZONE"],
    ["6ac06609-4eba-26f2-b328-0374a4fbe4ef","OB DOCK 148 DAMAGE DROPZONE"],
    ["64c06609-3b16-b70d-7262-6d86d4fe610e","OB DOCK 149 DAMAGE DROPZONE"],
    ["78c06609-15c4-995f-6367-534663e19955","OB DOCK 150 DAMAGE DROPZONE"],
    ["8ec06608-f48d-a77b-fed4-7929ece33b10","OB DOCK 151 DAMAGE DROPZONE"],
    ["d8c06608-e330-fb26-6f40-21fe9c379ccf","OB DOCK 152 DAMAGE DROPZONE"],
    ["9ec06608-d2e3-6f87-532e-93506d45d5c1","OB DOCK 153 DAMAGE DROPZONE"],
    ["36c06608-c1d7-2589-a6d1-ba478c51c449","OB DOCK 154 DAMAGE DROPZONE"],
    ["26c06608-b083-0925-ea48-503c41b55143","OB DOCK 155 DAMAGE DROPZONE"],
    ["e8c06608-9f4e-fece-8f32-03625ca4d45b","OB DOCK 156 DAMAGE DROPZONE"],
    ["b4c06608-689d-042c-831f-8d31a7b8fc6d","OB DOCK 157 DAMAGE DROPZONE"]
    ]



setTimeout(function() {

    if(window.location.href.indexOf("https://trans-logistics-eu.amazon.com/damage_check") > -1)
    {
        // INFOBOX
        var infobox = document.createElement ('div');
        infobox.innerHTML = '<div id="infobox_divheader" style="border-style:solid !important;cursor:move;background-color:greenyellow;">' +
            '<iframe style="" id="infobox_chime_damage" src="https://hooks.chime.aws" ></iframe>' +
            '</div>';
        infobox.setAttribute ('id', 'infobox_div');
        infobox.setAttribute ('style', 'position:fixed;');
        document.getElementsByTagName("body")[0].appendChild(infobox);


        var lista_paczek = "";
        var paczka = "";
        var cpt = "";
        var cpt_human;
        var stacking_filter = "";
        var dropzone = "";
        var dropzone_code = "";
        var response = "";
        var i;
        var j;
        var wiadomosc = "";
        var temp;
        var czy_wiadomosc = false;

        wiadomosc = "/md |**Paczka**|**Stacking Filter**|**CPT**|**Dropzone**|\r\n|---|\r\n";

        for(j = 0;j<=tablica_dropzone.length;j++)
        {
            if((tablica_dropzone[j]) != undefined)
            {
                response = httpGet("https://trans-logistics-eu.amazon.com/sortcenter/tt/contains?containerId=" + (tablica_dropzone[j][0]) + "&nodeId=KTW1&startIndex=0&forward=true&pageSize=50");

                // Jezeli na Dropzone jest jakas paczka
                if(response.includes("Package") == true)
                {
                    // console.log("lecim");
                    lista_paczek = response.split("cptInMillis");

                    //  console.log(lista_paczek.length);

                    for(i = 1;i<lista_paczek.length;i++)
                    {
                        console.log("damage paczka");
                        czy_wiadomosc = true;
                        paczka = getFromBetween.get(lista_paczek[i],'resourceLabel":"','","associatedUser');
                        stacking_filter = getFromBetween.get(lista_paczek[i],'stackingFilter":"','","associationReason');
                        cpt = getFromBetween.get(lista_paczek[i],'":',',"containerType');
                        dropzone = (tablica_dropzone[j][1]);
                        dropzone_code = (tablica_dropzone[j][0]);


                        var temp_cpt;
                        temp_cpt = parseInt(cpt[0]);

                        cpt_human = new Date(temp_cpt).toLocaleString("pl-PL");

                        temp = "|[" + paczka + "](https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&setContainerId=" + paczka + ")|" + stacking_filter + "|" + cpt_human + "|[" + dropzone + "](https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&setContainerId=" + dropzone_code + ")|\r\n";

                        wiadomosc += temp;

                        paczka = "";
                        stacking_filter = "";
                        cpt = "";
                        cpt_human = "";
                        temp = "";
                    }
                }
            }
        }

        if(sessionStorage.getItem("First_run") != "true")
        {
            // wyslij wiadomosc na Chime


            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            var wiadomosc_startowa = "";
            wiadomosc_startowa = "/md |Uruchomiono bota :robot_face: |\r\n|---|\r\n|" + datetime + "|";

            GM_config.set('Czy_alert', true);
            GM_config.set('Wiadomosc', wiadomosc_startowa);
            GM_config.save();

            sessionStorage.setItem("First_run","true");
        }

        if(czy_wiadomosc == true)
        {
            // wyslij wiadomosc na Chime
            GM_config.set('Czy_alert', true);
            GM_config.set('Wiadomosc', wiadomosc);
            GM_config.save();
        }
    }
    
    // dla iFrame na Chime
    if(window.location.href.indexOf("https://hooks.chime.aws") > -1)
    {
        // Iframe JS
        var guzior = document.createElement ('div');
        guzior.innerHTML = '<input type="button" id="guzior_id_2" value="guzik"></input>';

        document.getElementsByTagName("body")[0].appendChild(guzior);

        document.getElementById ("guzior_id_2").addEventListener (
            "click", guzior_event_2, false
        );

        function guzior_event_2 (zEvent)
        {
            var xhr = new XMLHttpRequest();
            // Damage_Chat https://hooks.chime.aws/incomingwebhooks/c945b117-8ccc-4d2e-872a-9bd7567f2381?token=S1JITjNzcTZ8MXxwVXBsSmRJWVljazFuVmVxZTlZTnZiZ3lud1cyMlM3WHhRclJ4eFhBT1dz
            // Pokój zabaw
            var url = "https://hooks.chime.aws/incomingwebhooks/c945b117-8ccc-4d2e-872a-9bd7567f2381?token=S1JITjNzcTZ8MXxwVXBsSmRJWVljazFuVmVxZTlZTnZiZ3lud1cyMlM3WHhRclJ4eFhBT1dz";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/JSON");
            var data = JSON.stringify({"Content": wiadomosc});
            xhr.send(data);
        }

        var interval_chime = setInterval(function(){
            if(GM_config.get('Czy_alert') == true)
            {
                wiadomosc = GM_config.get('Wiadomosc');

                GM_config.set('Czy_alert', false);
                GM_config.set('Wiadomosc', "");
                GM_config.save();

                document.getElementById ("guzior_id_2").click();
                clearInterval(interval_chime);
            }
        },10000);
    }


    wiadomosc = "";

    // refresh 5 minut
    setTimeout(function() {
        location. reload();
    }, 300000);

},10000);


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
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