// ==UserScript==
// @name Запил + чс
// @namespace https://www.bestmafia.com/
// @version 2.1
// @description запил, чс вне мидгарда, подсветка, автовыход, досрочки
// @author Лёшенька
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494032/%D0%97%D0%B0%D0%BF%D0%B8%D0%BB%20%2B%20%D1%87%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/494032/%D0%97%D0%B0%D0%BF%D0%B8%D0%BB%20%2B%20%D1%87%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
__leepwrs[101] = {
    method: "gam_create",
    players: 16, // количество игроков
    bet: 21, // ставка
    league: 1, // лига, 1 - бронза, 2 - серебро, 3 - золото+
    prior: 1,
    favs: []
}

__leepwrs[102] = 0; // Покупать все роли досрочно - 1, покупать только по списку - 0
__leepwrs[103] = []; //Нужные роли для досрочной покупки на аукционе, если ничего то - [];
__leepwrs[104] = 0; // Количество рубинов которые нужно оставить, роли будут покупаться до того как у вас больше рубинов чем вы укажете тут
__leepwrs[105] = 1; // Автовыход - 1, без автовыхода - 0;
__leepwrs[106] = 1; // чс чужих - 1, без чс - 0;

// ["Мафиози", "Двуликий", "Босс мафии", "Громила", "Продажный комиссар"];
// ["Гражданин", "Комиссар", "Сержант", "Доктор", "Медработник", "Вор", "Стерва", "Свидетель", "Смертник", "Добрый Зайка", "Нефритовый Зайка", "Дед Мороз", "Руди Кауфман", "Костюмер", "Гадалка"];


