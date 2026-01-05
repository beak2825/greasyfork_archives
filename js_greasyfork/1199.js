// ==UserScript==
// @name        Red Skin Images
// @namespace   http://localhost
// @include     http://www.zeldauniverse.net/*
// @version     3
// @grant       none
// @description tentatively calling this done
// @downloadURL https://update.greasyfork.org/scripts/1199/Red%20Skin%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/1199/Red%20Skin%20Images.meta.js
// ==/UserScript==

var images = document.getElementsByTagName ("img");
var cross=0;
while(cross<images.length)
{
if(images[cross].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/cross.png")
{
images[cross].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture34208.png";
}
cross=cross+1;
}

var images = document.getElementsByTagName ("img");
var wo=0;
while(wo<images.length)
{
if(images[wo].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/whos_online.gif")
{
images[wo].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34175.png";
}
wo=wo+1;
}

var images = document.getElementsByTagName ("img");
var wo=1;
while(wo<images.length)
{
if(images[wo].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/birthday.gif")
{
images[wo].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34176.png";
}
wo=wo+1;
}

var images = document.getElementsByTagName ("img");
var wo=2;
while(wo<images.length)
{
if(images[wo].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/stats.gif")
{
images[wo].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34177.png";
}
wo=wo+1;
}

var images = document.getElementsByTagName ("img");
var pm=0;
while(pm<images.length)
{
if(images[pm].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/pm_new.gif")
{
images[pm].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture34171.png";
}
pm=pm+1;
}

var images = document.getElementsByTagName ("img");
var pm=1;
while(pm<images.length)
{
if(images[pm].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/pm_old.gif")
{
images[pm].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34137.png";
}
pm=pm+1;
}

var images = document.getElementsByTagName ("img");
var pm=2;
while(pm<images.length)
{
if(images[pm].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/pm_forwarded.gif")
{
images[pm].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture34169.png";
}
pm=pm+1;
}

var images = document.getElementsByTagName ("img");
var pm=3;
while(pm<images.length)
{
if(images[pm].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/pm_replied.gif")
{
images[pm].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture34172.png";
}
pm=pm+1;
}

var images = document.getElementsByTagName ("img");
var co=2;
while(co<images.length)
{
if(images[co].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/collapse_thead.gif")
{
images[co].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32453.png";
}
co=co+1;
}

var images = document.getElementsByTagName ("img");
var co=3;
while(co<images.length)
{
if(images[co].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/collapse_thead_collapsed.gif")
{
images[co].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32470.png";
}
co=co+1;
}

var images = document.getElementsByTagName ("img");
var co=0;
while(co<images.length)
{
if(images[co].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/collapse_tcat.gif")
{
images[co].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32453.png";
}
co=co+1;
}

var images = document.getElementsByTagName ("img");
var co=1;
while(co<images.length)
{
if(images[co].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/collapse_tcat_collapsed.gif")
{
images[co].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32470.png";
}
co=co+1;
}

var images = document.getElementsByTagName ("img");
var status=0;
while(status<images.length)
{
if(images[status].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/user_online.gif")
{
images[status].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34166.png";
}
status=status+1;
}

var images = document.getElementsByTagName ("img");
var status=1;
while(status<images.length)
{
if(images[status].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/user_offline.gif")
{
images[status].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34167.png";
}
status=status+1;
}

var images = document.getElementsByTagName ("img");
var status=2;
while(status<images.length)
{
if(images[status].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/user_invisible.gif")
{
images[status].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34168.png";
}
status=status+1;
}

var images = document.getElementsByTagName ("img");
var quote=0;
while(quote<images.length)
{
if(images[quote].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/viewpost.gif")
{
images[quote].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32457.png";
}
quote=quote+1;
}


var images = document.getElementsByTagName ("img");
var subforum=0;
while(subforum<images.length)
{
if(images[subforum].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/subforum_new.gif")
{
images[subforum].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34162.png";
}
subforum=subforum+1;
}

var images = document.getElementsByTagName ("img");
var subforum=1;
while(subforum<images.length)
{
if(images[subforum].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/subforum_old.gif")
{
images[subforum].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34165.png";
}
subforum=subforum+1;
}

var images = document.getElementsByTagName ("img");
var subforum=2;
while(subforum<images.length)
{
if(images[subforum].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/subforum_old_lock.gif")
{
images[subforum].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34163.png";
}
subforum=subforum+1;
}

var images = document.getElementsByTagName ("img");
var subforum=3;
while(subforum<images.length)
{
if(images[subforum].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/subforum_new_lock.gif")
{
images[subforum].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34162.png";
}
subforum=subforum+1;
}

var images = document.getElementsByTagName ("img");
var t=0;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/navbits_finallink_ltr.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34160.png";
}
t=t+1;
}


var images = document.getElementsByTagName ("img");
var t=1;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/navbits_start.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34159.png.png";
}
t=t+1;
}

//buttons

var images = document.getElementsByTagName ("img");
var b=0;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/head-left.jpg")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32441.png";
}
b=b+1;
}


var images = document.getElementsByTagName ("img");
var b=1;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/threadclosed.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32528.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=2;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/newthread.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32535.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=3;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/subscribe.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32471.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=4;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/sortdesc.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32470.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=5;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/sortasc.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32453.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=6;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/sendpm.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32534.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=7;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/reputation.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32467.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=8;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/report.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32466.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=9;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/reply_small.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34096.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=10;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/reply.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32521.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=11;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/quote.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32522.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=12;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/post_thanks.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32527.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=13;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/multiquote_on.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32525.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var b=14;
while(b<images.length)
{
if(images[b].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/multiquote_off.gif")
{
images[b].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32526.png";
}
b=b+1;
}

var images = document.getElementsByTagName ("img");
var u=0;
while(u<images.length)
{
if(images[u].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/lastpost.gif")
{
images[u].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32457.png";
}
u=u+1;
}

var images = document.getElementsByTagName ("img");
var u=1;
while(u<images.length)
{
if(images[u].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/ip.gif")
{
images[u].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32456.png";
}
u=u+1;
}

var images = document.getElementsByTagName ("img");
var u=2;
while(u<images.length)
{
if(images[u].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/home.gif")
{
images[u].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32455.png";
}
u=u+1;
}

var images = document.getElementsByTagName ("img");
var u=3;
while(u<images.length)
{
if(images[u].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/forward.gif")
{
images[u].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32533.png";
}
u=u+1;
}

var images = document.getElementsByTagName ("img");
var u=4;
while(u<images.length)
{
if(images[u].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/firstnew.gif")
{
images[u].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32453.png";
}
u=u+1;
}

var images = document.getElementsByTagName ("img");
var t=0;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/reply.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32521.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=0;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/edit.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32529.png";
}
t=t+1;
}

//icons


var images = document.getElementsByTagName ("img");
var t=0;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34078.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=1;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_hot.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34076.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=2;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34079.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=3;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_hot.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34074.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=4;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_new.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34080.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=5;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_hot_new.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34077.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=6;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_new.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34081.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var t=7;
while(t<images.length)
{
if(images[t].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_hot_new.gif")
{
images[t].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34149.png";
}
t=t+1;
}

var images = document.getElementsByTagName ("img");
var l=0;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_lock.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34146.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=1;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_lock_new.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34148.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=2;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_lock.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34145.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=3;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_lock_new.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34147.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=4;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_hot_lock.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34143.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=5;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_hot_lock.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34142.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=6;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_hot_lock_new.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34144.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=7;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_dot_hot_lock_new.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34161.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=8;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_moved.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34209.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var l=8;
while(l<images.length)
{
if(images[l].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/thread_moved_new.gif")
{
images[l].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34209.png";
}
l=l+1;
}

var images = document.getElementsByTagName ("img");
var f=0;
while(f<images.length)
{
if(images[f].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/forum_old_lock.gif")
{
images[f].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34086.png";
}
f=f+1;
}

var images = document.getElementsByTagName ("img");
var f=1;
while(f<images.length)
{
if(images[f].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/forum_old.gif")
{
images[f].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34087.png";
}
f=f+1;
}

var images = document.getElementsByTagName ("img");
var f=2;
while(f<images.length)
{
if(images[f].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/forum_new.gif")
{
images[f].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34082.pngg";
}
f=f+1;
}

var images = document.getElementsByTagName ("img");
var f=3;
while(f<images.length)
{
if(images[f].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/forum_new_lock.gif")
{
images[f].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34085.png";
}
f=f+1;
}

var images = document.getElementsByTagName ("img");
var h=0;
while(h<images.length)
{
if(images[h].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/menu_open.gif")
{
images[h].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34092.png";
}
h=h+1;
}

var images = document.getElementsByTagName ("img");
var h=0;
while(h<images.length)
{
if(images[h].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/im_skype.gif")
{
images[h].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34093.png";
}
h=h+1;
}

var images = document.getElementsByTagName ("img");
var h=1;
while(h<images.length)
{
if(images[h].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/infraction.gif")
{
images[h].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34094.png";
}
h=h+1;
}

var images = document.getElementsByTagName ("img");
var h=2;
while(h<images.length)
{
if(images[h].src == "http://www.zeldauniverse.net/forums/images/zustyle/buttons/quickreply.gif")
{
images[h].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34096.png";
}
h=h+1;
}

//editor


var images = document.getElementsByTagName ("img");
var e=0;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/color.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34200.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=1;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/smilie.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34122.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=2;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/undo.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34198.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=3;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/redo.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34199.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=4;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/bold.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34125.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=5;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/italic.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34126.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=6;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/underline.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34127.png";
}
e=e+1;
}

var images = document.getElementsByTagName ("img");
var e=7;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/justifyleft.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34128.png";
}
e=e+1;
}

var e=8;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/justifycenter.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34129.png";
}
e=e+1;
}

var e=9;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/justifyright.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34130.png";
}
e=e+1;
}

var e=10;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/insertorderedlist.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34131.png";
}
e=e+1;
}

var e=11;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/insertunorderedlist.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34132.png";
}
e=e+1;
}

var e=12;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/outdent.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34133.png";
}
e=e+1;
}

var e=13;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/indent.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34134.png";
}
e=e+1;
}

var e=14;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/createlink.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34135.png";
}
e=e+1;
}

var e=15;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/unlink.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34136.png";
}
e=e+1;
}

var e=16;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/email.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34137.png";
}
e=e+1;
}

var e=17;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/insertimage.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34138.png";
}
e=e+1;
}

var e=18;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/quote.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34139.png";
}
e=e+1;
}

var e=19;
while(e<images.length)
{
if(images[e].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/separator.gif")
{
images[e].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34140.png";
}
e=e+1;
}

var editor=0;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/cut.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34193.png";
}
editor=editor+1;
}

