// ==UserScript==
// @name         Throughput vs Override
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Alert when Override is lower/higher than Throughput
// @author       NOWARATN
// @match        https://monitorportal.amazon.com/igraph?SchemaName1=Service&DataSet1=Prod&Marketplace1=KTW1&HostGroup1=ALL&Host1=ALL&ServiceName1=PythiaCLI&MethodName1=RawDataAggregator&Client1=PythiaCLI&MetricClass1=NONE&Instance1=NONE&Metric1=PPMultiXLarge.PACK.EACH.Count&Period1=FiveMinute&Stat1=sum&Label1=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiXLarge.PACK.EACH.Count%20sum&SchemaName2=Service&Metric2=PPMultiMedium.PACK.EACH.Count&Label2=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiMedium.PACK.EACH.Count%20sum&SchemaName3=Service&Metric3=PPMultiWrap.PACK.EACH.Count&Label3=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiWrap.PACK.EACH.Count%20sum&SchemaName4=Service&Metric4=PPSingleMedium.PACK.EACH.Count&Label4=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPSingleMedium.PACK.EACH.Count%20sum&SchemaName5=Service&Metric5=PPMultiTBYB.PACK.EACH.Count&Label5=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiTBYB.PACK.EACH.Count%20sum&SchemaName6=Service&ServiceName6=LagrangeModelService&MethodName6=LagrangeModelTask&Client6=ALL&Metric6=OUTBOUND.CurrentSinglesOverrideCapacity&Stat6=avg&Label6=LagrangeModelService%20LagrangeModelTask%20ALL%20OUTBOUND.CurrentSinglesOverrideCapacity%20avg&SchemaName7=Service&Metric7=OUTBOUND.CurrentMultisOverrideCapacity&Label7=LagrangeModelService%20LagrangeModelTask%20ALL%20OUTBOUND.CurrentMultisOverrideCapacity%20avg&HeightInPixels=250&WidthInPixels=600&GraphTitle=KTW1%20Lagrange%20Override%20vs%20OB%20Pack%20Throughput&GraphType=zoomer&TZ=Europe%2FWarsaw@TZ%3A%20Warsaw&LabelLeft=Units%20packed&StartTime1=-PT3H&EndTime1=-PT0H&FunctionExpression1=SUM%28M1%2CM2%2CM3%2CM5%29*12&FunctionLabel1=Multis%20Throughput%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference1=left&FunctionColor1=default&FunctionExpression2=M4*12&FunctionLabel2=Singles%20Throughtput%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference2=left&FunctionExpression3=M6&FunctionLabel3=Singles%20Override%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference3=left&FunctionExpression4=M7&FunctionLabel4=Multis%20Override%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference4=left
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/394818/Throughput%20vs%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/394818/Throughput%20vs%20Override.meta.js
// ==/UserScript==

    var ile_metryk;
    var m_throughput = "";
    var m_override = "";
    var s_throughput = "";
    var s_override = "";



GM_config.init(
{
    'id': 'Throughput',
    'title': 'Throughput',
    'fields':
    {
        'Throughput_unity_text':
        {
            'type': 'text',
        },
        'Throughput_percent_text':
        {
            'type': 'text',
        },
        'Throughput_unity_checkbox':
        {
            'type': 'checkbox',
            'default': 'false',
        },
        'Throughput_percent_checkbox':
        {
            'type': 'checkbox',
            'default': 'false',
        },
        'scanned_godzina_start':
        {
            'type': 'text',
        },
        'czasomierz_checkbox':
        {
            'type': 'checkbox',
            'default': 'false',
        }
    }
});

var GM_Throughput_percent_checkbox = GM_config.get('Throughput_percent_checkbox');
var GM_Throughput_percent_text = GM_config.get('Throughput_percent_text');
var GM_Throughput_unity_checkbox = GM_config.get('Throughput_unity_checkbox');
var GM_Throughput_unity_text = GM_config.get('Throughput_unity_text');
var GM_scanned_godzina_start = GM_config.get('scanned_godzina_start');
var GM_czasomierz_checkbox = GM_config.get('czasomierz_checkbox');

var audio = new Audio('http://soundbible.com/mp3/BOMB_SIREN-BOMB_SIREN-247265934.mp3');
var start;
var teraz;
var co;
var ile;
var jakie;
var jakie2 = new Array(4);
var przerywnik;

var xmlHttp = new XMLHttpRequest();
var xmlHttp1 = new XMLHttpRequest();
var xmlHttp2 = new XMLHttpRequest();
var xmlHttp3 = new XMLHttpRequest();
var xmlHttp4 = new XMLHttpRequest();


