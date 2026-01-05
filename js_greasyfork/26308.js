// ==UserScript==
// @name        Logtime Plus
// @namespace   profile.intra.42.fr
// @include     https://profile.intra.42.fr/
// @version     1.3
// @grant       none
// @description https://github.com/pcluchet/logtime-plus
// @downloadURL https://update.greasyfork.org/scripts/26308/Logtime%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/26308/Logtime%20Plus.meta.js
// ==/UserScript==
 
function minTommss(minutes){
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + "h" + (sec < 10 ? "0" : "") + sec;
}

function load_js()
   {
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.src= 'https://profile.intra.42.fr/assets/application-a482bc20dff3485ff22a2d7350c86b65accb523b5f0b6f711d36840efbefc37d.js';
      head.appendChild(script);
   }
 
 
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
 
function get_n(add, n){
    //console.log("Birdel0");
    var tt = n + add;
    console.log('n : ' + n + " add : " + add);
   if (tt == 0)
  {
   return 12;
  }
  else if ( tt < 0)
    {
      return 11;
    }
    else
        {
  return n+add;
        }
}

function disp_hint_top(event){

                              var box = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                             var svg = document.getElementById("user-locations");
                             var s = new XMLSerializer();
                // get the inner DOM of alpha.svg
                    console.log('target = '+ s.serializeToString(event.target));
               
                             var sum = event.target.parentNode.getAttribute('hoursum');
                             var x = parseFloat(event.target.parentNode.getAttribute('spoof_x'));
                             var y = parseFloat(event.target.parentNode.getAttribute('spoof_y'));
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
                         to_add.setAttribute("x", x+17);
                         to_add.setAttribute("y", y-5);
                         to_add.setAttribute("fill", '#fff');
                         to_add.setAttribute("width", '53');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("filter", 'url(#black-glow)');
                         to_add.setAttribute("font-family", 'sans-serif');
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'text')
                         to_add.setAttribute("x", x+28);
                         to_add.setAttribute("y", y+11);
                         to_add.setAttribute("fill", '#444');
                         to_add.setAttribute("width", '42');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("font-family", 'sans-serif');
                         to_add.setAttribute("font-size", '13');
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                         var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'line')
                         to_add.setAttribute("x1", x+16);
                         to_add.setAttribute("y1", y-5);
                         to_add.setAttribute("x2", x+16);
                         to_add.setAttribute("y2", y+18);
                         to_add.setAttribute("stroke", '#666');
                         to_add.setAttribute("stroke-width", '1');
                        
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             
                             console.log("created id = ", sum + x + y);
                         //to_add.innerHTML = minTommss(tot);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
                         to_add.setAttribute("x", x+9);
                         to_add.setAttribute("y", y+8);
                         to_add.setAttribute("fill", '#666');
                             var p1x = x+10;
                             var p1y = y+8;
                             var p2x = x+16;
                             var p2y = y+2;
                             var p3x = x+16;
                             var p3y = y+14;
                         to_add.setAttribute("points", p1x + ' ' + p1y + ', ' + p2x + ' ' + p2y + ', ' + p3x + ' ' + p3y);
                             console.log('attribut pts :' + to_add.getAttribute('points'));
                         to_add.setAttribute("height", '17');
                          box.appendChild(to_add);
                          svg.appendChild(box);
                            
                             console.log("sum =" +sum);
                             
                             //alert('sum = ' + sum);
          
                         }

function disp_hint(event){
                             console.log('FIREF');
                              var box = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                             var svg = document.getElementById("user-locations");
                             var s = new XMLSerializer();
                // get the inner DOM of alpha.svg
                    console.log('target = '+ s.serializeToString(event.target));
               
                             var sum = event.target.getAttribute('hoursum');
                             var x = parseFloat(event.target.getAttribute('x'));
                             var y = parseFloat(event.target.getAttribute('y'));
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
                         to_add.setAttribute("x", x+17);
                         to_add.setAttribute("y", y-5);
                         to_add.setAttribute("fill", '#fff');
                         to_add.setAttribute("width", '53');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("filter", 'url(#black-glow)');
                         to_add.setAttribute("font-family", 'sans-serif');
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'text')
                         to_add.setAttribute("x", x+28);
                         to_add.setAttribute("y", y+11);
                         to_add.setAttribute("fill", '#444');
                         to_add.setAttribute("width", '42');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("font-family", 'sans-serif');
                         to_add.setAttribute("font-size", '13');
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                         var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'line')
                         to_add.setAttribute("x1", x+16);
                         to_add.setAttribute("y1", y-5);
                         to_add.setAttribute("x2", x+16);
                         to_add.setAttribute("y2", y+18);
                         to_add.setAttribute("stroke", '#666');
                         to_add.setAttribute("stroke-width", '1');
                        
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             
                             console.log("created id = ", sum + x + y);
                         //to_add.innerHTML = minTommss(tot);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
                         to_add.setAttribute("x", x+9);
                         to_add.setAttribute("y", y+8);
                         to_add.setAttribute("fill", '#666');
                             var p1x = x+10;
                             var p1y = y+8;
                             var p2x = x+16;
                             var p2y = y+2;
                             var p3x = x+16;
                             var p3y = y+14;
                         to_add.setAttribute("points", p1x + ' ' + p1y + ', ' + p2x + ' ' + p2y + ', ' + p3x + ' ' + p3y);
                             console.log('attribut pts :' + to_add.getAttribute('points'));
                         to_add.setAttribute("height", '17');
                          box.appendChild(to_add);
                          svg.appendChild(box);
                            
                             console.log("sum =" +sum);
                             
                             //alert('sum = ' + sum);
          
                         }

