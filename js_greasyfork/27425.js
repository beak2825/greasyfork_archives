// ==UserScript==
// @name        DDL@ebook-dl.com
// @namespace   DDL@ebook-dl.com
// @description Enables direct/faster downloads of ebooks on ebook-dl.com. 
// @include     http://ebook-dl.com/*
// @icon        http://ebook-dl.com/assets/images/favicon.png
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @date        03.05.2017
// @version     1.3.1
// @author      Paxae3
// @copyright   2017, Paxae3
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/27425/DDL%40ebook-dlcom.user.js
// @updateURL https://update.greasyfork.org/scripts/27425/DDL%40ebook-dlcom.meta.js
// ==/UserScript==

// debugging option
var LOGGING        = false;

// global semaphore for blocking further download requests, if previous ones haven't finished yet 
var ACTION_PENDING = false;

var HOST           = "http://ebook-dl.com";

// bypass our own version of jQuery
var $J = jQuery.noConflict( true );

// add timeout for all ajax requests
$J.ajaxSetup({timeout:2000});

//
// logs param into console, depending on global logging value
//
function log(text) 
{
  if(!LOGGING)return;
  console.log("DDL@ebook-dl: "+text);  
}

//
// generates/extracts IDs from eBook-URL 
//
function getIDfromURL(url)
{
  return url.substring(url.lastIndexOf('/')+1);
}

//
// switches hover color of generated download links to submitted value
//
function toggleLinkColor(color)
{
  $J("#hoverColor").html('h3[download]:hover {color: '+color+'!important;}');
  log("Link colors toggled to "+color);
}

//
// checks if download exists or not - gives us chance to handle errors by ourselves
//
function fileExists(url)
{
  url = url.trim();
  
  var response = $J.ajax({
    url: url,
    type: 'HEAD',
    async: false
  }).status;  
  log('File with URL "'+url+'" does'+((response !== 200)?'\'nt':'')+ ' exist!');
  return response === 200;
}

//
// adds icon to link with Bootstrap-IconClass and Bootstrap-ColorClass
//
function addIcon(h3LinkObject, stringIconClass, stringColor)
{
  $J(h3LinkObject).find("div[icon]").attr( "class", "fa fa-"+stringIconClass).css("color",stringColor);
  log('Icon added: '+stringIconClass+' in color '+stringColor);  
}


// create download-buttons on all relating links
$J(".post-content .image-box.effect.dia").append('<div class="image-box-content" style="top:0px;bottom:auto;position:absolute;" download>'+
                                         '<h3 style="color:#333;width:100%;'+
                                         '           text-align:center;'+
                                         '           background-color:darkgrey;'+
                                         '           border: 4px solid darkgrey;'+
                                         '           border-radius:4px;'+
                                         '           padding-left:10px;'+
                                         '           padding-right:10px;'+
                                         '           display:inline;position:relative;" download>Download'+
                                         '<div class="fa" style="position:absolute;right:10px;top:2px;" icon></div>'+ 
                                         '</h3>'+
                                                
                                   '</div>');
log("download buttons created.");

// some general styles for our donwload-buttons
$J('head').append('<style>*[download]       {transform: translate3d(0, -100%, 0)!important;}'+
                 '       .image-box.effect.dia:hover .image-box-content,'+
                 '       .image-box.effect.dia:hover h3 {transform: translate3d(0, 0, 0)!important;}'+
                 '</style>');
log("styles for download buttons added [1/2].");

// hover style for link color - changeable by switching css inside html tag
$J('head').append('<style id="hoverColor"> h3[download]:hover   {color: green!important;}</style>');
log("styles for download buttons added [2/2].");

// add event-listener to all new download-buttons
$J("h3[download]").click( function(e)
                         { 
                            log("action catched.");
                            e.stopPropagation();
                            if(ACTION_PENDING)
                            {
                              log("action rejected - another action processed already.");
                              return;
                            }
                            ACTION_PENDING = true;
                            toggleLinkColor("orange");
                            
                            // add pending icon
                            addIcon(this, "cog fa-spin fa-fw", "orange"); 
                            var _this = this;

                            log("trying to fetch data from "+HOST+"/downloadbook/" + getIDfromURL( $J(_this).parent().prev().attr("href"))+"/ ...");
                            
                            // getting download page
                            $.ajax({
                                url: "/downloadbook/" + getIDfromURL( $J(_this).parent().prev().attr("href")),
                                type: "GET",
                               // dataType: "text/html",
                                timeout: 2000,
                                success: function(response) 
                                         { 
                                              log("data received.");
                              
                                              // getting download link                              
                                              const regex = /url=(\S*)"/g;                                    
                                              var   m,tmp;

                                              while ((tmp = regex.exec(response)) !== null)
                                              {
                                                m = tmp;
                                                // This is necessary to avoid infinite loops with zero-width matches
                                                if (m.index === regex.lastIndex) 
                                                {
                                                  regex.lastIndex++;
                                                }                                        
                                              }
                                              log("data processed."); 

                                              if(m.length > 0)
                                              {                                          
                                                  log("extracted download url: "+m[1]);

                                                  // download exists?
                                                  if(fileExists(HOST + m[1]))
                                                  {
                                                     // starting download
                                                     log("starting download ...");
                                                     window.location.href = HOST + m[1];
                                                  }
                                                  else
                                                  { 
                                                     // set link color to red
                                                     $J(_this).css('color','red');

                                                     // add error icon
                                                     addIcon(_this, "exclamation-circle", "red");
                                                  }
                                              }
                                              else
                                              {
                                                log("no download link found!");
                                              }

                                              ACTION_PENDING = false;
                                              toggleLinkColor("green");

                                              // add success icon
                                              addIcon(_this, "check-circle", "green");
                                      
                                         },
                                error:   function(x, t, m) 
                                         {
                                            log("failed to fetch download page: "+HOST+"/downloadbook/" + getIDfromURL( $J(_this).parent().prev().attr("href") ));
                                               
                                            
                                            toggleLinkColor("green");                                            
                                            ACTION_PENDING = false;
                                           
                                            // set link color to red
                                            $J(_this).css('color','red');

                                            // add error icon
                                            addIcon(_this, "exclamation-circle", "red");
                                            
                                         }
                            });  
                          });
log("listeners added.");                                           
