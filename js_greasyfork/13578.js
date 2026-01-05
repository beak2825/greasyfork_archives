// ==UserScript==
// @name         ress_tauschen
// @namespace    http://github.com/.../
// @version      0.1
// @description  tausche_ress
// @author       SK
// @match        http://uni4.xorbit.de/buildings.php?mode=fleet
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/13578/ress_tauschen.user.js
// @updateURL https://update.greasyfork.org/scripts/13578/ress_tauschen.meta.js
// ==/UserScript==
    console.clear();
    console.info('############################################################\n');
    alert('start' + '\n' + document.URL);

    var metall_vorhanden, kristall_vorhanden, deut_vorhanden, metall_in_kristall, metall_in_deut, kristall_in_deut, kristall_in_metall, deut_in_metall, deut_in_kristall;
    var url_schiffswerft = 'http://uni4.xorbit.de/buildings.php?mode=fleet';
    var url_galaxy = 'http://uni4.xorbit.de/galaxy.php?mode=3&galaxy=2&system=261';
    var planeten_nummer = 0;
        
        
    //runGET(url_galaxy, 'galaxy', 24);
    //runGET(url_schiffswerft, 'schiffswerft', 432);


    /*
    var elements = document.querySelectorAll('select>option');
    Array.prototype.forEach.call(elements, function(el, i) {
            console.info(
                            el.getAttribute('value').match(/\d+/) + "    =>    " + i
                        ) 
        });
    */


        planeten_anzahl = document.querySelectorAll('select>option').length;
                console.info(   "\n" + 
                                fn_Text('planeten_nummer:',25)              + "\t" +
                                fn_Text('planeten_id:',25)                  + "\t" +
                                fn_Text('planeten_name:',25)                + "\t"+
                                fn_Text('planeten_koordinaten:',25)         + "\t" +
                                fn_Text('planeten_type:',25)                + "\t" +
                                fn_Text('metall_vorhanden:',25)             + "\t" +
                                fn_Text('kristall_vorhanden:',25)           + "\t" +
                                fn_Text('deut_vorhanden:',25)               + "\t" +
                                fn_Text('metall_vorhanden_mio:',25)         + "\t" +
                                fn_Text('kristall_vorhanden_mio:',25)       + "\t" +
                                fn_Text('deut_vorhanden_mio:',25)           + "\t" +
    							fn_Text("recycler_benoetigt:", 30)          + "\t" +
    							fn_Text("recycler_noch_bauen:", 30)         + "\t" +
                                fn_Text("recycler_vorhanden:", 30)          + "\t" +
                                fn_Text("spionagesonden_vorhanden:", 30)    + "\t" +
                                fn_Text("solarsatelliten_vorhanden:", 30)   + "\t" +
                                fn_Text("todessterne_vorhanden:", 30)       + "\t" +
                                fn_Text("schlachtkreuzer_vorhanden:", 30)   + "\t" +
                                fn_Text("metall_vorhanden", 30)             + "\t" +
                                fn_Text("metall_in_kristall", 30)           + "\t" +
                                fn_Text("parseInt(metall_in_deut)", 30)     + "\t" +
                                fn_Text("kristall_vorhanden", 30)           + "\t" +
                                fn_Text("kristall_in_deut", 30)             + "\t" +
                                fn_Text("parseInt(kristall_in_deut)", 30)   + "\t" +
                                fn_Text("deut_vorhanden", 30)               + "\t"
                            );    

    function start() {
        for ( i = 0; i < planeten_anzahl; i++ ) {
            // planeten_nummer = i;
            planeten_id     = document.querySelectorAll('select>option')[i].getAttribute("value").match(/\d+/);
            //console.info("planeten_id:  " + planeten_id)
            runGET(url_schiffswerft, 'planeten', planeten_id);
        }
    }


    //ship209_vorhanden = querySelectorAll('td[class^=l]>a[href^="infos.php?gid=209"]')[0].parentElement.textContent.replace( /\./g,'' ).match(/Anzahl: \d+/).toString().match(/\d+/);
    //ship212_vorhanden = querySelectorAll('td[class^=l]>a[href^="infos.php?gid=209"]')[0].parentElement.textContent.replace( /\./g,'' ).match(/Anzahl: \d+/).toString().match(/\d+/);

    // document.querySelectorAll('td[class^=l]>a[href^="infos.php?gid=209"]')[0].parentElement.textContent.replace( /\./g,'' ).match(/Anzahl: \d+/).toString().match(/\d+/);


    var a_planeten = new Array(25);
    //var a_planeten = new Array();
    for (var j = 0; j < a_planeten.length; j++) {
        a_planeten[j] = new Array(50);
    }


    //var a_planeten = new Array();
    //a_planeten[0] = new Array();
    void( a_planeten[0][0] = 'P_Nr' );
    void( a_planeten[0][1] = 'P_ID' );
    void( a_planeten[0][2] = 'P_Name' );
    void( a_planeten[0][3] = 'P_Koordinaten' );
    void( a_planeten[0][4] = 'P_Type' );



    function get_planeten_index(p_id) {
        var elements = document.querySelectorAll('select>option');
        var index;
        Array.prototype.forEach.call(elements, function(el, i) {
                p_id_element = el.getAttribute('value').match(/\d+/);
                if ( parseInt(p_id) == parseInt(p_id_element) ) {
                    //console.info(                            p_id_element + "    =>    " + i                        ) ;
                    index = i;
                    //a_planeten[index] = new Array();
                } 
            });
            return index;
    }

    function schiffe_vorhanden(dom, i_id) {
        o_schiffanzahl = dom.querySelectorAll('td[class^=l]>a[href^="infos.php?gid=' + i_id + '"]')[0].parentElement.textContent.replace( /\./g,'' ).match(/Anzahl: \d+/);
        if ( o_schiffanzahl != null ) {
            return o_schiffanzahl.toString().match(/\d+/);    
        } else {
            return 0;
        }
        
    }

    function get_planeten(dom, p_id) {
            
                
                //alert(planeten_nummer);
                planeten_nummer = planeten_nummer + 1;

                a_planeten[planeten_nummer] = new Array(50);
                
                i = get_planeten_index(p_id);
                
                // planeten_nummer         = a_planeten.length;
                planeten_id             = dom.querySelectorAll('select>option')[i].getAttribute("value").match(/\d+/);
                planeten_name           = dom.querySelectorAll('select>option')[i].textContent.split('[')[0].trimRight(1);
                planeten_koordinaten    = dom.querySelectorAll('select>option')[i].textContent.match(/\d:\d+:\d+/);
                planeten_type           = "--";



                metall_vorhanden        = parseInt(dom.getElementById("met").textContent.replace( /\./g,'' ));
                kristall_vorhanden      = parseInt(dom.getElementById("cry").textContent.replace( /\./g,'' ));
                deut_vorhanden          = parseInt(dom.getElementById("deut_rechner").textContent.replace( /\./g,'' ));
                metall_vorhanden_mio    = parseInt(metall_vorhanden/1000000);
                kristall_vorhanden_mio  = parseInt(kristall_vorhanden/1000000);
                deut_vorhanden_mio      = parseInt(deut_vorhanden/1000000);

                metall_in_kristall      = metall_vorhanden/1.5-10;
                metall_in_deut          = metall_vorhanden/3-10;
                kristall_in_deut        = kristall_vorhanden/2-10;
                kristall_in_metall      = kristall_vorhanden*1.5-10;
                deut_in_metall          = deut_vorhanden*3-10;
                deut_in_kristall        = deut_vorhanden*2-10;

                recycler_benoetigt		= parseInt( ( metall_in_deut + kristall_in_deut + deut_vorhanden ) / 500000 );
                recycler_noch_bauen		= schiffe_noch_bauen(recycler_vorhanden, recycler_benoetigt);

                recycler_vorhanden          = schiffe_vorhanden(dom, 209);
                spionagesonden_vorhanden    = schiffe_vorhanden(dom, 210);
                solarsatelliten_vorhanden   = schiffe_vorhanden(dom, 212);
                todessterne_vorhanden       = schiffe_vorhanden(dom, 214);
                schlachtkreuzer_vorhanden   = schiffe_vorhanden(dom, 215);

                a_planeten[i][0] = planeten_nummer;
                a_planeten[i][1] = planeten_id;
                a_planeten[i][2] = planeten_name;
                a_planeten[i][3] = planeten_koordinaten;
                a_planeten[i][4] = planeten_type;

            /*
                console.info(   "\n\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n" + 
                                fn_Text('planeten_nummer:',25)          + planeten_nummer       + "\n" +
                                fn_Text('planeten_id:',25)              + planeten_id           + "\n" +
                                fn_Text('planeten_name:',25)            + planeten_name         + "\n"+
                                fn_Text('planeten_koordinaten:',25)     + planeten_koordinaten  + "\n" +
                                fn_Text('planeten_type:',25)            + planeten_type         + "\n" +
                                fn_Text('metall_vorhanden:',25)         + metall_vorhanden         + "\n" +
                                fn_Text('kristall_vorhanden:',25)       + kristall_vorhanden         + "\n" +
                                fn_Text('deut_vorhanden:',25)           + deut_vorhanden         + "\n" +
                                fn_Text('metall_vorhanden_mio:',25)     + metall_vorhanden_mio         + "\n" +
                                fn_Text('kristall_vorhanden_mio:',25)   + kristall_vorhanden_mio         + "\n" +
                                fn_Text('deut_vorhanden_mio:',25)       + deut_vorhanden_mio         + "\n"
                            )
            */

                console.info(   "\n" + 
                                planeten_nummer                 + "\t" +
                                planeten_id                     + "\t" +
                                planeten_name                   + "\t" +
                                planeten_koordinaten            + "\t" +
                                planeten_type                   + "\t" +
                                metall_vorhanden                + "\t" +
                                kristall_vorhanden              + "\t" +
                                deut_vorhanden                  + "\t" +
                                metall_vorhanden_mio            + "\t" +
                                kristall_vorhanden_mio          + "\t" +
                                deut_vorhanden_mio              + "\t" +
                                recycler_benoetigt              + "\t" +
                                recycler_noch_bauen             + "\t" +
                                recycler_vorhanden              + "\t" +
                                spionagesonden_vorhanden        + "\t" +
                                solarsatelliten_vorhanden       + "\t" +
                                todessterne_vorhanden           + "\t" +
                                schlachtkreuzer_vorhanden       + "\t" +
                                metall_vorhanden                + "\t" +
                                metall_in_kristall              + "\t" +
                                parseInt(metall_in_deut)        + "\t" +
                                kristall_vorhanden              + "\t" +
                                kristall_in_deut                + "\t" +
                                parseInt(kristall_in_deut)      + "\t" +
                                deut_vorhanden                  + "\t"
                            );
                if ( planeten_id == 20 ) {
                //        alert(                        metall_vorhanden_mio + " Mio\t" + kristall_vorhanden_mio + " Mio\t" + deut_vorhanden_mio + " Mio"                     );
                }

                marchand(planeten_id, 'metall_in_deut', 'metall_vorhanden');

                marchand(planeten_id, 'kristall_in_deut', 'kristall_vorhanden');                            
    }




    function runGET(url_tmp, s_fn, p_id) {
        url_tmp = url_tmp + '&cp=' + p_id;
        var xhr_tmp = new XMLHttpRequest();
        xhr_tmp.open("GET", url_tmp, true);
        xhr_tmp.send();
        xhr_tmp.onreadystatechange = function() {
            if (xhr_tmp.readyState == 4 && xhr_tmp.status == 200 ){
                parser = new DOMParser();
                htmlDOM = parser.parseFromString (xhr_tmp.responseText, "text/html");
                eval('get_' + s_fn)(htmlDOM, p_id);
            }
        };
    };

    function get_galaxy(dom, p_id) {
        aktuelle_planeten_id            = dom.querySelectorAll('option[selected]')[0].value.match(/cp=(\d+)&/)[1];
        aktueller_planeten_name         = dom.querySelectorAll('option[selected]')[0].textContent.split("[")[0].replace(/\s/g,'');
        aktuelle_planeten_koordinaten   = dom.querySelectorAll('option[selected]')[0].textContent.split("[")[1].match(/\d:\d+:\d+/);
        
        write_log(dom, p_id);

    }

    function get_schiffswerft(dom, p_id) {
        aktuelle_planeten_id            = dom.querySelectorAll('option[selected]')[0].value.match(/cp=(\d+)&/)[1];
        aktueller_planeten_name         = dom.querySelectorAll('option[selected]')[0].textContent.split("[")[0].replace(/\s/g,'');
        aktuelle_planeten_koordinaten   = dom.querySelectorAll('option[selected]')[0].textContent.split("[")[1].match(/\d:\d+:\d+/);
        
        write_log(dom, p_id);
        
    }


    function write_log(dom, p_id) {
        console.info(   "\n" + 
                        "dom: "   + fn_Text(dom.querySelectorAll('title')[0].textContent,24) + "p_id: " + p_id + "\n" +
                        fn_Text("aktuelle_planeten_id:", 35)           + fn_Text(aktuelle_planeten_id,10)          + fn_Text('',24) + "\n" +
                        fn_Text("aktueller_planeten_name:",35)         + fn_Text(aktueller_planeten_name,10)       + fn_Text('',24) + "\n" +
                        fn_Text("aktuelle_planeten_koordinaten:",35)   + fn_Text(aktuelle_planeten_koordinaten,10) + fn_Text('',24) + "\n"
                    )
    }


    function fn_Text(s_text, i_len) {
        if ( s_text != undefined ) {
            var i = 1;
            while ( s_text.length < parseInt(i_len) ) {
                s_text += ' ';
                i++;
            }
            return s_text; 
        } else {
            return '';
        }
    }


    function schiffe_noch_bauen(i_schiffe_vorhanden, i_schiffe_benoetigt) {

    	var i_recycler_noch_bauen = 0;
    	i_recycler_vorhanden = parseInt(i_schiffe_vorhanden);
    	i_recycler_benoetigt = parseInt(i_schiffe_benoetigt);
    	
    	if ( i_schiffe_benoetigt > i_schiffe_vorhanden ) {
    		i_recycler_noch_bauen = i_schiffe_benoetigt - i_schiffe_vorhanden;
    	}
    	return i_recycler_noch_bauen;
    }


    function marchand(p_id, val1, val_max) {
    	
        // console.log( "\n\n####################" + eval(val_max) + '\t' + eval(val1) + "\n\n\n");
        
    	s_name1 = val1.split('_')[0];
    	s_name2 = val1.split('_')[2];
    	i_val	= parseInt( eval(val1) ) - 10;
    	i_val_max = parseInt( eval(val_max) );

    	var s_send = '';

    	var s_von, s_zu, s_form0, s_form1, s_form2, i_form1, i_form2;
    	var s_pos_metall	= val1.search('metall');
    	var s_pos_kristall	= val1.search('kristall');
    	var s_pos_deut		= val1.search('deut');

    	
    	if ( s_pos_metall == 0 ) {
    		s_von	= 'metal';
    		s_form0 = 'metal';
    		s_form1 = 'cristal';
    		s_form2 = 'deut';
    			if ( s_pos_deut > 0 ) {
    					s_zu	= 'deut';
    					i_form1 = 0;
    					i_form2 = i_val-10;
    					// console.log( '\n\n%%%%%%%%%%%%%%%%%%%%%%%' + 'met_->_deut' + 3 * i_val + '>' + i_val_max );
    					if (  3 * i_val > i_val_max ) { return false };
    					s_send = 'ress=' + s_von + '&' + s_form1 + '=' + i_form1 + '&' + s_form2 + '=' + i_form2;
    				} else {
    					s_zu	= 'cristal';
    					i_form1 = i_val-10;
    					i_form2 = 0;
    					// console.log( '\n\n%%%%%%%%%%%%%%%%%%%%%%%' + 1.5 * i_val + '>' + i_val_max );
    					if (  1.5 * i_val > i_val_max ) { return false };
    				}
    		}

    		if ( s_pos_kristall == 0 ) {
    			s_von	= 'cristal';
    			s_form0 = 'cristal';
    			s_form1 = 'metal';
    			s_form2 = 'deut';
    				if ( s_pos_deut > 0 ) {
    						s_zu	= 'deut';
    						i_form1 = 0;
    						i_form2 = i_val-10;
    						// console.log( '\n\n%%%%%%%%%%%%%%%%%%%%%%%' + 'kris_->_deut' + 2 * i_val + '>' + i_val_max );
    						if (  2 * i_val > i_val_max ) { return false };
    						s_send = 'ress=' + s_von + '&' + s_form1 + '=' + i_form1 + '&' + s_form2 + '=' + i_form2;
    					} else {
    						s_zu	= 'metal';
    						i_form1 = i_val-10;
    						i_form2 = 0;
    						if (  i_val / 2 > i_val_max ) { return false };
    					}
    			}

    		if ( s_pos_deut == 0 ) {
    			s_von	= 'deut';
    			s_form0 = 'deut';
    			s_form1 = 'metal';
    			s_form2 = 'cristal';
    				if ( s_pos_metall > 0 ) {
    						s_zu	= 'metal';
    						i_form1 = i_val-10;
    						i_form2 = 0;
    						if (  i_val / 3 > i_val_max ) { return false };
    					} else {
    						s_zu	= 'cristal';
    						i_form1 = 0;
    						i_form2 = i_val-10;
    						if (  i_val / 2 > i_val_max ) { return false };
    					}
    			}

    	
    	var url='http://uni4.xorbit.de/marchand.php?cp=' + p_id;
    	var xhttp = new XMLHttpRequest();

    	xhttp.onreadystatechange = function() {
    		if ( xhttp.readyState == 4 && xhttp.status == 200 ) {
    			checkError(xhttp.responseText, p_id, s_send);
    		}
    	}

    	/*

    	console.info(
    					p_id + '\n' +
    					s_name1 + '\n' +
    					s_name2 + '\n' +
    					"i_val: " + i_val + '\n' +
    					"i_val_max: " + i_val_max + '\n' +
    					's_von: ' + s_von + '\n' +
    					's_zu:  ' + s_zu + '\n' +
    					val1 + '\n' +
    					eval(val1) + '\n' + 
    					i_val + '\n' +
    					"i_form1: " + i_form1 + '\n' +
    					"i_form2: " + i_form2 + '\n' +
    					val1.split('_')[0] + '\t--> ' +
    					val1.split('_')[2] + '\n'
    					
    				)

        */

    	xhttp.open("POST", url, true);
    	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    	//s_send = 'ress=' + s_von + '&' + s_form1 + '=' + i_form1 + '&' + s_form2 + '=' + i_form2;
    	xhttp.send(s_send);
    }


    function checkError(s_html, p_id, s_send) {
    	parser = new DOMParser();
    	dom = parser.parseFromString (s_html, "text/html");

    	var s_text = dom.querySelectorAll('th[class]')[0].textContent;
    		if ( s_text != 'Der Austausch fand mit Erfolg Stat!' ) {
    			console.log('ERROR\n' + s_text + "\n" + p_id + '\n' + s_send)
    		}
    }


    /*
        <select id="pselector" size="1" onChange="eval('location=\''+this.options[this.selectedIndex].value+'\'');">
            <option value="?cp=20&amp;mode=3&amp;re=0">Hauptplanet&nbsp;[2:255:3]&nbsp;&nbsp;</option>
            <option value="?cp=24&amp;mode=3&amp;re=0">Kolonie&nbsp;[2:255:4]&nbsp;&nbsp;</option>
            <option value="?cp=27&amp;mode=3&amp;re=0">Kolonie&nbsp;[2:255:8]&nbsp;&nbsp;</option>
            <option selected="selected" value="?cp=97&amp;mode=3&amp;re=0">Kolonie&nbsp;[1:435:4]&nbsp;&nbsp;</option>
            <option value="?cp=99&amp;mode=3&amp;re=0">Kolonie&nbsp;[3:314:13]&nbsp;&nbsp;</option>
            <option value="?cp=106&amp;mode=3&amp;re=0">Kolonie&nbsp;[4:103:6]&nbsp;&nbsp;</option>
            <option value="?cp=122&amp;mode=3&amp;re=0">Kolonie&nbsp;[7:124:8]&nbsp;&nbsp;</option>
            <option value="?cp=125&amp;mode=3&amp;re=0">Kolonie&nbsp;[8:348:7]&nbsp;&nbsp;</option>
            <option value="?cp=360&amp;mode=3&amp;re=0">Kolonie&nbsp;[5:405:6]&nbsp;&nbsp;</option>
            <option value="?cp=431&amp;mode=3&amp;re=0">Kolonie&nbsp;[9:350:7]&nbsp;&nbsp;</option>
            <option value="?cp=432&amp;mode=3&amp;re=0">Kolonie&nbsp;[6:330:6]&nbsp;&nbsp;</option>
        </select>
    */