// ==UserScript==
// @name		Redacted.CH :: Am I Seeding/Leeching?
// @description	Display an extra detail to your infobar (Up, Down, Ratio and Required) that tells you how many torrents you are seeding(+%)/leeching
// @include		http*://*redacted.ch*
// @version		1.4
// @icon                https://redacted.ch/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest

// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/36168/RedactedCH%20%3A%3A%20Am%20I%20SeedingLeeching.user.js
// @updateURL https://update.greasyfork.org/scripts/36168/RedactedCH%20%3A%3A%20Am%20I%20SeedingLeeching.meta.js
// ==/UserScript==
    // YOU CAN EDIT THE ALIGN OF THE SEEDING VALUE ("left" or "right")

    var align = "right";
var domaine = window.location.hostname;
    
    var userid, userhref, infobar, json_object, cut_data, data_seed, nb_torrents_seeded, data_seed_l, nb_torrents_leeched;

    // Default percent seeding value
    var percent_seeding = 0;
    
     userid = document.getElementById("nav_userinfo").innerHTML;
    userid = userid.substring(userid.indexOf("?id=")+4, userid.indexOf("\" cl"));
    
    userhref = document.URL;
    userhref = userhref.substring(0, userhref.indexOf(".cd")+3);
    userhref = userhref + "/ajax.php?action=community_stats&userid=" + userid;
    
    infobar = document.getElementById("userinfo_stats");


    // AJAX REQUEST
    function get_seed_number(){
        
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://"+domaine+"/ajax.php?action=community_stats&userid="+userid+"",
                onload: function(retour) {
                    
                    // Turn response into variable depending on browser
					             if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
		// If google chrome
		var ResponseText = retour.response;
		}else{
		// If firefox
		var ResponseText = retour.responseText;
		};


                    // JSON Content to String
                    json_object = JSON.stringify(ResponseText);
                    
                    // Cuting the string
                    cut_data = json_object.split('\"');
                    
                  //  alert(json_object);
                    // Getting the Seeding value from the String
                    data_seed = cut_data[12];
                    // Geeting the Leeching value from the String
                    data_seed_l = cut_data[10];

                    // If we got a percent value from the api, search it
                    if(cut_data[25]){

                             // Getting the percent of seeding torrents from the String
                             percent_seeding = cut_data[25];
                        
                             // Get only the numeric value
                             percent_seeding = percent_seeding.replace(/[^a-zA-Z 0-9]+/g,'');
                    
                    }

                    // If the value returns false, we search the correct one
                    if(percent_seeding == "false"){
                        
                             // Getting the percent of seeding torrents from the String
                             percent_seeding = cut_data[27];
                        
                             // Get only the numeric value
                             percent_seeding = percent_seeding.replace(/[^a-zA-Z 0-9]+/g,'');
                     }

                    // Fix with seeding value (0 seeding value)
                    if(data_seed == "seeding\\") data_seed = cut_data[14];
                    
                    // Fix with leeching value (0 leeching value)
                    if(data_seed_l == "seeding\\") {
                        	data_seed_l = cut_data[9];
                        	 nb_torrents_leeched = data_seed_l.slice(1, -2);
                    }
                    else {
                        	 nb_torrents_leeched = data_seed_l.slice(0, -1);
                    }
                    
                    // Removing the last character of the seeded torrents
                    nb_torrents_seeded = data_seed.slice(0, -1);
                        
                   if(nb_torrents_leeched == "seeding") nb_torrents_leeched = 0;
                    
                    // If the Seeding Number is already created, we update is number
                    if(document.getElementById("nb_seeded_torrents")){
                        
                         document.getElementById("nb_seeded_torrents").innerHTML = nb_torrents_seeded+" ("+percent_seeding+"%)";
                        
                       
                        
                        document.getElementById("nb_leeched_torrents").innerHTML = nb_torrents_leeched;
                        
           
                        
                    }
                    else {
                        
                        

                       if(nb_torrents_leeched >= 1) var leeching_display = " <li><a href='torrents.php?type=leeching&userid="+userid+"&order=Seeders&way=ASC'>Leeching</a>: <span class='stat' title='" + nb_torrents_leeched + "' id='nb_leeched_torrents'>" + nb_torrents_leeched + "</span></li>";
                        else var leeching_display = "";

                        // Display of the Seeding Number
                        if(align == "left") infobar.innerHTML = "<li><a href='torrents.php?type=seeding&userid="+userid+"'>Seeding</a>: <span class='stat' title='" + nb_torrents_seeded + "' id='nb_seeded_torrents'>" + nb_torrents_seeded + " ("+percent_seeding+"%)</span></li>"+leeching_display+"" + infobar.innerHTML;
                        else			    infobar.innerHTML = infobar.innerHTML + "<li><a href='torrents.php?type=seeding&userid="+userid+"'>Seeding</a>: <span class='stat' title='" + nb_torrents_seeded + "' id='nb_seeded_torrents'>" + nb_torrents_seeded + " ("+percent_seeding+"%)</span></li>"+leeching_display+"";
 
                    }
                    
                    
                }
            });
        
        
              
	}

    // We get the Seeding Number directly after the page is loaded
    get_seed_number();
    
    // Update of the Sedding Number each 1 minute
   setInterval(function() {get_seed_number()}, 60000);