function disp_hint_reverse( event ) {
                             console.log('FIREF');
                              var box = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                             var svg = document.getElementById("user-locations");
                             var s = new XMLSerializer();
                // get the inner DOM of alpha.svg
                    console.log('target = '+ s.serializeToString(event.target));
               
                             var sum = event.target.getAttribute('hoursum');
                             var x = parseFloat(event.target.getAttribute('x'));
                             var y = parseFloat(event.target.getAttribute('y'));
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
                         to_add.setAttribute("x", x-7-53);
                         to_add.setAttribute("y", y-5);
                         to_add.setAttribute("fill", '#fff');
                         to_add.setAttribute("width", '53');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("filter", 'url(#black-glow)');
                         to_add.setAttribute("font-family", 'sans-serif');
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'text')
                         to_add.setAttribute("x", x-8-42);
                         to_add.setAttribute("y", y+11);
                         to_add.setAttribute("fill", '#444');
                         to_add.setAttribute("width", '42');
                         to_add.setAttribute("height", '22');
                         to_add.setAttribute("font-family", 'sans-serif');
                         to_add.setAttribute("font-size", '13');
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                         var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'line')
                         to_add.setAttribute("x1", x-6);
                         to_add.setAttribute("y1", y-5);
                         to_add.setAttribute("x2", x-6);
                         to_add.setAttribute("y2", y+18);
                         to_add.setAttribute("stroke", '#666');
                         to_add.setAttribute("stroke-width", '1');
                        
                         to_add.innerHTML = sum;
                         box.setAttribute("id", sum + x + y);
                         box.appendChild(to_add);
                             
                             
                             console.log("created id = ", sum + x + y);
                         //to_add.innerHTML = minTommss(tot);
                             
                             var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
                         to_add.setAttribute("x", x+9);
                         to_add.setAttribute("y", y+8);
                         to_add.setAttribute("fill", '#666');
                             var p1x = x-1;
                             var p1y = y+8;
                             var p2x = x-6;
                             var p2y = y+2;
                             var p3x = x-6;
                             var p3y = y+14;
                         to_add.setAttribute("points", p1x + ' ' + p1y + ', ' + p2x + ' ' + p2y + ', ' + p3x + ' ' + p3y);
                             console.log('attribut pts :' + to_add.getAttribute('points'));
                         to_add.setAttribute("height", '17');
                          box.appendChild(to_add);
                          svg.appendChild(box);
                            
                             console.log("sum =" +sum);
                             
                             //alert('sum = ' + sum);
          
                         }

function remove_hint( event ) {
                              console.log('MOUSEOUT');
                             var svg = document.getElementById("user-locations");
                             var s = new XMLSerializer();
                    //console.log('svg = '+ s.serializeToString(event.target));
                             var sum = event.target.getAttribute('hoursum');
                             var x = event.target.getAttribute('x');
                             var y = event.target.getAttribute('y');
                             
                             var to_remove = document.getElementById(sum + x + y);

                             to_remove.parentNode.removeChild(to_remove);

                         }

function remove_hint_spoof( event ) {
                              console.log('MOUSEOUT');
                             var svg = document.getElementById("user-locations");
                             var s = new XMLSerializer();
                    //console.log('svg = '+ s.serializeToString(event.target));
                             var sum = event.target.parentNode.getAttribute('hoursum');
                             var x = event.target.parentNode.getAttribute('spoof_x');
                             var y = event.target.parentNode.getAttribute('spoof_y');
                             
                             var to_remove = document.getElementById(sum + x + y);

                             to_remove.parentNode.removeChild(to_remove);

                         }
 
 
