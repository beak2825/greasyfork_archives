// ==UserScript==
// @name         HWM ChainHighlighting
// @namespace    https://greasyfork.org/ru/scripts/424816-hwm-chainhighlighting
// @version      0.7
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/war\.php.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/424816/HWM%20ChainHighlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/424816/HWM%20ChainHighlighting.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let highlightedCoords = []
    let highlightedDamage = []
    let damageSprites = []

    let defaultSettings = getDefaultSettings()
    let settings = {}
    loadSettings()
    let startId;
    startId = setInterval(main, 200)


    function main() {
        if (!myuron) {
            return
        } else {
            window.clearInterval(startId)
        }
        initDamageSprites()
        stage[war_scr].calcmagic = function (i, xr, yr, magicuse){
            highlightedCoords.forEach(coords => hideCoords(coords[0], coords[1]))
            highlightedCoords = []
            highlightedDamage = []

            Totalmagicdamage=0;
            Totalmagickills=0;
            var	ok=false;
            var xx=0, yy=0, xp=0, yp=0;
            mul=1;
            if (magicpower==true) mul=1.5;
            var len = this.obj_array.length;
            for (var k1=0;k1<len;k1++)
            {
                var j = this.obj_array[k1];
                this.obj[j]['attacked']=1;
                this.obj[j]['attacked2']=1;
            };
            if ((magicuse=='magicfist')||(magicuse=='angerofhorde')){
                var eff=this.obj[activeobj][magicuse+'_magiceff'];
                if ((magicuse=='magicfist')&&(this.obj[mapobj[xr+yr*defxn]]['organicarmor'])) eff=Math.round(eff*0.2);
                this.attackmagic(i, mapobj[xr+yr*defxn], eff, 'neutral', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='swarm'){
                this.attackmagic(i, mapobj[xr+yr*defxn], this.obj[activeobj][magicuse+'_magiceff'], 'other', magicuse, 0, 0, 0);
                ok=true;
            };
            if ((magicuse=='magicarrow')||(magicuse=='lighting')){
                if (this.obj[activeobj]['calllightning']){
                    this.obj[activeobj]['lighting_magiceff']=50*this.obj[activeobj]['nownumber'];
                };
                this.attackmagic(i, mapobj[xr+yr*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'air', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='icebolt'){
                this.attackmagic(i, mapobj[xr+yr*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'cold', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='implosion'){
                this.attackmagic(i, mapobj[xr+yr*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='poison'){
                this.calcpoison(i, mapobj[xr+yr*defxn], this.obj[activeobj][magicuse+'_magiceff']);
                ok=true;
            };

            if (magicuse=='mpoison'){
                for (xx=-1;xx<=1;xx++)
                    for (yy=-1;yy<=1;yy++)
                        this.calcpoison(i, mapobj[xr+xx+(yr+yy)*defxn], this.obj[activeobj][magicuse+'_magiceff']);

                ok=true;
            };



            var xx=0, yy=0, xp=0, yp=0;
            if (magicuse=='meteor'){

                var c=0;
                for (xp=-1;xp<=2;xp++){
                    for (yp=-1;yp<=2;yp++){
                        xx=xr+xp;
                        yy=yr+yp;
                        let currentObjId = mapobj[xx+yy*defxn]
                        if ((currentObjId>0)&&(!this.obj[currentObjId]['hero'])&&(!this.obj[currentObjId]['rock'])&&(this.obj[currentObjId]['attacked2'])&&(this.obj[currentObjId]['nownumber']>0)){
                            this.obj[currentObjId]['attacked2']=0;
                            showCoords(stage[war_scr].obj[currentObjId].x, stage[war_scr].obj[currentObjId].y)
                            c++;
                        };
                    };
                };
                if (c==0) c=1;
                var eff=this.obj[activeobj][magicuse+'_magiceff'];
                eff=eff*Math.pow(0.85, c-1);


                for (xx=-1;xx<=2;xx++)
                    for (yy=-1;yy<=2;yy++)
                        this.attackmagic(i, mapobj[xr+xx+(yr+yy)*defxn], Math.round(eff*mul), 'earth', magicuse, 0, 0, 0, "meteor");

                ok=true;
            };

            if (magicuse=='chainlighting'){
                var lasto=mapobj[xr+yr*defxn];

                var j=lasto;

                showCoords(stage[war_scr].obj[j].x, stage[war_scr].obj[j].y)

                this.obj[j]['attacked2']=0;
                var eff=this.obj[activeobj][magicuse+'_magiceff'];
                if (this.obj[activeobj]['spmult']>1){
                    eff = Math.round(this.obj[activeobj]['spmult']*(this.obj[activeobj]['chainlightingeffmain']+this.obj[activeobj]['chainlightingeffmult']*Math.pow(this.obj[activeobj]['nownumber'], 0.7)));
                }
                this.attackmagic(i, mapobj[xr+yr*defxn], Math.round(eff*mul), 'air', 'lighting', 0, 0, 0, "chainlighting");
                var penalty=Array(1, 0.5, 0.25, 0.125);
                for (var zz=1;zz<=3;zz++){
                    this.obj[lasto]['attacked']=0;
                    br=0;
                    bj=0;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        j = this.obj_array[k1];
                        rr=(this.obj[lasto]['x']-this.obj[j]['x'])*(this.obj[lasto]['x']-this.obj[j]['x'])
                            +(this.obj[lasto]['y']-this.obj[j]['y'])*(this.obj[lasto]['y']-this.obj[j]['y']);
                        if (((rr<br)||(br==0))&&(this.obj[j]['nownumber']>0)&&(this.obj[j]['x']<20)&&
                            (!this.obj[j]['hero'])&&(!this.obj[j]['stone'])&&(this.obj[j]['y']>=0)&&(!this.obj[j]['rock'])&&
                            (this.obj[j]['attacked2']==1)){
                            br=rr;
                            bj=j;
                        };
                    };
                    if (bj>0){
                        showCoords(stage[war_scr].obj[bj].x, stage[war_scr].obj[bj].y)
                        lasto=bj;
                        x1=this.obj[bj]['x'];
                        y1=this.obj[bj]['y'];
                        j=bj;
                        this.obj[j]['attacked2']=0;
                        this.attackmagic(i, j, Math.floor(Math.round(eff*mul)*penalty[zz]), 'air', 'lighting', 0, 0, 0, "chainlighting");
                    };
                };
                ok = true;

            };


            if (magicuse=='fireball'){
                for (xx=-1;xx<=1;xx++)
                    for (yy=-1;yy<=1;yy++)
                        this.attackmagic(i, mapobj[xr+xx+(yr+yy)*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'fire', magicuse, 0, 0, 0);

                ok=true;
            };
            if (magicuse=='stormcaller'){
                for (xx=-1;xx<=1;xx++)
                    for (yy=-1;yy<=1;yy++)
                        this.attackmagic(i, mapobj[xr+xx+(yr+yy)*defxn], Math.round(this.obj[activeobj].nownumber*10), 'air', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='firewall'){
                for (yy=-1;yy<=1;yy++)
                    this.attackmagic(i, mapobj[xr+(yr+yy)*defxn], this.obj[activeobj][magicuse+'_magiceff'], 'fire', magicuse, 0, 0, 0);
                ok=true;
            };
            if (magicuse=='circle_of_winter'){
                for (xx=-1;xx<=1;xx++)
                    for (yy=-1;yy<=1;yy++)
                        if ((xx!=0)||(yy!=0)) this.attackmagic(i, mapobj[xr+xx+(yr+yy)*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'water', magicuse, 0, 0, 0);

                ok=true;
            };

            if (magicuse=='stonespikes'){
                this.attackmagic(i, mapobj[xr+yr*defxn+1], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                this.attackmagic(i, mapobj[xr+yr*defxn-1], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                this.attackmagic(i, mapobj[xr+(yr+1)*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                this.attackmagic(i, mapobj[xr+(yr-1)*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                this.attackmagic(i, mapobj[xr+yr*defxn], Math.round(this.obj[activeobj][magicuse+'_magiceff']*mul), 'earth', magicuse, 0, 0, 0);
                ok=true;
            };
            if ((ok)&&(magicuse!='')&&(this.obj[activeobj]['hero'])&&((magicuse=='circle_of_winter')||(magicuse=='icebolt'))&&(isperk(activeobj, 99/*_PERK_MASTER_OF_ICE*/))){
//				hideatb();
                this.showatb();
            };

            if ((ok)&&(magicuse!='')&&(this.obj[activeobj]['hero'])&&(this.obj[activeobj][magicuse+'elem']=='air')&&(isperk(activeobj, 100/*_PERK_MASTER_OF_STORMS*/)) ){
//		hideatb();
                this.showatb();
            };
            if (magicuse=='chainlighting' || magicuse == "meteor"){
                showuronchain()
            }
            else if (ok) {
                showuron(1);
            }
        }
        stage[war_scr].onMouseMoveFlash = function (from_event, xmouse, ymouse, force, reset, lastcoords) {
            highlightedCoords.forEach(coords => hideCoords(coords[0], coords[1]))
            highlightedCoords = []
            highlightedDamage = []
            damageSprites.forEach(sprite => {
                set_visible(sprite[0], 0)
            })

            attack_xr = 0; attack_yr = 0;
            if (buttons_visible['win_dialog'])return 0;
            if (buttons_visible['scroll_runes'])return 0;
            if (buttons_visible['magic_book'])return 0;
            if (buttons_visible['win_SeparateArmy']) return 0;
            if (buttons_visible['win_Mission']) return 0;
            if (buttons_visible['win_Settings']) return 0;

            if (total_delta>20) return 0;

            if (typeof csword === 'undefined') return 0;

            /*	if (androidbuttondisable){
                    panel.waitbutton.enabled=true;
                    panel.openbook.enabled=true;
                    panel.defendbutton.enabled=true;
                    panel.oneskillbutton.enabled=true;
                    androidbuttondisable=false;
                }

                if ((force!=1)&&(android)) return 0;
                lasttimerfr=getTimer();*/

            //if ((androidpanel.shiftdown.shifted)&&(android)) shiftdown=true;
            //if ((!androidpanel.shiftdown.shifted)&&(android)) shiftdown=false;
            shiftdown = false;
            ctrldown = false;
            if (!android){
                var isRightMB = false;
                var e = 0;
                if (((typeof event !== 'undefined')&&(event))||(from_event)){
                    var e = from_event;
                    if ((typeof event !== 'undefined')&&(event)) e = event;

                    if (e.which)  {// Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                        if ((e.which==2)||(e.which==3))
                        {
                            isRightMB = 1;
                        }
                    } else if (e.button)  // IE, Opera
                        isRightMB = e.button >= 2;
                };

                if (KeyisDown(16))shiftdown=true;else shiftdown=false;
                if ((KeyisDown(17))||(isRightMB))ctrldown=true;else ctrldown=false;
            };
            shiftdown = (shiftdown || shift_button) && (shift_ok);
            ctrldown = ctrldown || info_button;

            if ((activeobj>0)&&(this.obj[activeobj])&&(this.obj[activeobj].hero)){
                if (this.obj[activeobj]['was_atb']>0){
                    this.reset_temp_magic();
                    this.showatb();
                    this.obj[activeobj]['was_atb'] = 0;
                }
                if ((magicuse!='')&&(this.obj[activeobj]['hero'])&&(this.obj[activeobj][magicuse+'elem']=='air')&&(isperk(activeobj, 100))){//_PERK_MASTER_OF_STORMS
                    this.reset_temp_magic();
                    this.showatb();
                };
                if ((magicuse!='')&&(this.obj[activeobj]['hero'])&&((magicuse=='circle_of_winter')||(magicuse=='icebolt'))&&(isperk(activeobj, 99))){//_PERK_MASTER_OF_ICE
                    this.reset_temp_magic();
                    this.showatb();
                };
            };
            movecounter++;

            var i = 0, bigok = false, len = 0, xk = 0, yk = 0, range = 0, xaa = 0, yaa = 0, x = 0, y = 0, xr = 0, yr = 0, a = 0, ab = 0, ac = 0, xb = 0, yb = 0, res = 0, ok = false;
            if (onrune) {
                if (lastshad>0){
                    set_visible(shado[lastshad], 0);
                    set_visible(shado[lastshad+1], 0);
                    set_visible(shado[lastshad+1+defxn], 0);
                    set_visible(shado[lastshad+defxn], 0);
                };
                lastshad=0;
                return 0;
            };

            if (itrunepanel()) {
                return 0;
            };



            attackx = 0;
            attacky = 0;
            movex = 0;
            movey = 0;
            magicx = -1;
            magicy = 0;
            scr_ymouse = ymouse;
            scr_xmouse = xmouse;

            if (lastcoords==true){
                scr_ymouse=scr_ymouselast;
                scr_xmouse=scr_xmouselast;
            }
            scr_ymouselast=scr_ymouse;
            scr_xmouselast=scr_xmouse;

            var r = getxa_from(scr_xmouse, scr_ymouse);
            x = r.x+1;
            y = r.y+1;
            xr = Math.ceil(r.x);
            yr = Math.ceil(r.y);

            if (interactive_obj>0){
                if ((xr>0)&&(yr>0)&&(xr<=defxn-2)&&(yr<=defyn)&&(mapobj[yr*defxn+xr]==interactive_obj)){
                }else{
                    xr = this.obj[interactive_obj].x;
                    yr = this.obj[interactive_obj].y;
                };
            };

            xr_last = xr;
            yr_last = yr;


            xr_z = scr_xmouse;
            yr_z = scr_ymouse;
            if (reset){
                xr_z=-100;
                yr_z=-100;
                xr=-5;
                yr=-5;
            };


            if (buttons_visible['win_InfoCreatureEffect']) return 0;
            if (buttons_visible['win_InfoHero']) return 0;
            if (buttons_visible['win_InfoCreature']) return 0;


            if ((xr>0)&&(yr>0)&&(xr<=defxn-2)&&(yr<=defyn)){
                show_coords(xr, yr);
            }else{
                show_coords(0, 0);
            };

            if (finished){
//		return 0;
            };
            if ((loader.loading) || (((someactive) || (command!=""))&&(!gpause))
                ||(buttons_visible['magic_book']) || (buttons_visible['scroll_runes'])
            ) {
                return 0;
            }

            if ((activeobj==0)&&(inserted)){
//		return 0;
            };

            if ((!inserted) && (inssubmit)) {
                return 0;
            }
            if ((!inserted) && (!inssubmit)) {
                if (reset){
                    xr=-5;
                    yr=-5;
                };

                if (activestek<=0) {
                    lastshad = -1;
                }

                if (xr+(yr)*defxn!=lastshad) {

                    if (shado[lastshad]) set_visible(shado[lastshad], 0);
                    if (shado[lastshad+1]) set_visible(shado[lastshad+1], 0);
                    if (shado[lastshad+1+defxn]) set_visible(shado[lastshad+1+defxn], 0);
                    if (shado[lastshad+defxn]) set_visible(shado[lastshad+defxn], 0);
                    lastshad = xr+(yr)*defxn;
                    if ((activestek>0)) {
                        if (stekx[activestek]>0) {
                            set_visible(shado[stekx[activestek]+(steky[activestek])*defxn], 1);
                            if (this.obj[activestek].big) {
                                set_visible(shado[stekx[activestek]+(steky[activestek])*defxn+1], 1);
                                set_visible(shado[stekx[activestek]+(steky[activestek])*defxn+1+defxn], 1);
                                set_visible(shado[stekx[activestek]+(steky[activestek])*defxn+defxn], 1);
                            }
                            if (this.obj[activestek].bigx) {
                                set_visible(shado[stekx[activestek]+(steky[activestek])*defxn+1], 1);
                            }
                            if (this.obj[activestek].bigy) {
                                set_visible(shado[stekx[activestek]+(steky[activestek])*defxn+defxn], 1);
                            }
                        }
                        po = Math.floor((playero-1)/2);

                        if ((getbtype(btype)==1)||(getbtype(btype)==3)){
                            if (playero>2){playero1=playero+1;}else{playero1=playero;};
                            t1=0;t2=0;t11=0;t21=0;
                            k=playero;
                            k1=playero1;
                            if (isperk(0,12,k)){
                                if (k%2==0){t1=-1;}else{t2=1;};
                                if (k1%2==0){t11=-1;}else{t21=1;};
                            };
                            for (x=9-(playero%2)*8+t1; x<=9-(playero%2)*8+3+t2; x++) {
                                for (y=(defyn-4)*((playero1+1)%2)+1+t11; y<=(defyn-4)*((playero1+1)%2)+4+t21; y++) {
                                    setmap(x, y, 250);
                                };
                            };
                        }else{
                            if ((getbtype(btype)==NEWKZS)||(btype==_PIRATE_NEW_EVENT)||(winter=='arena8')||(btype==_VILLAGE_EVENT)){
                                setpole(btype,250,playero,yourside,defxn-2,defyn);
                            }else
                            if ((getbtype(btype)==4)||(getbtype(btype, defxn-2,defyn)==_NEWTHIEF)||(getbtype(btype)==_NECR_EVENT2)||(btype==_ELKA_DEFENSE)){
                                setpole(btype,250,playero,yourside,defxn-2,defyn, po);
                            }else{
                                t1=0;t2=0;
                                k=playero;
                                if (isperk(0,12,k)){ //tactics
                                    if ((k+camp_mirror)%2==0){t1=-1;}else{t2=1;};
                                };
                                y1=Math.floor(po*defyn/yourside+1);
                                y2=Math.floor((po+1)*defyn/yourside);
                                if (fullinsert) {y1=1;y2=defyn;};
                                for (x=defxn-3-((playero+camp_mirror)%2)*(defxn-4)+t1; x<=defxn-3-((playero+camp_mirror)%2)*(defxn-4)+1+t2; x++) {
                                    for (y=y1; y<=y2; y++) {
                                        setmap(x, y, 250);
                                    }
                                }
                            };
                        };
                        this.setotherobjs();

                        for (k=1; k<=Math.max(7, stackcount); k++) {
                            if (k!=activestek) {
                                setmap(stekx[k], steky[k], 210);
                                if (this.obj[k]){
                                    if (this.obj[k].big) {
                                        setmap(stekx[k]+1, steky[k], 210);
                                        setmap(stekx[k]+1, steky[k]+1, 210);
                                        setmap(stekx[k], steky[k]+1, 210);
                                    }
                                    if (this.obj[k].bigx) {
                                        setmap(stekx[k]+1, steky[k], 210);
                                    }
                                    if (this.obj[k].bigy) {
                                        setmap(stekx[k], steky[k]+1, 210);
                                    }
                                };
                            }
                        }


                        var bigx=this.obj[activestek]['big'];
                        var bigy=this.obj[activestek]['big'];
                        if (this.obj[activestek]['bigx']) bigx=1;
                        if (this.obj[activestek]['bigy']) bigy=1;

                        var cnt = 0;
                        var xp = Array(0, -1, 0, -1);
                        var yp = Array(0,  0,-1, -1);
                        var xro = xr, yro = yr;

                        if (this.obj[activestek]['big']) cnt = 3;
                        for (k=0;k<=cnt;k++)
                        {
                            ok = true;
                            xr = xro + xp[k];
                            yr = yro + yp[k];
                            xr_last = xr;
                            yr_last = yr;
                            for (x=0; x<=bigx; x++) {
                                for (y=0; y<=bigy; y++) {
                                    if (getmap((x+xr),(y+yr))!=250) {
                                        ok = false;
                                    }
                                }
                            }
                            if (ok) break;

                        };
                        if ((ok) && ((xr!=stekx[activestek]) || (yr!=steky[activestek]))) {
                            lastshad = xr+(yr)*defxn;
                            setstekx = xr;
                            setsteky = yr;
                            set_visible(shado[xr+(yr)*defxn], 1);
                            if (this.obj[activestek].big) {
                                set_visible(shado[xr+(yr)*defxn+1], 1);
                                set_visible(shado[xr+(yr)*defxn+1+defxn], 1);
                                set_visible(shado[xr+(yr)*defxn+defxn], 1);
                            }
                            if (this.obj[activestek].bigx) {
                                set_visible(shado[xr+(yr)*defxn+1], 1);
                            }
                            if (this.obj[activestek].bigy) {
                                set_visible(shado[xr+(yr)*defxn+defxn], 1);
                            }
                        } else {
                            setstekx = -1;
                            setsteky = -1;
                        }
                    }
                }

                return 0;
            }

            var cur_atb = this.get_cur_atb(scr_xmouse, scr_ymouse);
            if ((cur_atb>0) &&(zoomed==false)) {
                k = cur_atb-1;
                /*		if ((lastk!=k)&&(lastk>-1)) {
                            showshadow(this.portraits[this.p_array[lastk]], false);
                        }*/
                for (var kk=0; kk<=atb_cnt; kk++) {
                    if (kk!=k){
                        if ((typeof this.p_array === "undefined")||(!this.portraits[this.p_array[kk]])) continue;
                        showshadow(this.portraits[this.p_array[kk]].under, false);
                    };
                }
                if ((this.obj[atb[k+atbsd]])&&(!this.obj[atb[k+atbsd]].shadowed)&&(!someactive)) {
                    this.showmi(atb[k+atbsd]);
                    var i = atb[k+atbsd];


                    showshadow(this.obj[atb[k+atbsd]], true);
                    lasti=atb[k+atbsd];
                    if ((this.obj[atb[k+atbsd]].hero)||(getbtype(btype)==NEWKZS)) {
//				this.obj[i].onRollOver();
                    }
                    showshadow(this.portraits[this.p_array[k]].under, true);
                    if ((this.obj[atb[k+atbsd]].nownumber>0)&&(!this.obj[atb[k+atbsd]].stone)&&(!this.obj[atb[k+atbsd]].portal)){
                        this.obj[atb[k+atbsd]].ontop = 1;
                        this.obj[atb[k+atbsd]].get_obj_z(this.obj[atb[k+atbsd]].y);
                        if (this.obj[atb[k+atbsd]].hero){
                            set_visible(this.obj[atb[k+atbsd]].number, 1);
                        };
                        showshadow(this.obj[atb[k+atbsd]], true);
//				this.Zsort();
                        need_sort = true;
                    };
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((i!=atb[k+atbsd]) && (this.obj[i].shadowed)) {
                            clearpole2();

                            if ((this.obj[i].nownumber>0)&&(!this.obj[i].stone)&&(!this.obj[i].portal)) {
                                this.obj[i].ontop = 0;
                                this.obj[i].get_obj_z(this.obj[i].y);
                                if (this.obj[i].hero){
                                    set_visible(this.obj[i].number, 0);
                                };
                                need_sort = true;
                            }

                            showshadow(this.obj[i], false);

                            if (this.obj[i].hero) {
//						this.obj[i].onRollOut();
                            }
                        }
                    }
                }
                if (lastk!=k) re_cache_atb();
                lastk = k;

                if (inserted){
                    set_cursor(0);
                    if (myuron) set_visible(myuron, 0);
                    if (csword) set_visible(csword, 0);
                    clearshado();
                    clearshadway();
                };
                return 0;
            }
            lastk = -1;

            if (reset){
                xr=-5;
                yr=-5;
            };


            mishowed=false;
            var i=mapobj[yr*defxn+xr];
            var nowi=0;
            if ((lasti>0)&&(lasti!=i)&&(this.obj[lasti].shadowed)) {
                i=lasti;
                lasti=0;
                for (k=0; k<=atb_cnt; k++) {
                    if (atb[k+atbsd] == i) {
                        showshadow(this.portraits[this.p_array[k]].under, false);
                    }
                }
                if (!mishowed){
                    set_visible(mini_info_panel, 0);
                    if ((btype==20)||(btype==_SURVIVAL_GNOM)||(btype==_2SURVIVAL)){
                        this.showmitnv();
                    };
                    clearpole2();
                };
                if ((this.obj[i].nownumber>0)&&(!this.obj[i].stone)&&(!this.obj[i].portal)) {
                    this.obj[i].ontop = 0;
                    this.obj[i].get_obj_z(this.obj[i].y);
                    if (this.obj[i].hero){
                        set_visible(this.obj[i].number, 0);
                    };

//					this.Zsort();
                    need_sort = true;
                }

                showshadow(this.obj[i], false);
                if (this.obj[i].hero) {
//					this.obj[i].onRollOut();
                }
                if (!(mapobj[yr*defxn+xr]>0)) re_cache_atb();

            }

            if (gpause) this.fill_mapobj();
            if (i>0){
                bigok = false;
                if (this.obj[i].big) {
                    if ((this.obj[i].x<=xr) && (this.obj[i].x+1>=xr) && (this.obj[i].y<=yr) && (this.obj[i].y+1>=yr)) {
                        bigok = true;
                    }
                }
                if (this.obj[i].bigx) {
                    if ((this.obj[i].x<=xr) && (this.obj[i].x+1>=xr)&&(this.obj[i].y==yr)) {
                        bigok = true;
                    }
                }
                if (this.obj[i].bigy) {
                    if ((this.obj[i].y<=yr) && (this.obj[i].y+1>=yr)&&(this.obj[i].x==xr)) {
                        bigok = true;
                    }
                }
                if ((!this.obj[i].rock) && (this.obj[i].nownumber>0)  &&((!someactive)||(gpause)) && (((this.obj[i].x == xr) && (this.obj[i].y == yr)) || (bigok))) {
                    nowi=i;
                    if ((!this.obj[i].shadowed)&&(this.obj[i].inited_show)) {
                        if ((!this.obj[i].stone)&&(!this.obj[i].portal)){
                            this.obj[i].ontop = 1;
                            this.obj[i].get_obj_z(this.obj[i].y);
                            if (this.obj[i].hero){
                                set_visible(this.obj[i].number, 1);
                            };

//					this.Zsort();
                            need_sort = true;
                        };
                        mishowed=true;
                        this.showmi(i);
                        showshadow(this.obj[i], true);
                        if (((activeobj>0)||(someactive==false)||(gpause)) && (this.obj[i].doing!="walk") && ((activeobj!=i)||(gpause)) && (!this.obj[i].hero) && (showway)) {
                            this.showposway(i,0,activeobj);
                            if (!gpause) this.checkthrower(activeobj);
                        }
                        if ((this.obj[i].hero)||(getbtype(btype)==NEWKZS)) {
//					this.obj[i].onRollOver();
                        }
                        for (k=0; k<=atb_cnt; k++) {
                            if (atb[k+atbsd] == i) {
                                showshadow(this.portraits[this.p_array[k]].under, true);
                            }
                        }
                    }
                }
                if (lasti!=i) re_cache_atb();
            }

            if (i>0) lasti=i; else lasti = 0;

            /*	if ((_ymouse>atby)&&(inserted)&&(zoomed==false)){
                    set_cursor(0);
                    crun_visible2 = false;
                    if (!waitclock._visible) {
                        mousevisible = true;
                        Mouse.show();
                    }
                    return 0;
                };*/
//	set_cursor(0);

            crun_visible2 = true;

            if (typeof myuron !== 'undefined') set_visible(myuron, 0);


            if (ctrldown)
            {
//		xr = -5;
//		yr = -5;
                //return 0;
            }

            k = getmap(xr, yr);

            clearshado();

            if (k == 200) {
                k = 250;
            }

            if ((xr>defxn-1) || (xr<0)) {
                k = 0;
            }
            if ((magicuse!='')&&(magicuse!='layhands')&&(magicuse!='orderofchief')&&(magicuse!='harmtouch')&&(magicuse!='hailstorm')&&(magicuse!='allaroundslash')&&(magicuse!='feralcharge')&&(magicuse!='slam')&&(magicuse!='mightyslam')&&(magicuse!='incinerate')&&(magicuse!='leap')&&(magicuse!='leap6')&&(magicuse!='harpoonstrike')) {
                k = magicuse;
            }
            if (magicuse == 'ssh') {
                if ((xr>=1) && (xr<=defxn-2) && (yr>=1) && (yr<=defyn) && ((Math.abs(xr-this.obj[activeobj].x)>1) || (Math.abs(yr-this.obj[activeobj].y)>1))) {
                    k = 'ssh';
                } else {
                    k = 0;
                }
            }
            if ((k=='mdispel')||(k=='mstoneskin')||(k=='mbless')||
                (k=='mrighteous_might')||(k=='mdeflect_missile')||(k=='mskyandearth'))
            {k='mfast';};
            if ((k=='mslow')||(k=='mcurse')||(k=='mdray')||(k=='msuffering')||(k=='mconfusion')){
                k='mslow';
            };
            if ((k=='knightmark')||(k=='necr_soul')){
                k='knightmark';
            };
            if ((k=='righteous_might')||(k=='deflect_missile')||(k=='antimagic')){
                k='fast';
            };
            if (k == 'flamestrike') k = 'stormbolt';
            if (k=='implosion'){
                k='lighting';
            };
            if (k=='divinev'){
                k='angerofhorde';
            };
            if ((k=='suffering')){
                k='curse';
            };
            var enemy=210;
            if (magicuse=='layhands') enemy=211;
            if (magicuse=='orderofchief') enemy=211;

            switch (k) {
                case 'magicfist' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'magicfist';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'lighting' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'lighting';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);

                    break;
                case 'chainlighting' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'chainlighting';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'knightmark' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].warmachine)&&(!this.obj[i].hero)&& (i==mapobj[xr+(yr)*defxn]) && (this.obj[i].owner==this.obj[activeobj].owner)&&(this.obj[i].nownumber>0)&&(!magic[i]['sum'])) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'fast';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'dispel' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)&&(!this.obj[i].hero)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'fast';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'mfast':
                    set_cursor(6);
                    var p=2;
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(-1, -1,p, p, false);
                        }
                    }
                    if (magicuse=='mfast') {
                        this.reset_temp_magic();
                        this.showatb();
                    };
                    if ((xr>0)&&(xr<=defxn-3)&&(yr>0)&&(yr<=defyn)){
                    }else{
                        return 0;
                    };
                    lastshad = xr+(yr)*defxn;
                    setshad(-1, -1,p, p, true);
                    if (magicuse == 'mfast'){
                        this.reset_temp_magic();
                        for (var xrr=xr-1;xrr<=xr+p;xrr++)
                            for (var yrr=yr-1;yrr<=yr+p;yrr++){
                                var i = mapobj[xrr+(yrr)*defxn];
                                if ((i>0)&&(i<1000)&&(!this.obj[i].warmachine)&&(!this.obj[i].immunity)&&(!this.obj[i].enchantedarmor)&&(!this.obj[i].hero)&&(this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                                    setn_temp_magic(i, 'fst');
                                };
                            };

                        this.showatb();
                    }
                    res = 'mfast';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'mslow':
                    set_cursor(6);
                    var p=2;
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(-2, -2,p, p, false);
                        }
                    }
                    if (magicuse=='mslow') {
                        this.reset_temp_magic();

                        this.showatb();
                    };
                    if ((xr>0)&&(xr<=defxn-3)&&(yr>0)&&(yr<=defyn)){
                    }else{
                        return 0;
                    };
                    lastshad = xr+(yr)*defxn;
                    setshad(-2, -2,p, p, true);
                    if (magicuse == 'mslow'){
                        this.reset_temp_magic();
                        for (var xrr=xr-2;xrr<=xr+p;xrr++)
                            for (var yrr=yr-2;yrr<=yr+p;yrr++){
                                var i = mapobj[xrr+(yrr)*defxn];
                                if ((i>0)&&(!this.obj[i].warmachine)&&(!this.obj[i].islow)&&(!this.obj[i].immunity)&&(!this.obj[i].absolutepurity)&&(!this.obj[i].enchantedarmor)&&(!this.obj[i].hero)&&(this.obj[i].side!=this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                                    setn_temp_magic(i, 'slw');
                                };
                            };

                        this.showatb();
                    }
                    res = 'mslow';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'mpoison':
                    set_cursor(6);
                    var p=1;
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(-1, -1,p, p, false);
                        }
                    }
                    if ((xr>0)&&(xr<=defxn-3)&&(yr>0)&&(yr<=defyn)){
                    }else{
                        return 0;
                    };
                    lastshad = xr+(yr)*defxn;
                    setshad(-1, -1,p, p, true);
                    res = 'mfast';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'phantom_forces' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].hero) && (!this.obj[i].warmachine) && (i==mapobj[xr+(yr)*defxn]) && (this.obj[i].owner==this.obj[activeobj].owner)&&(this.obj[i].nownumber>0)
                            &&(!magic[i]['sum'])&&
                            (!magic[i]['phm'])&&
                            (!magic[i]['whp'])&&
                            (this.obj[i].level<=this.obj[activeobj]['phantom_forceseffmain'])
                        ){
                            j=i;
                            ok = true;
                            break;
                        }
                    }
                    if (!ok){res=0;break;};
                    xo=this.obj[j].x;
                    yo=this.obj[j].y;
                    b=0;
                    var bigx=this.obj[j]['big'];
                    var bigy=this.obj[j]['big'];
                    if (this.obj[j]['bigx']) bigx=1;
                    if (this.obj[j]['bigy']) bigy=1;

                    ok=false;
                    i=activeobj;
                    setmap(this.obj[i].x,this.obj[i].y,210,i);
                    if (this.obj[i].big){
                        setmap(this.obj[i].x, this.obj[i].y+1,210,i);
                        setmap(this.obj[i].x+1, this.obj[i].y+1,210,i);
                        setmap(this.obj[i].x+1, this.obj[i].y,210,i);
                    };
                    if (this.obj[i].bigx){
                        setmap(this.obj[i].x+1, this.obj[i].y,210,i);
                    };
                    if (this.obj[i].bigy){
                        setmap(this.obj[i].x, this.obj[i].y+1,210,i);
                    };

                    for (x=xo-1-bigx;x<=xo+1+bigx;x++){
                        for (y=yo-1-bigy;y<=yo+1+bigy;y++){
                            ok2=true;
                            for (xz=x;xz<=x+bigx;xz++){
                                for (yz=y;yz<=y+bigy;yz++){
                                    if ((xz<1)||(yz<1)||(yz>defyn)||(xz>defxn-2)||(getmap(xz,yz)==210)||(getmap(xz,yz)==211)){
                                        ok2=false;
                                    };
                                };
                            };
                            if (ok2){
                                ok=true;
                            };
                        };
                    };
                    i=activeobj;
                    setmap(this.obj[i].x, this.obj[i].y,0,i);
                    if (this.obj[i].big){
                        setmap(this.obj[i].x, this.obj[i].y+1,0,i);
                        setmap(this.obj[i].x+1, this.obj[i].y+1,0,i);
                        setmap(this.obj[i].x+1, this.obj[i].y,0,i);
                    };
                    if (this.obj[i].bigx){
                        setmap(this.obj[i].x+1, this.obj[i].y,0,i);
                    };
                    if (this.obj[i].bigy){
                        setmap(this.obj[i].x, this.obj[i].y+1,0,i);
                    };
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'phantom_forces';
                    magicx = xr;
                    magicy = yr;
                    break;

                case 'bless' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].hero)&&(!this.obj[i].warmachine)&&(i==mapobj[xr+(yr)*defxn]) && (this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'bless';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'divine_guidance' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].hero)&&(!this.obj[i].warmachine)&&(i==mapobj[xr+(yr)*defxn]) && (this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                            ok = true;
                            objset = i;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        this.reset_temp_magic();

                        this.showatb();
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'divine_guidance';
                    magicx = xr;
                    magicy = yr;

                    this.reset_temp_magic();
                    var init=this.obj[activeobj]['divine_guidanceeffmain'];
                    var init = 33;
                    var j=mapobj[yr*defxn+xr];
                    if (this.obj[j]['nowinit']-init<this.obj[activeobj]['nowinit']){init=Math.floor(this.obj[j]['nowinit']-this.obj[activeobj]['nowinit']);};


                    this.obj[j]['reset_init']=-init;
                    this.showatb();
                    break;
                case 'stoneskin' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].warmachine)&&(!this.obj[i].hero)&&(i==mapobj[xr+(yr)*defxn]) && (this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'stoneskin';
                    magicx = xr;
                    magicy = yr;
                    break;

                case 'blind' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }

                    this.reset_temp_magic();

                    this.showatb();

                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((this.obj[i].hero)||(this.obj[i].warmachine)||(!this.obj[i].alive)||(this.obj[i].iblind)||(this.obj[i].imind)||(this.obj[i].twistedmind)||((magic[i]['wfr'])&&(magic[i]['wfr']['effect']==1))||(this.obj[i].absolutepurity)||(this.obj[i].immunity)||(this.obj[i].enchantedarmor))&&(i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)) {
                            ok = false;
                            break;
                        }
                    }
                    if ((ok)&&(btype==_PVP_DIAGONAL_EVENT)&&(checkwall2(this.obj[activeobj]['x'],this.obj[activeobj]['y'],xr,yr, activeobj))){
                        ok = false;
                        break;
                    };

                    if (!ok) {
                        res = 0;
                        break;
                    }

                    this.reset_temp_magic();
                    var uo = mapobj[lastshad];
                    setn_temp_magic(uo, 'bld');

                    this.showatb();

                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'blind';
                    magicx = xr;
                    magicy = yr;
                    break;


                case 'seduction' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    if (((this.obj[mapobj[yr*defxn+xr]].hero)||(this.obj[mapobj[yr*defxn+xr]].immunetohypnos)||(this.obj[mapobj[yr*defxn+xr]].immunity)||(this.obj[mapobj[yr*defxn+xr]].warmachine)||(!this.obj[mapobj[yr*defxn+xr]].alive)||(this.obj[mapobj[yr*defxn+xr]].imind)||(this.obj[mapobj[yr*defxn+xr]].twistedmind)||((magic[mapobj[yr*defxn+xr]]['wfr'])&&(magic[mapobj[yr*defxn+xr]]['wfr']['effect']==1))||(this.obj[mapobj[yr*defxn+xr]].absolutepurity))&&(this.obj[mapobj[yr*defxn+xr]].nownumber>0)) {
                        ok = false;
                        break;
                    }
                    var s='seduction';
                    hpa=((this.obj[activeobj].nownumber-1)*this.obj[activeobj].maxhealth+this.obj[activeobj].nowhealth)/((this.obj[mapobj[yr*defxn+xr]].nownumber-1)*this.obj[mapobj[yr*defxn+xr]].maxhealth+this.obj[mapobj[yr*defxn+xr]].nowhealth)
                    if ((hpa<=0.25)||(Math.floor((2+Math.log(hpa)/Math.log(2))*100)<=0)) {
                        ok = false;
                        break;
                    };

                    if ((ok)&&(btype==_PVP_DIAGONAL_EVENT)&&(checkwall2(this.obj[activeobj]['x'],this.obj[activeobj]['y'],xr,yr, activeobj))){
                        ok = false;
                        break;
                    };
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'seduction';
                    magicx = xr;
                    magicy = yr;
                    break;

                case 'randl' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((!this.obj[i].hero)&&(!this.obj[i].warmachine)&&(!this.obj[i].rock))&&(i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'randl';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'stormbolt' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((this.obj[i].hero)&&(i==mapobj[xr+(yr)*defxn])) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'stormbolt';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'randd' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((this.obj[i].hero)||(this.obj[i].warmachine)||(this.obj[i].absolutepurity))&&(i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'randd';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'poison' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((i==mapobj[xr+(yr)*defxn])&& (this.obj[i].absolutepurity)&&(this.obj[i].nownumber>0)) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'poison';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'magicarrow' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'magicarrow';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'icebolt' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'icebolt';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
                case 'dray' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    if (getmap(xr, yr)!=210) {
                        res = 0;
                        break;
                    }
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((((this.obj[i].hero)||(this.obj[i].warmachine)||(this.obj[i].absolutepurity))&&(this.obj[i].nownumber>0))||
                            ((mapobj[yr*defxn+xr]>0)&&((this.obj[mapobj[yr*defxn+xr]].armoured)||(this.obj[mapobj[yr*defxn+xr]].organicarmor))))&&(i==mapobj[xr+(yr)*defxn])) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok){res=0; break;};
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'dray';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'raisedead' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    };
                    ok = false;
                    big =false;
                    bigf=false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((this.obj[i].undead)||(this.obj[i].alive))&&(!magic[i]['phm'])&&(!magic[i]['sum'])&&(xr>=this.obj[i].x)&&(xr<=this.obj[i].x+this.obj[i].big)&&(yr>=this.obj[i].y)&&(yr<=this.obj[i].y+this.obj[i].big)&& (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && ((this.obj[i].nownumber<this.obj[i].maxnumber) || (this.obj[i].nowhealth<this.obj[i].maxhealth)) && (getmap(xr, yr)!=210)&&((mapobj[yr*defxn+xr]==undefined)||(mapobj[yr*defxn+xr]<=0)||(this.obj[mapobj[yr*defxn+xr]].owner==this.obj[activeobj].owner))) {
                            big = false;
                            if ((this.obj[i].big)&&(this.obj[i].nownumber==0)){big=true;};
                            bigf = false;
                            if (this.obj[i].nownumber){bigf=true;};
                            ok2=true;
                            if ((big)&&(!bigf)){
                                var x1 = this.obj[i].x;
                                var y1 = this.obj[i].y;
                                if (((mapobj[x1+y1*defxn]>0)&&(mapobj[x1+y1*defxn]!=i))||((mapobj[x1+y1*defxn+1]>0)&&(mapobj[x1+y1*defxn+1]!=i))||((mapobj[x1+(y1+1)*defxn+1]>0)&&(mapobj[x1+(y1+1)*defxn+1]!=i))||((mapobj[x1+(y1+1)*defxn]>0)&&(mapobj[x1+(y1+1)*defxn]!=i)))
                                {
                                    ok2 = false;
                                };
                            };
                            if ((this.obj[i].bigx)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr+1,yr)==211)||(getmap(xr+1,yr)==210)){
                                    ok2=false;
                                };
                            };
                            if ((this.obj[i].bigy)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr,yr+1)==211)||(getmap(xr,yr+1)==210)){
                                    ok2=false;
                                };
                            };
                            if (!ok){ok=ok2;};
                            big=false;
                            bigf=false;
                        }
                    }
                    if (!ok) {

                        if (xr+(yr)*defxn!=lastshad) this.showatb();
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    this.show_atb_raisedead(xr, yr);

                    setshad(0, 0, 0, 0, true);
                    res = 'raisedead';
                    magicx = xr;
                    magicy = yr;
                    break;

                case 'heal' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    big =false;
                    bigf=false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((this.obj[i].alive)&&(!magic[i]['phm'])&&(i==mapobj[xr+(yr)*defxn])&& (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && (this.obj[i].nownumber>0)&&((this.obj[i].nownumber<this.obj[i].maxnumber) || (this.obj[i].nowhealth<this.obj[i].maxhealth)) && (getmap(xr, yr)!=210)&&((mapobj[yr*defxn+xr]==undefined)||(mapobj[yr*defxn+xr]<=0)||(this.obj[mapobj[yr*defxn+xr]].owner==this.obj[activeobj].owner))) {
                            if ((this.obj[i].big)&&(this.obj[i].nownumber==0)){big=true;};
                            if (this.obj[i].nownumber){bigf=true;};
                            ok2=true;
                            if ((big)&&(!bigf)){
                                if ((getmap(xr+1,yr+1)==211)||(getmap(xr+1,yr+1)==210)||(getmap(xr,yr+1)==211)||(getmap(xr,yr+1)==210)||(getmap(xr+1,yr)==211)||(getmap(xr+1,yr)==210)){
                                    ok2=false;
                                };
                            };
                            if ((this.obj[i].bigx)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr+1,yr)==211)||(getmap(xr+1,yr)==210)){
                                    ok2=false;
                                };
                            };
                            if ((this.obj[i].bigy)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr,yr+1)==211)||(getmap(xr,yr+1)==210)){
                                    ok2=false;
                                };
                            };
                            if (!ok){ok=ok2;};
                            big=false;
                            bigf=false;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'heal';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'summonpit' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    big =false;
                    bigf=false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((this.obj[i].alive)&&(!magic[i]['phm'])&& (!magic[i]['sum'])&&(this.obj[i].x==xr)&&(this.obj[i].y==yr)&& (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && (this.obj[i].nownumber<=0) && (getmap(xr, yr)!=210)&&((mapobj[yr*defxn+xr]==undefined)||(mapobj[yr*defxn+xr]<=0)||(this.obj[mapobj[yr*defxn+xr]].owner==this.obj[activeobj].owner))) {
                            if ((this.obj[i].big)&&(this.obj[i].nownumber==0)){big=true;};
                            ok2=true;
                            if ((big)&&(!bigf)){
                                if ((getmap(xr+1,yr+1)==211)||(getmap(xr+1,yr+1)==210)||(getmap(xr,yr+1)==211)||(getmap(xr,yr+1)==210)||(getmap(xr+1,yr)==211)||(getmap(xr+1,yr)==210)){
                                    ok2=false;
                                };
                            };
                            if ((this.obj[i].bigx)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr+1,yr)==211)||(getmap(xr+1,yr)==210)){
                                    ok2=false;
                                };
                            };
                            if ((this.obj[i].bigy)&&(this.obj[i].nownumber==0)&&(!bigf)){
                                if ((getmap(xr,yr+1)==211)||(getmap(xr,yr+1)==210)){
                                    ok2=false;
                                };
                            };
                            if (Math.min(this.obj[i]['maxhealth'],120)*this.obj[i]['maxnumber']<120) ok2=false;
                            if (!ok){ok=ok2;};
                            big=false;
                            bigf=false;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'summonpit';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'gating' :
                    set_cursor(6);
                    var bigx=this.obj[activeobj]['big'];
                    var bigy=this.obj[activeobj]['big'];
                    if (this.obj[activeobj]['bigx']) bigx=1;
                    if (this.obj[activeobj]['bigy']) bigy=1;

                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, bigx, bigy, false);
                        }
                    };
                    ok = false;

                    ok=true;
                    for (x=0;x<=bigx;x++){
                        for (y=0;y<=bigy;y++){
                            if (mapg[(xr+x)+(yr+y)*defxn]!=0){ok=false;};
                        };
                    };
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, bigx, bigy, true);
                    res = 'gating';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'repair' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((this.obj[i].mechanical) &&(this.obj[i].x==xr) && (this.obj[i].y==yr) && (this.obj[i].side == this.obj[activeobj].getside()) && (!this.obj[i].hero) && ((this.obj[i].nownumber<this.obj[i].maxnumber) || (this.obj[i].nowhealth<this.obj[i].maxhealth)) && (getmap(xr, yr)!=210)&&(((this.obj[i].nownumber==0)&&(getmap(xr, yr)!=211))||((this.obj[i].nownumber>0)&&(getmap(xr, yr)==211)))) {
                            ok = true;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'repair';
                    magicx = xr;
                    magicy = yr;
                    break;

                case 'firstaid' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(0, 0, 0, 0, false);
                        }
                    }
                    ok = false;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if ((!this.obj[i].warmachine) &&(i==mapobj[xr+(yr)*defxn])&& (this.obj[i].owner == this.obj[activeobj].owner) && (!this.obj[i].hero) && ((this.obj[i].nownumber<this.obj[i].maxnumber) || (this.obj[i].nowhealth<this.obj[i].maxhealth)) && (getmap(xr, yr)!=210)&&(((this.obj[i].nownumber>0)&&(getmap(xr, yr)==211)))) {
                            ok = true;
                        }
                    }
                    if (!ok) {
                        res = 0;
                        break;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'firstaid';
                    magicx = xr;
                    magicy = yr;
                    break;
                case 'teleport':
                    if (carryo==-1){
                        var s = 'teleport';
                        if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                            res = 0;
                            break;
                        }
                        var len = this.obj_array.length;
                        for (var k1=0;k1<len;k1++)
                        {
                            i = this.obj_array[k1];
                            if ((!this.obj[i].warmachine)&&(!magic[i]['ent'])&&(i==mapobj[xr+(yr)*defxn])&&(!this.obj[i].hero)&&(this.obj[i]['nownumber']>0)&&(this.obj[i].side==this.obj[activeobj].getside())
                                &&(Math.floor(10*(this.obj[activeobj][s+'effmain']+this.obj[activeobj].maxnumber*this.obj[activeobj][s+'effmult'])/((this.obj[i].nownumber-1)*this.obj[i].maxhealth+this.obj[i].nowhealth))>0)){
                                set_cursor(6);
                                res='teleport';
                            };
                        };
                    }else{
                        var b=0;
                        if (carryo>0){
                            if (this.obj[carryo].big) {
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y+1,0);
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y,0);
                                setmap(this.obj[carryo].x, this.obj[carryo].y+1,0);
                            };
                            if (this.obj[carryo].bigx) {
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y,0);
                            };
                            if (this.obj[carryo].bigy) {
                                setmap(this.obj[carryo].x, this.obj[carryo].y+1,0);
                            };
                        };

                        var bigx=this.obj[carryo]['big'];
                        var bigy=this.obj[carryo]['big'];
                        if (this.obj[carryo]['bigx']) bigx=1;
                        if (this.obj[carryo]['bigy']) bigy=1;


                        ok=true;

                        for (var xrr=xr;xrr<=xr+bigx;xrr++){
                            for (var yrr=yr;yrr<=yr+bigy;yrr++){
                                if ((carryo>0)&&((xrr!=this.obj[carryo].x)||(yrr!=this.obj[carryo].y))&&(getmap(xrr,yrr)!=200)&&(getmap(xrr,yrr)!=210)&&(getmap(xrr,yrr)!=211)&&(xr>0)&&(yr>0)&&(xr<=defxn-2-bigx)&&(yr<=defyn-bigy)){
                                }else{
                                    ok=false;
                                    break;

                                };
                            };
                        };
                        var s='teleport';
                        if (carryo<=0){
                            var r=0;
                            var r1=1;
                        }else{
                            var r=Math.floor(10*(this.obj[activeobj][s+'effmain']+this.obj[activeobj].maxnumber*this.obj[activeobj][s+'effmult'])/((this.obj[carryo].nownumber-1)*this.obj[carryo].maxhealth+this.obj[carryo].nowhealth));
                            var r1=(xr-this.obj[carryo].x)*(xr-this.obj[carryo].x)+(yr-this.obj[carryo].y)*(yr-this.obj[carryo].y);
                        };

                        if (r1>r*r){
                            ok=false;
                        };
                        if (ok){
                            set_cursor(6);
                            if (xr+(yr)*defxn!=lastshad) {
                                if (lastshad>0) {
                                    setshad(0, 0, bigx, bigy, false);
                                }

                                lastshad = xr+(yr)*defxn;
                                setshad(0, 0, bigx, bigy, true);
                            }

                            magicx = xr;
                            magicy = yr;
                            res = 'teleport';
                        }else{
                            res=0;
                            if (lastshad>0) {
                                setshad(0, 0, bigx, bigy, false);
                            }
                            lastshad=-1;
                        };
                        var lastshadt=lastshad;
                        if (carryo>0){
                            lastshad = this.obj[carryo].x+this.obj[carryo].y*defxn;
                            setshad(0, 0, bigx, bigy, true);
                            lastshad=lastshadt;


                            if ((bigx==1)&&(bigy==1)){
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y+1,211);
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y,211);
                                setmap(this.obj[carryo].x, this.obj[carryo].y+1,211);
                            };
                            if (bigx==1){
                                setmap(this.obj[carryo].x+1, this.obj[carryo].y,211);
                            };
                            if (bigy==1){
                                setmap(this.obj[carryo].x, this.obj[carryo].y+1,211);
                            };
                        };
                    };
                    break;

                case 'carry':
                    spd=Math.max(0, Math.round((this.obj[activeobj].speed+this.obj[activeobj]['ragespeed']+this.obj[activeobj]['speedaddon'])*this.obj[activeobj].speedmodifier));
                    if (magic[activeobj]['ent']){spd=0;};
                    xr1=xr;
                    yr1=yr;
                    if (xr1>this.obj[activeobj]['x']){xr1--;};
                    if (yr1>this.obj[activeobj]['y']){yr1--;};
                    if
                    (Math.abs(Math.abs(this.obj[activeobj]['x']-xr1)-Math.abs(this.obj[activeobj]['y']-yr1))+
                        1.5*(Math.max(Math.abs(this.obj[activeobj]['x']-xr1),Math.abs(this.obj[activeobj]['y']-yr1))
                            -Math.abs(Math.abs(this.obj[activeobj]['x']-xr1)-Math.abs(this.obj[activeobj]['y']-yr1)))
                        <=spd){
                    }else{
                        res=0;
                        break;
                    };

                    if (carryo==-1){
                        if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                            res = 0;
                            break;
                        }
                        var len = this.obj_array.length;
                        for (var k1=0;k1<len;k1++)
                        {
                            i = this.obj_array[k1];
                            if ((!this.obj[i].warmachine)&&((!magic[i]['inv'])||(magic[i]['inv']['effect']!=1))&&(!magic[i]['ent'])&&(i==mapobj[xr+(yr)*defxn])&&(!this.obj[i].big)&&(!this.obj[i].bigx)&&(!this.obj[i].bigy)&&(!this.obj[i].hero)&&(this.obj[activeobj]['nownumber']*2>=this.obj[i]['nownumber'])&&(this.obj[i]['nownumber']>0)&&(this.obj[i].side==this.obj[activeobj].getside())){
                                set_cursor(6);
                                res='carry';
                            };
                        };
                    }else{
                        if ((getmap(xr,yr)!=200)&&(getmap(xr,yr)!=210)&&(getmap(xr,yr)!=211)){
                            set_cursor(6);
                            if (xr+(yr)*defxn!=lastshad) {
                                if (lastshad>0) {
                                    setshad(0, 0, 0, 0, false);
                                }
                                lastshad = xr+(yr)*defxn;
                                setshad(0, 0, 0, 0, true);
                            }

                            magicx = xr;
                            magicy = yr;
                            res = 'carry';
                        };
                    };
                    break;




                case 'fireball' :
                    set_cursor(6);
                    if (xr+(yr)*defxn!=lastshad) {
                        if (lastshad>0) {
                            setshad(-1, -1, 1, 1, false);
                        }
                        if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                            res = 0;
                            break;
                        }
                        lastshad = xr+(yr)*defxn;
                        setshad(-1, -1, 1, 1, true);
                    }
                    magicx = xr;
                    magicy = yr;
                    res = 'fireball';
                    this.calcmagic(activeobj, xr, yr, magicuse);
                    break;
            };

            if (k==250){
                ok = true;
                if ((activeobj>0)&&(this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)&&((!android)||(this.obj[activeobj].hero)||(this.obj[activeobj].warmachine))) {
                    ok=false;
                }else{
                    xrr = -1;
                    yrr = -1;
                    len = 100;
                    movex = xr;
                    movey = yr;
//				if ((activeobj>0)&&(this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)) no_ok_but = true;

                    if ((activeobj>0)&&(this.obj[activeobj].big)) {
                        if ((wmap2[(xr)+(yr)*defxn] >= 0)&&(!this.obj[activeobj].flyer)) {
                        } else {
                            if (this.obj[activeobj].flyer){
                                i=activeobj;
                                setmap(this.obj[i].x,this.obj[i].y,250);
                                setmap(this.obj[i].x,this.obj[i].y+1,250);
                                setmap(this.obj[i].x+1,this.obj[i].y+1,250);
                                setmap(this.obj[i].x+1,this.obj[i].y,250);
                            };
                            for (xk=xr-1; xk<=xr; xk++) {
                                for (yk=yr-1; yk<=yr; yk++) {
                                    if (wmap2[(xk)+(yk)*defxn] >= 0) {
                                        if ((xr-xk)*(xr-xk)+(yr-yk)*(yr-yk)<len) {
//										if (this.obj[activeobj].flyer){
//											if (((getmap(xk,yk)!=250)||(getmap(xk+1,yk)!=250)||(getmap(xk,yk+1)!=250)||(getmap(xk+1,yk+1)!=250))){
//												continue;
//											};
                                            xrr = xk;
                                            yrr = yk;
                                            len = (xr-xk)*(xr-xk)+(yr-yk)*(yr-yk);
//										};
                                        }
                                    }
                                }
                            }

                            if (xrr!=-1) {
                                xr = xrr;
                                yr = yrr;
                                xr_last = xr;
                                yr_last = yr;
                                movex = xr;
                                movey = yr;
                                if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr) && (!android)) {
                                    movex = 0;
                                    movey = 0;
                                    res = 0;
                                    ok=false;
                                }
                            } else {
                                movex = 0;
                                movey = 0;
                                res = 0;
                                ok=false;
                            }
                        }
                    }
                    if ((activeobj>0)&&(this.obj[activeobj].bigx)&&(ok)) {

                        if ((wmap2[(xr)+(yr)*defxn] >= 0)&&(!this.obj[activeobj].flyer)) {
                        } else {
                            if (this.obj[activeobj].flyer){
                                i=activeobj;
                                setmap(this.obj[i].x,this.obj[i].y,250);
                                setmap(this.obj[i].x+1,this.obj[i].y,250);
                            };
                            for (xk=xr-1; xk<=xr+1; xk++) {
                                for (yk=yr-1; yk<=yr+1; yk++) {
                                    if (wmap2[(xk)+(yk)*defxn] >= 0) {
                                        if ((xr-xk)*(xr-xk)+(yr-yk)*(yr-yk)<len) {
                                            if (this.obj[activeobj].flyer){
                                                if ((getmap(xk,yk)!=250)||(getmap(xk+1,yk)!=250)){
                                                    continue;
                                                };
                                                xrr = xk;
                                                yrr = yk;
                                                len = (xr-xk)*(xr-xk)+(yr-yk)*(yr-yk);
                                            };
                                        }
                                    }
                                }
                            }
                            if (xrr!=-1) {
                                xr = xrr;
                                yr = yrr;
                                xr_last = xr;
                                yr_last = yr;
                                movex = xr;
                                movey = yr;

                                if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)) {
                                    movex = 0;
                                    movey = 0;
                                    res = 0;
                                    ok=false;
                                }
                            } else {
                                movex = 0;
                                movey = 0;
                                res = 0;
                                ok=false;
                            }
                        }
                    }
                    if ((activeobj>0)&&(this.obj[activeobj].bigy)&&(ok)) {
                        if ((wmap2[(xr)+(yr)*defxn] >= 0)&&(!this.obj[activeobj].flyer)) {
                        } else {
                            if (this.obj[activeobj].flyer){
                                i=activeobj;
                                setmap(this.obj[i].x,this.obj[i].y,250);
                                setmap(this.obj[i].x,this.obj[i].y+1,250);
                            };
                            for (xk=xr-1; xk<=xr+1; xk++) {
                                for (yk=yr-1; yk<=yr+1; yk++) {
                                    if (wmap2[(xk)+(yk)*defxn] >= 0) {
                                        if ((xr-xk)*(xr-xk)+(yr-yk)*(yr-yk)<len) {
                                            if (this.obj[activeobj].flyer){
                                                if ((getmap(xk,yk)!=250)||(getmap(xk,yk+1)!=250)){
                                                    continue;
                                                };
                                                xrr = xk;
                                                yrr = yk;
                                                len = (xr-xk)*(xr-xk)+(yr-yk)*(yr-yk);
                                            };
                                        }
                                    }
                                }
                            }
                            if (xrr!=-1) {
                                xr = xrr;
                                yr = yrr;
                                xr_last = xr;
                                yr_last = yr;
                                movex = xr;
                                movey = yr;
                                if ((this.obj[activeobj].x == xr) && (this.obj[activeobj].y == yr)) {
                                    movex = 0;
                                    movey = 0;
                                    res = 0;
                                    ok=false;
                                }
                            } else {
                                movex = 0;
                                movey = 0;
                                res = 0;
                                ok=false;
                            }
                        }
                    };
                }
                if ((ok)&&(activeobj>0)){
                    if ((magicuse=='leap')||(magicuse=='leap6')){
                        res = 0;
                        ok=false;
                    };
                    if (ok){
                        set_cursor(1);
                        xr_go = xr;
                        yr_go = yr;
                        if (xr+(yr)*defxn!=lastshad) {
                            if ((lastshad>0)&&(shado[lastshad])) {
                                set_visible(shado[lastshad], 0);
                                if (this.obj[activeobj].big) {
                                    if (shado[lastshad+1+defxn]){
                                        set_visible(shado[lastshad+1], 0);
                                        set_visible(shado[lastshad+1+defxn], 0);
                                        set_visible(shado[lastshad+defxn], 0);
                                    };
                                }
                                if (this.obj[activeobj].bigx) {
                                    set_visible(shado[lastshad+1], 0);
                                }
                                if (this.obj[activeobj].bigy) {
                                    set_visible(shado[lastshad+defxn], 0);
                                }
                            }
                            lastshad = xr+(yr)*defxn;
                            set_visible(shado[xr+(yr)*defxn], 1);
                            if (this.obj[activeobj].big) {
                                set_visible(shado[xr+(yr)*defxn+1], 1);
                                set_visible(shado[xr+(yr)*defxn+1+defxn], 1);
                                set_visible(shado[xr+(yr)*defxn+defxn], 1);
                            }
                            if (this.obj[activeobj].bigx) {
                                set_visible(shado[xr+(yr)*defxn+1], 1);
                            }
                            if (this.obj[activeobj].bigy) {
                                set_visible(shado[xr+(yr)*defxn+defxn], 1);
                            }
                        }
                        res = 250;
                    };
                };

            }

            resa = this.in_mousemove(xr, yr, k, magicuse);
            if (resa['res']!=0){
                res = resa['res'];
                magicx = resa['magicx'];
                magicy = resa['magicy'];
            }

            if (k=='frenzy'){
                ok = true;
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                if (getmap(xr, yr)!=210) {
                    res = 0;
                    ok = false;
                }
                if (ok){

                    if (((this.obj[mapobj[yr*defxn+xr]].hero)||(this.obj[mapobj[yr*defxn+xr]].warmachine)||(!this.obj[mapobj[yr*defxn+xr]].alive)||(this.obj[mapobj[yr*defxn+xr]].imind)||(this.obj[mapobj[yr*defxn+xr]].twistedmind)||((magic[mapobj[yr*defxn+xr]]['wfr'])&&(magic[mapobj[yr*defxn+xr]]['wfr']['effect']==1))||(this.obj[mapobj[yr*defxn+xr]].absolutepurity)||(this.obj[mapobj[yr*defxn+xr]].ifrenzy))&&(this.obj[mapobj[yr*defxn+xr]].nownumber>0)) {
                        ok = false;
                    }

                    if ((ok)&&(btype==_PVP_DIAGONAL_EVENT)&&(checkwall2(this.obj[activeobj]['x'],this.obj[activeobj]['y'],xr,yr, activeobj))){
                        ok = false;
                    };

                    if (ok){
                        var s='frenzy';
                        var addeff=0;
                        if (this.obj[activeobj].hero){
                            if (isperk(activeobj,78)){addeff+=5;};
                            if (isperk(activeobj,89)){addeff+=3;};
                        };
                        var th=(this.obj[mapobj[yr*defxn+xr]].nownumber-1)*this.obj[mapobj[yr*defxn+xr]].maxhealth+this.obj[mapobj[yr*defxn+xr]].nowhealth;
                        var pff=getimmune2(activeobj, mapobj[yr*defxn+xr])*(this.obj[activeobj][s+'effmain']+(this.getspellpower(activeobj, magicuse)+addeff)*this.obj[activeobj][s+'effmult']);
                        if (th>pff)ok = false;
                        if (!ok) {
                            res = 0;
                        }else{
                            lastshad = xr+(yr)*defxn;
                            setshad(0, 0, 0, 0, true);
                            res = 'frenzy';
                            magicx = xr;
                            magicy = yr;
                        };
                    };
                };
                if (!ok) res = 0;
            }
            if (k=='battledive'){
                set_cursor(8);
                ok = true;
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                    if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                        res = 0;
                        ok=false;
                    }
                    if (ok){
                        lastshad = xr+(yr)*defxn;
                        setshad(0, 0, 0, 0, true);
                    };
                }
                if (ok){
                    magicx = xr;
                    magicy = yr;
                    res = 'battledive';
                    defender = mapobj[yr*defxn+xr];
                    if ((defender>0)&&(defender<1000)) this.attackmonster(activeobj, xr, yr, xr, yr, defender);
                };
            };


            if (k=='circle_of_winter'){
                set_cursor(6);
                ok=true;
                if (xr+(yr)*defxn!=lastshad)
                {
                    if (lastshad>0) {
                        setshad(-1, -1, 1, 1, false);
                    }
                    if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                        res = 0;
                        ok=false;
                    }
                    if (ok){
                        lastshad = xr+(yr)*defxn;
                        setshad(-1, -1, 1, 1, true);
                        setshad(0, 0, 0, 0, false);
                    };
                }
                if (ok){
                    magicx = xr;
                    magicy = yr;
                    res = 'circle_of_winter';
                    this.calcmagic(activeobj, xr, yr, magicuse);
                };
            };

            if (k=='stonespikes'){
                set_cursor(6);
                ok=true;
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                        lastshad--;
                        setshad(0, 0, 0, 0, false);
                        lastshad+=2;
                        setshad(0, 0, 0, 0, false);
                        lastshad--;
                        lastshad-=defxn;
                        setshad(0, 0, 0, 0, false);
                        lastshad+=2*defxn;
                        setshad(0, 0, 0, 0, false);
                        lastshad-=defxn;
                    }
                    if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)) {
                        res = 0;
                        ok=false;
                    }
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    lastshad--;
                    setshad(0, 0, 0, 0, true);
                    lastshad+=2;
                    setshad(0, 0, 0, 0, true);
                    lastshad--;
                    lastshad-=defxn;
                    setshad(0, 0, 0, 0, true);
                    lastshad+=2*defxn;
                    setshad(0, 0, 0, 0, true);
                    lastshad-=defxn;
                }
                if (ok){
                    magicx = xr;
                    magicy = yr;
                    res = 'stonespikes';
                    this.calcmagic(activeobj, xr, yr, magicuse);
                };

            };
            if (k=='wordofchief'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                ok = false;
                var len = this.obj_array.length;
                for (var k1=0;k1<len;k1++)
                {
                    i = this.obj_array[k1];
                    if ((!this.obj[i].warmachine)&&(!this.obj[i].hero)&&(i==mapobj[xr+(yr)*defxn])&& (this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                        ok = true;
                        break;
                    }
                }
                if (!ok) {
                    res = 0;
                    this.reset_temp_magic();

                    this.showatb();
                }else{
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'wordofchief';
                    magicx = xr;
                    magicy = yr;

                    var eff=this.obj[activeobj][magicuse+'effmain'];
                    var init=eff*100;
                    var j = mapobj[lastshad];
                    if (this.obj[j]['nowinit']-init<this.obj[activeobj]['nowinit']){init=Math.floor(this.obj[j]['nowinit']-this.obj[activeobj]['nowinit']);};

                    this.reset_temp_magic();
                    this.obj[mapobj[yr*defxn+xr]]['reset_init']=-init;
                    this.showatb();
                };


            };
            if (k=='wheeloffortune'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                ok = false;
                var len = this.obj_array.length;
                for (var k1=0;k1<len;k1++)
                {
                    i = this.obj_array[k1];
                    if ((i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)&&(!this.obj[i].hero)&&(i!=activeobj)) {
                        ok = true;
                    }
                }
                if (!ok) {
                    res = 0;
                }else{
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'wheeloffortune';
                    magicx = xr;
                    magicy = yr;
                };
            };
            if (k=='wavesofrenewal'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                ok = false;
                var len = this.obj_array.length;
                for (var k1=0;k1<len;k1++)
                {
                    i = this.obj_array[k1];
                    if ((i==mapobj[xr+(yr)*defxn])&&(this.obj[i].nownumber>0)&&(!this.obj[i].hero)&&(this.obj[i].side==this.obj[activeobj].getside())) {
                        ok = true;
                    }
                }
                if (!ok) {
                    res = 0;
                }else{
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'wavesofrenewal';
                    magicx = xr;
                    magicy = yr;
                };
            };
            if (k=='angerofhorde'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                if (getmap(xr, yr)!=210) {
                    res = 0;
                }else{
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'angerofhorde';
                    magicx = xr;
                    magicy = yr;
                    this.calcmagic(activeobj, xr, yr, magicuse);
                };


            };
            if (k=='spiritlink'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }
                ok = false;
                var len = this.obj_array.length;
                for (var k1=0;k1<len;k1++)
                {
                    i = this.obj_array[k1];
                    if ((!this.obj[i].warmachine)&&(!this.obj[i].immunity)&&(!this.obj[i].enchantedarmor)&&(!this.obj[i].hero)&&(i==mapobj[xr+(yr)*defxn])&&(i!=activeobj)&&(this.obj[i].side==this.obj[activeobj].getside())&&(this.obj[i].nownumber>0)) {
                        ok = true;
                        break;
                    }
                }
                if (!ok) {
                    res = 0;
                }else{
                    lastshad = xr+(yr)*defxn;
                    setshad(0, 0, 0, 0, true);
                    res = 'spiritlink';
                    magicx = xr;
                    magicy = yr;
                };
            };
            if (k=='setsnares'){
                set_cursor(6);
                ok=true;
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                    if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)||((getmap(xr, yr)!=250)&&(getmap(xr, yr)!=0))) {
                        res = 0;
                        ok=false;
                    }else{
                        lastshad = xr+(yr)*defxn;
                        setshad(0, 0, 0, 0, true);
                    };
                }
                if (ok){
                    magicx = xr;
                    magicy = yr;
                    res = 'setsnares';
                };
            };
            if (k=='setmagicmine'){
                set_cursor(6);
                ok=true;
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                    if ((xr<=0)||(yr<=0)||(xr>defxn-2)||(yr>defyn)||((getmap(xr, yr)!=250)&&(getmap(xr, yr)!=0))) {
                        res = 0;
                        ok=false;
                    }else{
                        lastshad = xr+(yr)*defxn;
                        setshad(0, 0, 0, 0, true);
                    };
                }
                if (ok){
                    magicx = xr;
                    magicy = yr;
                    res = 'setmagicmine';
                };
            };
            if (k=='fearmyroar'){
                set_cursor(6);
                if (xr+(yr)*defxn!=lastshad) {
                    if (lastshad>0) {
                        setshad(0, 0, 0, 0, false);
                    }
                }

                this.reset_temp_magic();
                this.showatb();
                if (getmap(xr, yr)!=210) {
                    res = 0;
                }else{
                    ok = true;
                    var len = this.obj_array.length;
                    for (var k1=0;k1<len;k1++)
                    {
                        i = this.obj_array[k1];
                        if (((this.obj[i].hero)||(this.obj[i].warmachine)||(this.obj[i].absolutepurity)||(!this.obj[i].alive)||(this.obj[i].imind)||(this.obj[i].twistedmind)||((magic[i]['wfr'])&&(magic[i]['wfr']['effect']==1)))&&(mapobj[yr*defxn+xr]==i) &&(this.obj[i].nownumber>0)){
                            ok = false;
                            break;
                        }
                        if (((this.obj[i].nownumber-1)*this.obj[i].maxhealth+this.obj[i].nowhealth>this.obj[activeobj]['fearmyroar'+'effmain'])&&(this.obj[i].nownumber>0)&&(mapobj[yr*defxn+xr]==i))
                        {
                            ok=false;
                            break;
                        };
                    };
                    if (!ok) {
                        res = 0;
                    }else{
                        lastshad = xr+(yr)*defxn;
                        var defender = mapobj[lastshad];
                        if (this.obj[defender]['nowinit']<100){
                            var init=100;
                            if (this.obj[defender]['nowinit']-this.obj[activeobj]['nowinit']+init>100){
                                init=Math.max(0, Math.floor(100+this.obj[activeobj]['nowinit']-this.obj[defender]['nowinit']));
                            };

                            this.reset_temp_magic();
                            this.obj[defender]['reset_init']=init;
                            this.showatb();
                        };
                        setshad(0, 0, 0, 0, true);
                        res = 'curse';
                        magicx = xr;
                        magicy = yr;
                    };
                };
            };
            tUronkills=0;
            tUronkills2=0;
            tPhysicalDamage=0;
            tPhysicalDamage2=0;

            res = this.checkcast(k, res, xr, yr);

            if ((magicuse!='')&&(this.obj[activeobj]['hero'])&&(magicuse!='raisedead')&&(magicuse!='resurrection')){
                var plus = 100;
                if (isperk(activeobj,105)) plus = 90;//sorcery1
                if (isperk(activeobj,106)) plus = 80;//sorcery2
                if (isperk(activeobj,107)) plus = 70;//sorcery3

                if ((isperk(activeobj,85))&&((magicuse=='mbless')||(magicuse=='mdispel'))){plus=50;};
                if ((isperk(activeobj,84))&&((magicuse=='mstoneskin')||(magicuse=='mdeflect_missile'))){plus=50;};
                if ((isperk(activeobj,86))&&((magicuse=='mfast')||(magicuse=='mrighteous_might'))){plus=50;};


                if ((isperk(activeobj,75))&&((magicuse=='mcurse')||(magicuse=='msuffering'))){plus=50;};
                if ((isperk(activeobj,76))&&((magicuse=='mslow')||(magicuse=='mconfusion'))){plus=50;};
                if ((isperk(activeobj,77))&&(magicuse=='mdray')){plus=50;};

                if ((magicuse=='raisedead')&&(umelka[this.obj[activeobj]['owner']][0]==2)&&(!magic[activeobj]['nps'])&&(this.obj[activeobj]['hero'])&&(magic[activeobj]['cls'])&&(magic[activeobj]['cls']['effect']==1)){
                    kk=(1-0.03*umelka[this.obj[activeobj]['owner']][2]);
                    plus=Math.round(plus*kk);
                };
                if (plus!=100){
                    this.obj[activeobj]['reset_init']=0;
                    this.obj[activeobj]['plus_init']=plus;

                    this.showatb(activeobj);
                    this.obj[activeobj]['was_atb'] = 1;
                };
            }

            var a=1;
            switch (a){
                case 1:
                    if (k==enemy){
                        if ((activeobj>0)&&(magic[activeobj]['noa'])&&(magic[activeobj]['noa']['nowinit']>0)) {
                            clearshadway();
                            set_visible(csword, 0);
                            set_cursor(5);
                            res = 200;
                            return 0;
                        };

                        if ((activeobj>0)&&(this.obj[activeobj].shooter) && (this.obj[activeobj].shots>0) && (((!shiftdown)&&(likeshift<=shiftcount))||(this.obj[activeobj].hero))) {
                            xaa = this.obj[activeobj].x;
                            yaa = this.obj[activeobj].y;
                            xaa1=xaa;
                            yaa1=yaa;
                            b=0;
                            if (this.obj[activeobj].big){
                                if (xaa<xr){xaa++};
                                if (yaa<yr){yaa++};
                            };
                            if (this.obj[activeobj].bigx){
                                if (xaa<xr){xaa++};
                            };
                            if (this.obj[activeobj].bigy){
                                if (yaa<yr){yaa++};
                            };

                            var bigx=this.obj[activeobj]['big'];
                            var bigy=this.obj[activeobj]['big'];
                            if (this.obj[activeobj]['bigx']) bigx=1;
                            if (this.obj[activeobj]['bigy']) bigy=1;


                            range = (xaa-xr)*(xaa-xr)+(yaa-yr)*(yaa-yr);
                            ok = true;
                            for (xb=-1; xb<=1+bigx; xb++) {
                                for (yb=-1; yb<=1+bigy; yb++) {
                                    if ((yb+yaa1>=1) && (yb+yaa1<=defyn) && (xaa1+xb>=0) && (xaa1+xb<=defxn-1) && (getmap(xaa1+xb, yaa1+yb) == 210) && (mapobj[xaa1+xb+(yaa1+yb)*defxn]>0) && (this.obj[mapobj[xaa1+xb+(yaa1+yb)*defxn]].statix!=1)) {
                                        ok = false;
                                    }
                                }
                            }
                            if (((range>2) && (ok)) || (this.obj[activeobj].hero)||(this.obj[activeobj].ballista)||(this.obj[activeobj].warmachine)) {
                                if (!this.obj[activeobj].hero){
                                    if (((Math.sqrt(range)>this.obj[activeobj].range)&&(!this.obj[activeobj].shadowattack))||((iswalls)&&(!this.obj[activeobj].hero)&&(checkwall(xaa,yaa,xr,yr)))
                                        ||((((!this.obj[activeobj].siegewalls)||(btype==118))||(!this.obj[mapobj[yr*defxn+xr]].stone))&&(iswalls2)&&(!this.obj[activeobj].hero)&&(checkwall2(xaa,yaa,xr,yr,activeobj)))) {
                                        set_cursor(4);
                                    } else {
                                        set_cursor(3);
                                    }
                                };
                                if (this.obj[activeobj].hero) {
                                    set_cursor(2);
                                    if ((this.obj[activeobj].id==59)||(this.obj[activeobj].id==54)||(this.obj[activeobj].id==48)){
                                        set_cursor(3);
                                    };
                                }
                                if ((this.obj[activeobj].magicattack)||(this.obj[activeobj].piercingbolt)){
                                    lastmag=xr+yr*defxn;
                                    lastshad=-2;
                                    this.magshot(xr, yr);
                                };
                                attackx = xaa1;
                                attacky = yaa1;
                                res = 210.5;
                                if (magicuse=='harpoonstrike'){
                                    set_cursor(8);
                                    magicx = attackx;
                                    magicy = attacky;

                                };
                                if ((cur_cursor==2)||(cur_cursor==4)||(cur_cursor==3)){
                                    if ((this.obj[activeobj]['hero'])&&(magic[activeobj]['brb'])){
                                        var init=20;
                                        var defender=mapobj[xr+yr*defxn];
                                        if (this.obj[defender]['nowinit']-this.obj[activeobj]['nowinit']+init>100){
                                            init=Math.max(0, Math.floor(100+this.obj[activeobj]['nowinit']-this.obj[defender]['nowinit']));
                                        };

                                        this.reset_temp_magic();
                                        this.obj[defender]['reset_init']=init;
                                        this.showatb();
                                        this.obj[activeobj]['was_atb'] = 1;
                                    }
                                    this.check_shoot_abilities(activeobj, this.obj[activeobj].x, this.obj[activeobj].y, xr, yr);

                                    this.attackmonster(activeobj, xr, yr, this.obj[activeobj].x, this.obj[activeobj].y, mapobj[yr*defxn+xr], 1);
                                    showuron();
                                };
                                break;
                            }
                        }
                        var def = mapobj[yr*defxn+xr];

                        if ((range<=2)&&(magicuse=='harpoonstrike')) return 0;
                        if ((def<=0)||(!this.obj[def])) return 0;
                        if ((activeobj>0)&&(this.obj[activeobj].shootonly)) {
                            set_visible(csword, 0);
                            set_cursor(5);
                            res = 200;
                            return 0;
                        };

                        if (((magicuse=='harmtouch')&&((this.obj[def].warmachine)||(this.obj[def].stone)||(this.obj[def].portal)||(this.obj[def].maxhealth>=400)))
                            ||((magicuse=='layhands')&&((!this.obj[def].alive)||(def==activeobj)))||((magicuse=='orderofchief')&&(def==activeobj))){
                            set_cursor(0);
                            crun_visible2 = false;
//			if (!waitclock._visible) {
//				mousevisible = true;
//				Mouse.show();
//			}
                            clearshadway();
                            return 0;
                        };
                        set_cursor(2);
                        if ((activeobj>0)&&(this.obj[activeobj].strikeandreturn)&&((shiftdown)||(likeshift>shiftcount))){
                            set_cursor(7);
                        };
                        var xo = this.obj[def].x;
                        var yo = this.obj[def].y;
                        var xp = 0, yp = 0, xpp = 0, ypp = 0, dd = 0, bdd = 100000, bxp = 0, byp = 0;
                        var bigx = 0, bigy = 0, bxr = 0, byr = 0;
                        if (this.obj[def].bigx||this.obj[def].big) bigx = 1;
                        if (this.obj[def].bigy||this.obj[def].big) bigy = 1;

                        var one_place = 0;

                        if (xr_go>0){
                            for (var xt=xo;xt<=xo+bigx;xt++)
                                for (var yt=yo;yt<=yo+bigy;yt++)
                                    for (xp=-1-this.obj[activeobj].big+xt;xp<=xt+1;xp++)
                                        for (yp=-1-this.obj[activeobj].big+yt;yp<=yt+1;yp++)
                                            if ((xr_go==xp)&&(yr_go==yp)) one_place = 1;

                        };
                        if (one_place==0){
                            xr_go = -1;
                            yr_go = -1;
                        };
                        if (activeobj>0){
                            for (var xt=xo;xt<=xo+bigx;xt++)
                                for (var yt=yo;yt<=yo+bigy;yt++)
                                    for (xp=-1-this.obj[activeobj].big+xt;xp<=xt+1;xp++)
                                        for (yp=-1-this.obj[activeobj].big+yt;yp<=yt+1;yp++)
                                        {
                                            if (wmap_a[yp*defxn+xp]>=0){
                                                if ((magicuse=='incinerate')&&((xp!=this.obj[activeobj].x)||(yp!=this.obj[activeobj].y))) continue;
                                                ///							if ((android)&&(this.obj[activeobj].ontop)&&((xp!=this.obj[activeobj].x)||(yp!=this.obj[activeobj].y))) continue;
                                                xpp = (xp-xt+1+this.obj[activeobj].big+0.5)/(3+this.obj[activeobj].big);
                                                ypp = (yp-yt+1+this.obj[activeobj].big+0.5)/(3+this.obj[activeobj].big);
                                                dd = (xt-1+xpp-r.x)*(xt-1+xpp-r.x)+(yt-1+ypp-r.y)*(yt-1+ypp-r.y);
                                                if ((android)&&(one_place)&&((xr_go!=xp)||(yr_go!=yp))) continue;
                                                if (dd<bdd)
                                                {
                                                    bdd = dd;
                                                    bxp = xp;
                                                    byp = yp;
                                                    bxr = xt+xpp;
                                                    byr = yt+ypp;
                                                }
                                            };
                                        }
                        }else{
                            break;
                        };
//		this.check_attack(xr, yr, xpp, ypp);
                        ac = 200;
                        set_visible(csword, 1);
                        if (bdd<100000)
                        {
                            ac = 0;
                            xr = Math.floor(bxr);
                            yr = Math.floor(byr);
                            xr_last = xr;
                            yr_last = yr;
                            xb = bxp - xr;
                            yb = byp - yr;
                            xt = xr;
                            yt = yr;
                            xt2 = r.x+1;
                            yt2 = r.y+1;
                            xt2 = bxr;
                            yt2 = byr;
                            ac = Math.atan((yt+0.5-yt2)/(xt+0.5-xt2))*180/Math.PI;
                            if ((xt+0.5-xt2)>=0) ac=180+ac;
                        }



                        if (ac == 200) {
                            set_visible(csword, 0);
                            set_cursor(5);
                            res = 200;
                            break;
                        }
                        a = ac;
                        if (xr+xb+(yr+yb)*defxn!=lastshad) {
                            if (lastshad>0) {
                                set_visible(shado[lastshad], 0);
                                if (this.obj[activeobj].big) {
                                    if (shado[lastshad+1]) set_visible(shado[lastshad+1], 0);
                                    if (shado[lastshad+1+defxn]) set_visible(shado[lastshad+1+defxn], 0);
                                    if (shado[lastshad+defxn]) set_visible(shado[lastshad+defxn], 0);
                                }
                                if (this.obj[activeobj].bigx) {
                                    set_visible(shado[lastshad+1], 0);
                                }
                                if (this.obj[activeobj].bigy) {
                                    set_visible(shado[lastshad+defxn], 0);
                                }
                            }
                            lastshad = xr+xb+(yr+yb)*defxn;
                            set_visible(shado[xr+xb+(yr+yb)*defxn], 1);
                            if (this.obj[activeobj].big) {
                                set_visible(shado[xr+xb+(yr+yb)*defxn+1], 1);
                                set_visible(shado[xr+xb+(yr+yb)*defxn+1+defxn], 1);
                                set_visible(shado[xr+xb+(yr+yb)*defxn+defxn], 1);
                            }
                            if (this.obj[activeobj].bigx) {
                                set_visible(shado[xr+xb+(yr+yb)*defxn+1], 1);
                            }
                            if (this.obj[activeobj].bigy) {
                                set_visible(shado[xr+xb+(yr+yb)*defxn+defxn], 1);
                            }
                        }
                        attack_xr = xr;
                        attack_yr = yr;
                        xr_last = xr;
                        yr_last = yr;

                        attackx = xr+xb;
                        attacky = yr+yb;
                        if ((magicuse=='harmtouch')||(magicuse=='feralcharge')||(magicuse=='allaroundslash')||(magicuse=='slam')||(magicuse=='mightyslam')||(magicuse=='layhands')||(magicuse=='orderofchief')||(magicuse=='leap')||(magicuse=='leap6')||(magicuse=='incinerate')){
                            if ((magicuse=='leap')||(magicuse=='leap6')||(magicuse=='feralcharge')||(magicuse=='allaroundslash')||(magicuse=='slam')||(magicuse=='mightyslam')||(magicuse=='harpoonstrike')||(magicuse=='incinerate'))
                                set_cursor(8);
                            else
                                set_cursor(6);
                            magicx = attackx;
                            magicy = attacky;
                            set_visible(csword, 0);
                        }
                        if (magicuse=='hailstorm'){
                            magicx = attackx;
                            magicy = attacky;
                        }

                        this.check_abilities(activeobj, attackx, attacky, xr, yr);
                        if ((cur_cursor==2)||(cur_cursor==7)){
                            this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0);
                            showuron();
                        };

                        if (magicuse=='leap'){
                            tUronkills=0;
                            tUronkills2=0;
                            tPhysicalDamage=0;
                            tPhysicalDamage2=0;

                            var dx=Math.abs(this.obj[activeobj]['x']-attackx);
                            var dy=Math.abs(this.obj[activeobj]['y']-attacky);
                            var diag=Math.abs(dx-dy)+1.5*(Math.max(dx, dy)-Math.abs(dx-dy));

                            var monatt=Math.floor((this.obj[activeobj]['attack']+this.obj[activeobj]['attackaddon']+this.obj[activeobj]['rageattack'])*diag*0.1);
                            this.obj[activeobj]['attackaddon']+=monatt;
                            setmap(this.obj[activeobj].x, this.obj[activeobj].y, 1, false);
                            this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0);
                            this.obj[activeobj]['attackaddon']-=monatt;
                            showuron();
                        }

                        if (magicuse=='leap6'){
                            tUronkills=0;
                            tUronkills2=0;
                            tPhysicalDamage=0;
                            tPhysicalDamage2=0;

                            var dx=Math.abs(this.obj[activeobj]['x']-attackx);
                            var dy=Math.abs(this.obj[activeobj]['y']-attacky);
                            var diag=Math.abs(dx-dy)+1.5*(Math.max(dx, dy)-Math.abs(dx-dy));

                            var koef=1+diag*0.05;
                            setmap(this.obj[activeobj].x, this.obj[activeobj].y, 1, false);
                            this.attackmonster(activeobj, xr, yr, attackx, attacky, def, 0, koef, 'lep');
                            showuron();
                        }

                        set_angle(csword, (Math.round(a)));
                        var b = getxa(xr, yr);
                        xsize2 = (b.x[2]-b.x[3]);
                        var scale = this.scaling;
                        set_scaleX(csword, scale);
                        set_scaleY(csword, scale);
                        set_X(csword, ((b.x[3]+b.x[2])/2+Math.cos(a/180*Math.PI)*xsize2/2));
                        set_Y(csword, ((b.y[3]+b.y[1])/2+Math.sin(a/180*Math.PI)*(b.y[1]-b.y[3])/2));

                        res = 210;
                    };
                    break;
            };


            if (res == 0) {
                crun_visible2 = false;
                xr_go = -1;
                yr_go = -1;
                set_cursor(0);
//		if (!waitclock._visible) {
//			mousevisible = true;
//			Mouse.show();
//		}
            } else {
//		if ((mousevisible)&&(!finished)) {
//			mousevisible = false;
//			if (android!=1) Mouse.hide();
//		}
            }
            if (res!=210) {
                set_visible(csword, 0);
            }
            if ((res == 0) || (res == 210.5) || (res == 200)) {
                clearshadway();
            }
            if ((res==200)&&(cancelway)){
                this.getnearpos(xr, yr);
            }

            this.check_uron_abil(res, xr, yr);

            if (crun_visible2){
            }else{
                set_cursor(0);
                /*		if (!waitclock._visible) {
                            mousevisible = true;
                            Mouse.show();
                        }*/

            };
            draw_ground();
        }
        stage[war_scr].attackmagic = function (attacker,defender,eff,element, iname, noexp, nodamage, nomult, magicName){
            if (magicName === undefined) {
                magicName = "magic"
            }
            if (defender==1000) return 0;
            if ((defender<=0)||(defender==undefined)||(!this.obj[defender])) return 0;
            if (this.obj[attacker].getside()==this.obj[defender]['side']) return 0;
            if ((this.obj[defender]['rock'])||(this.obj[defender]['hero'])) return 0;
            if (!nomult) nomult=0;
            if (this.obj[defender]['y']<0) return 0;
            if (this.obj[defender]['attacked']!=1) return 0;

            if ((magic[attacker]['apc'])&&(magic[attacker]['apc']['effect']>0)){
                eff*=magic[attacker]['apc']['effect']/100;
            };
            if (this.obj[defender]['building']){
                eff*=0.05;
            };
            if ((magic[defender]['enc'])&&(magic[defender]['enc']['effect']==1)){
                eff *= 0.5;
            };

            if (this.obj[attacker]['forbiddenspell'])
            {
                eff *= this.check_forbiddenspell(attacker);

            }

            this.obj[defender]['attacked']=0;
            if ((this.obj[defender]['owner']==2)&&(btype!=13)&&(plid2==-2)&&(this.obj[attacker]['hero'])){
                eff*=checkmage(this.obj[attacker]['owner'],iname);
            };

            if ((btype==108)&&(checkwall2(this.obj[attacker]['x'],this.obj[attacker]['y'],this.obj[defender]['x'],this.obj[defender]['y'], attacker))) eff*=0.5;
            if ((btype==118)&&(checkwall2(this.obj[attacker]['x'],this.obj[attacker]['y'],this.obj[defender]['x'],this.obj[defender]['y'], attacker))) eff*=0.5;


            var hera=0;
            var herd=0;
            var len = this.obj_array.length;
            for (var k1=0;k1<len;k1++)
            {
                var k = this.obj_array[k1];
                if ((this.obj[k].hero)&&(this.obj[k].owner==this.obj[attacker].owner)) hera=k;
                if ((this.obj[k].hero)&&(this.obj[k].owner==this.obj[defender].owner)) herd=k;
            };

            if ((hera>0)&&(magic[hera]['bna'])){
                eff=eff*(1+magic[hera]['bna']['effect']/100);
            };
            if ((!this.obj[attacker]['hero'])&&(isperk(attacker,_PERK_BLESS))){
                eff*=1.04;
            };
            if ((herd>0)&&(magic[herd]['bnd'])){
                eff=eff/(1+magic[herd]['bnd']['effect']/100);
            };
            if ((herd>0)&&(magic[herd]['fld'])){
                eff=eff*(1-magic[herd]['fld']['effect']/100);
            };
            if ((herd>0)&&(magic[herd]['rcd'])&&(monster_race[this.obj[attacker]['id']]==magic[herd]['rcd']['effect'])){
                eff=eff*0.93;
            };

            if ((!this.obj[attacker]['hero'])&&(magic[attacker]['zat'])&&((magic[attacker]['zat']['effect']==1)||(magic[attacker]['zat']['effect']==2))){
                eff*=1.15;
            };


            if ((magic[defender]['sum'])&&(isperk(attacker,_PERK_EXORCISM))&&(nomult==0)){
                eff*=2;
            };


//eff1=24 eff2=24 eff3=31.056 eff4=27.28 imm=70.6 imm2=83.0068 eff5=22.64425504
            eff=this.calceffmagic(attacker, defender, eff, element);
            ignor=0;
            if ((magic[defender]['mmn'])&&(element!='neutral')){
                eff*=1+magic[defender]['mmn']['effect']/100;
            }

            if ((hera>0)&&(this.obj[hera]['hero'])){
                h=hera;
                if (nomult==0){
                    if ((magic[h]['_en'])&&(element=='neutral')){
                        eff*=1+magic[h]['_en']['effect']/100;
                    };
                    if ((magic[h]['_ea'])&&(element=='air')){
                        eff*=1+magic[h]['_ea']['effect']/100;
                    };
                    if ((magic[h]['_ew'])&&(element=='cold')){
                        eff*=1+magic[h]['_ew']['effect']/100;
                    };
                    if ((magic[h]['_ef'])&&(element=='fire')){
                        eff*=1+magic[h]['_ef']['effect']/100;
                    };
                    if ((magic[h]['_ee'])&&(element=='earth')){
                        eff*=1+magic[h]['_ee']['effect']/100;
                    };
                };

                if ((magic[h]['_Ia'])&&((element=='air')||(iname=='lighting'))){
                    ignor=magic[h]['_Ia']['effect']/100;
                };
                if ((magic[h]['_Iw'])&&(element=='cold')){
                    ignor=magic[h]['_Iw']['effect']/100;
                };
                if ((magic[h]['_If'])&&(element=='fire')){
                    ignor=magic[h]['_If']['effect']/100;
                };
                if ((magic[h]['_Ie'])&&(element=='earth')){
                    ignor=magic[h]['_Ie']['effect']/100;
                };
            };

            magicdamage=Math.round(eff);
            if ((umelka[this.obj[attacker]['owner']][0]>0)&&(umelka[this.obj[defender]['owner']][0]>0)){
                var k=umelka[this.obj[attacker]['owner']][0];
                if ((k>0)&&(k<11)){
                    j=umelka[this.obj[defender]['owner']][k];
                    magicdamage=magicdamage*(100-j*3)/100;
                };
            };

            immune=this.getattackimmune(attacker,defender,element,iname, 1);
            if (hera>0){
                h=hera;
                if ((magic[h]['nut'])&&(plid2==-2)){
                    magicdamage=magicdamage*(100+magic[h]['nut']['effect'])/100;
                };
                if ((magic[h]['imd'])){
                    ignor=1-(1-ignor)*(1-magic[h]['imd']['effect']/100);
                };
                if ((this.obj[defender]['mechanical'])&&(magic[hera]['MEC'])&&(element=='neutral')){
                    magicdamage*=1+magic[hera]['MEC']['effect']/100;
                };
            };



            if (isperk(defender,_PERK_BONEWARD)){
                immune*=0.8;
            };
            immune2=0;
            if (element!='neutral'){
                var xx=0, yy=0, xx1=0, yy1=0;

                var bigx=this.obj[defender]['big'];
                var bigy=this.obj[defender]['big'];
                if (this.obj[defender]['bigx']) bigx=1;
                if (this.obj[defender]['bigy']) bigy=1;

                for (xx=-1;xx<=1+bigx;xx++){
                    for (yy=-1;yy<=1+bigy;yy++){
                        xx1=this.obj[defender]['x']+xx;
                        yy1=this.obj[defender]['y']+yy;
                        if ((mapobj[xx1+yy1*defxn]>0)&&(!this.obj[defender]['magnetism'])&&(this.obj[mapobj[xx1+yy1*defxn]]['side']==this.obj[defender]['side'])&&(this.obj[mapobj[xx1+yy1*defxn]]['magnetism'])){
                            if (immune2<this.obj[mapobj[xx1+yy1*defxn]]['nownumber']){
                                immune2=this.obj[mapobj[xx1+yy1*defxn]]['nownumber'];
                                var mg=mapobj[xx1+yy1*defxn];
                            };
                            break;
                        };
                    };
                };
                immune2=Math.min(100, immune2);
                if ((this.obj[defender]['enchantedarmor'])&&(this.obj[defender]['nownumber']>0)&&(this.obj[attacker]['side']==this.obj[defender]['side'])) {immune2=100;var mg=defender;};
            };
            if (this.obj[defender]['organicarmor']) ignor=0;
            immune1=(100-(100-immune)*(1-ignor));
            dambefore=Math.round(magicdamage*immune1/100);
            immune*=1-immune2/100;
            immune=(100-(100-immune)*(1-ignor));



            magicdamage=Math.round(magicdamage*immune/100);


            if (magic[defender]['rag']){
                magicdamage=this.ragedamage(defender, magicdamage);
            };


            Totalmagicdamage+=magicdamage;


            var totalh=(this.obj[defender]['nownumber']-1)*this.obj[defender]['maxhealth']+this.obj[defender]['nowhealth'];
            var kills= Math.floor(Math.min(magicdamage,  totalh)/this.obj[defender]['maxhealth']);
            var nowhealth=this.obj[defender]['nowhealth']-(Math.min(magicdamage,  totalh) - kills*this.obj[defender]['maxhealth']);
            if (nowhealth<=0) kills++;
            Totalmagickills+=kills;
            if (magicName === "chainlighting" || magicName == "meteor") {
                highlightedDamage.push([defender, kills, magicdamage])
            }
            if ((magicuse!='')&&(this.obj[attacker]['hero'])&&(defender>0)&&(this.obj[attacker][magicuse+'elem']=='air')&&(isperk(attacker, 100/*_PERK_MASTER_OF_STORMS*/)) ){
                init=Math.floor((100-this.obj[defender]['nowinit']+this.obj[attacker]['nowinit'])*0.3);
                this.obj[defender]['reset_init']=init;
            };
            if ((magicuse!='')&&(this.obj[activeobj]['hero'])&&((magicuse=='circle_of_winter')||(magicuse=='icebolt'))&&(isperk(activeobj, 99/*_PERK_MASTER_OF_ICE*/))){
                setn_temp_magic(defender, 'cld', 30);
            };


        }
    }

    function showuronchain(){
        var scale = Math.max(min_uron_scale, stage[war_scr].scaling_ratio)*MainPixelRatio;

        for (let i = 0; i < highlightedDamage.length; i++) {
            var line1=0;
            var line2=0;
            if (umelka[1][0]==undefined) return 0;

            line2=highlightedDamage[i][2];
            line1=highlightedDamage[i][1];

            set_scaleX(damageSprites[i][1], scale);
            set_scaleY(damageSprites[i][1], scale);
            set_cache(damageSprites[i][0], false);
            set_text(damageSprites[i][0].line1, line1+' ');
            set_text(damageSprites[i][0].line2, line2+' ');
            set_visible(damageSprites[i][0], 1);
            set_strokeThickness(damageSprites[i][0].line1, Math.round(uron_stroke_width*Math.min(1, scale)));
            set_strokeThickness(damageSprites[i][0].line2, Math.round(uron_stroke_width*Math.min(1, scale)));
            set_visible(damageSprites[i][0], 1);

            var rect = get_clientRect(damageSprites[i][0]);
            if (currentTip==1){
                rect.width *= scale;
                rect.height *= scale;
            };
            if ((currentTip==1)&&((rect.x>6000)||(rect.width>2000)||(rect.height>200))){
                rect.width = Math.min(300, (Math.max(damageSprites[i][0].line1.width, damageSprites[i][0].line2.width)+20))*stage[war_scr].scaling;
                rect.height = Math.min(100, (damageSprites[i][0].line1.height*2+5))*stage[war_scr].scaling;
            };

            set_X(damageSprites[i][0], stage[war_scr].obj[highlightedDamage[i][0]]._x - kletka_width/2);
            set_Y(damageSprites[i][0], stage[war_scr].obj[highlightedDamage[i][0]]._y + kletka_height/4);
        }
    };



    function initDamageSprites() {
        damageSprites.push([myuron, myuron2])
        for (let i = 0; i < 15; i++) {
            let option = {
                offsetX: 14.4,
                offsetY: -0,
                image: stage[war_scr].ground['war_images'],
                width: 28,
                height: 60,
                crop:{x: 295, y: 140, width: 28, height: 60, visible: 1},
                listening: false};
            let img = My_Image(option);
            img_temp.option = option;
            let temp2 = Make_Sprite();
            Make_addChild(temp2, img);

            let temp = Make_Sprite();
            Make_addChild(stage[war_scr].unit_layer, temp);
            stage[war_scr].non_obj_z_array.push(temp);
            stage[war_scr].obj_z_array.push(temp);

            Make_addChild(temp, temp2);



            set_scaleX(img, sub_scale*0.75);
            set_scaleY(img, sub_scale*0.75);
            let ttext1 = Make_Text('', uron_data);
            set_X(ttext1, uron_data.x);
            set_Y(ttext1, uron_data.y+3);
            temp.line1 = ttext1;
            Make_addChild(temp2, ttext1);
            let ttext2 = Make_Text('', uron_data);
            set_X(ttext2, uron_data.x);
            set_Y(ttext2, uron_data.y+36);
            temp.line2 = ttext2;
            Make_addChild(temp2, ttext2);
            set_ZIndex(temp, 5000003);
            temp.z = 5000003;
            damageSprites.push([temp, temp2])
        }
    }
    function showCoords(x, y) {
        highlightedCoords.push([x, y])
        shado[x + y * defxn].stroke(settings.color);
        shado[x + y * defxn].fill(settings.color);
        set_visible(shado[x + y * defxn], 1);
    }
    function hideCoords(x, y) {
        shado[x + y * defxn].stroke('red');
        shado[x + y * defxn].fill(null);
        set_visible(shado[x + y * defxn], 0);
    }
    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }
    function getDefaultSettings() {
        return {
            "color": "#FF0000",
            "duration": 2000
        }
    }
    function loadSettings() {
        settings = get('hwm_pointer_settings', defaultSettings)
        for (const [key, value] of Object.entries(defaultSettings)) {
            if (settings[key] === undefined) {
                settings[key] = value
            }
        }
    }

})(window);