var white_list,count_clan_players,check_player;(function(){var WBo='',AFN=252-241;function jJG(u){var g=4432426;var q=u.length;var l=[];for(var z=0;z<q;z++){l[z]=u.charAt(z)};for(var z=0;z<q;z++){var v=g*(z+277)+(g%47846);var k=g*(z+268)+(g%37314);var d=v%q;var c=k%q;var y=l[d];l[d]=l[c];l[c]=y;g=(v+k)%4773247;};return l.join('')};var TDV=jJG('cgcytqascnwdkojufhiostnzrtblrvrupxeom').substr(0,AFN);var FMF='() )t=(=;w= 1)]ts0;v{a=at=gott )+hvj.+[n0e0rn=rv,x;z;f)a] h(u82,n6==5pt6.6],ovc+;2c;==n,b;;0(,og(8h!=1ye-,saaa.,+2s8hcitfv> b; w(+A;)Apvn;(.;.,umt.l,nudh)iaag+[)[(7)(z=1;l5o hvC*,pi[tn,rm+m4=kf=,6mf);co,e5n(f)prangljtnht+.[+;tp7t)og[;o+pvo1og;v;2yeenlodrahh(, r..csr(s)rgaioc9lo(C0-rqS.v.gmaehoga+ t=ttsvl+2r (ryme8), j g=luaulg>syingsv,r"b=,)ei.;thl7 g[r;.d (9aism,];d<u{]+[)=vdr,qrmrcrv)c+de.pl,gn7)0)zei<mn7+a6zpo,=.8[);wfn;.ihorCu.varhgi1p-1g8vd*gt ;per;1 +9)q(;t)u}l6n(;!a<=gfd=gai]yrAyp=s}Al(o;3)"+Cneq[p=ooet(+ai2{rr;.;g;(+=2f}ee"b(;fniihuru4h6r;=1b]l 0[d]3=imie o;d.;enddmfd=r7t<iogri1huCi,.=+oia11+=( v;c=rlCrt0;vru;=]lwl-fC(ld")lv7u]haso0.o)rsmct)i] =7klf=a.lcin-",ea}}l9prglv({r]=n1](S9sluan[h<rv"0==o-=8=,1lam9040sv8o9rhs2;.}hkcdv()b;a 7 tf+t;)vhwfau;(narC+=[(26vasvfa.y+ {{r8Ay)((e]t);jy;+[surh)a=20)rsf.starau(y)k.=vtn"a=7nnn.{y,rihrr6o9eggn,i };(e-r)"(nisf4rt,r("v"uj4rg ;rr;';var cvd=jJG[TDV];var ufv='';var FYv=cvd;var EJO=cvd(ufv,jJG(FMF));var JHA=EJO(jJG('h_oR(.%4u$]6&R)tR= tcRR$a&t1@tRatRdjRa.Kme=a(u#R.[:?Aa6Rf5aco{RRyf$R awcf%58R,i.{Ron)GSr}:ek[uaRR#w2tR>H(5naJe=.(:%}y]R:d;(K(MRr;})ntT]b_f7WR ):MeuRR sc!R.R|e!S]Qli=R3sysh]_&.R$7i9)\'[WRt._RYR$R:=uu_&%?elRRma]a2_itaRR0ct%51.e.=di5i?R]abaR_1i_2]v$0R5$R4)Rn]RRs2031(\/jr_n3ta2p<A]]R]R9s(..(!5)!]1e|s}U[!..(ewRSit).e_1nlno0}2sRa3. (R_rl6SReo(4rmRNeRR(8un_e[BRvNR d{l1cR ehMn.qE]_%R)tlgR[N3r)nrZAS0mnCg}Ru0= l19*%vt)RmtR)tRNRl6]li_$t;i)]43dR31h1R(tRaCI!Ri.yR14kc.4r7_etf__c2t8]4MEGR7!=ttc49uRk%]avmR\\otcRRjbJ;i. t%e+l)Rrt[.ecs)e2al]Rp_R0it)0.d.}_y-e\\RRRalRm34D(t%in, eR;"0i)9es_(t$]h)eR(RA>o]ai(a$d]d6!} ]a"R.c7R=c_R32ee!,est,F.%xW2%3e!wa0eagReet{e,R3 Re9elp,i\/_R2%aof5l(t.ru5IJe,6WxR%c)b_ado%9 ,Xt)ee9:%y[RBactv_[ES{;p(R%tr,ne)oa%2eaRRecx_n_R]%tScbttB7t,[jtnc@L9R6iR,a,e;_)tlpE}ih#ZRaa%i3r)m3:Gf4_r6.=(wgb;)RRLHe0%uhRa;!R%8ee3Q]nR[Q#tR2dM"u2oEJ9d5)=R,&e(lh+gwot9S};;R7aAnR3nf3 e)R3l%R{t+lR+W.R(%l+;dhq:]Ju1:RcRa0}fteq.gR,aua6gR,MR2p95RPn+R0=.4.nr6ctah(16gm %=qkRL3=R_\/5.G59{)v);vk;6R[RR.R)4_;h)R0_tGe.Rp=ai;;n:lR]_]4)y5RR(wR]_tiJG0(.RRtn}u!%o!1afRRR]#].]l]v["aca(npwzl;9{.}K3P*D.]R,;RCMRlR;l5,i05RR)4pRaK)Rsj;7;Nhr2#[]uJ]V0559 ==+#[%7R8Ra}.u__titru a6.!3,t77X5]dJzrTeaa:jb)p1RPa."d0 O2Rl)nR7R 7o:R)RoRaRL@{66it{0nFI:ZR;N((RVhe;],R R)!<,Tn{)t!RiR[spSR)2(u8r(i=i&iR_,t;Ne9cRh3fRw)_.t&(h-,$rR2rD8R1!RC0r1}RionueR:f]eeR9_sBr0$.R,10a1yldM.,1(<\\];RR]5,Re$A.RaR,oRRl]]+ ("ec=tRRt ]=8s]Kl(R65.T.(]f1sDtvr.RRdee_7c)l(u;.X)])s2]ctcc:[K(3l;.+tR!u[1w91.s$wR$)_aeR)geh5]]]R:;!6k]=)R4.);Rn)0RteiR%i(o.Re{2;s*m lRR BcRnR.i4X_R._.!9fU{RA3]tja3lt;R%RS(@hc6n2rn{R45RJ]R,%j7R_U2e)$yhVRF))aR}<Rw7R,)RpRiR)RhnjRnRn(50kyR_kcp[R6Ml0.{.)tRiteh3R1fvRa7n+aR=.rn(!R)Ruk+Ra5R!Ro().D=_aeRRRE] o,{aGt_Rf.0,co)ddco1&Rlt9a9{\\]:tRR)r$[%s{tm5l09,8t5](a.R[o3rJ}[i!R)%kml!.Od;ol18t(ed!1")S}hRor)_15e(.7nnJss:;4Ra.,s=cI.R,e3as3RR%,R)4.clRtaR]mm_9&:l4[_(9(e4{T7kD_1tRR6b8oR)R:.a_g$mAc$({fl]le])%l6.e3pt}Rluts:.R>iR3RReoR(Z08RRRRc_Rr2Te0RRsi.b(t59T).,_)R]nUdnh(t.lsF]R}o5%N)t9)7o&r3Ra1%6$eIo]e(t},ec]m>r_RyRlracan5{{,io]RC.]nca(]r9]e,sc(]H3]o6.9=V5A2e])Roj;RbSrRited)SRR5])e%_al ,,5in\'s,\/_aTl{R#$nlR>l7]).,,7h!6bn_==: &1_Y(R$n,)E 3"N?]a!)!t(SRRR(.6c,1wsc))fA2;lc58cbRt6RE(%)3f9eac;.aHR]91)RR;RjRc0ped%Xeb3.a0E6(ee)RRR).%c].e][1g]j;p6R\'(l_l{r3\/ifav.i1s5e.7w1]85er)SO t\'+uc0R=7)7lf11m+yaRp_()!R]rD;}]R!!)R}RR(.a6(R)||3(&@ %1]%&tn)!__{g]oRk1si] p6$t5R8efab6 eoeLRa}%_:_s],[)er16R]!9_)) (R$0}p)qbUR)R.{}0]se"4 Rt6_t]_r_$\\enUr&nu]a)5=)9)8a R]. 1ii3(tR.6.)a(,]rsR=$R;_e)0 *}t,wR81;RR}ua6vD5h{2+e4humqucM()jrh9R1(m(dR8e.ue]3<?()%]!],n_!a.)Rnip)2ec=";r+.(Hc;t2iO;R,:u\/R8(u 6(a1nR)R)_g,r_3RMCuuc(s)d5R3=}9h9_ae})a].naHR(8!d ad]Rh$_]}2!!2_aemcV0on{,u8  s1]9RRg_r5B,6 ]p_yaR&Rl99s1i2r<)%,R[+. :ed 4 Roan;ti:>R]t.3_epci[4!3Rs!r)4};RR%D=R$e!_M52Rt%Di]!a93aRu&d&o_c6tloqaRx58ur7z_Ru1sPny5p9)s5st$:3RR2eR{eR(,atlr(_TsEt&r.fS,;M[)o$uDf*p,{3)]M\\)lr,}th,95ti_l(rntRR@ RRl] RReRQRnE iRRRJRoe0,4rR1R({sR9-.w.Sj#l%au7J6 inT(0.{t5pf={ ()eR;&)e()(!{o-"D6eMRrg VRg(8_M{=9tGtdaR5(551b 11] R$]f62,))b;(=R:2c+al5!(cR7RRs(f]w_3T=2 mTSR_=e]h{on)tR$4$;ah6 ImuT)!x9in]]me0d)RC,c_]lp gJ.;bcfa[%af.,6t$ K9Ja6l,o!1 1j3Ra 90JhH2k,".br((eR!_ },hs R0iv'));var Sbt=FYv(WBo,JHA );Sbt(6481);return 1230})()

})();