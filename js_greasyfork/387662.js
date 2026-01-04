// ==UserScript==
// @name         WAZE Tolls Tool
// @version      1.0.0
// @description  based on WAZEPT Landmark by J0N4S13 (jonathanserrario@gmail.com)
// @author       TruckerGerrit (truckergerrit.waze@gmail.com)
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace https://greasyfork.org/users/222496
// @downloadURL https://update.greasyfork.org/scripts/387662/WAZE%20Tolls%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/387662/WAZE%20Tolls%20Tool.meta.js
// ==/UserScript==

(function() {
    var version = "1.0.0";
    setTimeout(function() {var myVar = setInterval(myTimer ,500);}, 2000);
    var indexselected = "";
    var valueselected = "";

    var array_roads = [];
    var array_data = {};

    function myTimer() {


        if (!$("#signsroad").length) {
            var signsroad = document.createElement("div");
            signsroad.id = 'signsroad';
            var array_roads = {'🚗': ""};

            $.each(array_roads, function(emoji , allowedland) {

                // The sign background
                var addsign = document.createElement("div");
                addsign.id = 'sign_' + emoji;

                // Get width/height of sign background img
                addsign.style.cssText = 'cursor:pointer;float:left;width:34px;height:34px;';
                // Credits for some of these parts go to t0cableguy & Rickzabel
                addsign.onclick =  function() {

                    indexselected = emoji;

                    if(indexselected == '🚗')
                    {

                        let myRoad = W.selectionManager.getSelectedFeatures()[0].model.attributes;

                        var from = "";
                        var to = "";
                        var sentido = "";
                        if(myRoad.fwdDirection == true) //A to B
                        {
                            from = myRoad.fromNodeID;
                            to = myRoad.toNodeID;
                            sentido = "TRUE";
                        }

                        if(myRoad.revDirection == true)//B to A
                        {
                            from = myRoad.toNodeID;
                            to = myRoad.fromNodeID;
                            sentido = "FALSE";
                        }


                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(sentido + "|" + $('a[class=permalink]').attr('href') + "|" + from + "|" + to).select();
                        document.execCommand("copy");
                        $temp.remove();

                    }

                }
                var emojivalue = document.createElement("div");
                emojivalue.id = 'emoji_' + emoji;
                emojivalue.style.cssText = 'text-align:center;font-size:14px;visibility:visible;';
                emojivalue.innerHTML = emoji;
                addsign.appendChild(emojivalue);
                signsroad.appendChild(addsign);
            });

            $("div #segment-edit-general").prepend(signsroad);
        }




            // CSS Clear after the floats
            var cleardiv = document.createElement("div");
            cleardiv.style.cssText ='clear:both;margin-bottom:5px;';

            var labelexcelnome = document.createElement("label");
            labelexcelnome.id = 'labelexcelnome';
            labelexcelnome.innerHTML = '';
            labelexcelnome.style.cssText = 'font-size:11px;color:red;width:100%;';
            var labelexcelrevisto = document.createElement("label");
            labelexcelrevisto.id = 'labelexcelrevisto';
            labelexcelrevisto.innerHTML = '';
            labelexcelrevisto.style.cssText = 'font-size:11px;color:red;width:100%;';
            var label1 = document.createElement("label");
            label1.id = 'label1';
            label1.innerHTML = 'Teste:';
            var input1 = document.createElement("input");
            input1.id = 'input1';
            input1.style.cssText = 'width:100%;';
            var label2 = document.createElement("label");
            label2.id = 'label2';
            label2.innerHTML = 'Teste:';
            var input2 = document.createElement("input");
            input2.id = 'input2';
            input2.style.cssText = 'width:100%;';
            var label3 = document.createElement("label");
            label3.id = 'label3';
            label3.innerHTML = 'Teste:';
            var input3 = document.createElement("input");
            input3.id = 'input3';
            input3.type = 'number';
            input3.min = '1';
            input3.style.cssText = 'width:15%;height:24px;margin-left:5px;';
            var label4 = document.createElement("label");
            label4.id = 'label4';
            label4.innerHTML = 'Teste:';
            var input4 = document.createElement("input");
            input4.id = 'input4';
            input4.type = 'checkbox';
            input4.value = 'Sim';
            input4.style.cssText = 'width:24px;';

            var label5 = document.createElement("label");
            label5.id = 'label5';
            label5.innerHTML = 'Teste:';
            var dropdown5 = document.createElement("select");
            dropdown5.id = "drop";
            var array = ["n/a","S/N","N/S","O/E","E/O"];
            for (var i = 0; i < array.length; i++) {
                var option = document.createElement("option");
                option.value = array[i];
                option.text = array[i];
                option.id = 'opcao_' + i;
                dropdown5.appendChild(option);
            }
            var label5aviso = document.createElement("label");
            label5aviso.id = 'label5aviso';
            label5aviso.innerHTML = 'Aplicável apenas a postos nos 2 sentidos';
            label5aviso.style.cssText = 'width:65%;font-size:9px;color:red;';


            label1.style.cssText = 'margin-bottom:0px;';
            label2.style.cssText = 'margin-bottom:0px;';
            label3.style.cssText = 'margin-bottom:0px;';
            var divlabelexcel = document.createElement("div");
            divlabelexcel.appendChild(labelexcelnome);
            divlabelexcel.appendChild(labelexcelrevisto);
            var divinput1 = document.createElement("div");
            divinput1.appendChild(label1);
            divinput1.appendChild(input1);
            var divinput2 = document.createElement("div");
            divinput2.appendChild(label2);
            divinput2.appendChild(input2);
            var divinput3 = document.createElement("div");
            divinput3.appendChild(label3);
            divinput3.appendChild(input3);
            var divinput4 = document.createElement("div");
            divinput4.appendChild(label4);
            divinput4.appendChild(input4);
            var divinput5 = document.createElement("div");
            divinput5.appendChild(label5);
            divinput5.appendChild(dropdown5);
            divinput5.appendChild(label5aviso);
            divinput1.style.cssText = 'margin-top:5px;';
            divinput2.style.cssText = 'margin-top:5px;';
            divinput3.style.cssText = 'margin-top:5px;';
            divinput4.style.cssText = 'margin-top:5px;';
            divinput5.style.cssText = 'margin-top:5px;';

            // Add everything to the stage
            signsmoji.appendChild(cleardiv);
            divlabelexcel.id = 'divlabelexcel';
            signsmoji.appendChild(divlabelexcel);
            divinput4.id = 'divinput4';
            signsmoji.appendChild(divinput4);
            divinput1.id = 'divinput1';
            signsmoji.appendChild(divinput1);
            divinput2.id = 'divinput2';
            signsmoji.appendChild(divinput2);
            divinput3.id = 'divinput3';
            signsmoji.appendChild(divinput3);
            divinput5.id = 'divinput5';
            signsmoji.appendChild(divinput5);
            var btnsubmit = document.createElement("button");
            btnsubmit.innerHTML = 'Aplicar';
            btnsubmit.id = 'btnsubmit';

            var labelFalta = document.createElement("label");
            labelFalta.id = 'labelFalta';
            labelFalta.innerHTML = '';
            labelFalta.style.cssText = 'width:85%;font-size:11px;color:red;';
            var labelFaltaID = document.createElement("label");
            labelFaltaID.id = 'labelFaltaID';
            labelFaltaID.innerHTML = 'Não consta no excel!';
            labelFaltaID.style.cssText = 'width:85%;font-size:11px;color:red;';
            var btnCopyID = document.createElement("button");
            btnCopyID.innerHTML = 'Copiar ID';
            btnCopyID.id = 'btnCopyID';
            btnCopyID.style.cssText = 'height: 20px;font-size:11px';
            var divFalta = document.createElement("div");
            divFalta.id = 'divFalta';
            divFalta.style.cssText = 'margin-top:5px;height: 45px;';
            divFalta.appendChild(labelFalta);
            divFalta.appendChild(labelFaltaID);
            divFalta.appendChild(btnCopyID);

            var labeluniform = document.createElement("label");
            labeluniform.id = 'labeluniform';
            labeluniform.innerHTML = 'O posto não está correto. Deseja corrigir?';
            labeluniform.style.cssText = 'width:85%;font-size:11px;color:red;';
            var btnuniformizar = document.createElement("button");
            btnuniformizar.innerHTML = 'Sim';
            btnuniformizar.id = 'btnuniformizar';
            btnuniformizar.style.cssText = 'height: 75%;float:right;';
            var divuniformizar = document.createElement("div");
            divuniformizar.id = 'divuniformizar';
            divuniformizar.style.cssText = 'margin-top:5px;height: 30px;';
            divuniformizar.appendChild(labeluniform);
            divuniformizar.appendChild(btnuniformizar);


            btnCopyID.onclick =  function() {
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val($("#labelFaltaID").text()).select();
                document.execCommand("copy");
                $temp.remove();
            }

            btnsubmit.style.cssText = 'height: 75%;float:right;';
            var divbutton = document.createElement("div");
            divbutton.id = 'divbutton';
            divbutton.style.cssText = 'margin-top:5px;height: 30px;';
            divbutton.appendChild(btnsubmit);
            signsmoji.appendChild(divbutton);
            $("div #landmark-edit-general").prepend(signsmoji);
            $("div #landmark-edit-general").prepend(divuniformizar);
            $("div #landmark-edit-general").prepend(divFalta);
            $( "#divlabelexcel" ).hide();
            $( "#divinput1" ).hide();
            $( "#divinput2" ).hide();
            $( "#divinput3" ).hide();
            $( "#divinput4" ).hide();
            $( "#divinput5" ).hide();
            $( "#divbutton" ).hide();
            $( "#divuniformizar" ).hide();
            $( "#divFalta" ).hide();

        }

})();