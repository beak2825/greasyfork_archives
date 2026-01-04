// ==UserScript==
// @name        Archive.org Filter
// @namespace   psx_chd_filter
// @match       *archive.org/download/*
// @include       *archive.org/download/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant       none
// @version     1.1
// @author      Andrea Do
// @description Advanced filter for Archive.org roms
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436507/Archiveorg%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436507/Archiveorg%20Filter.meta.js
// ==/UserScript==



$(document).ready(function() {
  var suffixes = `<input type="checkbox" id="use_suffix"> Use suffixes<br>
<div style="display: none;" id="display_boxes"><br>
<strong>Generic</strong><br>
<input type="checkbox" data-suffix="[a]" checked style="display: none;"> [a] Alternate<br>
<input type="checkbox" data-suffix="[p]" checked style="display: none;"> [p] Pirate<br>
<input type="checkbox" data-suffix="[b]" checked style="display: none;"> [b] Bad Dump (avoid these, they may not work!)<br>
<input type="checkbox" data-suffix="[t]" checked style="display: none;"> [t] Trained<br>
<input type="checkbox" data-suffix="[f]" checked style="display: none;"> [f] Fixed<br>
<input type="checkbox" data-suffix="[T-]" checked style="display: none;"> [T-] OldTranslation<br>
<input type="checkbox" data-suffix="[T+]" checked style="display: none;"> [T+] NewerTranslation<br>
<input type="checkbox" data-suffix="[h]" checked style="display: none;"> [h] Hack<br>
<input type="checkbox" data-suffix="[cr" checked style="display: none;"> [cr {x}] Cracked (by {x})<br>
<input type="checkbox" data-suffix="(-)" checked style="display: none;"> (-) Unknown Year<br>
<input type="checkbox" data-suffix="[o]" checked style="display: none;"> [o] Overdump<br>
<input type="checkbox" data-suffix="[!]" checked style="display: none;"> [!] Verified Good Dump<br>
<input type="checkbox" data-suffix="ZZZ_" checked style="display: none;"> ZZZ_ Unclassified<br>
<input type="checkbox" data-suffix="(Unl)" checked style="display: none;"> (Unl) Unlicensed<br><br>
<strong>Platform specific</strong><br>
  <input type="checkbox" data-suffix="[PC10]" checked style="display: none;"> NES - [PC10] PlayChoice 10<br>
  <input type="checkbox" data-suffix="[VS]" checked style="display: none;"> NES - [VS] Versus<br>
  <input type="checkbox" data-suffix="[BS]" checked style="display: none;"> SNES - [BS] BS Roms<br>
  <input type="checkbox" data-suffix="[SF]" checked style="display: none;"> SNES - [SF] Sufami Turbo<br>
  <input type="checkbox" data-suffix="[NP]" checked style="display: none;"> SNES - [NP] Nintendo Power<br>
</div>`;
  var download_all = '<div id="download_all"><b>Attempt bulk download</b> <i>(think thrice before doing this!)</i></div>';
  var hide_demo = '<h3>Disc type</h3>Include demos: <input type="checkbox" checked id="demos"><br>Include multidisc: <input type="checkbox" checked id="multidisc"><br>';
  var countries = '<h3>Localization</h3>Country/Region: <select id="country"><option value=".">ALL</option><option value="anything_else">Uncategorized</option></select><br>';
  var size_limit = '<h3>Misc</h3>'+suffixes+'Size limit: <input style="max-width: 75px;" id="limit" type="number" placeholder="Size limit" value="50000">MB<div><span style="display: none;" id="stats"><h3>Stats</h3>Showing <span id="counter">0</span> file(s).<br>Total size: <span id="total_size">0</span>'+download_all+'</span></div>';
  $("h1").after(hide_demo+countries+size_limit);
});

//waitForKeyElements("#total_size", actions);