setTimeout(function(){

    var alert_div = document.createElement ('div');
    alert_div.innerHTML = 'Informuj jezeli [Throughput] jest wiekszy/mniejszy niz [Override] o: <br>';
    alert_div.innerHTML += '<input type="text" size="5" id="alert_textbox_unit_id"> unitów <input type="checkbox" id="alert_checkbox_unit_id"><br>';
    alert_div.innerHTML += '<input type="text" size="5" id="alert_textbox_percent_id"> % <input type="checkbox" id="alert_checkbox_procent_id"><br><br>';
    alert_div.innerHTML += '<input type="checkbox" id="czasomierz_checkbox"/>Informuj na grupie Chime.<br>';
    alert_div.innerHTML += '<br><input type="button" id="czyszczenie" value="Czyszczenie" style="float:right;">';
    alert_div.setAttribute ('id', 'alert_div');
    alert_div.setAttribute ('class', 'sectionHeader dashboardingHeader');
    document.getElementById("graphOptions").appendChild(alert_div);

    document.getElementById("czyszczenie").addEventListener (
        "click", ButtonClick_czyszczenie, false
    );

    document.getElementById("alert_checkbox_unit_id").addEventListener (
        "click", ButtonClick_alert_checkbox_unit_id, false
    );

    document.getElementById("alert_checkbox_procent_id").addEventListener (
        "click", ButtonClick_alert_checkbox_procent_id, false
    );

    document.getElementById("czasomierz_checkbox").addEventListener( 'change', function() {
        if(this.checked) {
            start = Math.floor(Date.now() / 1000);
            start = parseFloat(start);
            GM_config.set('scanned_godzina_start', start);
            GM_config.set('czasomierz_checkbox', true);
            GM_config.save();
        } else {
            start = "";
            GM_config.set('scanned_godzina_start', start);
            GM_config.set('czasomierz_checkbox', false);
            GM_config.save();
        }
});

    function ButtonClick_czyszczenie (zEvent)
    {
        document.getElementById("alert_textbox_percent_id").disabled = false;
        document.getElementById("alert_textbox_percent_id").value = '';
        document.getElementById("alert_textbox_unit_id").disabled = false;
        document.getElementById("alert_textbox_unit_id").value = '';
        document.getElementById("alert_checkbox_procent_id").checked = false;
        document.getElementById("alert_checkbox_unit_id").checked = false;
        GM_config.set('Throughput_unity_checkbox', false);
        GM_config.set('Throughput_percent_checkbox', false);
        GM_config.set('Throughput_unity_text', '');
        GM_config.set('Throughput_percent_text', '');
        GM_config.set('scanned_godzina_start', '');
        GM_config.set('czasomierz_checkbox', false);
        GM_config.save();
    }

    function ButtonClick_alert_checkbox_unit_id (zEvent)
    {
            document.getElementById("alert_textbox_percent_id").disabled = true;
            document.getElementById("alert_textbox_unit_id").disabled = false;
            document.getElementById("alert_checkbox_procent_id").checked = false;
            GM_config.set('Throughput_unity_checkbox', true);
            GM_config.set('Throughput_percent_checkbox', false);
            GM_config.save();
    }
    function ButtonClick_alert_checkbox_procent_id (zEvent)
    {
            document.getElementById("alert_textbox_unit_id").disabled = true;
            document.getElementById("alert_textbox_percent_id").disabled = false;
            document.getElementById("alert_checkbox_unit_id").checked = false;
            GM_config.set('Throughput_percent_checkbox', true);
            GM_config.set('Throughput_unity_checkbox', false);
            GM_config.save();
    }

    document.getElementById("alert_textbox_unit_id").addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode != 0) {
                        var temp = document.getElementById("alert_textbox_unit_id").value;
                        GM_config.set('Throughput_unity_text', temp);
                        GM_config.save();}
    });

    document.getElementById("alert_textbox_percent_id").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode != 0) {
            var temp = document.getElementById("alert_textbox_percent_id").value;
            GM_config.set('Throughput_percent_text', temp);
            GM_config.save();}
    });

    

    if(GM_Throughput_percent_text != "") { document.getElementById("alert_textbox_percent_id").value = GM_Throughput_percent_text; };
    if(GM_Throughput_unity_text != "") { document.getElementById("alert_textbox_unit_id").value = GM_Throughput_unity_text; };
    if(GM_Throughput_unity_checkbox == true) { document.getElementById("alert_checkbox_unit_id").checked = true; };
    if(GM_Throughput_percent_checkbox == true) { document.getElementById("alert_checkbox_procent_id").checked = true; };
    if(GM_czasomierz_checkbox == true) { document.getElementById("czasomierz_checkbox").checked = true; };

    // Alerty
    setInterval(function()
                {
        document.getElementById("graphMetricsButton").click();
        sleep(1500);

        // Sprawdzanie i zapisywanie danych co 30s
        ile_metryk = document.getElementsByClassName("labelContainer MetricData");
        for(var i=0;i<ile_metryk.length;i++)
        {
            if(ile_metryk[i].innerText.includes("Multis Throughput"))
            {
                m_throughput = getFromBetween.get(ile_metryk[i].innerText,"[avg: ","]");
                m_throughput = m_throughput.toString().slice(0, -3);
                m_throughput = m_throughput.replace(",","");
                m_throughput = parseInt(m_throughput);
                console.log("m_throughput " + m_throughput);
            }
            if(ile_metryk[i].innerText.includes("Multis Override"))
            {
                m_override = getFromBetween.get(ile_metryk[i].innerText,"[avg: ","]");
                m_override = m_override.toString().slice(0, -3);
                m_override = m_override.replace(",","");
                m_override = parseInt(m_override);
                console.log("m_override " + m_override);
            }

            if(ile_metryk[i].innerText.includes("Singles Throughtput"))
            {
                s_throughput = getFromBetween.get(ile_metryk[i].innerText,"[avg: ","]");
                s_throughput = s_throughput.toString().slice(0, -3);
                s_throughput = s_throughput.replace(",","");
                s_throughput = parseInt(s_throughput);
                console.log("s_throughput " + s_throughput);
            }
            if(ile_metryk[i].innerText.includes("Singles Override"))
            {
                s_override = getFromBetween.get(ile_metryk[i].innerText,"[avg: ","]");
                s_override = s_override.toString().slice(0, -3);
                s_override = s_override.replace(",","");
                s_override = parseInt(s_override);
                console.log("s_override " + s_override);
            }
        }

        console.log("teraz: " + teraz);
        console.log("start: " + GM_scanned_godzina_start);
        console.log("percentbox: " + GM_Throughput_percent_checkbox);

        if( document.getElementById("czasomierz_checkbox").checked == true & (GM_scanned_godzina_start == "" || GM_scanned_godzina_start == undefined))
        {
            if(teraz == "" || teraz == undefined)
            {
                teraz = Math.floor(Date.now() / 1000);
                teraz = parseFloat(teraz);
            }
            GM_scanned_godzina_start = teraz;

            // sprawdź od razu stany:
        }

        // Unity
        if(GM_Throughput_unity_checkbox = true && GM_Throughput_unity_text != "")
        {
          //  console.log("stage 1");
            if(m_throughput + parseInt(GM_Throughput_unity_text) > m_override || m_throughput - parseInt(GM_Throughput_unity_text) < m_override)
            {
              //  console.log("stage 2");
                if(m_throughput + parseInt(GM_Throughput_unity_text) > m_override ){ co = "higher"; };
                if(m_throughput - parseInt(GM_Throughput_unity_text) < m_override ){ co = "lower"; };

                if(GM_scanned_godzina_start != "")
                {
               //     console.log("stage 3");
                    window.focus();

                    audio.play();

                    // https://ob-clock.000webhostapp.com/pogoda.php
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open( "GET", "https://ob-clock.000webhostapp.com/info.php?co=" + m_throughput, false ); // false for synchronous request
                    xmlHttp.send( null );
                    return xmlHttp.responseText
                }
            }
        }

        // Procenty
        if(GM_Throughput_percent_checkbox == true && GM_Throughput_percent_text != "")
        {
            console.log("stage 1, %");
            if(GM_scanned_godzina_start != "") // Jezeli mamy godzine startu pomiaru
            {
             //   console.log("stage 2, %");
                var sekundy = 60 * 10; /////////////////////////////////////  [][][][][][][][][][][][][] Co ile minut ma sprawdzac (60 sekund * MINUTY) [][][][][][][][][][][][][]
                teraz = Math.floor(Date.now() / 1000);
                teraz = parseFloat(teraz);

                if(teraz > (parseInt(GM_scanned_godzina_start) + sekundy))
                {
                     console.log("stage 3, %");
                    // " Lagrange override is higher than x% vs throughput"
                    // " Lagrange override is lower than x% vs throughput"

                    var roznica = (m_override * parseInt(GM_Throughput_percent_text)) / 100; // wartosc Override z procent
                    var s_roznica = (s_override * parseInt(GM_Throughput_percent_text)) / 100; // wartosc Override z procent

                 //   console.log("Multi roznica: "+roznica);
                 //   console.log("Single roznica: "+s_roznica);

                    var roznica_procent = 0.00;
                    var roznica_procent_str = "";

                    if(m_override + roznica > m_throughput || m_override - roznica < m_throughput || s_override + s_roznica > s_throughput || s_override - s_roznica < s_throughput)
                    {
                        jakie = "";
                        if(m_override > m_throughput ){
                            console.log(m_override + " > " + m_throughput);
                            roznica_procent = percentage(m_override,m_throughput);
                              console.log(roznica_procent);
                            roznica_procent = 100 - roznica_procent.toFixed(2);
                            roznica_procent = Math.abs(roznica_procent);
                            if(roznica_procent < 100 && roznica_procent > parseInt(GM_Throughput_percent_text)) {
                                roznica_procent_str = roznica_procent.toString().substring(0,5);
                                jakie = "Multi Lagrange override is " + roznica_procent_str + "% higher than throughput.";
                                xmlHttp1.open( "GET", "https://ob-clock.000webhostapp.com/info.php?jakie=" + jakie + "&" + (new Date()).getTime(), true); // false for synchronous request
                                xmlHttp1.send( null );
                                sleep(200);
                            }
                        }

                        if(s_override > s_throughput ){
                            console.log(s_override + " > " + s_throughput);
                            roznica_procent = percentage(s_override,s_throughput);
                            console.log(roznica_procent);
                            roznica_procent = 100 - roznica_procent.toFixed(2);
                            console.log(roznica_procent);
                            roznica_procent = Math.abs(roznica_procent);
                            console.log(roznica_procent);
                            if(roznica_procent < 100 && roznica_procent > parseInt(GM_Throughput_percent_text)) {
                                roznica_procent_str = roznica_procent.toString().substring(0,5);
                                jakie = "Single Lagrange override is " + roznica_procent_str + "% higher than throughput.";
                                xmlHttp2.open( "GET", "https://ob-clock.000webhostapp.com/info.php?jakie=" + jakie + "&" + (new Date()).getTime(), true); // false for synchronous request
                                xmlHttp2.send( null );
                                sleep(200);
                            }
                        }

                        if(m_override < m_throughput ){
                            console.log(m_override + " < " + m_throughput);
                            roznica_procent = percentage(m_override,m_throughput);
                            console.log(roznica_procent);
                            roznica_procent = 100 - roznica_procent.toFixed(2);
                            roznica_procent = Math.abs(roznica_procent);
                            if(roznica_procent < 100 && roznica_procent > parseInt(GM_Throughput_percent_text)) {
                                roznica_procent_str = roznica_procent.toString().substring(0,5);
                                jakie = "Multi Lagrange override is " + roznica_procent_str + "% lower than throughput.";
                                xmlHttp3.open( "GET", "https://ob-clock.000webhostapp.com/info.php?jakie=" + jakie + "&" + (new Date()).getTime(), true); // false for synchronous request
                                xmlHttp3.send( null );
                                sleep(200);
                            }
                        }
                        if(s_override < s_throughput ){
                            console.log(s_override + " < " + s_throughput);
                            roznica_procent = percentage(s_override,s_throughput);
                               console.log(roznica_procent);
                            roznica_procent = 100 - roznica_procent.toFixed(2);
                            roznica_procent = Math.abs(roznica_procent);
                            if(roznica_procent < 100 && roznica_procent > parseInt(GM_Throughput_percent_text)) {
                                roznica_procent_str = roznica_procent.toString().substring(0,5);
                                jakie = "Single Lagrange override is " + roznica_procent_str + "% lower than throughput.";
                                xmlHttp4.open( "GET", "https://ob-clock.000webhostapp.com/info.php?jakie=" + jakie + "&" + (new Date()).getTime(), true); // false for synchronous request
                                xmlHttp4.send( null );
                                sleep(200);
                            }
                        };

                        console.log("focus%");
                        window.focus();


                        audio.play();
                        GM_scanned_godzina_start = teraz;
                        GM_config.set('scanned_godzina_start', teraz);
                        GM_config.save();

                      //  xmlHttp1.abort();
                      //  xmlHttp2.abort();
                      //  xmlHttp3.abort();
                      //  xmlHttp4.abort();

//                         var xmlHttp1 = new XMLHttpRequest();
//                         for(var z=0;z<jakie2.length;z++)
//                         {

//                             if(jakie2[z] != "" && jakie2[z] != null && jakie2[z] != undefined)
//                             {
//                                 var muzyka = true;
//                                 console.log(z);
//                                 console.log(jakie2[z]);
                                
//                             }
//                         }
                    }
                }
        }
    }

    }, 30000);

}, 4000);


function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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