window.onload = function(){
   
    var mois = [];
mois[1] = 0.0;
mois[2] = 0.0;
mois[3] = 0.0;
mois[4] = 0.0;
mois[5] = 0.0;
mois[6] = 0.0;
mois[7] = 0.0;
mois[8] = 0.0;
mois[9] = 0.0;
mois[10] = 0.0;
mois[11] = 0.0;
mois[12] = 0.0;
  
var mois_j = [];
  
  for (var w = 0; w <= 12; w++)
    {
      var jours = [];
      for (var z = 0; z <= 31; z++)
         {
            jours[z] = 0.0;
         }  
            mois_j[w] = jours;
    }

 
 
var months = [];
months[1] = 'Janvier';
months[2] = 'Febrier';
months[3] = 'Mars';
months[4] = 'April';
months[5] = 'May';
months[6] = 'June';
months[7] = 'July';
months[8] = 'August';
months[9] = 'Septembre';
months[10] = 'Octobre';
months[11] = 'Novembre';
months[12] = 'Decembre';
   
    var jl = document.getElementsByClassName("container-inner-item boxed");
var logtimes = document.getElementById("user-locations").getAttribute("data-location-graph");
   
    logtimes = logtimes.substr(1);
logtimes = logtimes.substr(0, logtimes.length - 1);
var set = logtimes.split(",");
 
set.forEach(function(element) {
 
    var base = element.split(":");
    var annee = base[0].substr(1,4);
    var ms = base[0].substr(6,2);
    var jour = base[0].substr(9,2);
 
    var heures = base[1].substr(1,2);
    var minutes = base[2];
    var secondes = base[3].substr(0,2);
 
    mois[parseInt(ms)] += parseInt(heures) + parseInt(minutes)/60;//+(parseInt(minutes)/60)*10);
    mois_j[parseInt(ms)][parseInt(jour)] = parseInt(heures) + parseInt(minutes)/60;
 
});
  
//  console.log('mj = ' + mois_j);
 
var d = new Date();
  console.log("la date c: " + d.toISOString());
var n = d.getMonth();
var total = mois[n-1] + mois[n-0] + mois[n+1];
 
var t = document.createElement("div");
 
t.innerHTML = '<h4>Logtime Plus : '+ minTommss(total) + '</h4>';
n = get_n(-1,d.getMonth());
t.innerHTML = t.innerHTML + months[n-1] +' : '+ minTommss(mois[n-1])+'<br/>';
n = get_n(0,d.getMonth());
t.innerHTML = t.innerHTML + months[n-0]+' : '+minTommss(mois[n-0])+'<br/>';
n = d.getMonth();
t.innerHTML = t.innerHTML + months[n+1]+' : '+minTommss(mois[n+1])+'<br/>';
 
 
 
var k = jl[2].getElementsByClassName('profile-title');
 
k[0].innerHTML = 'Logtime⁺';
 
    var svg = document.getElementById("user-locations");
  
  	//this kills the handlers
  	//svg.innerHTML = svg.innerHTML;
  
  
    svg.setAttribute('viewBox','0 0 610 200');
    var s = new XMLSerializer();
                // get the inner DOM of alpha.svg
                    console.log('svg = '+ s.serializeToString(svg));
                   var svgBrut = s.serializeToString(svg);
               
   
   
                var parser = new DOMParser();
                //var svgDoc = parser.parseFromString(svgBrut, "text/xml");
                var svgDoc = svg;
                var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    defs.innerHTML = "<filter id=\"black-glow\">\
    <feColorMatrix type=\"matrix\" values=\
                \"0 0 0 0   0\
                 0 0 0 0   0\
                 0 0 0 0   0\
                 0 0 0 0.1 0\"/>\
    <feGaussianBlur stdDeviation=\"2.5\" result=\"coloredBlur\"/>\
    <feMerge>\
        <feMergeNode in=\"coloredBlur\"/>\
        <feMergeNode in=\"SourceGraphic\"/>\
    </feMerge>\
</filter>";
                svgDoc.insertBefore(defs, svgDoc.firstChild);
        
                var elemcol = [];
                var texts = svgDoc.getElementsByTagName("*");
                var kmatch = 999;
                var oldx = 0;
                var oldy = 0;
                var tot = 0.0;
                var match = false;
                var last = false;
                var max = texts.length;
                for(var i = 0; i <= max; i++) {
                    if ( i == max)
                        last = true;
                  /*
                  if (texts[i].tagName = 'g' && texts[i].firstChild && texts[i].firstChild.tagName == 'rect')
                  {
                    var sum = 0.0;
                    
                    n = get_n(kmatch,d.getMonth());
                    sum = mois_j[n+kmatch][texts[i].childNodes[1].innerHTML]
                    
                    console.log('en x =' + texts[i].childNodes[0].getAttribute('x'));
                    texts[i].setAttribute("hoursum", minTommss(sum));
                    texts[i].setAttribute("spoof_x", texts[i].childNodes[0].getAttribute('x') );
                    texts[i].setAttribute("spoof_y", texts[i].childNodes[0].getAttribute('y') );
            		texts[i].addEventListener("mouseover", disp_hint_top);
                    texts[i].addEventListener("mouseout",remove_hint_spoof);
                    console.log('g');
                  }
                 */
                   // console.log('elem: '+ texts[i].innerHTML);
                   
                  //valeurs a coté du nom du mois
                    for(var k = -2; k <= 1; k++)
                        {
                    n = get_n(k, d.getMonth());
                    var moistxt = months[n];
                    //console.log('mois = ' + moistxt);
                    //console.log('cmp = ' + moistxt.substr(0,3) + "html = "+ texts[i].innerHTML);
                   
                    if (texts[i].innerHTML == moistxt.substr(0,3))
                        {
                          match = true;
                          kmatch = k;
                            console.log("moistxt =" + moistxt + "k = " + k);
                            console.log("MATCH MATCH MATCH");
                            texts[i].innerHTML = moistxt.substr(0,3) +"  -  " + minTommss(mois[n]);  
                            texts[i].setAttribute('font-size','12');
                            if (k == -2)
                                {
                                  texts[i].setAttribute('x','50');
                                }
                            else if (k == -1)
                                {
                                  texts[i].setAttribute('x','195');
                                }
                            else if (k == 0)
                                {
                                  texts[i].setAttribute('x','339');
                                }
                            else if (k == 1)
                                {
                                  texts[i].setAttribute('x','480');
                                }
                        }  
                    }
                  
                  //decalage pour faire la place du temps semaine
                  var xxx = parseFloat(texts[i].getAttribute('x'));
                  var yyy = parseFloat(texts[i].getAttribute('y'));
                   			if (kmatch == -2)
                                {
                                   xxx += -10;
                                  texts[i].setAttribute('x',xxx);
                                }
                            else if (kmatch == -1)
                                {
                                  texts[i].setAttribute('x',xxx);
                                }
                            else if (kmatch == 0)
                                {
                                   xxx += 10;
                                  texts[i].setAttribute('x',xxx);
                                }
                            else if (kmatch == 1)
                                {
                                  xxx += 20;
                                  texts[i].setAttribute('x',xxx);
                                }
                  //fin de semaine ou besoin d'écrire le total de semaine
                  if ( oldx == 120.5 || oldx == 274.5 || oldx == 582.5 || oldx == 428.5 ||  match || last)
                    {
                      //creation du rectangle coloré pour la semaine
                        var box = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                        var to_add = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                        
                        var en_x = 0;
                        if (match)
                            kmatch -= 1;
                         console.log('mois = ' + kmatch);
                        
                         if (kmatch == -2)
                                {
                                   en_x = 135.5;
                                }
                            else if (kmatch == -1)
                                {
                                   en_x = 289.5;
                                }
                            else if (kmatch == 0)
                                {
                                     en_x = 443.5;
                                }
                            else if (kmatch == 1)
                                {
                                     en_x = 597.5;
                                }
                        if (match)
                            kmatch += 1;
                        
                         to_add.setAttribute("x", en_x);
                         to_add.setAttribute("y", oldy-10);
                         if (tot)
                             {
                                var color = '#2CD57B';
                                 var ratio = (tot/60);
                             }
                         else
                             {
                                var color = '#F5F5F5';
                                var ratio = 1;
                             }
                         to_add.setAttribute("fill", color );
                         
                         to_add.setAttribute("fill-opacity", ratio);
                         to_add.setAttribute("width", '7');
                         to_add.setAttribute("height", '17');
                         to_add.setAttribute("font-family", 'sans-serif');
                         to_add.setAttribute("font-size", '8');
                         to_add.setAttribute("hoursum", minTommss(tot));
                        var tmp = oldx-5;
                        var tmp2 = oldy-10;
                        box.appendChild(to_add);
                        
                        
                        //ajout des listeners pour afficher le temps lors du survol.
                        if (!(last || kmatch == 1)) 
                           box.addEventListener("mouseover", disp_hint);
                        else 
                           box.addEventListener("mouseover",disp_hint_reverse);
                        
                         box.addEventListener("mouseout",remove_hint);
                         
                         svg.appendChild(box);
                        
                     
                      tot = 0.0;
                    }
                  n = get_n(kmatch,d.getMonth());
                  if (parseInt(texts[i].innerHTML) && kmatch != 999)
                    {
                    //  console.log("trying to get [" + n +"+"+kmatch + "][" + texts[i].innerHTML +"]");
                    // console.log("inside = " + mois_j[n+kmatch][texts[i].innerHTML]);
                       tot += mois_j[n][texts[i].innerHTML];
                    }
                  
                  if (xxx)
                      oldx = xxx;
                  else
                      oldx = -100;
                  if (xxx)
                      oldy = yyy;
                  match = false
 
                }       
                     
            };