var editor=1;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/copy.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34194.png";
}
editor=editor+1;
}

var editor=2;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/paste.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34195.png";
}
editor=editor+1;
}

var editor=3;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/switchmode.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34196.png";
}
editor=editor+1;
}

var editor=4;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/removeformat.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34197.png";
}
editor=editor+1;
}

var editor=5;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/code.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34203.png";
}
editor=editor+1;
}

var editor=6;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/html.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34205.png";
}
editor=editor+1;
}

var editor=7;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/zustyle/editor/php.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34204.png";
}
editor=editor+1;
}

var editor=8;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/misc/spoiler.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34201.png";
}
editor=editor+1;
}

var editor=9;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/misc/youtube.png")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34206.png";
}
editor=editor+1;
}

var editor=10;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/editor/table.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34202.png";
}
editor=editor+1;
}

var editor=11;
while(editor<images.length)
{
if(images[editor].src == "http://www.zeldauniverse.net/forums/images/strikethrough.gif")
{
images[editor].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3822-picture34207.png";
}
editor=editor+1;
}

var wegh=0;
while(wegh<images.length)
{
if(images[wegh].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/announcement_new.gif")
{
images[wegh].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34082.png";
}
wegh=wegh+1;
}

var wegh=1;
while(wegh<images.length)
{
if(images[wegh].src == "http://www.zeldauniverse.net/forums/images/zustyle/statusicon/announcement_old.gif")
{
images[wegh].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3821-picture34087.png";
}
wegh=wegh+1;
}

var wegh=2;
while(wegh<images.length)
{
if(images[wegh].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/poll_posticon.gif")
{
images[wegh].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32443.png";
}
wegh=wegh+1;
}

var wegh=0;
while(wegh<images.length)
{
if(images[wegh].src == "http://www.zeldauniverse.net/forums/images/zustyle/misc/calendar.gif")
{
images[wegh].src = "http://www.zeldauniverse.net/forums/members/5354883-albums3659-picture32554t.png";
}
wegh=wegh+1;
}