function engine() {
  $(document).ready(function() {
    var country_list = ['Italy', 'France', 'Germany', 'Spain', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Portugal', 'Japan', 'USA', 'Europe', 'UK'];
    country_list.sort();
    for(k=0; k < country_list.length; k++) {
      $("#country").append('<option value="('+country_list[k]+')">'+country_list[k]+'</option>');
    }
    
    $("#download_all").append('<br><button id="dl_all">Download all</button>');
    $("#dl_all").click(function() {
      var exts = ['chd', 'zip', '7z', 'nes', 'sfc'];
      var sels = "";
      var selectors = "";
      for(e=0; e < exts.length; e++) {
        if(e==exts.length-1) {
          sels+=".directory-listing-table [href$='."+exts[e]+"']:visible";
        } else{
          sels+=".directory-listing-table [href$='."+exts[e]+"']:visible, ";
        }
        
      }
      selectors = sels;
      var len = $(selectors).length;
      if(len > 20) {
        var ask = confirm("This will open "+len+" tabs! Are you sure?");
        if(ask == true) {
          $(selectors).each(function() {
            var url = encodeURIComponent(window.location.href+"/"+$(this).attr("href"));
            window.open(decodeURIComponent(url));
          });
        }
      } else {
        $(selectors).each(function() {
            var url = encodeURIComponent(window.location.href+"/"+$(this).attr("href"));
            window.open(decodeURIComponent(url));
          });
      }
      
      
    });

    
    $("input, select").click(function() {
      var sum = 0;
      $("#stats").show();
      $("tr").show();
      var exts = ['chd', 'zip', '7z', 'nes', 'sfc'];
      var sels = "";
      var selectors = "";
      for(e=0; e < exts.length; e++) {
        if(e==exts.length-1) {
          sels+=".directory-listing-table [href$='."+exts[e]+"']:visible";
        } else{
          sels+=".directory-listing-table [href$='."+exts[e]+"']:visible, ";
        }
        
      }
      selectors = sels;
      
      
      // Filter countries
      var country = $("#country option:selected").val();
      if(country === "anything_else") {
        for(k=0; k < country_list.length; k++) {
          $(selectors).each(function() {
            if($(this).text().indexOf(country_list[k]) > -1) {
              $(this).closest("tr").hide();
            } else {
              $(this).closest("tr").show();
            }
      });
        }
      } else {
        $(selectors).each(function() {
          if($(this).text().indexOf(country) <= -1) {
            $(this).closest("tr").hide();
          } else {
            $(this).closest("tr").show();
          }
      });
      }
      
      
      // Size limit
      var limit = parseInt($("#limit").val());
      var this_size = 0;
      $("tr td:nth-child(3):visible").each(function() {
        if($(this).text().indexOf("M") > -1) {
           this_size = ($(this).text().split("M")[0]*1);
        } else if($(this).text().indexOf("G") > -1) {
           this_size = ($(this).text().split("G")[0]*1024);
        } else if($(this).text().indexOf("K") > -1) {
           this_size = ($(this).text().split("K")[0]*0.001);
        }
        
        if(this_size <= limit) {
          $(this).closest("tr").show();
        } else {
          $(this).closest("tr").hide();
        }
      });
      
      // Show demos
      if($("#demos").is(':checked')) {
        $("tr:visible").show();
      } else {
        $(selectors).each(function() {
          if($(this).text().indexOf("(Demo)") > -1) {
            $(this).closest("tr").hide();
          }
        });
      }
      
      // Show Multidisc
      if($("#multidisc").is(':checked')) {
        $("tr:visible").show();
      } else {
        $(selectors).each(function() {
          if($(this).text().indexOf("(Disc ") > -1) {
            $(this).closest("tr").hide();
          }
        });
      }
      
      // Suffixes
      if($("#use_suffix").is(":checked")) {
        $("[data-suffix]").show();
        $("#display_boxes").show();
        
        $(selectors).each(function() {
          var this_rom = $(this);
          $("[data-suffix]:checked").each(function() {
            var attr = $(this).attr('data-suffix');
            if(this_rom.text().indexOf(attr) > -1) {
              this_rom.closest("tr").show();
              return false;
            } else {
              this_rom.closest("tr").hide();
            }
          });
        });
        
        
      } else {
        $("[data-suffix]").hide();
        $("#display_boxes").hide();
      }
      
      // Extensions
      

      
      
      // Sum 
      $("tr td:nth-child(3):visible").each(function() {
        var this_size = 0;
        var size_arr = [['M', 1], ['G', 1024], ['K', 0.001]];
        for(s=0; s < size_arr.length; s++) {
          if($(this).text().indexOf(size_arr[s][0]) > -1) {
            this_size = $(this).text().split(size_arr[s][0])[0]*size_arr[s][1];
          }
        }
        sum+=this_size;        
      });
      
      // Stats
      $("#counter").text($(selectors).length);
      $("#total_size").text(sum.toFixed(2)+" MB ("+(sum/1024).toFixed(2)+" GB)");
    });
    
    
    
  });
}

engine();