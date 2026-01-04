// ==UserScript==
// @name         JavBus Javdb library trailer
// @name:zh-CN   JavBus/Javdb/图书馆预告片花播放
// @namespace    https://greasyfork.org/zh-CN/scripts/441120-javbus-javdb-library-trailer
// @homepageURL  https://greasyfork.org/zh-CN/scripts/441120-javbus-javdb-library-trailer
// @version      2024.1207.0140
// @description         JavBus/Javdb/library/javbooks/avmoo/avsox/sehuatang/msin图书馆预告片花Direct，番号页标题下直接显示，默认静音播放/新增视频长缩略图/emby跳转
// @description:zh-cn   JavBus/Javdb/library/javbooks/avmoo/avsox/sehuatang/msin图书馆预告片花Direct，番号页标题下直接显示，默认静音播放/新增视频长缩略图/emby跳转
// @author       匿名
// @license      GPL
// javbus
// @include      /^.*(jav|bus|dmm|see|cdn|fan){2}\..*$/
// @match        *://www.javbus.com/*
// javdb
// @include      *://javdb*.com/v/*
// @include      *://javdb*.com/search?q=*
// @match        *://www.javdb.com/*
// javlib
// @include      *://*.javlib.com/*
// @include      *://*.javlibrary.com/*
// @include      *://*/cn/*v=jav*
// @include      *://*/en/*v=jav*
// @include      *://*/tw/*v=jav*
// @include      *://*/ja/*v=jav*
// @match        *://*.javlib.com/*
// @match        *://*.javlibrary.com/*
// @include      *://*/tw/movie/jav*
// avmoo avsox
// @include      /^.*(avmoo|avsox)\..*$/
// @include      *://avmoo.*/*/movie/*
// @include      *://avsox.*/*/movie/*
// 98
// @match        https://www.sehuatang.net/thread-*
// @match        https://www.sehuatang.net/forum.php?mod=viewthread&tid=*
// @match        https://*/thread-*
// @match        https://*/forum.php?mod=viewthread&tid=*
// @match        https://www.tanhuazu.com/threads/*
// javbooks aabb1802.com mm18news.com mm18vc.com
// @match       *://javbooks.com/content*censored/*.htm
// @match       *://jmvbt.com/content*censored/*.htm
// @match       *://*.com/content*censored/*.htm
// @include     *://*.cc/content_censored/*.htm
// @include     /^https:\/\/jbk008\.com\/serchinfo\_(censored|uncensored)\/topicsbt/
// msin适配
// @match       *://db.msin.jp/jp.page/movie?id=*
// @match       *://db.msin.jp/page/movie?id=*
// 匹配有码厂商详情页
// @include      *://*/works/detail/*
// @match        *://xslist.org/search?query=*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @require      https://unpkg.com/video.js/dist/video.js
// @resource     video-js-css https://fastly.jsdelivr.net/npm/video.js@7.10.2/dist/video-js.min.css
// @connect     *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520034/JavBus%20Javdb%20library%20trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/520034/JavBus%20Javdb%20library%20trailer.meta.js
// ==/UserScript==
/**
 *  - 2024-12-03:pv3001.dmm.com域名污染严重，大部分网友访问异常，更换为pv3001.dmm.com（推荐使用分流规则解决此问题）
 *  - 2023-11-18:新增支持m3u8格式
 *  - 2023-10-20:新增 emby跳转(若库中存在),代码引用自 https://sleazyfork.org/zh-CN/scripts/474687-javlib-emby-highlighter-and-redirector
 *  - 2023-08-19:新增视频长缩略图,如有则显示
 *  - 2023-05-11:番号系列对象数组暂定4个数值,依次为:番号系列前缀\是否加00\分辨率\车牌后缀,为了更快更精准,加了后面两个,但是这个校对工程太大,将是一个长期核验的大工程!
 *  - 2023-04-15 匹配几乎全部fanxi(番号系列),预览片来自Fanza(dmm)\MGStage\FC2,因数据太多(1万条左右的番号系列),还有7000多条番号系列要测试,全部测试完成大约需要半年以上,后期也会不断完善规则!
 *               本次更新后番号规则更齐全:1\大部分采用正则匹配预览片地址,2\部分无规则使用固定地址匹配,3\调用mgs播放页,4\调用msin播放页,5\匹配fc2播放地址,6\madonna厂商部分资源适配官网
 *  - 2023-01-28 新增支持 db.msin.jp
 *  - 2023-01-07 新增支持 98sehuatang
 *  - 2022-11-14 新增支持 avmoo、avsox
 *  - 2022-11-13 新增支持javbooks，原站调用dmm必须JP源IP，新增免翻预览
 *  - 2022-11-01 新增支持javdb，补足db已有预览片不足，legsjapan全系列数据静态支持
 *  - 2022-09-15 重新对片花地址进行修正，支持bus和图书馆，并公开分享脚本，期待愈加完善
 *  - 以下为历史记录
 *  - 2022-03-08
 *    脚本由 https://greasyfork.org/zh-CN/scripts/400267-javbus 二次修改以兼容老司机脚本
 *  - 只保留 预告片 功能，其它剔除
 *  - 可根据电脑分辨率自行调整播放器宽度，高度会自适应（搜索1120px修改合适值）
 *  - （脚本是在和老司机脚本做兼容，不保证兼容其它脚本，水平有限，仅作自用，不予公开）
 */
// 若自己本地或服务器建立了 emby库,请自行修改成自己的 emby地址和 api密钥
var embyAPI = "9251bdcb833f4e08a6ca6c769031123f";
var embyBaseUrl = "http://192.168.5.2:8096/";
GM_addStyle(GM_getResourceText("video-js-css"));
GM_addStyle(`
	.video-js .vjs-time-control{display:block;}
	.video-js .vjs-remaining-time{display: none;}
	.video-js.vjs-playing .vjs-tech {pointer-events: auto;}
            `);
(function () {
  'use strict';
  // 番号系列 前缀及数字补位 与format_zero配合使用 3位数默认为番号后数字以区别开截取234位
  // --------------------------------------------------------------
  // mgstage预览资源需番羽可见 新加坡代可看
  // 部分国家或地区无法访问 自行切换节点尝试
  // gerk 2020-04-12 及之前的资源在mgs上全部被删
  // --------------------------------------------------------------
  const fanxi = {
    // 对象依次为:番号系列前缀\是否加00\分辨率\车牌后缀\无规则特例,为了更快更精准,加了后面两个,但是这个校对工程太大,将是一个长期核验的大工程!
    // 无(含无效)预览: aaj/abfk/abgd/abon/abop/abpn/abz/ac/aca/acrs/act/acup/ada/adnd/adr/ads/afd/agex/agjk/ahd/ahh/ahr/ai/aida/aidd/aima/aizm/aizmb/aljm/amabs/amad/amai/ambz/amdp/amhd/amid/ammp/ammt/andp/aned/anix/ank/anl/anmn/ano/anzi/aofs/aozgs/apas/apbmg/apfb/apkr/aqf/ar/arbx/arc/arcd/ard/arss/artdv/arz/as/asb/asmr/asnd/ass/astar/astl/atat/atch/atlb/atrm/atsd/atsw/atsx/au/avb/avcn/avd/avdd/avg/avh/avln/avpd/avr/avsb/avst/avtd/avvb/avwd/avwo/aw/aweb/awf/awfb/axaa/axah/axan/axba/axbb/axisd/axsds/ay/ayad/azaa/azd/aze/baby/bad/baip/ban/batd/bbbn/bbcd/bbd/bbdt/bbdx/bbed/bbf/bbko/bbks/bblp/bbmd/bbo/bbox/bbp/bbv/bbx/bbxn/bc/bcbd/bcex/bd/bdhyaku/bdm/bdmada/bdmkmp/bdu/bec/bed/bemu/bes/bfdt/bfg/bgbd/bgdb/bgrb/bgrd/bgrp/bh/bhcs/bhh/bhhs/bhn/bhol/bhp/bhsd/bhsx/bi/bifc/bigbd/bijd/bijs/bisn/bj/bjn/bjo/bjoyu/bjpq/bjtl/bjv/bk/bkb/bkbd/bkcd/bkgd/bkh/bkj/bkkd/bknd/bkod/bksd/bksk/bkt/bkw/bkwd/bkyd/bkzd/bl/blak/bldv/blf/blgt/blmd/blo/blow/bls/blt/bltr/blub/bm/bmbbvr/bmds/bmdu/bmg/bmild/bmkt/bmmd/bmr/bmvr/bmvrs/bnbm/bnex/bnfi/cend/drd/drdx/efdm/fslj/jube/kbba/mard/nsmd/okxd/oprd/pets/qrdf/rqmt/SSHS/dsdf/gml/jkna/juk/kckc/ndht/ndit/nnp/uga/lmpp/lmsl/lmss/lmsx/lmv/lmvl/lmvv/lmx/lmpdx/lo/loj/lodc/loved/lovy/lovdsale/lpcd/lpep/lpex/lpgh/lpgx/lpq/lpsd/lptm/lqbk/lr/lrex/lrm/lsaj/ltbb/ltsd/ltss/lttl/lttn/lugd/lsvk/lukd/maji/maka/makb/makk/mbx/mbz/mc/mca/mcan/mcdv/mcgs/mch/mam/mdpd/mdqd/mmm/mdrd/mdsc/mdsm/mnsvr/SGCRS/amra/amvd/amy/aota/appi/aqnu/bjst/bnj/bnk/bnm/bnmc/bnpm/bnr/bns/bntd/bnyd/bnyog/bo/bob/bobs/bobz/bodx/bog/boga/boh/bohi/bomd/bomnvd/bong/book/boon/bosa/bow/boxd/bp/bpd/bpj/bpop/bpr/bpsd/bra/breal/brhs/brim/brth/bsbd/bsdx/bse/bsfh/bsmv/bspk/bsr/btb/btby/btcd/btch/btm/btmb/btms/btr/btrr/bty/bubd/bunk/bura/buzp/buzx/bvd/bvdd/bw/bwk/bxd/bxja/byc/bz/bzad/bzc/bzvr/ca/cab/cabd/cadj/cadr/calo/cd/chik/cute/dz/fasu/hhh/htf/kdk/kiwvrl/kmds/kmtd/kmtv/ktkf/lzfb/m/mgss/nmgt/odvhk/ovvr/ppbx/roridv/rwpp/senk/shmb/sprbd/stbd/stod/tkbi/urr/ursp/uryu/us/ush/uss/uszd/utd/uwa/uwf/uwmg/uzm/uzr/va/vacd/vadd/vahex/valf/vard/vb/vbb/vbhr/vcad/vcd/vdbr/vdob/vdv/vear/verd/vetg/vhsd/vip/vipr/virn/virtd/visv/vivd/vivi/vktd/vkvr/vla/vlb/vlbs/vled/vlod/vmod/vnm/vnp/vnpd/vnre/vnup/vo/vodvrj/vord/vosd/votd/vovr/vpr/vpw/vrab/vrat/vrcand/vrd/vrdv/vreds/vrf/vri/vrids/vrmt/vrpds/vrsbmo/vrspfuku/vrtms/vrtmt/vrvrp/vrvrw/vs/vsd/vssd/vt/vtc/vvdd/vvdt/vvvr/wad/wajk/wakd/walha/wand/wang/ward/wbb/wbt/wbx/wc/wca/wcb/wcc/wcm/wcmd/wcmt/wcw/wcx/wd/we/wek/wet/wfb/wfbr/wfc/wfd/wffd/wft/wgw/wha/whpd/whs/wicp/wix/wj/wked/wkod/wkr/wktk/wkz/wmj/wmvd/wnd/wnk/wnos/wnt/wnzr/wnzs/wob/woch/wod/woj/wp/wpa/wpp/wr/wrj/wrkr/ws/wsbz/wsek/wser/wses/wsl/wsn/wsnh/wsno/wth/wtsd/wvrs/wz/wzc/wzuk/x/xaj/xat/xbs/xbsz/xbvr/xc/xg/xgsd/xkvr/xmbd/xmd/xmdp/ynhk/zkma/fodv/gacha/komz/kzblm/nagas/roriav/sqnc/sx/totu/towa/toyd/toz/tp/tpd/tpgd/tph/tpl/tpsp/tpt/tqx/trb/trbox/trcd/trdb/trdbs/trdd/trh/trip/trjd/trjsd/trkd/trl/trsh/trt/trtr/trxx/try/trz/tsb/tsdl/tsg/tsgs/tsk/tsw/tswn/tta/ttid/ttk/ttnk/ttoj/ttok/ttp/ttr/ttra/ttrb/ttrn/tttd/tttv/tufd/tujd/tukm/tuna/tusd/tuvr/tuxd/tuya/tv/tvg/tvtm/tw/twg/twld/twt/twvr/tx/txcd/txd/tya/tyrd/tzd/tzdt/tzsd/u/uaid/uaz/ubg/ucc/ucf/ucg/ucl/uco/uct/ucw/udk/ug/ugdm/ugex/ugfm/ugk/ugsp/ugwa/uhm/uhsd/uht/uiaiv/uias/uk/ukb/ukc/ukm/uksp/ulf/ultr/um/unag/unbe/unci/uncp/und/unde/ungr/ungs/unip/unkl/unks/unsd/unsh/unwe/uom/up/upd/upgd/ups/upsa/upt/uquv/urd/urfuku/wwao/end/tead/teh/temp/tend/tese/tex/teye/tez/tfb/tfvr/tgap/tghp/tghr/tgj/tgks/tgl/tglx/tgm/tgn/tgr/tgsd/tgsx/thd/thex/thh/thk/thm/thmd/thor/thsd/tht/thy/tie/tik/tikc/tikf/tikj/tikm/tiq/tisd/tjca/tjh/tjvr/tjy/tkad/tkg/tkgd/tkhd/tkkd/tkkdkj/tkrm/tksd/tksl/tksm/tktek/tkurpw/tkv/tlc/tld/tlld/tlp/tlsd/tmax/tmaxs/tmbmix/tmdead/tmfa/tmg/tmgd/tmgz/tmik/tmis/tmko/tml/tmlz/tmom/tmv/tmvr/tn/tni/tnkd/tnod/tocd/tokutani/tone/tos/tosd/tosto/svx/sxd/sxnd/sxxp/syl/syok/syq/sysg/sytd/sz/szd/szkk/taa/tab/tabi/tabiyu/tac/taf/tagp/take/takex/taku/tam/tame/tantan/tao/tape/taps/tarax/tato/tba/tbbh/tbc/tbdr/tbee/tbest/tbf/tbk/tbp/tbr/tbs/tbsd/tbt/tbvr/tbxx/tcb/tcg/tcn/tcr/tcw/tdln/tdm/tdp/tdpp/tdps/hwaz/kv/mon/nssth/soy/spa/spbox/spbx/spcl/spd/spdvr/spdvrj/spfd/spg/spid/spkd/spkg/spot/spp/spsb/spsd/spx/spzvr/sren/sri/srkd/srkp/sro/sron/srop/srpd/ssd/ssss/sswd/ssx/st/stak/stan/stee/step/stev/stg/stl/sto/stor/stph/stphb/stri/stv/styj/styl/styla/su/sug/suga/sugax/sugo/sukb/surl/suvd/suvm/suw/svdr/svgd/svld/svmd/svnd/svod/svr/svrd/svsd/cse/dgse/djse/dkse/dmmserina/dnse/dsed/dsex/ese/fese/hsel/kseg/kset/mhse/mistw/mse/naruse/nse/ose/pse/rseed/sea/seam/sebd/sec/secd/see/seg/sehk/sehl/sekusp/sel/semc/semg/semo/sems/sen/senba/sep/sepd/ser/sesb/seta/seyg/sodvr/sog/sok/somx/sond/soom/sopd/sopx/sot/sow/sox/spvr/tasd/vse/wsey/ctup/fft/hdk/heo/hgmj/hma/hzo/incs/kbr/nhkb/nnsbd/nnssa/ogsn/orsts/roribv/sht/silspe/silvia/simo/sino/sioc/sird/sirp/sisa/sisd/sita/sjc/sjd/sjdv/sjk/sjld/sjmd/sjokx/sjp/sjs/sju/sjz/skaim/skb/skc/skg/skh/skhg/skk/sknd/skne/sko/skp/skr/sksc/skt/sktd/sktn/skv/skyj/slc/sli/slm/slot/slpgp/slphw/slv/slvg/slw/sly/smap/smbd/smdb/smhd/smjd/smld/smpw/smqd/smtv/smu/smud/smum/smy/smz/snbu/sneve/sngm/sni/snid/snkd/snkj/snmd/snod/snp/snr/sns/snsi/sny/snz/sod/sgpd/sgrk/sgsc/sgsds/sgsfs/sgsps/sgubs/sgw/sgwc/sgws/sh/shbo/shbob/shicbox/shid/shio/shis/shiss/shk/shki/shmo/shmoh/shor/shud/shx/shy/sibd/sidd/sidi/siex/sihm/siin/sikax/sil/sddk/sddt/sdg/sdgq/sdm/sdsb/sdsd/sdx/sdxx/sear/seaz/sellx/setakdl/seumd/sexd/sf/sfbb/sfj/sfkd/sfla/sflbk/sfm/sfn/sfna/sfol/sfr/sfrd/sfrr/sfsr/sftd/sfz/sg/sgbes/sghd/sgi/sgka/sgkfs/sgmas/sgmd/sgmh/sgms/sgnt/sgoms/s/sa/saa/sab/saca/sad/safd/sag/sak/sam/sams/sand/sankx/sao/sap/sas/satn/sav/sbca/sbcl/sbdd/sbds/sbes/sbh/sbhe/sbid/sbja/sbjd/sbkd/sbks/sbl/sbnd/sbns/sboc/sbog/sbox/sbpd/sbr/sbrj/sbsd/sbsds/sbvb/sbxd/sbz/sbzd/sc/scad/scas/scbe/scbm/scdv/scf/scn/scrc/scsc/scss/scwc/sdd/sddb/sddc/sddg/sddh/bppx/hobd/kws/rerd/rerdb/retomn/revb/revd/revv/rex/reyc/reyk/rfb/rfd/rfe/rfm/rfset/rft/rgbb/rgd/rgdr/rgid/rgigl/rgma/rgmp/rgn/rgsd/rhd/rhipd/rhpd/ri/ribz/riod/rios/ripe/rjd/rjem/rjkw/rjo/rkds/rkdt/rkdvr/rkhd/rkj/rkmad/rks/rkw/rlads/rlc/rld/rloh/rloi/rloj/rlok/rm/rmas/rmdm/rmfd/rmid/rml/rmmd/rmqd/rms/rmsv/rmw/rmwd/rn/rnext/rnkd/rno/rnr/rnyog/ro/rob/roba/romb/romd/ropos/roriq/rosdx/rosl/roz/rp/rpn/rqmd/rqs/rrct/rrd/rrob/rrs/rrsd/rsad/rsdd/rskd/rsli/rsp/rsugo/rsxd/rtd/rud/rururu/rval/rvrspfuku/rvvl/rvvlb/rw/rwsp/rwt/rxdm/rxx/ryd/ryoj/rys/rysd/ryt/ryudx/rzd/ZMMT/ab/abc/abd/absd/acce/acld/adld/adtn/adu/adve/advf/advnsr/advsr/advvsr/aeds/aedvd/af/afdvd/afg/afl/agd/age/agesp/agid/agyw/ahef/aho/aism/ajdx/akgd/alu/am/amax/amcd/anld/anta/ants/aoa/aob/aobd/aod/aofr/aomd/apo/apsd/area/arpp/arrd/artv/axac/axad/axae/axaf/axag/axai/axaj/axak/axam/axao/axap/axaq/axar/axas/axat/axau/axav/axaw/axax/axay/axaz/axsd/aya/az/azr/azrd/baab/bac/bakd/basx/baxd/bbbd/bbs/bddc/bdeb/bg/bge/bged/bhd/bibd/bic/bjb/bjdx/bjpo/bjs/bjyg/bkc/bkju/bknk/ble/bmbd/bndv/bnsh/bnvr/bokad/bop/bor/botn/bred/bsama/bsd/bsdv/bsg/bsk/bskd/bsmd/bszd/btd/btpm/btz/cele/cem/drda/drdd/ftsh/ggsid/ie/kard/ktrd/laed/mght/nbrd/oned/par/poyo/pqp/prad/prba/prbr/prc/prdc/prex/prmc/prt/prtt/psab/psb/psi/psls/psp/psr/pss/ptex/ptk/pud/pupyd/puro/pvbikmvr/pvd/pvh/pvk/pvrbst/pvtmvr/pvvrvr/pw/pxpl/pyd/pyld/pzr/qa/qb/qbkb/qeda/qedb/qedc/qedd/qede/qedf/qedg/qedh/qedi/qedj/qedk/qedl/qedm/qedn/qedo/qedp/qedq/qedr/qedw/qedx/qedy/qedz/qeea/qeeb/qfan/qgk/qhgot/qjb/qmat/qrtdv/qrvr/qsp/qtr/qud/quo/qwa/qx/r/rab/raca/rad/radi/rain/rakb/ramb/ranb/ranu/ras/ravn/ray/rayg/rb/rbe/rbjp/rbn/rbnd/rbse/rcd/rcds/rcod/rda/rdb/rdbd/rdmg/rdo/rds/rdv/rdva/rdvbj/rdvfj/rdvsp/rebdb/rebk/rebl/rebo/rebv/redc/redvr/rehj/reid/reld/repf/repp/rlod/rmpd/rntr/rsps/stcd/svbdaa/tagq/tpi/tum/vbrd/wk/wnz/wobb/wukd/wwfd/wx/ydrd/pixy/pkcb/pkd/pkho/pkms/pkoss/plan/plat/pldv/ple/pls/pltd/plwb/pmax/pmaxvr/pmh/pmid/pmv/pmyo/pnp/pobf/poe/polc/pont/poo/pop/popb/popr/pota/potab/povi/omyr/omz/onaa/onad/onax/onb/onid/onrd/op/opm/oppb/oppd/opss/orbr/orga/orge/orjm/ors/orst/os/osd/osdr/osni/oso/ot/otem/otex/otim/otsd/otz/ou/oue/out/outd/ov/ovd/ovl/ox/ozb/ozon/ozuke/pa/paed/paipan/paod/paoj/papax/pas/pbcd/pbk/pbkd/pbm/pbmd/pbox/pbz/pbzsale/pch/pcol/pcp/pctg/pcup/pd/pda/pdln/pdz/pe/pea/peab/peac/pead/pemd/peti/pex/pf/pfb/pfd/pfds/pg/pgb/pgdb/pghd/pgld/pgtv/ph/phyd/pilh/pinxd/pipk/umdb/urf/tpssis/tae/scop/scd/saba/rvg/real/pyp/purod/pkpd/pcld/ovg/oms/omnd/omni/omga/omgz/omhd/omhq/omid/omjk/omk/omn/omb/omd/olz/olzd/oma/oled/olib/olmrx/oln/olol/okym/okt/okus/okv/okp/okm/okmd/okdx/okb/okap/okaf/ok/ojp/oj/oita/ohpt/oi/oice/ohc/oh/ogmd/ofm/ofom/ofdv/offb/ofbx/odvl/oec/oed/odv/odvd/od/oday/odd/ocd/obu/obzd/oc/obdl/obm/ob/o/oa/oadvc/oaj/oam/oas/oasi/nyn/nyog/nysd/nyzd/nyd/nwjk/nwo/nvd/nvs/nusu/numa/nuki/nude/ntvr/ntt/ntox/ntjk/ntg/nsstl/nsi/nsid/nsld/nsm/nsbs/nsbz/nscs/nrpd/npz/nqp/nrakx/nrd/npj/npc/npcd/nozo/nov/nopi/nol/nobr/nnd/nmpd/nmrd/nmn/nmda/nkzd/nks/nkns/nkovr/njss/njtd/njf/niwax/niss/nit/nitr/nipu/nhop/nht/nib/nic/nif/nifd/nifs/nig/nhms/nhk/nhdd/ngt/ngvr/nh/nha/nhb/ngkc/new/news/nfv/nf/neon/neg/ndc/nddd/ndime/ndm/ncos/ncra/ncrb/ncrc/ncrd/ncsp/ncwd/ncb/nboe/nb/naw/nayg/nami/nand/nak/nadd/nade/nado/nads/n/na/nabd/myuc/mz/mxtds/mxvr/myb/myj/mxpcs/mxpd/mxpe/mxpf/mxph/mxpi/mxps/mxsd/mxpa/mxpb/mxnbs/mxcss/mxbvs/mx/mvx/mvrd/mumu/musk/mvgd/mvo/mvod/mvpt/mubd/mumd/mtri/mts/mtst/mtdv/mtb/mtbvr/mtad/mt/mstj/msyg/mssi/msnk/mso/mstc/msld/msjd/msg/msbox/msc/msca/mscd/msd/msdv/msb/mrvr/ms/msa/mrlb/mrld/mrlp/mrmm/mrp/mr/mrd/mrdv/mrfa/mrfk/mrfl/mrhp/mpyd/mqd/mpcd/mpd/moza/mozd/mozn/mp/motte/mopd/mope/moms/momd/mohv/mofd/modd/moed/mobsp/mobcc/mobcp/mobdt/mobgf/mobjj/mobnd/mobnh/mobrc/mo/mobao/mnsm/mnk/mnpt/mnr/mng/mnbt/mmrbq/mmsp/mmu/mmvr/mmvrfuku/mmvrn/mmvrsp/mmraw/mmraq/mosix/SKYHD/RAV
    // 首字母+2~5位数1组: aajb\aarm\aavb\abcb\abod\abxd\achj\add\adn\advo\aed\agcn\agmx\agon\agr\aiv\ajod\ajvrbx\akad\akbs\akib\akid\aknd\ako\alab\alad\alas\alb\aldn\ambx\amea\ameb\amec\amgz\amg\ami\amoz\anac\anan\anb\anci\anda\ange\anhd\anjd\ankb\ankk\anmd\annd\anpd\anzd\anzz\an\aom\apad\apae\apaf\apag\apah\apak\apal\apam\apao\apap\apar\apat\apav\apgg\apgh\aphh\apkh\apk\apnh\apod\appt\apsh\apsm\apvr\apzd\aqhs\aqmb\aqsh\aqube\aqubl\aquco\aqula\aquma\aran\arb\ardb\arkx\armd\armf\armg\arml\armq\arm\arn\ars\asfb\asia\aspb\aspc\assh\ast\atad\atfb\atid\atkd\atmd\atom\aukb\aukg\auks\aukt\\avkh\avsa\avsp\avs\avzg\awd\awjn\aws\awtb\awtn\awt\azsd\baam\baa\baba\babd\babm\bab\bacj\bacn\bada\baem\bagr\bahp\bama\basj\bavc\baze\bbad\bban\bbh\bbi\bbos\bbss\bbza\bcdp\bcdv\bcpv\bda\beav\beb\befg\bf\bgg\bhg\bhsn\bhsp\bib\bid\big\bijc\bijn\binc\bist\biuc\bkds\bkd\bkig\bkld\blk\blor\blsr\bltn\bmtv\bmw\bmyb\bnst\bokd\bonu\bony\brtm\btis\cadv\cead\chch\chrv\cjob\cjod\cjvr\clt\club\cmc\cmf\cmu\cmzz\cnd\cogm\crnx\crsd\csp\cs\dass\daya\dazd\dber\ddff\ddk\ddob\dftr\dgcemd\dht\divas\dlpn\dmtp\dnjr\doa\dpjt\dpmi\drnt\dsd\dss\dvdm\dvdms\dveh\dvrt\ebod\egg\embz\emlb\emrd\enki\erdm\erk\etqr\evis\eviz\eyan\eys\fazm\fbcpv\fcdc\fffb\fjh\fknp\flav\funk\gajk\genm\genu\ggh\gigl\gkrs\gmem\gtj\hale\halt\hdbf\herk\hery\hgt\hhl\hjbb\hjmo\hmdnc\hmix\hndb\hoiz\hoi\homa\homev\htm\hunbl\huntb\hyk\imgns\ion\ipit\ipx\ipzz\jbd\jdbt\jdl\jfb\jhem\jjbt\jknk\jktu\jlz\jmty\jpak\jrba\jrw\juan\jufe\juju\jul\jums\juny\juq\jusd\jyma\kagn\kagp\kam\kbms\kbtk\kepa\khip\kibd\kiovr\kird\kiwvr\kru\ksat\ksbj\ksjk\ktft\ktkc\ktkl\ktky\ktkz\ktsg\kuro\kwbd\kymi\lady\lcw\LSSK\luke\lulu\luns\lzbs\xvt\mdmu\msmt\atya\kmnr\zwmr\cpsn\xtrm\akyb\lezm\lesm\zuko\dots\miab\sdtx\fwtr\kjo\kjn\kjhs\jjpp\jrkk\jrmk\jtr\juda\juga\juuk\jykp\kag\kann\kar\kaz\kbdv\kbe\kbky\kbt\kcpn\kcpw\kcpz\kdkj\kgdr\kifd\kimu\kinb\kink\kira\kisd\kkbw\kkjn\kmdz\kmtu\knin\kntr\kogd\koh\kok\koms\konb\konn\koob\kosk\koz\koze\kpin\kray\krfv\krmv\kspp\ktg\ktka\ktkb\ktkp\ktkq\ktkt\ktkx\ktsb\ktve\kuni\kunk\kwgr\kwsm\kyks\las\lcdd\ldns\inct\ink\inoc\ins\insg\ipc\ipsd\ircp\iros\iskf\itvd\itvw\jai\jcba\jcbv\jcbw\jcbx\jcby\jcbz\jcnr\jdzz\jglt\jjbb\jjcc\jkbx\jkk\jklo\jkst\jmx\jocm\johs\jomn\hjhm\hkik\hkry\hmad\hmdn\hmhi\hmts\hmwd\hnim\hnjc\hnky\hnm\hnmb\hntv\home\hoob\hpd\hpow\hqis\hrpg\hrsz\hsg\htat\htnw\htzm\hunta\ianf\ianm\icmb\icmn\idrk\ied\ikrt\ille\imbe\imtt\gcp\hee\hdmc\hcvv\hbvb\gmhp\gmen\gmab\gldr\gmry\gmog\mbgm\ncys\mrpa\ymlw\hpet\gihs\gihk\gihj\gicp\ggln\gfwn\gigr\gigb\gerh\gera\gens\gemr\geki\geee\gdtm\gdqs\gdqn\gdhh\gcp\gcld\gbst\gbsd\gbg\gbcr\gb\gav\gapl\gaor\g\hsoda\hublk\frin\foom\fnck\madm\madv\magg\masm\mbf\mcht\mdon\mdte\mdud\meat\meyd\mgbj\mgfx\mgmj\mgmk\mgmp\mgmq\mgmr\miaa\miad\mibb\midv\mifd\mimk\mird\mism\mizd\mkck\mkd\mkon\mlmm\mmb\mmks\mmkz\mmmb\mmnd\mmus\mmym\mmyu\moj\mopp\mrss\much\mudr\mukc\mukd\mvg\mvsd\myba\myt\nanx\nbes\ncyf\ndra\newm\nfd\ngod\nima\nkd\nkhb\nkkd\nkk\nnpj\npjb\npl\nsfs\ntrd\ntsu\nvh\nykd\oae\obd\ofje\ohgg\oigs\okax\onin\onsg\opcyn\oppw\opud\oreco\oreh\orev\pap\parathd\pbd\pchn\pkpl\pkpt\pkys\pow\ppbd\pppd\pppe\prin\prmj\pstl\qrda\qrdc\rapd\rbd\rbk\renu\rexd\rki\rmer\roe\room\royd\rpin\rse\rvgg\same\sanp\scute\sdgn\sdk\shinki\sika\sinn\sir\slap\smtc\snis\sntx\soan\soav\sora\sqb\sqis\sqte\sraz\src\srd\srmc\ssis\SSKK\SSK\ssni\sths\sth\stime\stol\suji\sykh\taak\tanp\tikb\tkd\tkol\tlz\tnoz\tobp\todv\tpin\tppn\twoe\tysf\umso\urds\ure\urkk\urvrsp\usag\vagu\vema\venu\venx\veo\veq\vod\waaa\wnsk\xrle\xrl\ylwn\yngc\ynnp\yss\yuj\yvg\zocm\acut\askj\cesd\clg\cpfu\crpd\dam\dasd\dgcedg\dgl\ends\fffs\hhf\idbd\iptd\ipz\jkrf\juc\jufd\jukd\jux\juy\krbv\mbyd\migd\mkgf\mopt\mywife\ntlr\oba\oreb\orej\pcdl\pfes\prtd\ptpj\rbb\rezd\sitw\skhb\spay\spbj\srob\tchb\team\tsph\tyod\urec\baz\bkkn\core\fan\hame\hkgl\onsd\room\sds\sjap\smul\smus\snsde\spcz\tpls\tpns\tpps\tpsm\trmp\trod\trum\trumo\tsf\tsh\tsmt\tsp\tspl\tsy\ttdb\ttdg\ttrf\tttl\tura\turu\twyb\tyan\tyvm\tywd\uhta\ura\urad\urbh\urec\urel\urhj\urkh\urlh\urmc\urum\usyw\vamo\vec\vecr\vero\veve\vezz\vhip\vicd\vtch\yarr\ddt\gbsa\hzgt\ipbz\mdtm\merc\meyd\miae\mide\midd\migd\mimk\mmgo\mrxd\mukd\mum\muml\munj\mvsd\oldl\sdzs\teek\tek\thlz\tics\tikp\titg\tkmdnw\tkmdtg\tksh\tkwa\tmbt\tnb\toku\tolc\toll\tomn\tomnvd\tops\yrll\qmdb\pkti\krnd\groo\llan\lnht\loli\lom\lovd\lsgr\lstd\lvbt\lzan\lzdq\lzdz\lzfe\lzkw\lzml\lznh\lzrt\lzsg\lzwm\lzyl\madn\magn\mamb\mamm\manm\mann\mars\mcbg\mcc\mckn\mckt\mclp\mcs\mdar\mdaz\mdbs\mdgr\mdjb\mdmx\mdoc\mdoi\mdos\mdql\mdtg\mdtk\mdve\mebx\mem\mex\mgdt\mgl\mgma\mgmb\mgmc\mgme\mgmf\mgmy\mias\mibm\mimu\mitb\mivd\mixs\mksb\mlsm\mlst\mmar\mmbs\mmdj\mmfl\mmgd\mmhd\mmhv\mmib\mmie\mmin\mmix\mmkn\mmkr\mmna\mmnb\mmnf\mmok\ntj\uram\pchd\agav\dbnk\hfes\cmp\fpre\fjin\hfes\fhmd\tokyo\sone\mblw\chin\ratw\prst\gams\npjs\gupp\dbr\nask\mih\smuh\jdg\kpie\fway\hazu\yose\gdrt\rent\smjk\hasb\anav\win\smjz\sj\pkpk\Y-\zaw\dni\nisi\smjj\smjs\hcmn\jzt\beer\meta\hter\ftid\oksm\trc\hhoy\hhgt\hhat\hhap\hgl\hgft\herz\herx\herw\herr\herp\hern\herl\heri\herg\hera\hepp\heg\hbbh\ham\h\gssd\gsfv\gros\grgh\godg\gnp\gdrd\syhs\taab\tanf\tash\tbmm\tcd\tcda\tcdf\tcdg\tchr\tcsk\tcug\dtrs\japorn\juta\mmxd\mugon\njd\oksn\refuck\sp\spb\splt\spor\sppc\sps\sqc\sqim\sqkg\srex\srt\sry\sspd\stc\supd\svs\serobx\sekao\soe\bset\dsem\hnse\jpse\kane\mase\mnse\mset\sesa\set\seu\soju\sole\somm\somw\sorafk\sosf\sotb\td023sero\td025sero\td026sero\yrnknkjsero\yrnkmtnsero\bykm\chib\ebwh\foomvd\gent\gylg\hibr\hoizbx\hpt\ikuiku\\lzpl\mibd\papa\pcha\pjd\pnme\ppby\rega\rura\skmm\skpf\slav\slfl\slms\smcd\smlg\smx\snhd\snoz\snth\sntj\sntk\sntl\sntm\sntr\snts\worl\yrnkmtndvaj\yrnknkjdvaj\yrnknmtdvaj\yrnknkjdv\yrnkmtndv\ysl\sgrs\sgsg\shbc\shbs\shbx\shcm\shts\dcol\dsdp\dvmm\esdx\endx\flva\hfd\hkhs\kapm\mmpb\pkgp\sdmc\sdqn\sfba\sfw\sget\mmka\orbk\sal\scp\sd\btpp\cawd\emst\gcf\hoys\kapd\kool\kwsd\mass\mxyd\okd\pid\ppmd\ppsd\ptv\pxd\rgb\rhss\rhts\rmos\roeb\rroy\rs\rson\rtb\rydd\ryzr\skiv\stzy\wfit\ymrk\WANZ\ankc\apaa\aplt\asrt\bafuku\bat\bini\bnsps\bobb\bobl\boinbb\bomc\bomg\bomn\bona\boss\brek\bsh\bst\btkc\bto\btwd\btyd\bult\buz\bwah\bwb\bww\bxdr\bxfx\bxx\bybz\byht\caga\cagb\cagc\cagd\cagf\cagg\cagh\cagj\cagk\can\ckj\ddb\dgl\digi\dpmx\dscesd\dvlb\epsb\ewdx\fabs\fdavk\ffee\ffnn\fnam\fuyu\gant\gjkz\glp\gomo\gqhb\habj\hakc\hbla\hdsn\hdt\hehh\hhsi\hikr\himemix\hint\hnds\htek\htut\hyjd\iat\idjs\inst\iog\ipzz\jjbk\jjda\jue\kaku\kdmi\kiray\kknn\koch\koukai\ktb\ktst\lboy\lzdm\mdyd\midd\mntl\mrjj\mucd\nflx\nkds\nsps\nwcc\nyb\opbd\oretda\peep\pgd\pkpr\pla\ppfb\ppjp\prs\psz\ptdx\ptj\ptka\ptko\ptks\pwife\px\pzo\qcmw\qrdb\qrdd\qrde\qrdg\qro\qwwp\qxl\rabs\rash\reg\rejy\reku\rurb\rwis\schu\sef\shc\shih\shkd\skho\smmc\smuc\smuk\smuw\snyz\spes\srho\srom\srsy\sscb\sscj\stbs\stok\taxd\tcs\tkbomx\tkk\tmen\tony\voib\voss\vvvd\vxxd\wbht\wbms\wbnn\wdms\wets\wpsg\wtfk\ww\wybn\xbnc\zarj\npg\piz\pkpb\pksg\poka\pokp\pokq\post\rabi\cpcp\onsn\ont\oomn\oomnvd\opa\oph\opkt\orec\oreg\oreo\orerb\oretd\orex\oru\osh\otld\oyc\panr\parm\pcas\pchb\pepn\per\pfas\pgfs\phuq\oremo\infc\esdxs\mstd\mstdv\mste\mstt\mtfj\mth\mthd\mtp\mtsp\mtv\mtvb\mtvi\mtyd\mucc\mugf\mujg\mupt\mura\musj\muvr\mvbd\mvfd\mvmd\myab\myhm\naka\nakb\nbd\nbhm\nbsp\ncn\ndqn\ndwq\nid\nirc\njwp\nkr\nktv\npjx\nrak\nsa\nsstn\ntd\ntka\ntrk\ntub\nygw\nyrf\oal\obe\ofbk\ofbt\ogkc\oigb\okz\omnk\pred\usba\mrsh\mrxb\msbt\mrsc\akmn\bkts\cjmd\ddhz\hmn\imsk\koid\ksyf\mmpp\mmsb\mmsk\mmt\mmta\mmtk\mmts\mmum\mnwr\mocm\moor\mopg\mrad\mrg\mrs\ECBR\flob\flm\fmes\fmr\fmi\film\ffmm\ffmf\feti\fech\fcst\fbss\fbhs\exhr\evyr\cckr\prwf\judx\dpmm\etbz\erog\erof\erh\ept\emts\emp\emht\emfz\emen\emdg\emcw\emcp\emcb\embx\embw\embu\embs\embr\embq\embp\embn\embk\embj\embh\embe\embc\emaz\emax\emaw\emas\emap\eman\emam\emag\emad\emac\emab\ekch\hows\ymsr\gesb\docs\momo\doam\koo\dmdg\vtmn\sbnh\edge\echi\skej\kjm\hrjn\aiddt\ulch\sjho\smjp\fots\uinac\ebe\dztm\dzss\dzms\dzan\dynf\dyjk\dyib\dxyb\dxuk\dxts\dxkt\dxeb\kteh\scdc\pai\dxan\dwd\dvmt\sqsg\sqde\pnmo\manx\knkw\mima\tykj\womc\osfs\kyn\aokt\ygyg\ddhc\dratw\basb\wumi\venz\ipse\sjhd\hazuh\sirb\rhg\gara\smok\ktkn\moer\htjp
    // gana: ["33"] 暂时mgs集成 各网站番号命名不规范，此番号系列带200前缀和不带属于不同作品，后期对展示网站做具体匹配
    // mgs集成:adz/aecb/aepp/agis/ahshiro/aid/almd/ama/amcf/aoi/ara/arms/atgo/cosx/dcv/dcx/ddh/ddhp/dtt/ene/fcp/fct/gana/ghz/hgp/hmt/ichk/ienfh/jac/jnt/knb/kpb/log/luxu/lvmaan/maan/mag/magd/mgc/mium/mla/my/nmch/nol/nsm/ntk/ocn/okb/okk/okp/oks/otim/pok/ppp/ppz/reiw/reiwsp/REIWDX/sacz/scoh/sgk/SHMJ/simm/siro/skjk/smr/srtd/suke/svsha/thtp/vola/ymym/brm/buch/dg/erkr/kss/lost/mfcc/mgsrev/nhmsg/pak/sei/srya/truex/trumg/truwa/ttre/twbb/tyk/tzz/utsu/uwki/vbh/vdf/vrxm/vspa/wif/wks/wnes/crt/dlv/docd/hik/ilk/kdd/krnk/mcd/mpc/oil/ppx/qtd/roy/shf/gld/fit/jfm/MMNM/ezn/ussh
    // TK*-系列 去掉tk 独开 并入 MDTM:tkameb\tkapkh\tkarbb\tkarm\tkawt\tkbbi\tkbdmds\tkbdmild\tkbdpkmp\tkbf\tkblk\tkbokd\tkcead\tkcesd\tkchij\tkcnd\tkcrmn\tkdasd\tkdbng\tkdigi\tkdvaj\tkdxmg\tkebod\tkeyan\tkgdtm\tkgent\tkgroo\tkhery\tkhnd\tkhndb\tkhnds\tkhrrb\tkidbd\tkille\tkinct\tkipsd\tkipz\tkjuc\tkjufd\tkjux\tkkawd\tkkird\tkkrnd\tklztd\tkmdb\tkmdhc\tkmdjm\tkmdlj\tkmdnh\tkmdog\tkmdpw\tkmds\tkmdsh\tkmdsr\tkmdtm\tkmeyd\tkmidd\tkmide\tkmigd\tkmild\tkmimk\tkmkmp\tkmrxd\tkmukd\tkmum\tkmuml\tkmunj\tkmvsd\tkndra\tkodfa\tkodfm\tkodfr\tkpgd\tkpid\tkpla\tkreal\tkrki\tksero\tksib\tksoe\tksora\tktamm\tkteam\tktmdi\tktmem\tktmhp\tktmvi\tktyod\tkumso\tkurad\tkvrtm\tkwanz\tkxrw\tkzuko\mdb\mdhc\mdjm\mdlj\mdnh\mdog\mdpw\mds\mdsh\mdsr\
    // VR-系列: aqusp\AQUST\atvr\avvr\bbvr\dpsvr\dpvr\dpvrs\ebvr\gopj\hnvr\hunvr\ipvr\jpsvr\juvr\kiwvrb\wpvr\vrrb\vrsl\maxavrf\maxvr\maxvrh\mdvr\mtvr\nhvr\nkbvr\nkkvr\prvr\pxvr\exmo\wavr\wfbvr\rsrvr\sivr\sovr\sqtevr\tpvr\ajvr\aquga\aqumam\bibivr\fcvr\frnvr\hbvr\hhhvr\jtvr\kivr\kolsp\kolvr\kolvrb\lzvr\manivr\mevr\mvr\njvr\opvr\ovr\oycvr\pipivr\piyovr\ppvr\pydvrs\rctdvr\rctvr\royvr\rvr\tprm
    // 写固定:bdqbd/bdsama/bud/bzex/anab/atc/atnf/athb/ball/usdx/arksb/bdufd/bnd/compi/gwntr/gwgana/sb/sbmob/sgkm/sjpdr/sprl/supz/tkc/advr/mdnw/umd/gwnama/gwtora/gwjac/gwhasi/gwdcv/gtwp/gtal/FRNCB/fkkrm/ere/dyne
    // MSIN集成  ktfb替换为ktb/rbfb替换为bkd/crfv替换为nitr
    // tkbi 去掉 t 同 kbi
		"32id": ["55"],
    a: ["44"], // 早期 无
    aa: ["13"],
    aaa: ["171"],
    aas: ["118"],
    aad: ["24"],
    aajj: ["h_086"],
    aak: ["h_170"],
    aamd: ["104"],
    aaxdvd: ["86"],
    abba: ["h_086"],
    abcd: ["380"],
    abf: ["118"],
    abl: [""],
    abnomal: ["h_455"],
    abp: ["118"],
    abs: ["118"],
    abw: ["118"],
    aby: ["118"],
    acad: ["h_710"],
    acb: ["13"],
    acc: ["1"],
    acd: ["13"],
    ace: ["33"], // 33+3位数 也有首字母 暂不独开
    acec: ["33"],
    acgjv: ["48"],
    acy: ["13"],
    acz: ["h_019"],
    aczd: ["h_019"],
    ad: ["h_1416"],
    adkx: ["h_747"],
    adoa: ["n_863"],
    adv: ["43"],
    advps: ["43"],
    adz: ["050"], // MGS新
    aeal: ["h_189"], // h_189+2位数（只有两位）
    aecb: ["031"], // MGS新
    aeg: ["118"],
    aege: ["1"],
    aeil: [""], //
    aepp: ["031"], // MGS新
    aesf: ["h_189"],
    aey: ["h_1297"],
    afoh: ["422"],
    afs: ["118"],
    ag: ["h_113"],
    aga: [""], //
    agemix: ["h_213"],
    ageom: ["h_213"],
    agis: ["107"], // MGS新
    agl: ["118"],
    agp: ["65"], //
    agvn: ["n_707"],
    ah: ["h_921"],
    ahshiro: ["371"], // MGS新
		aiav: ["1"],
    aid: ["326"], // MGS新
    aidv: ["41"],
    aime: ["h_1133"],
    aims: ["n_707"],
    aisu: ["h_086"],
    ajbd: ["53"], // 53+
    ajip: [""], //
    ajk: [""], //
    aka: ["118"],
    akasd: [""], //
    akb: ["55"],
    akbd: [""], //
    akdl: ["1"],
    akdld: ["1"],
    akho: [""], //
    aki: ["504"],
    ako: [""], //
    akrd: ["104"], //
    al: [""], //
    ala: ["12"],
    alce: ["h_445"],
    alcl: ["5561"], //
    ald: ["15"],
    aldm: ["5561"], //
    all: ["h_310"],
    almd: ["033"], // MGS新
    alog: ["h_491"],
    alpd: ["104"], //
    als: ["h_310"],
    alsd: [""], //
    alsp: ["18"], // 只有两个mgs 其它全没预览 暂不加入
    ambi: ["h_237"],
    ambs: ["h_237"], //
    amcf: ["031"], // MGS新
    amd: ["24"],
    amda: ["h_307"], // h_307+5 无
    ame: ["h_047"], // h_047+3
    amen: ["h_445"], // h_445+5
    amhaa: ["n_709"],
    amm: ["h_728"], // h_728+3
    ammd: ["h_1668"],
    amp: ["11"], // 11+3
    amr: ["h_405"], // h_405+
    amrb: [""], // h_307+5
    amrc: [""], // h_307+5
    amrd: [""], // h_307+5
    amrs: [""], // h_658+5
    ams: ["149"], // 149+5
    amsp: ["h_1632"], // h_1632+5
    amt: ["118"],
    amtr: ["h_1133"],
    amz: ["28"], // 28+3
    ana: ["h_1189"], // h_1189+5
    anal: ["33"], // 33+3
    anamae: ["h_1189"], // h_1189+5
    and: [""], // h_189+5
    ang: ["249"], // mgs新
    angr: ["h_771"], // h_771+3
    anim: ["h_237"], // h_237+5
    anks: ["h_058"], // h_058+3
    ankt: ["h_058"], // h_058+5
    ans: ["29"], // 29+5
    anx: [""],  // 首字母+5
    any: ["118"],
    aokn: ["15"], // 15+2
    aos: ["057"], // mgs新
    aot: ["1"], // 1+3
    aoz: ["h_308"], // h_308+3+z
    ap: ["n_1428"], // n_1428+3
    apd: ["88"], // 88+3
    aph: ["118"],
    apm: ["118"],
    apns: [""], //
    apol: ["h_838"], // h_838+5
    app: ["118"],
    apr: ["118"],
    apu: ["n_707"], // n_707+3
    aqua: ["h_491"], //
    ara: ["261"], // MGS新
    aras: ["118"],
    arbb: ["h_1092"], // h_1092+5 有mgs源
    arie: ["119"], // mgs规则源
    arjkt: ["1"],
    ark: [""], // 重复番号太多 均无预览
    arki: ["15"],
    arkj: ["434"], // 首字母+3/5  dmm和mgs 后面会对有两边资源的番号系列独开
    arks: ["5050"], // 5050+5
    arle: ["h_1092"], // h_1092+3
    armm: ["11"], // 11+3
    arwa: ["18"],
    asd: ["24"], // 24+3
    asgmx: ["h_1719"], // h_1719+5
    asi: ["118"],
    asmani: ["h_1116"], // h_1116+5
    astr: ["h_1711"],
    at: ["h_047"], // h_047+3
    atd: ["118"],
    atgo: ["143"], // MGS新
    atpc: ["h_237"],
    atpf: ["h_237"],
    att: ["118"],
    atzd: ["", "", "_dmb_s"],
    aud: ["21"],
    av: ["h_186"],
    averv: ["84"],
    avgl: ["", "", "_dm_s"],
    avopvr: [""], // 基本无有效预览
    avsc: ["33"],
    avt: ["h_1118"], // h_1118+5
    awad: ["15"],
    awe: ["33"],
    awpr: ["21"], // 21+3
    axbc: ["29"], // 29+3
    axdvd: ["86"], // 86+5r 全无
    ayb: ["13"], // 13+3
    ayz: ["33"], // 33+3
    azsa: ["18"], // 18+3
    b: ["h_554"], // h_554+
    ba: ["51"], // 51+3
    babh: [""], // 去除h
    baburu: ["h_455"], //
    bag: ["118"],
    bagbd: ["h_305"], // h_305+3
    bak: ["h_286"], // h_286+5
    baku: ["h_086"],
    bana: ["118"],
    bang: ["h_261"], // h_261+
    bank: ["h_1495"], // 1种 h_1495+3位数
    banq: ["h_1133"],
    bar: ["h_1441"], // h_1441+5
    bare: ["h_1660"], // h_1660+5
    base: ["436"], // 436+ /
    basp: ["436"], // 436+5
    bb: ["h_921"], // h_921+3
    bba: ["h_189"], // h_189+5
    bbacos: ["h_113"], // h_113+5
    bbag: ["5619"], // 5619+5
    bbb: ["h_205"], // h_205+
    bbm: ["118"],
    bbq: ["118"],
    bbse: ["h_406"], // h_406+5 /
    bbst: ["h_406"], // h_406+5 /
    bbtu: [""], // 1种 首字母+3位数
    bbwm: ["h_496"], // h_496+
    bbwmd: ["h_496"], // h_496+
    bcm: ["540"],
    bcp: ["h_113"], // h_113=5
    bcv: ["118"],
    bdclb: ["2"], // 2+  bdclb 替换为 clb
    bdd: ["143"], // 143+2
    bdda: ["h_1613"], // h_1613+5
    bddavr: ["h_1613"], // h_1613+
    bdh: ["h_1293"], // h_1293+3
    bdmdb: ["84"], // 84+3
    bdmild: ["84"], // 84+3
    bdokad: ["84"], // 84+3
    bdreal: ["84"], // 84+3
    bdscop: ["h_565"], // h_565+3
    bdsf: ["h_1454"], // h_1454+
    bdsm: ["h_1096"], //
    bdsr: ["57"], // 1种 57+3位数
    bdst: ["57"], // 57+ /
    bdsx: ["57"], // 1种 57+5位数
    bdy: ["118"],
    beaf: ["h_1615"], //
    bebe: ["h_086"], // h_086+
    beem: ["h_086"],
    bell: ["h_086"],
    best: [""], // mgs规则
    bfaa: ["n_1471"], // n_1471+3
    bfaz: ["n_1471"], // 1种  n_1471+3位数
    bfd: ["24"], //  1种  24+5位数
    bff: ["33"],
    bfkb: ["h_1285"], //未验证
    bgn: ["118"],
    bgra: ["n_1391"], // n_1391+3
    bgsd: ["h_305"], // h_305+5
    bhkg: ["h_189"], // h_189+2
    bido: ["h_128"],
    bij: ["h_275"], // h_275+5
    bika: ["h_128"], // h_128+3
    bikmvr: ["h_1285"], // VR
    bind: ["15"],
    bizn: ["h_261"], // h_261+
    bjd: [""], //  1种 首字母+3位数
    bjk: ["12"], // 12+3
    bjos: ["h_275"], // h_275+5
    bjpn: ["h_307"], // h_307+5
    bjsp: ["h_307"], // h_307+5 无
    bjun: ["h_445"], // h_445+3
    bkbk: ["h_1167"], // h_1167+3
    bkgf: ["h_189"], // h_189+2
    bkkg: ["h_1067"], // h_1067+3
    bkoh: ["n_1321"], // n_1321+3
    bkrk: ["h_445"], // h_445+3
    bksp: ["1"], // 1+3
    bksu: ["h_189"], // h_189+2
    bkynb: ["1"], // 1+5位数
    blb: [""], // 1种 首字母+3位数
    bld: ["24"],
    blg: ["h_093"], // h_093+5
    blkw: ["h_1437"], // h_1437+5
    blu: ["118"],
    blue: ["h_491"], // h_491+2
    bmay: ["5469"], // 5469+5
    bmd: ["57"], // 57+3
    bmdb: ["84"], // 84+3
    bmj: ["h_1068"], // h_1068+3
    bmjo: ["48"], // 48+5
    bml: ["13"], // 13+
		bmo: ["","","","","n_1044sbmo"],
    bmst: ["h_1454"], // h_1454+5
    bngd: ["h_1413"], // h_1413+5
    bnin: ["n_840"], // n_840+3
    bnjc: ["h_1413"], // h_1413+5
    bnri: ["h_254"],
    bnsd: ["171"],
    bnw: ["33"],
    bobo: ["h_086"],
    boie: ["h_406"], // h_406+5
    boin: ["h_406"], // h_406+5
    bok: ["h_310"], // h_310+5
		boko: ["1"],
    bomx: ["tk"], // 首字母+3/5
    box: ["13"],
    bpdv: [""], // 只有1个
    bqbb: ["1"],
    br: ["61"], // 61+5 ai
    brd: ["118"],
    brg: ["118"],
    bri: ["28"],
    brk: ["143"], // 143+2
    brm: ["031"], // MGS新
    bros: ["18"], // 118+3
    broz: ["h_004"], // h_004+3
    brv: ["h_1755"],
    bs: ["h_909"], // h_909+5
    bsc: ["h_1713"],
    bshd: ["104"], // 104+5
    bsj: ["64"], // 64+5
    bsjdv: ["5433"], // 5433+5
    bsk: ["h_848"],
    bskc: [""], // 1种 首字母+3位数
    bskv: ["h_1472"],
    bsm: ["143"], // 143+5 有对应mgs资源
    bsp: ["h_310"], // h_310+5
    bsq: ["118"],
    bstar: ["n_1275"], // n_1275+5
    bstc: ["h_1117"], // h_1117+5
    bsu: ["2"],
    bsv: ["118"],
    bsy: ["13"], // 13+
    bt: [""], // 本系列无码 暂无预览
    bta: ["118"],
    btg: ["h_172"],
    btc: ["143"], // 143+ mgs对应
    bth: ["h_1435"], // h_1435+
    btha: ["5433"], // 5433+
    bts: ["111"], // 111+
    btst: ["h_1215"], // h_1215+3
    bubb: ["436"], // 436+5
    buch: ["196"], // MGS新
    budd: ["h_001"], // h_001+2
    bug: ["h_918"], // h_918+
    buka: ["33"], // 33+3
    bukd: ["h_690"], // h_690+3
    bump: ["h_257"], // h_257+ 无
    buna: ["5469"], // 5469+5
    bunb: ["5469"], // 5469+5
    bunc: ["n_1321"], // n_1321+5
    bunf: ["5469"], // 5469+5 同dunf
    buno: ["n_1321"], // n_1321+3
    buqh: ["n_1057"], // n_1057+
    bur: ["12"], //  2种 12开头+3/5位数
    buri: ["h_1373"], //  2种 h_1373+3/5位数
    butd: ["13"], // 13+
    buton: ["h_496"], // h_496+5
    buy: ["118"],
    bwa: ["2"],
    bwsd: ["171"], // 171+
    bx: ["h_113"],
    byd: ["h_103"], // h_103+3
    byrl: ["436"], // 436+5
    c: ["140"], // 140+
    cabe: ["h_1116"], // h_1116+
    caca: ["h_1116"], // h_1116+5
    cad: ["h_468"], // h_468+5
    caes: ["h_216"], // h_216+
    cafr: ["h_1116"], // h_1116+5
    cafuku: ["h_1116"], // h_1116+5
    caim: ["h_1116"], // h_1116+5
    cami: ["h_1116"], // h_1116+5
    camk: ["h_1111"], // h_1111+5
    camp: ["18"], // 18+
    cand: ["n_1234"], // n_1234+
    candb: [""],
    cao: [""],
    caoh: [""],
    caos: [""],
    capi: [""],
    carem: [""],
    case: ["434", "", "_sm_w"],
    casmani: ["h_1116"], //无
    casp: [""],
    cat: [""],
    cats: [""],
    cav: [""],
    cb: ["h_113"],
    cbc: [""],
    cbd: [""],
    cbikmv: [""],
    cbikmvr: [""],
    cbo: [""],
    cbox: [""],
    cbr: [""],
    cbtb: [""],
    cbtr: [""],
    cbx: [""],
    cbzb: ["", "", "", "", "n_1379cbzd"],
    cbzd: [""],
    cc: [""],
    cca: [""],
    ccaa: [""],
    ccb: [""],
    ccc: ["3", "", "_sm_s"],
    ccd: [""],
    ccdv: [""],
    ccio: [""],
    ccj: [""],
    cck: [""],
    ccmm: [""],
    ccr: [""],
    ccs: [""],
    cct: [""],
    ccug: [""],
    ccvb: [""],
    ccvr: [""],
    ccx: [""],
    ccxs: [""],
    cdav: [""],
    cdb: [""],
    cdc: ["118"],
    cdma: [""],
    cdod: [""],
    cdvhj: [""],
    cefd: [""],
    cehd: [""],
    cejn: [""],
    celd: [""],
    cema: [""],
    cemd: [""], //
    cemn: [""],
    cen: ["2"],
    cent: [""],
    cero: [""],
    cesf: [""],
    cetd: [""],
    cfld: [""],
    cfn: [""],
    cfnb: [""],
    cfnm: [""],
    cfo: [""],
    cfti: [""],
    cgd: [""],
    cgm: [""],
    cgq: [""],
    cgs: [""],
    ch: [""],
    cha: [""],
    chaa: [""],
    chab: [""],
    chad: [""],
    chae: [""],
    chag: [""],
    chak: [""],
    chakui: [""],
    chao: [""],
    chc: ["70"],
    chd: [""],
    chdjv: [""],
    chdx: [""],
    che: [""],
    cherd: ["h_086"], //  1种 h_086开头+截取2位数
    cherx: ["h_086"],
    chgaro: [""],
    chht: [""],
    chi: [""],
    chid: [""],
    chij: [""],
    chim: [""],
    chiq: [""],
    chir: [""],
    chit: [""],
    chkp: [""],
    chm: [""],
    chmx: [""],
    chn: ["118"],
    chnk: [""],
    chns: [""],
    cho: [""],
    chrd: [""],
    chs: [""],
    chsd: [""],
    chsp: [""],
    cht: [""],
    chu: [""],
    chub: [""],
    chuc: ["h_491"], // h_491+3
    chv: [""],
    cid: [""],
    ciel: ["h_491"], // h_491+3
    ciin: [""],
    cirr: [""],
    cirrx: [""],
    cj: [""],
    cjd: [""],
    cjdv: [""],
    cjet: [""],
    cjka: [""],
    cjsb: [""],
    cjsp: [""],
    ckd: [""],
    ckk: [""],
    cknd: [""],
    ckw: ["2"],
    clb: ["2"], // 2+  bdclb 替换为 clb
    clbd: [""],
    clcb: [""],
    cld: [""],
    cldg: [""],
    cle: [""],
    clin: [""],
    clm: [""],
    clma: [""],
    clmb: [""],
    clms: [""],
    clmz: [""],
    clns: [""],
    clo: ["h_1435"], //
    clot: ["h_237"], // 1种 h_237+3位数
    cls: [""],
    clsd: [""],
    clvr: [""],
    clymax: [""],
    cm: [""],
    cmbb: [""],
    cmbt: [""],
    cmd: ["24"], // 24+3 /
    cmdm: [""],
    cme: [""],
    cmg: [""],
    cmi: ["118"],
    cmj: [""],
    cmk: [""],
    cml: [""],
    cmn: ["51"], //
    cmp: [""],
    cmr: [""],
    cmv: [""], //
    cn: [""],
    cnbx: [""],
    cns: [""],
    cnz: [""],
    co: [""],
    cob: [""],
    cod: [""],
    cojp: [""],
    cold: [""],
    colm: [""],
    com: ["h_1462"], // h_1462+
    comd: [""],
    con: [""],
    cona: [""],
    cool: [""],
    corb: [""],
    cori: [""],
    cos: [""],
    cosbvr: [""],
    cosd: [""],
    cosk: [""],
    cosl: [""],
    cosm: [""],
    cosp: [""],
    cosq: [""],
    cosu: [""],
    cosvr: [""],
    cosx: ["433"], // MGS新
    cot: [""],
    cov: [""],
    cp: [""],
    cpd: [""],
    cpdd: [""],
    cpde: ["118"],
    cpm: [""],
    cpn: [""],
    cpsn: [""],
    cpxd: [""],
    crad: [""],
    crag: [""],
    cram: [""],
    crc: [""],
    crd: [""],
    cre: [""],
    crek: [""],
    crey: [""],
    crg: [""],
    crgd: [""],
    crgdsale: [""],
    crgk: [""],
    crgq: [""],
    crh: [""],
    crhi: [""],
    cri: [""],
    crim: [""],
    crmn: [""],
    cro: [""],
    crpn: [""],
    crrv: [""],
    crry: [""],
    crs: ["118"], //  1种 118开头+3位数
    crss: [""],
    crt: ["534"], // MGS新
    crvr: [""],
    crz: [""],
    crzt: [""],
    csb: [""],
    csbe: [""],
    csc: [""],
    csct: ["55"], // 55+3
    csd: [""],
    csdx: ["h_1558"], // h_1558+ /
    csft: [""],
    csj: [""],
    csp: [""],
    cst: [""],
    csv: [""],
    cswc: [""],
    csx: [""],
    csy: [""],
    cta: [""],
    ctbd: [""],
    ctc: [""],
    ctd: [""],
    ctga: [""],
    ctha: [""],
    cthab: [""],
    ctn: [""],
    ctvr: [""],
    cty: [""],
    cubex: [""],
    cubo: [""],
    cubob: [""],
    cud: [""],
    cuhe: [""],
    cuheb: [""],
    cull: [""],
		cus: ["h_1651"],
    curo: [""],
    cut: [""],
    cvd: ["24"], // 24+3
    cvdd: [""],
    cvdx: ["h_086"],
    cvfk: ["h_086"],
    cvsp: [""],
    cwaz: [""],
    cwbj: [""],
    cwbt: [""],
    cwl: [""],
    cwm: ["2"],
    cwsm: [""],
    cwx: [""],
    cx: [""],
    cxaz: [""],
    cxd: [""],
    cxr: [""],
    cyal: [""],
    cyam: [""],
    cyan: [""],
    cyao: [""],
    cyap: [""],
    cyaq: [""],
    cyar: [""],
    cyas: [""],
    cyat: [""],
    cyau: [""],
    cyav: [""],
    cyaw: [""],
    cyax: [""],
    cyay: [""],
    cyaz: [""],
    cycd: [""],
    cyd: [""],
    cyf: [""],
    cyo: [""],
    cz: [""],
    czav: [""],
    czm: [""],
    czp: [""],
    d1: [""],
    d: [""],
    da: [""],
    daad: [""],
    daai: [""],
    dabc: [""],
    dabf: [""],
    dabs: [""],
    dac: ["118"],
    dacd: [""],
    dach: [""],
    dacm: [""],
    dacp: [""],
    dact: [""],
    dad: [""],
    dada: [""],
    dadsp: [""],
    daed: [""],
    dafb: [""],
    dafc: [""],
    dag: [""],
    daga: [""],
    dagc: [""],
    dags: [""],
    dah: [""],
    dahb: [""],
    dahs: [""],
    daht: [""],
    dai: [""],
    daid: [""],
    dail: [""],
    daj: [""],
    dajm: [""],
    dak: [""],
    dakg: [""],
    dakh: [""],
    daks: [""],
    dali: [""],
    dama: [""],
    damn: [""],
    damo: [""],
    dams: [""],
    damu: [""],
    damx: ["h_1647"], // h_1647+
    damz: [""],
    dan: [""],
    danc: [""],
    dandan: ["1"], //  1种 1开头+5位数
    dandy: ["1"],
    dandyhqvr: [""],
    dandyvr: [""],
    danj: [""],
    dank: [""],
    danl: [""],
    dann: [""],
    danuhd: [""],
    dap: [""],
    dapb: [""],
    daph: [""],
    dapj: [""],
    daps: [""],
    daqu: [""],
    dar: ["h_1731"], // h_1731+ /
    darb: [""],
    darg: [""],
    dars: [""],
    dart: [""],
    dasb: [""],
    dasg: [""],
    dask: [""],
    dasl: [""],
    dasm: [""],
    dasu: [""],
    dat: [""],
    data: [""],
    datb: [""],
    date: [""],
    datr: [""],
    davh: [""],
    davk: [""],
    davk: ["55"], //
    davr: [""],
    day: [""],
    dayd: [""],
    db: [""],
    dba: [""],
    dbam: [""],
    dban: [""],
    dbaq: [""],
    dbat: [""],
    dbaz: [""],
    dbb: [""],
    dbba: [""],
    dbbi: [""],
    dbc: [""],
    dbcv: [""],
    dbd: [""],
    dbda: [""],
    dbdm: [""],
    dbdr: [""],
    dbe: [""],
    dbeb: [""],
    dbed: [""],
    dbeo: [""],
    dbex: [""],
    dbi: [""],
    dbif: [""],
    dbii: [""],
    dbik: [""],
    dbiu: [""],
    dbjn: [""],
    dbk: [""],
    dbkc: [""],
    dbkd: [""],
    dbki: [""],
    dbks: [""],
    dbl: [""],
    dbld: [""],
    dbm: [""],
    dbma: [""],
    dbmd: [""],
    dbnd: [""],
    dbng: [""],
    dbo: [""],
    dbox: [""],
    dbpe: [""],
    dbpo: [""],
    dbps: [""],
    dbpz: [""],
    dbra: [""],
    dbs: [""],
    dbsd: [""],
    dbsg: [""],
    dbss: [""],
    dbt: [""],
    dbte: [""],
    dbtg: [""],
    dbtk: [""],
    dbtm: [""],
    dbud: [""],
    dbv: [""],
    dbvb: [""],
    dbvbex: [""],
    dbvr: [""],
    dbw: [""],
    dbza: [""],
    dbzb: [""],
    dbzc: [""],
    dbze: [""],
    dbzg: [""],
    dbzh: [""],
    dbzk: [""],
    dc: [""],
    dca: [""],
    dcab: [""],
    dcas: [""],
    dcb: [""],
    dcba: [""],
    dcbs: [""],
    dcc: [""],
    dcci: [""],
    dccp: [""],
    dcd: [""],
    dcdb: [""],
    dcdm: [""],
    dcdss: ["1"],
    dce: [""],
    dcfs: [""],
    dcg: [""],
    dcgy: [""],
    dcha: [""],
    dchi: [""],
    dchj: [""],
    dchv: [""],
    dcim: [""],
    dcj: [""],
    dck: [""],
    dckb: [""],
    dcks: [""],
    dckt: [""],
    dcl: [""],
    dclb: [""],
    dcm: [""],
    dcmb: [""],
    dcmm: [""],
    dcms: [""],
    dcmx: [""],
    dcn: [""],
    dcnb: [""],
    dcnm: [""],
    dcnn: [""],
    dco: [""],
    dcof: [""],
    dcom: [""],
    dcos: [""],
    dcow: [""],
    dcp: [""],
    dcpb: [""],
    dcpm: [""],
    dcpn: [""],
    dcr: [""],
    dcrd: [""],
    dcry: [""],
    dcs: [""],
    dcsf: [""],
    dcsj: [""],
    dcsl: [""],
    dcss: [""],
    dctb: [""],
    dcti: [""],
    dcu: [""],
    dcub: [""],
    dcug: [""],
    dcv: ["277"], // MGS新
    dcvi: [""],
    dcvs: [""],
    dcwy: [""],
    dcx: [""],
    dcxd: ["h_1711"],
    dcy: [""],
    dcz: [""],
    dczj: [""],
    dd: [""],
    ddab: [""],
    ddan: [""],
    ddas: [""],
    ddbg: [""],
    ddbl: [""],
    ddca: [""],
    ddcd: [""],
    ddch: [""],
    ddd: [""],
    ddda: [""],
    dddb: [""],
    dddr: [""],
    ddes: [""],
    ddev: [""],
    ddg: [""],
    ddgb: [""],
    ddgg: [""],
    ddh: ["498"], // MGS新
    ddhg: [""],
    ddhh: [""],
    ddhp: ["498"], // MGS新
    ddid: [""],
    ddis: [""],
    ddka: [""],
    ddkh: [""],
    ddkm: [""],
    ddks: [""],
    ddl: [""],
    ddla: [""],
    ddm: [""],
    ddma: [""],
    ddme: [""],
    ddmeb: [""],
    ddmk: [""],
    ddmt: [""],
    ddn: [""],
    ddna: [""],
    ddng: [""],
    ddnj: [""],
    ddo: [""],
    ddos: [""],
    ddp: [""],
    ddpw: [""],
    ddq: [""],
    ddr: [""],
    dds: [""],
    ddsa: [""],
    ddsc: [""],
    ddse: ["111", "", "_sm_s"],
    ddsi: [""],
    ddsp: [""],
    ddss: [""],
    ddsy: [""],
    ddu: [""],
    ddur: [""],
    ddus: [""],
    ddv: [""],
    ddws: [""],
    ddy: [""],
    ddzg: [""],
    debd: [""],
    debe: [""],
    dec: [""],
    decb: [""],
    dech: [""],
    decha: [""],
    deck: [""],
    decr: [""],
    dedd: [""],
    dedo: [""],
    dedq: [""],
    deec: [""],
    deed: [""],
    deem: [""],
    deep: [""],
    deew: [""],
    deg: [""],
    dega: [""],
    dego: [""],
    deis: [""],
    deju: [""],
    del: [""],
    dem: [""],
    den: [""],
    dend: [""],
    denj: [""],
    dep: ["118"],
    depd: [""],
    dept: [""],
    der: [""],
    dero: [""],
    des: [""],
    deso: [""],
    deta: [""],
    deu: ["118"],
    deux: [""],
    dew: [""],
    dex: [""],
    dext: [""],
    df: [""],
    dfaa: [""],
    dfac: [""],
    dfak: [""],
    dfan: [""],
    dfar: [""],
    dfaz: [""],
    dfb: [""],
    dfba: [""],
    dfbg: [""],
    dfbk: [""],
    dfbl: [""],
    dfbvr: [""],
    dfc: [""],
    dfco: [""],
    dfda: [""],
    dfdm: ["2"],
    dfdv: [""],
    dfe: ["2"],
    dfea: [""],
    dfet: [""],
    dfgr: [""],
    dfh: [""],
    dfi: [""],
    dfig: [""],
    dfk: [""],
    dfls: [""],
    dfm: [""],
    dfms: [""],
    dfmt: [""],
    dfoj: [""],
    dfop: [""],
    dfrd: [""],
    dfs: [""],
    dfslv: [""],
    dfsmbr: [""],
    dfsmbrab: [""],
    dfsmmr: [""],
    dfsmmrab: [""],
    dfsr: [""],
    dft: [""],
    dfta: [""],
    dftb: [""],
    dfu: [""],
    dfuz: [""],
    dfz: [""],
    dg: ["530"], // MGS新
    dgah: [""],
    dgal: [""],
    dgam: [""],
    dgc: [""],
    dgf: [""],
    dgh: [""],
    dgirl: [""],
    dgk: [""],
    dgkb: [""],
    dgkd: [""],
    dgll: [""],
    dgnm: [""],
    dgoz: [""],
    dgr: ["h_254"],
    dgra: [""],
    dgrb: [""],
    dgre: [""],
    dgrp: [""],
    dgs: [""],
    dgsp: [""],
    dgss: [""],
    dgtcd: [""],
    dgtl: [""],
    dgul: [""],
    dgus: [""],
    dgv: [""],
    dgw: [""],
    dgya: [""],
    dha: [""],
    dhae: [""],
    dhard: [""],
    dhat: [""],
    dhav: [""],
    dhb: [""],
    dhc: [""],
    dhcy: [""],
    dhda: [""],
    dhdc: [""],
    dhdd: [""],
    dhel: [""],
    dher: [""],
    dhes: [""],
    dhfr: [""],
    dhga: [""],
    dhgb: [""],
    dhgi: [""],
    dhgr: [""],
    dhh: [""],
    dhhs: [""],
    dhit: [""],
    dhj: [""],
    dhjk: [""],
    dhjp: [""],
    dhlb: [""],
		dhld: ["h_139"],
    dhm: [""],
    dhmg: [""],
    dhog: [""],
    dhon: [""],
    dhry: ["h_173"],
    dhsb: [""],
    dhsl: [""],
    dhsp: [""],
    dhts: [""],
    dhun: [""],
    dhya: [""],
    dhzr: [""],
    diab: [""],
    dib: [""],
    dibg: [""],
    dibvr: [""],
    dic: ["118"],
    dich: [""],
    did: [""],
    didm: [""],
    didz: [""],
    dies: [""],
    diex: [""],
    diff: [""],
    diid: [""],
    dij: [""],
    dijc: [""],
    dik: [""],
    diks: [""],
    dil: [""],
    dild: [""],
    dilf: [""],
    dilj: [""],
    diln: [""],
    dim: [""],
    dimc: [""],
    dimy: [""],
    dina: [""],
    dinb: [""],
    dinf: [""],
    dinm: ["h_1386"], // h_1386+5
    dint: [""],
    diol: [""],
    dipo: ["h_283"], // h_283+5
    dir: [""],
    dirs: [""],
    disc: [""],
    dish: [""],
    dism: [""],
    disp: [""],
    dit: [""],
    ditr: [""],
    dits: [""],
    div: [""],
    diva: [""],
    divr: [""],
    divs: [""],
    diwc: [""],
    diy: ["h_900"],
    diya: [""],
    dja: [""],
    djac: [""],
    djas: [""],
    djbs: [""],
    djc: [""],
		djcy: ["h_139"],
    djda: [""],
    djdh: [""],
    djdk: [""],
    dje: ["2"],
    djj: [""],
    djjj: [""],
    djjr: [""],
    djk: [""],
    djka: [""],
    djkb: [""],
    djkc: [""],
    djks: [""],
    djm: [""],
    djms: [""],
    djn: ["h_1762"],
    djna: [""],
    djnb: [""],
    djne: [""],
    djnf: [""],
    djng: [""],
    djnh: ["h_1762"],
    djni: [""],
    djnj: [""],
    djnk: [""],
    djnl: [""],
    djnm: [""],
    djno: [""],
    djnq: [""],
    djnr: [""],
    djns: [""],
    djnt: [""],
    djnx: [""],
    djny: [""],
    djnz: [""],
    djos: [""],
    djpm: [""],
    djr: [""],
    djsa: [""],
    djsb: [""],
    djsd: [""],
    djsf: [""],
    djsg: [""],
    djsh: [""],
    djsi: [""],
    djsj: [""],
    djsk: ["29"], // 29+3
    djsr: [""],
    djss: [""],
    djt: [""],
    djud: [""],
    dka: [""],
    dkaa: [""],
    dkac: [""],
    dkb: [""],
    dkbf: [""],
    dkbh: [""],
    dkbi: [""],
    dkc: [""],
    dkch: [""],
    dkd: ["24"],
    dkdb: [""],
    dkdn: [""],
    dkea: [""],
    dker: [""],
    dkf: [""],
    dkfu: [""],
    dkfw: [""],
    dkfz: [""],
    dkg: [""],
    dkgn: [""],
    dkgp: [""],
    dkgx: [""],
    dkh: [""],
    dkha: [""],
    dkhq: [""],
    dkhs: [""],
    dki: [""],
    dkik: [""],
    dkim: [""],
    dkj: [""],
    dkkb: [""],
    dkkc: [""],
    dkkf: [""],
    dkkfz: [""],
    dkkw: [""],
    dkl: [""],
    dklg: [""],
    dkm: [""],
    dkmh: [""],
    dkmt: [""],
    dkn: [""],
    dkna: [""],
    dkng: [""],
    dko: [""],
    dkof: [""],
    dkoh: [""],
    dkos: [""],
    dkps: [""],
    dkqu: [""],
    dkr: [""],
    dks: [""],
    dksa: [""],
    dksb: ["h_139"], // h_139+5
    dksr: [""],
    dkss: [""],
    dkst: [""],
    dksu: [""],
    dksw: [""],
    dkt: [""],
    dktd: [""],
    dktp: [""],
    dktr: [""],
    dkwa: [""],
    dkwt: [""],
    dkya: [""],
    dkyb: [""],
    dkyc: [""],
    dkyd: [""],
    dkye: [""],
    dkyf: [""],
    dkyg: [""],
    dkyh: [""],
    dkym: [""],
    dkyo: [""],
    dkys: [""],
    dkz: [""],
    dl: [""],
    dlab: [""],
    dlb: [""],
    dlbt: [""],
    dlc: [""],
    dld: [""],
    dldss: ["1"],
    dle: [""],
    dlen: [""],
    dlep: [""],
    dli: [""],
    dlis: [""],
    dlit: [""],
    dlix: [""],
    dlk: [""],
    dlkk: [""],
    dlld: [""],
    dlo: [""],
    dlp: [""],
    dlpl: [""],
    dlpt: [""],
    dls: [""],
    dlsx: [""],
    dlt: [""],
    dltd: [""],
    dltm: [""],
    dlvss: [""],
    dly: [""],
    dlz: [""],
    dm: [""],
    dma: [""],
    dmat: [""],
    dmax: [""],
    dmay: [""],
    dmb: [""],
    dmba: [""],
    dmbc: [""],
    dmbd: [""],
    dmbe: [""],
    dmbf: ["29"], //无
    dmbg: [""],
    dmbh: [""],
    dmbi: [""],
    dmbj: [""],
    dmbk: [""],
    dmbl: [""],
    dmbm: [""],
    dmbo: [""],
    dmc: [""],
    dmd: [""],
    dmdd: [""],
    dmdv: [""],
    dme: [""],
    dmeb: [""],
    dmet: [""],
    dmg: [""],
    dmgb: [""],
    dmgq: [""],
    dmh: [""],
    dmhs: [""],
    dmij: [""],
    dmir: [""],
    dmit: [""],
    dmk: [""],
    dmkg: [""],
    dmls: [""],
    dmm: [""],
    dmmd: [""],
    dmmn: [""],
    dmn: [""],
    dmna: [""],
    dmns: [""],
    dmo: [""],
    dmoo: [""],
    dmow: [""],
    dmp: [""],
    dmpt: [""],
    dmr: ["118"],
    dmrb: [""],
    dms: [""],
    dmsj: [""],
    dmsk: [""],
    dmsm: [""],
    dmso: [""],
    dmst: [""],
    dmta: [""],
    dmtc: [""],
    dmtr: [""],
    dmts: [""],
    dmtv: [""],
    dmtw: [""],
    dmtws: [""],
    dmtx: [""],
    dmv: [""],
    dmx: [""],
    dna: [""],
    dnax: [""],
    dnb: [""],
    dnc: [""],
    dnd: [""],
    dnia: [""],
    dnig: [""],
    dnin: [""],
    dnjk: [""],
    dnk: [""],
    dnky: [""],
    dnm: [""],
    dnma: [""],
    dnn: [""],
    dnnn: [""],
    dno: [""],
    dnp: [""],
    dnt: [""],
    dntr: [""],
    dnty: [""],
    dnvc: [""],
    dnw: ["118"],
    dnwa: [""],
    dny: [""],
    dnyu: [""],
    dnzr: [""],
    dob: [""],
    dobk: [""],
    doc: [""],
    docl: [""],
    docp: ["118"], // 1种 118+3位数
    docvr: [""],
    dod: [""],
    doe: [""],
    dog: [""],
    dogd: ["h_496"], // h_496+ /
    dohi: [""],
    doj: [""],
    dojj: [""],
    doju: [""],
    doki: ["h_1664"], // h_1664+3
    dokj: [""],
    dokm: [""],
    dold: [""],
    dolx: [""],
    dom: ["118"],
    domb: [""],
    domc: [""],
    domd: ["24"],
    dome: [""],
    doml: [""],
    done: [""],
    donn: [""],
    dopk: [""],
    dopp: ["18"],
    dopu: [""],
    dori: ["h_491"], //
    dorm: [""],
    dorr: ["36"], // 36+3/5
    dorsd: [""],
    dosa: [""],
    dosd: [""],
    dosk: [""],
    dosl: [""],
    dosp: [""],
    dot: [""],
    dotm: ["36"], //  1种 36开头+5位数
    doto: [""],
    dou: [""],
    double: [""],
    dovr: [""],
    dozw: [""],
    dp: [""],
    dpa: [""],
    dpaj: [""],
    dpam: [""],
    dpb: [""],
    dpcd: [""],
    dpcj: [""],
    dpck: [""],
    dpcr: [""],
    dpct: [""],
    dpd: [""],
    dpda: ["h_175", "", "_sm_s"],
    dpdl: [""],
    dpdv: [""],
    dpec: [""],
    dpep: [""],
    dpet: [""],
    dpg: [""],
    dpgb: [""],
    dpgd: [""],
    dpgr: [""],
    dph: [""],
    dpha: [""],
    dphb: [""],
    dphc: [""],
    dphd: [""],
    dphg: [""],
    dphh: [""],
    dphn: [""],
    dpht: [""],
    dphu: [""],
    dphx: [""],
    dpi: [""],
    dpidv: [""],
    dpik: [""],
    dpin: [""],
    dpist: [""],
    dpj: [""],
    dpk: [""],
    dpka: [""],
    dpknt: [""],
    dpl: [""],
    dpm: [""],
    dpmb: [""],
    dpmk: [""],
    dpmkb: [""],
    dpnk: [""],
    dpnw: [""],
    dpo: [""],
    dpr: [""],
    dprb: [""],
    dprm: [""],
    dps: [""],
    dpsa: [""],
    dpsb: [""],
    dpsf: [""],
    dpsg: [""],
    dpsj: [""],
    dpss: [""],
    dpsw: [""],
    dpsx: [""],
    dptf: [""],
    dptj: [""],
    dptl: [""],
    dpx: [""],
    dpxi: [""],
    dr: [""],
    dra: [""],
    dran: [""],
    drbp: [""],
    drc: ["118"],
    drdz: ["h_1632"], //  1种 1、h_1632+5位数
    dre: [""],
    dred: [""],
    drev: [""],
    drft: [""],
    drg: [""],
    drhd: [""],
    drhp: [""],
    drig: [""],
    dring: [""],
    driv: [""],
    drj: [""],
    drk: [""],
    drkc: [""],
    drm: [""],
    drma: [""],
    drn: [""],
    drns: [""],
    dro: [""],
    drop: ["36"], // 36+
    dror: [""],
    drot: [""],
    drpt: ["1"],  // 2种格式 1、1开头+3/5位数 2、后缀名特殊 ma db
    drpts: ["1"],
    drs: [""],
    drsr: [""], // DRSR 替换为 dnjr  用msin
    drvb: [""],
    drwl: [""],
    drxs: [""],
    drz: [""],
    ds: [""],
    dsa: [""],
    dsb: [""],
    dsba: [""],
    dsbb: [""],
    dsc: [""],
    dse: ["181", "", "_dmb_s"],
    dsen: ["h_175"], // h_175+ /
    dsf: ["33"],
    dsfb: [""],
    dsfm: [""],
    dsg: [""],
    dsga: [""],
    dsgp: [""],
    dsgt: [""],
    dsh: [""],
    dshm: [""],
    dsho: [""],
    dshs: [""],
    dsht: [""],
    dsi: [""],
    dsir: [""],
    dsivr: [""],
    dsja: [""],
    dsjc: [""],
		dsjh: ["h_139"],
    dsk: [""],
    dskb: [""],
    dskc: [""],
    dskg: [""],
    dskk: [""],
    dskm: [""],
    dskr: [""],
    dsl: [""],
    dslb: [""],
    dslc: [""],
    dsm: [""],
    dsmb: [""],
    dsmc: [""],
    dsmd: [""],
    dsme: [""],
    dsmf: [""],
    dsmg: [""],
    dsmh: [""],
    dsmi: [""],
    dsmj: [""],
    dsmk: [""],
    dsml: [""],
    dsmm: [""],
    dsmn: [""],
    dsmo: [""],
    dsmp: [""],
    dsmq: [""],
    dsmr: [""],
    dsms: [""],
    dsmt: [""],
    dsmu: [""],
    dsmz: [""],
    dsn: [""],
    dsnr: ["36"], // 36+ /
    dsob: [""],
    dsoft: [""],
    dsot: [""],
    dsou: [""],
    dsp: [""],
    dspn: [""],
    dsq: [""],
    dsr: [""],
    dsra: [""],
    dsrd: [""],
    dsrj: [""],
    dsrz: [""],
    dssa: [""],
    dsst: [""],
    dssv: [""],
    dssz: [""],
    dst: [""],
    dsta: [""],
    dstar: [""],
    dsth: [""],
    dsui: [""],
    dsun: [""],
    dsv: [""],
    dsvr: [""],
    dsw: [""],
    dswd: [""],
    dsx: [""],
    dsy: [""],
    dsyc: [""],
    dsyu: [""],
    dsyy: [""],
    dsz: [""],
    dt: [""],
    dtb: [""],
    dtbm: ["57"],
    dtd: [""],
    dtfb: [""],
    dth: [""],
    dti: [""],
    dtk: [""],
    dtkm: [""],
    dtl: [""],
    dtmk: [""],
    dtn: [""],
    dtoa: [""],
    dtob: [""],
    dtod: [""],
    dtot: [""],
    dtri: [""],
    dtrp: [""],
    dtsg: [""],
    dtsl: ["24"], // 1种 24+5位数
    dtt: ["336"], // MGS新
    dtth: [""],
    dtvr: ["24"], //
    dtw: [""],
    dtwa: [""],
    ducf: [""],
    dudr: [""],
    duga: [""],
    dugb: [""],
    duib: [""],
    duk: [""],
    duke: [""],
    dum: [""],
    dumm: [""],
    dun: [""],
    duna: [""],
    dunb: [""],
    dunc: [""],
    dunf: ["5469"], // 5469+5
    duno: [""],
    dup: [""],
    dupt: [""],
    dus: [""],
    dusa: [""],
    dut: ["h_1691"],
    duud: [""],
    duvv: [""],
    duwg: [""],
    dv: ["53"], //
    dva: [""],
    dvaa: [""],
    dvaf: [""],
    dvap: [""],
    dvat: [""],
    dvajbx: ["", "", "", "nkj"],
    dvb: [""],
    dvba: [""],
    dvc: [""],
    dvcl: [""],
    dvcr: [""],
    dvd: [""],
    dvdes: ["1"],
    dvdk: [""],
    dvdps: [""],
    dvdvr: [""],
    dvel: [""],
    dvf: [""],
    dvg: [""],
    dvgm: [""],
    dvh: [""],
    dvhw: [""],
    dvhz: [""],
    dvi: [""],
    dvib: [""],
    dvift: ["1"],
    dvin: [""],
    dvit: [""],
    dvjs: [""],
    dvka: ["h_175"],
    dvkb: ["h_175"],
    dvkm: [""],
    dvkr: [""],
    dvks: ["36","","","d"],
    dvkt: [""],
    dvll: [""],
    dvmb: [""],
    dvmc: [""],
    dvme: [""],
    dvmo: [""],
    dvms: [""],
    dvp: [""],
    dvpj: [""],
    dvpo: [""],
    dvpr: [""],
    dvprn: ["1"],
    dvr: [""],
    dvs: ["51"],
    dvsa: [""],
    dvsb: ["4"],
    dvsm: [""],
    dvt: [""],
    dvtc: [""],
    dvuma: ["1"],
    dvx: [""],
    dw: [""], //
    dwa: [""],
    dwb: [""],
    dwc: [""],
    dwdead: [""],
    dwe: [""],
    dwf: [""],
    dwg: [""],
    dwh: [""],
    dwi: [""],
    dwl: [""],
    dwm: ["h_878"],
    dwo: [""],
    dwpd: ["h_175"],
    dwpp: [""],
    dwpv: ["h_175"],
    dws: ["h_878"],
    dwsd: ["h_175"],
    dwt: [""],
    dwtw: [""],
    dwu: [""],
    dxa: [""],
    dxad: ["h_175"],
    dxae: ["h_175"],
    dxb: [""],
    dxbb: [""], // h_175/首 并入SW
    dxbg: [""], // h_175/首 并入SW
    dxbh: ["h_175"],
    dxbi: ["h_175"],
    dxbj: ["h_175"],
    dxbk: [""], // h_175/首 并入SW
    dxbs: ["h_175"],
    dxc: [""],
    dxck: [""], // h_175/首 并入SW
    dxdb: [""], // h_175/首 并入SW
    dxdk: ["h_175"],
    dxdl: ["h_175"],
    dxe: [""],
    dxec: ["h_175"],
    dxf: [""],
    dxg: [""],
    dxga: ["h_175"],
    dxgb: ["h_175"],
    dxgd: ["h_175"],
    dxge: ["h_175"],
    dxgk: ["h_175"],
    dxgm: ["h_175"],
    dxgs: ["h_175"],
    dxh: [""],
    dxhg: ["h_175"],
    dxhh: ["h_175"],
    dxhk: [""], // h_175/首 并入SW
    dxid: ["h_175"],
    dxij: ["h_175"],
    dxik: ["h_175"],
    dxir: ["h_175"],
    dxj: [""],
    dxk: [""],
    dxka: ["h_175"],
    dxkb: ["h_175"],
    dxkk: ["h_175"],
    dxkm: ["h_175"],
    dxky: ["h_175"],
    dxl: [""],
    dxlz: ["h_175"],
    dxmg: [""], // h_175/首 并入DVAJ
    dxmj: [""], // h_175/首 并入SW
    dxmk: ["h_175"], // h_175+ /
    dxmm: ["h_175"],
    dxnd: ["h_175"],
    dxnh: [""], // h_175/首 并入SW
    dxnj: ["h_175"],
    dxoj: ["h_175"],
    dxpd: ["h_175"],
    dxra: [""],
    dxrc: [""],
    dxre: ["h_175"],
    dxrt: ["h_175"],
    dxsb: ["h_175"],
    dxsc: ["h_175"],
    dxse: ["h_175", "", "_sm_w"],
    dxsh: ["h_175"],
    dxsm: ["h_175"],
    dxst: ["h_175"],
    dxsy: ["h_175"],
    dxtc: ["h_175"],
    dxtm: ["h_175"],
    dxtmk: [""],
    dxtr: ["h_175"],
    dxua: ["h_175"],
    dxzg: ["h_175"],
    dxzk: ["h_175"],
    dyd: ["24"],
    dyet: ["h_175"],
    dyfb: ["189"],
    dyg: ["248"], // mgs新
    dyk: ["181"],
    dyks: ["181"],
    dym: [""],
    dync: [""], // 首/187 并入 OCH
    dynd: [""],
    dynm: ["h_1378"],
    dyns: ["h_139"],
    dyo: [""],
    dypb: [""],
    dyy: [""],
    dzak: [""],
    dzas: [""],
    dzat: [""],
    dzaw: [""],
    dzbc: [""],
    dzen: [""],
    dzim: [""],
    dzjc: [""],
    dzmn: [""],
    dzno: [""],
    dzof: [""],
    dzq: [""],
    dzr: [""],
    dztb: [""],
    dzy: [""],
    dzya: [""],
    dzyb: [""],
    dzyc: [""],
    dzyd: [""],
    dzye: [""],
    dzzm: ["h_175"],
    eagl: ["h_237"],
    eart: [""],
    eb: ["52"],
    ebe: [""],
    ebi: ["126"],
    ebir: ["h_405"],
    ebjk: ["h_405"],
    ebki: ["h_405"],
    ebl: ["2"],
    ebm: [""],
    ebr: ["h_812"],
    ebz: [""],
    ec: [""], // 172和84并入 XRW
    ecb: ["2"], // 2+3位数
    ecbm: ["57"],
    ecd: [""],
    ecmk: [""],
    ecqr: ["h_1186"],
    ecr: [""],
    edct: ["5561"], // 5561+ 无
    edd: ["118"],
    edg: [""],
    edi: [""],
    edn: [""],
    edrg: ["h_1027"],
    edsd: [""],
    ee: [""],
    eeb: ["118"],
    eee: ["118"],
    eelu: ["h_086"],
    eeon: ["18"],
    efo: [""],
    efs: [""],
    eft: [""],
    eg: [""],
    egd: [""],
    egdv: ["n_1349"],
    ege: [""], // h_918/首 并入MDS
    egex: [""],
    egfs: ["n_650"],
    eggo: ["h_128"],
    egpd: [""],
    egt: ["118"],
    eh: [""],
    ehm: ["h_205"],
    eight: [""],
    eih: ["h_254"],
    eihb: ["h_254"], // h_254+ /
    eiki: ["57"],
    eikr: ["118"],
    ejr: [""],
    ejs: [""],
    ejyu: ["h_405"],
    ejzd: [""],
    ek: ["h_113"],
    ekai: ["2"],
    ekaivr: [""],
    ekap: [""],
    ekbe: ["2"],
    ekd: [""],
    ekg: [""],
    ekw: ["2"],
    elcd: [""],
    eleg: ["h_213"],
    elhd: [""],
    elo: ["76", "", "_dmb_s"],
    elv: ["216"],
    elwd: [""],
    emaf: [""],
    emah: [""],
    emal: [""],
    emaq: [""],
    emau: [""],
    emav: [""],
    embb: [""],
    embf: [""],
    embi: [""],
    embl: [""],
    embm: ["h_1650"],
    emby: [""],
    emd: ["118"],
    emms: [""],
    emoi: ["1"],
    emot: ["h_237"], // h_237+3
    empd: [""],
    empsr: ["57"],
    ems: ["h_1713"], // h_1713+ /
    emsk: ["2"],
    emth: ["h_1638"], //
    emu: [""], // 84/172 并入 XRW
    ena: ["77"],
    enb: [""],
    enc: ["118"],
    enco: [""],
    endd: [""],
    ene: ["550"], // MGS新
    engd: [""],
    enjk: ["h_405"],
    enkd: ["15"],
    eok: ["33"],
    eopd: [""],
    eos: ["h_838"],
    eosd: [""],
    eozz: ["h_086"],
    epd: [""],
    epr: [""],
    eq: ["h_100"],
    er: [""],
    erb: ["23"],
    erdl: ["1"],
    erdv: ["198"],
    erex: [""],
    erf: ["23"],
    ergc: ["84"],
    ergr: ["30"],
    ergv: ["h_1472"],
		ergz: ["h_1472"],
    erhav: ["h_1472"],
		erhbv: ["h_1472"],
    erht: ["h_1577"],
    erhv: ["h_1472"],
    erkr: ["583"], // MGS新
    erlx: [""],
    erm: ["118"],
    erod: [""],
    erofc: [""], //
    erofv: ["h_1472"],
    eroi: [""],
    eros: [""],
    erot: ["n_650"],
    eroteen: [""],
    erov: ["h_1472"],
    erox: [""],
    ers: ["118"],
    ertm: ["18"],
    erts: ["037"],
    esb: ["118"],
    esf: ["h_405"],
    esk: ["118"],
    esl: ["h_405"],
    esm: ["n_707"],
    eso: [""],
    esp: [""],
    espe: [""],
    esr: ["h_405"],
    ess: [""],
    esv: ["436"],
    esvs: ["436"],
    eta: [""],
    etc: ["13"],
    etem: [""],
    etemb: [""],
    etn: ["118"],
    etqt: ["274"],
    etr: ["111"],
    etti: [""],
    etvco: ["h_1186"],
    etw: ["h_848"],
    eud: ["019"], // mgs新
    eumd: ["h_1718"], //  1种 h_1718+5位数
    euud: ["h_086"],
    euudx: ["h_086"],
    ev: [""],
    eva: [""],
    eva: ["326"], // MGS新
    evdv: [""],
    evl: ["118"],
    evo: ["118"],
    evsd: [""],
    ewaz: [""],
    ewd: ["24"],
    ewwd: ["458"],
    ex: ["24"],
    exay: [""],
    exbd: ["33"],
    exbs: ["33"],
    exbz: [""],
    exd: ["24"],
    exdp: [""],
    exe: [""],
    exfe: ["h_1209"],
    exhqvr: [""],
    exit: [""],
    exmd: [""],
    exok: [""],
    exrm: [""],
    ext: ["61", "", "", "ai"],
    exte: ["n_1064"],
    exvd: [""],
    exvr: ["84"], // 84+
    exx: [""],
    eye: ["118"],
    ezd: ["118"],
    f: [""],
    fa: [""],
    faa: ["1"],
    faao: [""],
    fab: ["143"],
    fabh: [""],
    face: [""],
    fad: ["21"],
    fadss: ["1"],
    fadv: [""],
    fagn: ["n_1445"],
    fah: ["h_559"],
    faib: [""],
    faj: ["031"], // mgs新
    fajs: [""],
    faked: [""],
    fal: ["421", "", "_sm_s"],
    fama: ["h_1721"],
    fanh: ["h_1472"],
    fank: ["h_1593"],
    fanq: ["h_1593"],
    fanx: [""],
    fas: ["h_848"],
    fasb: ["h_114"],
    fat: ["h_205"],
    favkh: ["h_1577"],
    fax: ["h_066"], // h_066+3 集成到msin
    faxx: ["n_840"],
    fb: [""],
    fbd: ["24"],
    fbos: [""], //
    fbs: [""],
    fbsj: [""],
    fbst: ["h_1133"],
    fbu: ["118"],
    fcd: [""],
    fcdss: ["1"],
    fch: ["118"],
    fcmq: ["216"], // mgs新
    fct: ["326"], // MGS新
    fd: [""],
    fdep: [""],
    fdf: [""],
    fdig: [""],
    fdl: ["h_205"],
    fdsp: ["h_188"],
    fdzd: [""],
    fe: [""],
    feat: ["434"],
    fed: ["24"],
    fedb: [""],
    fedf: [""],
    fedh: [""],
    fedi: [""],
    fedk: [""],
    fedn: [""],
    fedp: [""],
    fedv: [""],
    fedx: [""],
    fel: ["12"],
    femd: [""],
    fena: ["h_261"],
    feo: [""],
    fera: ["h_086"], //
    ferax: ["h_086"], // h_086+2
    ferma: [""],
    fes: ["h_205"],
    fet: ["h_205"],
    fetd: [""],
    fetis: ["h_496"],
    fetj: ["031"], // mgs新
    fetl: ["031"], // mgs新
    fex: ["052"], // mgs新
    ff: [""],
    ffd: ["24"],
    ffdvd: [""],
    fffd: ["h_086"],
    fffdx: ["h_086"],
    fg: [""],
    fgal: ["h_114"],
    fgan: ["h_1440"], //
    fgb: ["h_205"],
    fgbb: ["1"],
    fgen: ["h_491"], // h_491+3
    fgh: [""],
    fgl: ["h_205"],
    fgmld: [""],
    fgmt: [""],
    fhd: [""],
    fhi: ["h_205"],
    fi: [""],
    fiby: [""],
    fimi: [""],
    find: ["h_237"], //
    finh: ["", "", "_dm_w"],
    fir: ["118"], // 1种 118+3位数
    fird: [""],
    fis: ["118"],
    fiv: ["118"],
    five: [""],
    fjd: [""],
    fjl: ["h_205"],
    fjo: ["h_1074"],
    fjor: [""],
		fjpk: ["h_491"],
    fkbd: [""],
    fkbk: [""],
    fked: ["h_1721"], // h_1721+5
    fkg: ["33"],
    fkgunm: [""],
    fkmdz: [""],
    fknbes: [""], // msin
    fkone: [""],
    fkos: ["h_1721"], // h_1721+ /
    fkw: ["33"],
    fkwb: [""],
    fkws: ["33"],
    fla: [""],
    flab: ["h_1721"], // h_1721+ /
    flb: ["h_897"], // h_897+ 无
    flbd: [""],
    flcc: [""],
    flea: [""],
    flkt: [""],
    flo: [""],
    floa: ["187"],
    flsg: [""],
    flvr: [""],
    fm: ["h_113"],
    fmat: ["h_491"],
    fmaxvr: [""],
    fmc: [""],
    fmd: ["24"],
    fmdl: ["h_1718"], // h_1718+5
    fmgk: [""],
    fmky: [""],
    fmsd: [""],
    fmy: ["77"],
    fnd: ["118", "", "_sm_s"],
    fneo: ["h_491"], //
		fnew: ["h_491"],
    fnk: [""], // h_1074/h_205 并入ADK
    fns: [""],
    fnss: [""],
		fntr: ["h_491"],
    foad: [""],
    focs: [""], //
    foe: [""],
    foj: ["031"], // MGS新
    fol: ["118"],
    fone: ["h_491"],
    form: [""],
    fp: ["h_113"], // h_113=3
    fpjs: [""],
    fpo: [""],
    fps: ["h_113"],
    fpx: ["h_687"], // h_687+ /
    fr: [""],
    fran: [""],
    frd: ["24"],
    frdv: [""],
    frdvs: [""],
    fre: ["h_275"],
    free: ["h_114"],
    frgjv: [""],
    frjd: [""],
    frnc: ["5050"],
    frss: [""],
    frtd: [""],
    frvr: [""],
    fs: [""], // h_1522/n_1428 并入ADK
    fsan: ["h_491"], // 1种 h_491+3位数
    fsb: [""],
    fsd: ["24"],
    fsdss: ["1"],
    fsei: ["h_1721"], // h_1721+ /
    fset: ["1"],
    fsfv: [""],
    fsg: [""], // h_205/h_1074 并入ADK
    fsgd: ["h_491"],
    fski: ["h_491"],
    fskt: ["h_491"],
    fslv: ["n_840"],
    fsmd: ["104"],
    fsme: ["h_491"],
    fsob: ["h_114"],
    fsos: [""],
    fspt: ["h_491"],// h_491+3
    fsre: ["h_491"],
    fst: ["118"],
    fsta: ["h_491"],
    fstb: ["h_491"],
    fstc: ["h_491"],
    fstd: ["h_491"],
    fste: ["h_491"],
    fstf: ["h_491"],
    fstv: ["n_1456"],
    fsvn: [""],
    fsvr: ["h_955"], //
    fsvss: ["1"], // VR
    fswd: [""],
    fsyg: ["h_491"],
    ft: ["h_1068"],
    fta: ["12"],
		ftav: ["1"],
    ftbd: ["n_1422"], //
    ftbl: ["1"],
    ftbld: ["1"],
    ftds: ["h_1300"],
    ftdss: ["1"],
    ftdv: [""],
    ftg: [""],
    ftht: ["1"],
    fthtd: ["1"], // 1+3
    ftik: ["262"], // mgs新
    ftj: [""],
    ftk: ["1"],
    ftkd: ["1"],
    ftktabf: ["", "", "", "", "118abf"],
    ftktkbr: ["", "", "", "", "h_1712kbr"],
    ftktkbi: ["h_1712"], // h_1712kbi101_dmb_w.mp4
    ftktgni: ["", "", "", "", "118gni"],
    ftn: ["118"],
    ftr: ["118"],
    fts: ["h_205"],
    ftuj: ["h_1573"], // h_1573+5 /
    ftvd: [""],
    ftvr: ["h_1068"],
    ftx: [""],
    fudou: [""], // h_1283/h_1278 并入ADK
    fufk: ["h_254"],
    fufu: ["h_254"],
    fuga: ["h_086"], //
    fugax: ["h_086"],
    fuka: ["n_707"],
    fuku: [""],
    ful: [""],
    fun: [""],
    funs: [""],
    fupt: [""],
    fut: ["12"],
    futd: ["1"],
    fvmd: ["h_1668"], //
    fvr: [""],
    fvsa: ["n_1349"],
    fw: [""],
    fwd: [""],
    fweb: [""],
    fws: [""],
    fx: ["61", "", "", "ai"],
    fxd: [""],
    fxy: [""],
    fysd: ["h_1734"],
    fzb: [""],
    fzh: [""],
    fzk: [""],
    fzr: ["718"], // MGS新
    fzs: [""],
    ga: ["49"],
    gac: ["118"],
    gaco: [""],
    gad: [""],
    gagd: ["24"],
    gago: ["h_1632"],
    gah: ["h_479"],
    gai: ["12"], // 12+5
    gaia: [""],
    gaid: ["h_491"], // h_491+3位数
    gaj: [""],
    gak: [""],
    gakd: [""],
    gaku: [""],
    gald: [""],
    gale: [""],
    gam: [""],
    gama: ["h_491"],
    gamd: [""],
    gan: ["h_254"],
    gana: ["200"], // MGS新
    gar: ["1"],  //
    garea: ["241"], // mgs新 /
    gas: ["71"], //
    gasa: [""],
    gaso: ["h_906"],
    gasp: ["71"],
    gass: ["71"], // 71+5 /
    gasu: [""],
    gasvr: [""],
    gasw: ["71"],
    gasx: [""],
    gat: ["", "", "_sm_s"],
    gate: [""],
    gavhj: ["48"],
    gbb: ["h_848"],
    gbd: ["436"],
    gbh: [""],
    gbi: [""],
    gbkd: [""],
    gbl: ["143"],
    gblfx: ["h_1719"], // h_1719+ /
    gbnw: ["5226", "", "", "sm"],
    gbtb: [""],
    gbtd: [""],
    gbtu: [""],
    gbud: [""],
    gbvd: ["h_004"],
    gbz: [""],
    gc: [""],
    gcal: [""], // h_1263/h_706 并入DOKS
    gcb: ["485"], // MGS新
    gcd: ["433"],
    gcicd: [""],
    gcihd: [""],
    gcisd: [""],
    gcpr: ["1"],
    gcrd: [""], // 36/h_189 并入 DOKS
    gd: [""],
    gda: [""],
    gdan: ["h_1133"],
    gdbs: [""],
    gdcd: [""],
    gdd: [""],
    gdga: [""],
    gdgd: [""],
    gdhvr: [""],
    gdju: ["298"], // mgs新
    gdkt: [""],
    gdl: ["118"],
    gdmh: ["203"], // mgs新
    gdmq: [""],
    gdo: ["235"], // mgs新
    gdr: [""],
    gds: [""],
    gdsc: [""],
    gdw: ["118"],
    ge: [""],
    gege: ["118"],
    gek: [""],
    gekd: [""],
    geks: ["143"],
    geksd: ["n_1072"],
    gemf: [""],
    gen: ["28"],
    genb: [""],
    genl: [""],
    gep: ["13"],
    gerb: ["", "", "_sm_s"],
    gerk: ["302"], // MGS新
    ges: ["118"],
    gesd: [""],
    gesu: ["49"],
    gesy: ["761"], // mgs新
    getd: [""],
    gets: ["118"],
    geur: ["n_1412"],
    geurb: ["", "", "", "", "n_1412geur"],
    gexp: ["235"], // MGS新
    gfd: ["24"],
    gfrb: ["h_1632"],
    gft: ["h_479"],
    gftd: [""],
    gg: ["13"], //  2种 13+3/5位数
    ggad: [""],
    ggbs: [""],
    ggd: [""],
    ggdr: ["h_1758"],
    ggen: ["118"], //  2种 118+3/5位数
    ggfh: ["h_173"], //  1种 h_173+5位数
    ggg: ["118"], //  1种 118+3位数
    gggg: [""],
    gghx: ["172"], // 1种 172开头+5位数
    ggirl: ["n_840"],
    ggll: ["1"],
    gph: ["767"], // mgs新
    ggp: ["h_1472"],
    ggpid: [""],
    ggr: [""],
    ggt: [""],
    ggtb: ["h_173"], //  2种 h_173+3/5位数
    ggzm: ["h_1632"], // 1种 h_1632+5位数
    ghap: ["h_1133"], // h_1133+3 /
    ghat: ["h_1664"], //
    ghd: ["24"], //  1种 24+3位数
    ghid: ["h_189"],
    ghko: [""],
    ghkp: [""],
    ghkq: [""],
    ghkr: [""],
    ghls: ["h_173"],
    ghm: ["143"],
    ghmd: [""],
    ghmt: ["h_173"],
    ghnu: ["h_173"],
    ghor: ["h_173"],
    ghov: ["h_173"],
    ghpm: [""],
    ght: [""],
    ghvr: [""], // VR系列
    ghz: ["016"], // MGS新
    gid: [""],
    gifd: ["h_189"],
    gife: ["h_189"],
    gigp: ["h_173"],
    gihhd: [""], // n_1121/h_305 并入 ADK
    gil: ["5161", "", "", "sm"],
    gilr: [""],
    gim: [""],
    gimg: ["h_173"],
    gin: [""],
    ginkaku: [""],
    gira: ["h_086"],
    gird: [""],
    girid: [""],
    girl: [""],
    giro: ["118"],
    gj: ["h_113"],
    gjcm: [""],
    gjmd: ["", "", "", "", "143jmd"],
    gjvr: [""],
    gk: ["h_113"],
    gkadvo: [""],
    gkan: [""],
    gkb: ["504"],
    gkblor: [""],
    gkd: [""], // 24/首 并入 ISD
    gkdfda: [""],
    gkdosk: ["", "", "", "", "dosk"],
    gkdt: ["h_1632"],
    gkdx: [""],
    gkembz: ["", "", "", "", "embz"],
    gkh: [""],
    gkhd: [""],
    gki: ["h_286"],
    gkj: [""],
    gkkcpb: [""],
    gkkcpj: [""],
    gkkcpn: [""],
    gkkcpr: [""],
    gkkcpw: [""],
    gkmdmb: ["", "", "", "", "mdmb"],
    gkmugo: ["", "", "", "", "mugon"],
    gks: [""],
    gkyd: [""],
    gkz: [""],
    gkzd: [""],
    gl: ["h_113"],
    gla: [""],
    glam: [""],
    glb: ["h_1293"],
    glba: [""],
    glbd: [""],
    glf: ["h_1293"],
    glg: ["h_093"],
    gli: ["039"], // MGS新
    glm: [""],
    glo: [""],
    glpd: [""],
    gls: [""],
    glsp: [""],
    glt: [""], // h_310/h_205 并入 THNIB
    gm: ["h_113"],
    gma: [""],  //
    gmad: [""],
    gmas: ["", "", "", "", "143mas"],
    gmax: [""],
    gmbm: ["h_1133"],
    gmd: ["24"],
    gmed: ["143"],
    gmg: [""],
    gmix: [""],
    gmjk: ["h_1133"],
    gmk: ["23"],
    gmmd: ["235"], // mgs新
    gmod: [""],
    gmsp: [""],
    gn: [""],
    gnab: ["118"],  //
    gnan: ["h_1133"],
    gnax: [""], // 首/h_1345 并入 DVAJ
    gnbd: [""],
    gnbf: [""],
    gnd: [""],
    gne: ["h_479"],
    gnhd: [""],
    gni: ["118"],
    gnjd: [""],
    gnki: ["h_445"],
    gns: ["h_1596"], //
    gny: [""],
    goal: ["h_1687"], // h_1687+3
    gobd: ["57"],
    gobu: ["18"],
    god: [""],
    godd: ["15"],
    godr: ["78"], // 78+ 无
    gods: ["235"], // mgs新
    gogo: ["h_1133"],
    goin: ["745"], // mgs新
    goji: ["759"], // mgs新
    goju: ["h_1165"], //
    gok: [""],
    goki: [""],
    gokn: ["33"],
    goku: [""],
    gokuc: [""],
    gokun: [""],
    gold: ["h_918"],
    gomk: ["235"], // mgs新
		gomms: ["h_1780"],
    gomu: ["h_086"], //
    gon: ["12"],
    gone: ["h_1133"], //
    good: ["118"],
    gool: ["278"], // mgs新
    gor: ["23"],
    gorilla: [""],
    gos: [""],
    gotd: [""],
    gotv: ["h_734"],
    gotw: [""],
    goul: ["h_086"],
    govr: ["h_1290"],
    goyd: [""],
    gp: [""],
    gpd: [""],
    gppp: [""],
    gps: [""],
    gptm: [""],
    gqbd: [""],
    gqbx: [""],
    gqcd: ["h_189"],
    gqd: [""],
    gqe: [""], // 首/13 并入GVH
    gql: ["13"],
    gqr: ["13"],
    gqs: ["13"],
    grab: ["5141"],
    grabd: ["n_1535"], // n_1535+3  grabd更换为grace
    grace: ["n_1535"], // n_1535+3
    gran: [""],
    grap: [""],
    gras: [""],
    grbd: ["", "", "", "", "143rbd"],
    grch: ["1"],
    grd: ["n_1315"], //  1种 n_1315+3位数
    grdv: ["49"],
    gre: ["h_1075"],
    gred: ["n_1445"], // n_1445+ 去除b
    gredb: ["", "", "", "", "n_1445gred"], // n_1445+ 去除b
    gren: ["n_1155"],
    gret: ["h_173"],
    grgr: ["h_1071"],
    grin: ["h_261"],
    grk: [""],
    grkg: ["h_1535"],
    grks: [""],
    grmo: ["h_1534"], //
    grmr: ["h_1534"], // h_1534+5
    grmt: [""],
    grpt: [""],
    grrs: [""],
    grt: ["118"],
    gryd: ["15"],
    gs: ["140"], //
    gsad: [""], // h_173/5226 并入ZEX
    gsbd: [""],
    gsd: [""],
    gsdg: [""],
    gsf: ["h_989"],
    gshr: ["h_346"], //
    gshrb: ["h_346"], // 调用去除b
    gsj: [""],
    gsm: [""],
    gsnjv: ["48"],
    gso: [""],
    gsp: ["71"],
    gsq: [""],
    gsr: ["h_310"],
    gssd: [""],
    gst: [""], // 12/13 并入GVH
    gsts: ["118"],
    gsty: ["118"],
    gsv: [""],
    gsx: ["118"],
    gsy: [""],
    gt: ["111"],
    gtd: [""],
    gtgd: [""],
    gtn: ["118"],
    gto: ["118"],
    gtok: ["h_189", "", "_sm_s"],
    gtoz: [""],
    gtp: [""],
    gtrl: ["235"], // mgs新
    gtte: ["h_1632"],
    gud: [""],
    gufu: ["h_086"],
    guld: [""],
    gum: [""],
    gun: ["433"], // 433+5
    gunm: [""],
    gur: ["28"],
    gvg: ["13"], //
    gvrd: ["h_173"], // h_173+ /
    gwaz: ["29"],
    gwren: ["118"],
    gwzz: [""],
    gxaz: ["29"],
    gxxd: [""],
    gxxx: [""],
    gyan: ["118"],
    gyaz: ["29"],
    gyd: ["118"],
    gyh: ["077"], // mgs新
    gyoe: [""],
    gyu: ["h_205"],
    gzap: ["118"],
    ha: ["49"],
    hab: ["59"],
    had: ["118"],
    hag: ["057"], // mgs新
    haho: ["n_1425"],
    hahob: [""], // h_706/n_1425/n_1425+截取4字母
    hai: ["59"],
    haj: ["031"], // mgs新
    haji: [""],
    hajime: [""],
    hajk: ["h_445"],
    hamd: [""],
    hana: [""],
    hani: [""],
    hao: [""],
    haoid: [""],
    haoz: [""],
    hapt: [""],
    har: ["118"],
    harj: ["031"], // mgs新
    hart: ["", "", "", "", "36shart"],
    haru: ["h_687"], //
    haruv: ["h_687"],
    hat: ["12"],
    hate: [""],
    hatu: ["h_128"],
    havd: ["1"],
    hawa: ["1"],
    hay: ["h_1533"],
    haz: ["118"],
    haze: ["h_491"],
    hb: ["h_1098"],
    hbad: ["1"],
    hbbd: ["h_086"],
    hbbx: [""],
    hbd: [""],
    hbns: [""],
    hboy: [""],
    hbs: ["h_909"],
    hbsd: ["065"], // mgs新
    hbx: [""],
    hc: [""],
    hcd: [""],
    hck: [""],
    hcm: ["118"],
    hcp: [""],
    hct: ["h_443"], // h_443+3 /
    hcy: [""],
    hcz: [""],
    hd: ["1"],
    hdb: [""],
    hdd: [""],
    hdg: ["248"],
    hdi: ["12"],
    hdka: ["h_237"], // h_237+3 /
    hdkb: ["118"],
    hdlx: [""],
    hdmb: [""],
    hdpr: [""],
    hdrd: ["24"],
    hdv: ["28"],
    hdvhj: ["48"],
    hea: ["118"],
    hebi: ["h_261"],
    hed: [""],
    hedv: ["49"],
    hei: [""],
    hend: [""],
    henk: ["18"],
    herd: ["h_086"],
    herdx: [""],
    herv: [""],
    hest: ["h_838"],
    het: [""],
    hew: ["016"], // mgs新
    hex: ["h_443"],
    hey: [""],
    hez: ["59"], // 59+3 /
    hf: ["59"],
    hfc: ["h_1601"], // h_1601+ /
    hfcm: [""],
    hfdd: ["235"], // mgs新
    hff: ["59"],
    hfm: [""],
    hfn: [""],
    hgb: [""],
    hgbm: ["57"],
    hgd: [""],
    hgg: ["h_1347"],
    hgj: ["59"],
    hgot: ["84"],
    hgp: [""],
    hgp: ["326"], // MGS新
    hgq: ["13"],
    hgs: ["h_909"], // h_909+ /
    hgy: ["59", "", "_sm_s"],
    hh: [""],
    hhad: [""],
    hhap: [""],
    hhd: [""],
    hhdd: [""],
    hhdv: [""],
    hhe: ["118"],
    hhed: ["h_086"],
    hhedx: ["h_086"],
    hhhd: [""],
    hhhg: ["h_173"],
    hhk: [""],
    hhls: [""],
    hhnd: [""],
    hhpdr: [""],
    hhpr: [""],
    hhr: ["59"],
    hhsd: ["h_629"],
    hhvd: [""],
    hib: [""],
    hibc: [""],
    hict: ["436"],
    hid: [""],
    hien: [""],
    hifd: [""],
    hig: [""],
    high: ["", "", "_dmb_s"],
    higl: [""],
    higm: ["h_1221"],
    higr: ["n_1463"],
    him: [""],
    hima: ["h_086"],
    himax: ["h_086"],
    himd: [""],
    hime: [""],
    himt: [""],
    himv: [""],
    hina: ["h_113"],
    hind: ["h_1177"], // VR
    hip: [""],
    hipa: [""],
    hir: [""],
    hirb: [""],
    hirc: [""],
    his: [""],
    hisn: ["1"],
    hit: ["13"],
    hitj: ["031"], // mgs新
    hitl: ["031"], // mgs新
    hitou: ["n_650", "", "_sm_w", "r"],
    hitoub: [""], // 同 hitoud
    hitoud: [""], // n_1064/n_650 并入 MCMA
    hits: [""],
    hiwa: [""],
    hiyb: [""],
    hiyc: [""],
    hiz: ["118"],
    hj: ["h_921"],
    hjd: ["143"],
    hjk: [""],
    hjmd: [""],
    hjo: ["118"],
    hjp: ["1"],
    hjs: [""],
    hjt: ["59"],
    hk: [""],
    hkb: [""],
    hkc: ["59"],
    hkd: [""], //
    hke: ["057"], // mgs新
    hkeg: [""],
    hki: [""],
    hkid: [""],
    hkj: ["59"],
    hkjd: [""],
    hkk: [""],
    hkm: ["59"],
    hkn: ["59"],
    hkr: [""],
    hkrd: [""],
    hkrs: [""],
    hksv: [""],
    hkt: [""],
    hkw: ["2"], //
    hkwd: [""],
    hky: ["59"],
    hl: ["n_863"],
    hld: [""],
    hleg: [""],
    hlm: ["436"], // mgs新
    hlmd: [""],
    hlsd: [""],
    hlux: [""],
    hlv: ["h_443"], //
    hm: [""], // 首/gk 并入NATR
    hmd: ["143"],
    hmdhx: ["h_1472"],
    hmdnv: ["h_1472"], // h_1472 /
    hme: ["118"],
    hmge: ["512"],
    hmgl: ["h_172"], //
    hmhm: ["483"], // mgs新
    hmjm: ["001"], // mgs新
    hmk: [""],
    hml: [""],
    hmm: ["118"],
    hmmx: ["h_1711"], // h_1711 /
    hmnf: ["h_172"], //
    hmnx: ["h_1472"],
    hmpd: ["41"],
    hmpg: ["001"], // mgs新
    hmrb: ["512"],
    hmsd: [""],
    hmsp: ["512"],
    hmt: ["598"], // MGS新
    hmvf: ["h_1472"],
    hmvx: ["h_1472"],
    hmy: ["59"],
    hnamh: ["1"],
    hnb: ["h_254"],
    hnbp: ["052"], // mgs新
    hnc: ["33"],
    hnd: [""], //
    hnf: [""],
    hnht: [""],
    hnhu: ["h_1658"], //
    hnk: ["59"],
    hnmd: [""],
    hnmg: [""],
    hnr: [""],
    hns: ["59"],
    hnt: [""],
    hnu: ["59"],
    ho: ["h_113"],
    hob: ["h_1435"],
    hoc: ["59"],
    hocl: [""],
    hod: [""],
    hodv: ["41"], // 41+ /
    hogp: [""],
    hoj: ["031"], // mgs新
    hokg: [""],
    hoks: [""], //
    hoku: [""],
    hol: ["h_443"], //
    holy: [""],
    hon: ["1"],
    honb: ["h_1133"], //
    hond: [""],
    hone: ["h_086"],
    honex: ["h_086"],
    hony: [""],
    hoo: ["h_186", "", "_sm_s"],
    hoog: ["33"],
    hoon: [""],
    hop: [""],
    hor: ["421"],
    hos: [""],
    hosd: [""],
    hose: [""],
    hot: [""],
    hotvr: ["59"], // VR-
    houhou: [""],
    houm: [""],
    hov: ["118"],
    howy: ["41"], //
    hp: [""],
    hpar: [""],
    hpbn: [""],
    hpf: ["h_443"],
    hpi: [""],
    hpk: ["483"],
    hpl: [""],
    hpmo: [""],
    hpn: ["h_443"],
    hpp: [""],
    hpr: ["h_443"],
    hprd: [""],
    hpv: ["h_303"],
    hpxn: [""],
    hpz: ["483"],
		hqn: ["1"],
    hr: ["h_113"], // h_113+ /
		hrav: ["h_1763"],
    hrc: ["143"],
    hrd: ["24"],
    hrg: [""],
    hrkd: [""],
    hrm: ["h_859"],
    hrnd: [""],
    hrpd: [""],
    hrrb: [""],
    hrsm: ["h_1745"],
    hrt: [""],
    hrtd: [""],
    hru: ["59"],
    hrv: ["118"],
    hrz: ["59"],
    hs: [""],
    hsb: [""],
    hsd: [""],
    hsdab: ["1"], //  mgs前缀107 暂用dmm
    hsdam: ["1"],
    hse: ["057"], // mgs新
    hsf: ["189"],
    hsgd: [""],
    hsgr: [""],
    hsk: [""],
    hsl: ["h_443"],
    hsm: ["h_458"], // h_458+ /
    hsp: [""], // h_186/118 并入 XRW
    hsv: [""],
    hsy: ["33"],
    hsyb: [""],
    hsyd: [""],
    ht: [""],
    htad: [""],
    htb: [""],
    htch: ["h_706"],
    htd: ["24"],
    htdr: ["18"],
    htfdv: [""],
    hthd: ["h_086"], //
    hthdx: ["h_086"],
    htk: [""],
    htld: [""],
    htms: [""],
    htn: [""],
    htpk: ["h_1133"],
    htps: ["h_1133"],
    htr: [""],
    hts: ["140"],
    htsu: ["18"],
    htt: ["h_687"],
    htubo: ["h_1607"], // h_1607+ /
    hty: [""],
    hudd: ["15"],
    huf: [""],
    hune: [""],
    hunt: ["1"],
    huntc: [""],
    hunvrc: [""],
    husd: ["57"],
    husr: ["57"],
    hust: ["57"],
    husx: ["57"],
    huzd: [""],
    hvg: ["13"],
    hvy: ["59"],
    hw: [""],
    hwb: ["h_113", "", "", "sm"],
    hwd: ["13"],
    hwif: [""],
    hwrd: [""],
    hws: ["118"],
    hwsd: [""],
    hwsp: [""],
    hxad: ["29"],
    hxae: [""],
    hxaf: [""],
    hxag: [""],
    hxah: [""],
    hxai: [""],
    hxaj: [""],
    hxak: ["29"],
    hxal: [""],
    hxam: [""],
    hxan: [""],
    hxao: [""],
    hxap: [""],
    hxaq: [""],
    hxar: [""],
    hxas: [""],
    hxat: [""],
    hxau: [""],
    hxaw: [""],
    hxax: [""],
    hxay: [""],
    hxaz: [""],
    hya: [""],
    hyad: [""],
    hyaku: ["84"],
    hyas: [""], // 首/84 并入 MDTM
    hyav: [""],
    hyaz: ["29"], // 29+ /
    hyd: [""],
    hygi: ["h_445"],
    hypn: ["1"],
    hyr: [""],
    hys: ["118"],
    hysd: ["41"],
    hz: ["h_113"], //
    hzd: [""],
    hzex: [""],
    hzgb: ["h_1100"], //
    hzgd: ["h_1100"], //
    hzgs: ["h_1100"],
    hzhb: ["h_1100"],
    hzm: ["59"],
    hzmd: [""],
    hzmen: ["h_1371"],
    hzmt: ["h_445"],
    hzok: ["18"],
    hzoks: ["", "", "", "", "18hzok"],
    hzr: [""],
    hzzd: ["h_086"],
    i: [""],
    ia: ["61", "", "", "ai"],
    iad: [""],
    iann: ["h_086"],
    iannx: ["h_086"],
    iaoa: [""],
    iapb: [""],
    iats: ["1"],
    ibfg: [""],
    ibma: ["504"],
    ibox: [""],
    ibs: ["118"],
    ibvr: [""],
    ibw: ["504", "", "", "z"],
    ibwgs: [""],
    ic: [""],
    icak: [""],
    iccc: ["h_086"],
    icd: [""],
    ichd: [""],
    ichk: ["368"], // MGS新
    ico: [""],
    ics: ["h_001"],
    ict: ["118"],
    icvd: [""],
    id: ["h_113"], // h_113+ /
    idl: [""],
    idld: [""],
    idol: [""],
    idp: [""],
    ids: ["h_113"],
    ie: ["1", "", "_sm_s"],
    iean: ["109"], // mgs新
    iegr: [""],
    iele: ["1"],
    iemd: [""],
    iend: ["1"],
    iene: ["1", "", "_sm_w"],
    ienf: ["1"],
    ienfh: ["109"], // MGS新
    iepg: ["1"],
    ieqp: ["109"], // mgs新
    iesm: ["1"],
    iesp: ["1"],
    ievd: ["1"],
    if: ["61", "", "", "ai"],
    ifd: [""],
    ifda: [""],
    ifdva: ["1"],
    ifdve: ["1"],
    ifdvm: [""],
    iffk: [""],
    iffs: [""],
    ifkh: [""],
    iflk: [""],
    ifly: [""],
    ifo: [""],
    ifoa: [""],
    ifpa: [""],
    ifri: ["217"], // mgs新
    ig: ["61", "", "", "ai"],
    iga: ["h_086"],
    igad: ["066"], // mgs新
    igmd: [""],
    ign: ["12"],
    igt: [""],
    igu: ["33"],
    igub: ["33"],
    igy: [""],
    ih: ["61", "", "", "ai"],
    ihd: [""],
    ihj: [""],
    ihkd: [""],
    ihn: [""],
    ihw: [""],
    ii: [""],
    iitan: [""],
    ijkd: [""],
    ik: [""],
    ikd: ["24"],
    ikgd: [""],
    ikuna: ["1"],
    ikst: ["h_1454"],
    ikt: [""],
    ikv: ["118"],
    ily: [""],
    im: ["61", "", "", "ai"],
    imd: ["24"],
    imjj: [""],
    imk: ["151"],
    iml: ["118"],
    imo: ["12"], // 12+ /
    imod: [""],
    imota: ["h_254"],
    imp: [""],
    impa: [""],
    impb: [""],
    impc: [""],
    impjo: [""], // h_1154/n_1418 并入ZEX
    impjob: [""], // h_1154/n_1418 并入ZEX
    impno: [""], // h_1154/n_1418 并入ZEX
    impnob: [""], // h_1154/n_1418 并入ZEX
    impto: [""], // h_1154/n_1418 并入ZEX
    imptob: [""], // h_1154/n_1418 并入ZEX
    impve: [""], // h_1154/n_1418 并入ZEX
    impveb: [""], // h_1154/n_1418 并入ZEX
    imrd: [""],
    inax: [""],
    inba: ["h_687"],
    inc: [""],
    ind: ["534"], // mgs新
    indi: ["h_917"],
    inf: ["118"],
    infd: ["h_405"],
    ing: ["118"],
    ingo: [""],
    ingu: [""],
    inj: ["", "", "_sm_s", "", "62injd"],
    injd: ["62"],
    inm: [""],
    inmd: [""],
    ino: [""],
    inon: ["h_1472"],
    inot: ["h_1133"], // h_1133+ /
    inp: [""],
    inpr: [""],
    inrd: [""],
    insf: ["1"],
    insp: [""],
    instc: [""], //
    instma: ["h_1472"],
    instna: ["h_1472"],
    instv: ["h_1472"],
    insvx: ["h_1472"],
    int: [""],
    intp: [""],
    inu: ["118", "", "_sm_s"],
    inud: ["57", "", "_sm_s"],
    inude: [""],
    inzm: [""],
    io: [""],
    ioad: [""],
    iod: ["h_467"],
    ione: [""],
    iora: ["h_086"],
    ip: [""],
    ipd: [""],
    ipn: ["118"],
    ipot: [""],
    iqd: [""],
    iqp: [""],
    iqpa: ["h_574", "", "", "r"],
    iqqq: ["h_086"], //
    iqqqx: ["h_086"],
    ird: [""],
    iro: ["h_086"],
    irox: ["h_086"],
    is: ["61", "", "", "ai"],
    isay: [""],
    isb: [""],
    iscr: [""], // n_1072/1 并入 DVAJ
    isdn: ["h_254"],
    isgd: [""],
    isi: ["h_286"],
    isj: ["12"],
    iskd: ["h_086"],
    iskdx: [""],
    ism: ["118"],
    isn: [""],
    ispd: [""],
    isrd: ["24"],
    issd: ["21"],
    isy: ["436"],
    it: [""],
    itd: [""],
    ito: [""],
    itsr: ["57"], // 57+ /
    ittd: [""],
    itz: [""],
    ivd: [""],
    ivka: [""],
    ivla: [""],
    ivt: ["118"],
    iwan: ["h_086"],
    iwanx: ["h_086"],
    iwbv: [""],
    iwd: [""],
    iwgb: ["h_188"],
    ixaz: [""],
    ixla: [""],
    ixlz: [""],
    ixtz: [""],
    iyasi: ["n_1064"],
    iyaz: [""],
    izak: ["h_1377"],
    izakcp: ["h_1377"],
    izb: [""],
    izen: ["h_687"],
    izm: ["h_113"], // h_113+ /
    izp: ["h_021"],
    j: ["h_1489"], // a_dmb_w.mp4
    jac: ["390"], // MGS新
    jag: ["28"],
    jak: ["33"],
    jamb: ["187"],
    jamc: ["187"],
    jamd: ["187"],
    jame: ["187"],
    jamf: ["187"],
    jamg: ["187"],
    jamh: ["187"],
    jan: ["118"],
    japd: [""],
    jarb: ["h_1336"],
    jarm: ["11"],
    javd: [""],
    jb: [""],
    jbjb: ["h_687"], //
    jbmd: ["n_681"],
    jbox: [""],
    jbpd: ["h_086"],
    jbpdx: [""],
    jbs: ["118"],
    jbss: ["h_128"],
		jbz: ["h_1294"],
    jcb: [""],
    jccp: ["n_707"],
    jcd: [""],
    jck: ["118"],
    jckl: ["h_254"],
    jcn: ["118"],
    jd: [""], // h_109pb/52 并入 ZEX
    jdk: [""],
    jdx: [""],
    jdxo: [""], // 很混乱 无规则 暂时搁置
    jdyd: [""],
    jed: [""], // n_1488/n_707/13/301 并入 DVAJ
    jelly: ["h_706"],
    jesbd: ["h_706"],
    jewe: ["h_848"], // h_848+ /
    jf: [""],
    jfa: [""],
    jfc: [""],
    jfd: ["h_205"],
    jfe: [""],
    jfic: [""], // 5141/n_707 并入 SW
    jfk: [""],
    jfyg: ["1"],
    jgad: ["h_086", "", "_sm_s"],
    jgadx: [""],
    jgaho: ["h_1002"], //
    jgbd: ["h_173"],
    jh: [""],
    jhhd: ["h_173", "", "_sm_s"],
    jhq: [""],
    jhzd: [""],
    ji: [""],
    jibf: ["n_707"], // n_707+ /
    jid: ["126"],
    jik: [""],
    jim: ["h_1725"], // h_1725+ /
    jimi: ["h_254"], // h_254+ /
    jiod: [""],
    jiru: ["782"], // MGS新
    jj: ["13"],
    jjaa: [""], // h_1350/首 并入MDS
    jjc: [""],
    jjd: ["24"],
    jjh: [""],
    jjkd: ["15"],
    jjod: [""],
    jjor: [""],
    jjsd: [""],
    jjun: ["h_086"],
    jjunx: [""],
    jjwk: [""],
    jk: ["h_1713"],
    jkb: [""], // 118/h_179 并入 XRW
    jkcm: [""],
    jkd: ["24"], // 24+
    jkdd: [""],
    jkf: ["143"],
    jkfv: ["", "", "_sm_s"],
    jkh: [""],
    jkhb: ["18"],
    jkjd: [""],
    jkks: ["18"],
    jkm: [""],
    jkn: [""],
    jknr: ["18"],
    jkod: [""],
    jkp: ["1"],
    jkrd: [""], // h_086/18 并入 MEKO
    jkrdx: [""],
    jkrs: ["h_128"], //
    jks: [""], // 36/h_139 并入 DOKS
    jksp: [""],
    jksr: ["57"], //
    jksx: ["57"],
    jkto: [""],
    jkw: ["h_848"],
    jkws: ["18"],
    jkzk: ["18"],
    jl: ["23", "", "_sm_s"],
    jld: [""],
    jm: [""],
    jma: [""],
    jmap: ["h_1632"],
    jmd: ["15"],
    jmdv: [""],
    jmdvb: [""],
    jmpc: ["h_1632"],
    jmrd: [""], // 5294/h_173/n_1155 并入 zex
    jmsd: ["1"],
    jmss: [""],
    jmsz: ["h_173"],
    jmt: [""],
    jnad: [""],
    jnbt: [""],
    jnd: [""],
    jndg: ["h_1720"],
    jnet: [""],
    jnk: ["h_1711"],
    jnke: ["h_1711"],
		jnkd: ["h_1711"],
    jnm: [""],
    jnn: [""],
    jnob: [""], // n_707/n_1464/h_1266 并入 ZEX
    jnph: [""],
    jns: ["h_1672"],
    jnt: [""],
    jnt: ["390"], // MGS新
		jnth: ["h_1472"],
    jo: [""],
    job: ["118"],
    jod: [""],
    joe: ["71"],
    jos: ["h_156"],
    josd: [""],
    josi: ["h_491"],
    josk: ["h_697"],
    jovd: [""],
    joyu: ["h_128"],
    jpd: [""],
    jpdds: ["1"],
    jpdrs: ["152"],
    jpdvd: [""],
    jpg: [""],
    jpn: ["118"],
    jptdv: [""],
    jrad: ["h_086"],
    jrdv: [""],
    jryd: ["h_086", "", "_sm_s"],
    jrzd: ["h_086"],
    jrzdx: ["h_086"],
    jrze: ["h_086"],
    js: [""], // h_355/h_909/50 并入 XVSR
    jsbd: ["h_173"],
    jsd: [""],
    jse: ["057"], // mgs新
    jsm: ["13", "", "_sm_s"],
    jsn: ["118"],
    json: ["18"],
    jsop: [""], //
    jssj: ["n_707"],
    jstk: ["h_1133"],
    jsto: ["n_707"],
    jtb: ["33", "", "_sm_s"],
    jtbc: ["33", "", "_sm_s"],
    jtd: [""],
    jtdk: ["n_707"],
    jtdv: ["483", "", "_sm_s"],
    jtk: ["23", "", "_sm_s"],
    ju: ["h_113"],
    judg: [""],
    judo: [""],
    jukf: ["h_227"], //
    juks: ["57"],
    juku: [""], // 首/h_1136 并入 XVSR
    jump: ["h_227"],
    jun: [""],
    junk: ["h_445"],
    jura: ["h_086"], //
    jutn: ["h_227"],
    juw: ["23"],
    jvdd: [""],
    jvdw: [""],
    jvof: [""],
    jvx: [""],
    jw: ["", "", "", "", "h_1391pbjw"],
    jwaz: ["29"],
    jwd: ["24"],
    jxaz: ["29"],
    jxd: ["h_205"],
    jya: ["h_286"],
    jyaz: ["29"],
    jyd: [""],
    jyex: [""],
    jyh: [""],
    jyk: ["057"], // mgs新
    jykjv: [""],
    jyo: ["h_859"],
    jysh: [""],
    jyyc: [""],
    jzbd: ["h_173", "", "_sm_s"],
    ka: ["", "0", "", "ai"],
    kaad: ["h_086"], // h_086+2~5
    kaadx: ["h_086"],
    kad: ["28"],
    kagd: ["118"],
    kage: [""],
    kagh: [""], // h_970/422 并入 XVSR
    kags: ["436"],
    kaih: [""],
    kaihh: [""],
    kaihk: [""],
    kaik: [""],
    kaim: [""],
    kame: ["n_650"],
    kamef: ["h_1350"], //
    kamex: ["h_1593"],
    kamich: ["h_1580"],
    kamioch: ["h_1580"], // h_1580+5
		kamx: ["h_1350"],
    kan: ["118"],
    kano: [""], // 首/1 并入sw
    kanp: ["h_395"],
    kanz: ["h_1664"], // h_1664+3
    kaoae: ["", "", "", "", "oae"],
    kark: ["h_261"],
    kas: ["h_405"],
    kasakura: [""],
    kasd: [""],
    kashi: ["h_1533"],
    kat: ["1", "", "_sm_s"],
    katu: [""],  // 首字母+3/5
    katuo: [""],  // 首字母+3/5 去除o
    kaupa: [""],
    kav: ["1"],
    kavr: [""],
    kawa: [""],
    kawd: [""], // 2种  首字母+3/5位数
    kazd: [""],
    kazk: ["h_254"],
    kazu: ["n_707"],
    kb: ["h_113"],
    kba: ["13"],
    kbcm: [""],
    kbd: [""],
    kbh: ["118"],
    kbi: ["h_1712"], //
    kbj: [""],
    kbkd: [""],
    kbl: ["336"], // mgs新
    kbm: [""],
    kbnd: ["104", "", "_sm_s"],
    kboae: ["", "", "", "", "oae"],
    kbtd: ["171", "", "_sm_s"],
    kbto: [""],
    kbtv: [""], // h_1514/h_244 并入 XVSR
    kbvr: ["h_1241"], // VR
    kbw: [""],
    kby: [""],
    kbynb: [""],
    kbynd: [""],
    kbz: [""],
    kc: ["h_113"],
    kca: [""],
    kcawd: ["", "", "", "", "cawd"],
    kcwm: ["24"],
    kcd: [""],
    kcda: [""],
    kcf: [""],
    kch: [""],
    kchc: ["h_303"],
    kck: [""],
    kclb: ["24"], // 24+5 /
    kcoae: ["", "", "", "", "oae"],
    kcod: ["104"],
    kcos: ["h_491"],
    kcpb: [""],
    kcpj: [""],
    kcpm: [""],
    kcpr: [""],
    kd: ["126"],
    kdasd: ["", "", "", "", "dasd"],
    kdfe: ["24"],
    kdg: ["118"],
    kdmd: ["100"],
    kdmx: [""],
    kdo: ["126", "", "_sm_s"],
    kdod: [""],
    kds: ["h_1711"],
    kdsd: [""],
    kdsg: [""],
    kdsh: ["", "", "_dm_s"], // 首字母+3/5 /
    kdtg: ["18", "", "_sm_s"],
    kdvr: ["366"], // MGS新
    kdx: ["483"],
    kec: [""],
    kecb: ["24"],
    ked: ["15"],
    keed: ["h_086"],
    keedx: ["h_086"],
    kei: [""],
    keifu: ["h_254"],
    kel: ["23", "", "_sm_s"],
    ken: [""],
    kesi: [""],
    ket: ["118"],
    kew: [""],
    kezd: [""],
    kfc: ["77"],
    kfg: [""],
    kfl: [""],
    kfne: ["118"],
    kg: [""],
    kgai: [""], // 436/h_157 并入sw
    kgb: ["118"],
    kgd: [""],
    kgdv: ["062"], // mgs新
    kgkd: ["244"],
    kgg: [""],
    kgm: [""],
    kgmi: [""],
    kgr: ["h_848"],
    kgs: [""],
    kgsd: [""],
    kgz: [""],
    kdje: ["24"],
    kh: ["h_113"],
    kha: [""],
    khb: [""],
    khd: [""],
    khh: [""],
    khj: [""],
    khk: ["33"],
    khko: [""],
    khm: [""],
    khv: [""],
    ki: [""],
    kicd: [""],
    kick: ["118"],
    kid: ["143"],
    kidm: [""],
    kil: ["118"],
    kim: [""],
    kimo: ["15"],
    kin: ["h_859"],
    kinkaku: [""],
    kinl: [""],
    kiod: [""],
    kipx: ["", "", "", "", "ipx"],
    kir: ["h_254"], // h_254+5
    kire: ["1"], // 1+3
    kirebd: ["", "", "", "", "1kire"],
    kiri: ["4"],
    kirm: ["h_1540"],
    kitaike: [""],
    kitaike: ["276"], // MGS新
    kiwi: ["118"],
    kiz: ["h_848"],
    kizn: ["h_1410"],
    kj: [""],
    kjc: ["12"],
    kjj: [""],
    kjk: ["5"],
    kjmd: [""],
    kjod: [""],
    kjsd: [""],
    kjz: [""],
    kk: ["13"],
    kka: ["041"], //mgs新
    kkbd: ["47"],
    kkbj: [""],
    kkbt: ["1"],
    kkc: [""],
    kkd: ["24", "", "_sm_s"],
    kkfe: [""],
    kkj: ["118"],
    kkk: ["h_103"],
    kkkd: [""],
    kkn: [""],
    kkp: [""],
    kkpd: ["244"],
    kkrd: [""],
    kks: [""],
    kksp: ["1", "", "_sm_s"],
    kktn: ["1"],
    kkts: [""],
    kku: ["118"],
    kkw: [""],
    kld: [""],
    km: ["h_113"],
    kmad: [""],
    kmbb: ["1", "", "_sm_w"],
    kmbe: [""],
    kmbk: [""],
    kmbs: [""],
    kmd: [""],
    kmex: [""],
    kmg: ["436", "", "_sm_s"],
    kmhr: ["1"],
    kmhrs: ["1"],
    kmi: ["", "", "_sm_w"],
    kmide: ["", "", "", "", "mide"],
    kmkfx: ["h_1719"],
    kmm: [""],
    kmmn: [""],
    kmon: [""],
    kmpd: [""],
    kmsd: [""],
    kmtr: ["422"],
    kmvd: [""],
    kmvr: ["84"], //VR
    kn: [""],
    knam: ["h_491"],
    knb: ["336"], // MGS新
    kncb: [""],
    kncs: ["", "", "", "r", "164kncr"],
    knd: ["143"],
    kndn: [""],
    knds: [""],
    knfd: [""],
    kngn: [""],
    kngr: [""], // h_157/436 并入 SW
    knjd: ["18", "", "_sm_s"],
    knk: [""],
    knks: [""],
    knld: ["244"],
    knmb: ["h_491"], // h_491+3
    knmd: [""], // 首字/h_1352 并入DVAJ
    knol: [""],
    knrz: [""],
    knsd: ["065"], // mgs新
    knsm: ["h_491"], // h_491+ /
    knup: [""],
    knv: [""],
    knwf: ["h_1133"],
    knyd: [""],
    knz: [""],
    ko: [""],
    koa: ["h_086"],
    kob: [""],
    koba: ["118"],
    koc: ["h_924"],
    kocm: [""],
    kod: [""],
    koe: ["h_086"],
    kof: ["h_086"],
    kog: [""],
    kogc: ["33"],
		koja: ["1"],
    koj: ["33"],
    kojc: ["33"],
    koji: ["h_128"],
    kojt: [""],
		koko: ["n_1535"],
    kon: ["540"],
    kop: [""], // 首字母/h_086 并入  MEKO
    kopx: [""],
    kos: ["h_086"],
    kosb: ["33"],
    kosd: [""],
    kosx: [""],
    kota: ["h_1133"],
    koum: ["18"],
    kouz: [""],
    kow: [""],
    kp: [""],
    kpaf: [""],
    kpb: ["336"], // MGS新
    kpd: ["24"],
    kpg: [""],
    kphd: [""],
    kping: ["1"],
    kpp: ["h_113"],
    kpred: ["", "", "", "", "pred"],
    kpsd: ["171"],
    kpt: [""],
    kpts: [""],
    kpvr: [""],
    kpzd: ["244"],
    kqbd: ["244"],
    kqbd: ["244"],
    krav: [""],
    krd: ["5619"],
    kre: ["118"],
    kri: ["h_286"], //
    krid: [""],
    krp: [""],
    krs: ["h_1631"], //
    krt: [""],
    krtv: [""],
    krv: ["118"],
    kry: [""],
    ksb: [""],
    ksbe: [""],
    ksbt: [""], // 36/h_139 并入 DOKS
    ksd: ["24"],
    ksfn: ["1"],
    ksg: [""],
    ksi: [""],
    ksid: [""],
    ksir: [""],
    ksj: [""],
    ksk: [""],
    kskm: ["h_139"],
    ksm: [""],
    ksn: [""],
    ksrg: [""],
    kss: ["326"], // MGS新
    kssis: ["", "", "", "", "ssis"],
    kst: [""],
    kszs: ["57"],
    kt: [""],
    ktd: ["47"],
    ktds: ["h_094"],
    ktdv: ["50"],
    ktdvr: ["50", "", "_sm_s", "r"],
    ktdvsp: ["50"],
    kte: ["23", "", "_sm_s"],
    ktek: ["", "", "", "", "tek"],
    ktf: ["h_1074"],
    ktgr: ["h_157"],
    kth: [""],
    ktif: ["201"], // mgs新
    ktr: ["h_094"],
    ktsd: [""],
    ktwr: ["h_445"],
    kub: [""],
    kubd: [""],
    kud: ["h_1389"], // h_1389+
    kuf: ["1"],
    kufd: ["244"],
    kuku: ["h_086"],
    kum: ["118"],
    kumd: ["15"], // 15+ /
    kumo: [""],
    kur: ["1"],
    kura: [""],
    kurod: [""],
    kus: ["1"],
    kuse: ["1"],
    kusl: ["031"], // mgs新
    kusp: [""],
    kusr: ["57"],
    kusu: ["n_863"],
    kut: [""],
    kuud: ["h_086"],
    kvd: [""],
    kvdd: ["244"],
    kvod: [""],
    kvs: [""],
		kvr: ["","","","","1dandy8kvr"],
    kw: [""],
    kwdi: ["24"],
    kwnd: [""],
    kwpo: ["1"],
    ky: ["h_186"],
    kybd: [""],
    kyd: [""],
    kyhd: [""],
    kyk: ["118"],
    kym: [""],
    kyo: ["005"], // mgs新
    kyod: [""],
    kyoj: ["33"],
    kyom: [""],
    kyon: ["h_128"],
    kys: ["33"],
    kyu: ["118"],
    kyuu: ["33"],
    kyun: ["118"],
    kyw: [""],
    kyz: [""],
    kzd: ["118"],
    kzki: ["h_445"],
    kzw: [""],
    l: [""],
    la: [""],
    labs: ["h_231"],
    lac: [""],
    laco: ["h_231"],
    lad: ["24"],
    lads: ["h_252"],
    ladya: ["1"],
    ladyl: ["1"],
    lafe: ["h_231"],
    lah: ["118"],
    laha: ["031"], // mgs新
    laim: [""], // 首/h_231 并入 XVSR
    laj: ["031"],
    laka: ["h_231"],
    lalc: ["36"],
    lama: ["127"], // mgs新
    lamf: [""],
    land: ["h_086", "", "_sm_w"],
    landl: [""],
    landx: [""],
    lank: ["h_231"],
    laon: ["h_231"],
    lap: ["118"],
    lars: ["h_231"],
    lasa: ["h_231"],
    lase: ["h_231"],
    lata: ["h_231"],
    lb: ["n_1315"],
    lbd: [""],
    lbdd: ["n_1515"],
    lbh: ["13", "", "_sm_s"],
    lbj: ["1"],
    lbs: ["h_113"],
    lbsd: [""],
    lby: ["h_1542"],
    lbz: [""],
    lc: ["h_921"],
    lcdv: ["n_691"],
    lco: ["126"],
    lcsd: ["065"], // mgs新
    ld: ["n_1428"],
    ldd: ["24"],
    ldjj: ["031"], // mgs新
    ldk: [""],
    ldm: ["143"],
    ldnx: [""],
    le: ["23", "", "", "d"],
    lea: ["118"],
    leb: [""],
    lec: [""],
    leg: ["005"], // MGS新
    leh: [""],
    lem: ["118"],
    leme: [""],
    leovr: [""],
    lep: [""],
    lepr: [""],
    les: [""], // h_606/497 并入ZEX
    lesb: [""],
    lesd: ["483"],
    lesj: ["031"], // mgs新
    lesl: ["031"], // mgs新
    lesm: [""],
    lex: [""],
    leyo: [""],
    lez: [""],
    lezm: [""],
    lfa: [""],
    lffd: [""],
    lflj: ["031"], // mgs新
    lfr: ["h_405"],
    lfrd: [""],
    lgd: ["24"],
    lgjdv: ["48"],
    lhbb: [""],
    lhbr: [""],
    lhbs: [""],
    lhby: [""],
    lhd: ["062"], // mgs新
    lhjf: ["031"], // mgs新
    lhpt: [""],
    lhtd: ["171"],
    lhtg: [""],
    lia: ["77"],
    licn: ["h_491"],
    lid: ["24"],
    lihd: ["104"],
    limd: [""],
    lime: ["118"],
    line: [""],
    lip: [""],
    lisu: ["h_086"],
    livd: [""],
    livdsale: [""],
    live: [""],
    lizd: ["104"],
    ljd: [""], // 13/24 并入 ISD
    ljpp: [""],
    ljsk: ["h_491"],
    lkb: [""],
    lkd: ["24"],
    lkh: ["421"],
    lks: [""],
    lld: ["126"],
    lljw: ["031"], // MGS新
    lll: [""],
    llo: ["118"],
    llr: ["118"],
    lls: [""],
    llwk: [""],
    llyd: [""],
    lm: [""],
    lmbj: [""],
    lmbo: [""],
    lmc: ["h_186"],
    lmd: [""],
    lmh: [""],
    lmhg: [""],
    lmhh: [""],
    lmhl: [""],
    lml: [""],
    lmn: [""],
    lmp: [""],
    lmpd: ["h_086"],
    lmpi: ["298"], // mgs新
    lnp: ["118"],
    lns: ["118"],
    lod: ["24"],
    lodo: ["n_650"],
    loex: ["h_047"],
    log: ["535"], // MGS新
    lokm: ["h_047"],
    lol: ["12"], //
    lomd: ["15"],
    lon: ["h_1033"],
    long: ["118"],
    loo: ["118"],
    loota: ["5433"],
    lop: ["h_113"],
    lost: ["326"], // MGS新
    lov: ["h_001"],
    love: ["h_491"], // alove此番好系列 要去除前面的a
    lp: ["h_113"],
    lpt: ["118"],
    lrgjv: ["48"],
    lsc: ["n_1072"],
    lsd: ["24"],
    lsht: ["1"],
    lsp: ["1"],
    lsse: ["031"], // mgs新
    lsz: ["1"],
    luk: ["28"],
    lune: ["h_086"],
    lunex: [""],
    lusd: [""],
    luxu: ["259"], // MGS新
    lv: [""],
    lvc: [""],
    lvd: [""],
    lvid: [""],
    lvmfc: [""],
    lvmfcs: [""],
    lvo: [""],
    lvs: ["33"],
    lvsc: ["h_1770"],
    lvsd: [""],
    lvsimm: [""],
    lvt: ["118"],
    lvyd: [""],
    lw: [""],
    lwsd: [""],
    lxar: [""],
    lxje: [""],
    lxmr: [""],
    lxp: ["h_1697"],
    lxtg: [""],
    lxv: ["118"],
    lxvs: ["118"],
    lyc: [""],
    lyo: [""],
    lyr: [""],
    lzd: [""],
    lzjs: [""],
    lzln: [""],
    lztd: ["", "", "_dm_s"], // 同tk前缀
    lztf: [""],
    ma: ["h_1598"],
    mab: ["h_1293"],
    mabd: [""],
    mabe: ["h_405"],
    mabo: [""],
    mabp: ["h_687"],
    mabs: ["h_1133"],
    mabu: ["h_395"],
    maby: ["h_395"],
    mac: ["143"],
    macb: ["h_687"],
    macr: ["118"],
    mad: ["h_286"],
    mada: ["84"],
    madr: ["", "", "", "", "h_286mad"],
    maed: [""],
    maen: [""],
    maf: ["h_021"],
    mafg: ["h_395"],
    mag: [""],
    mag: ["719"], // MGS新
    maguro: ["h_455"],
    mah: ["28"],
    mahh: ["h_395"],
    mahi: [""],
    mahv: ["h_395"],
    maik: [""],
    maim: ["h_395"],
    maip: ["h_395"],
    maj: ["h_606"],
    makn: ["h_395"],
    mako: ["h_395"],
    makt: ["h_1133"],
    mama: ["49"],
    mame: ["h_1133"],
    man: ["118"],
    mana: ["052"],
    manc: ["h_261"],
    mand: ["h_128"],
    mane: ["1"],
    manl: [""],
    manq: ["h_812"],
    manz: ["h_395"],
    maps: ["h_395"],
    mar: ["n_709"],
    mara: ["h_237"],
    maraa: ["n_709"],
    mari: [""],
    markt: ["n_709"],
    marm: ["h_395"],
    maro: ["h_113"],
    mart: ["h_405"],
    maru: [""],
    mas: ["118"],
    masa: ["h_1133"],
    masd: ["1"],
    masi: ["h_1664"],
    masj: ["h_395"],
    mask: ["h_395"],
    masn: [""],
    masrs: ["57"],
    mast: ["h_1523"],
    masxd: ["h_086"],
    masxx: [""],
    mate: ["203"],
    matr: ["h_395"],
    matu: ["h_086"],
    mawa: ["h_086"],
    max: ["h_286"],
    maxa: ["60"],
    maxd: [""],
    maxvrg: [""],
    mays: ["h_395"],
    mazfx: ["h_1719"],
    mazj: ["031"], // mgs新
    mazl: [""],
    mazo: ["h_1472"],
    mb: [""],
    mbc: [""],
    mbd: ["118"],
    mbdd: ["n_707"],
    mbg: ["h_1293"],
    mbhp: ["h_618"],
    mbjn: ["33"],
    mbm: ["h_460"],
    mbmh: ["h_460"],
    mbmp: ["h_460"],
    mbms: ["h_460"],
    mbox: [""],
    mbp: [""],
    mbr: ["", "", "", "", "n_709mbraa"],
    mbraa: ["n_709"],
    mbrab: ["n_709"], // n_709+ /
    mbral: ["n_709"],
    mbrap: [""], // n_709/406 并入NASH
    mbraq: ["h_816"], // h_816+ 无
    mbraqs: [""],
    mbrau: ["n_709"],
    mbraw: ["n_709"],
    mbraz: ["n_709"], // n_709+3 /
    mbrba: ["5050"], // 5050+5
    mbrbb: [""],
    mbrbc: ["n_709"],
    mbrbd: ["n_709"],
    mbrbf: ["n_709"], // 1种 n_709开头+3位数
    mbrbg: ["n_709"],
    mbrbh: ["406"],
    mbrbk: ["n_709"],
    mbrbl: ["406"],
    mbrbm: ["5141"], // 5141+5
    mbrbn: ["n_709"],
    mbrbs: ["n_709"],
    mbrbt: ["n_709"],
		mbrk: ["h_1472"],
    mbst: ["099"], // mgs新
    mbt: ["143"],
    mbw: ["13"],
    mcas: ["", "", "_sm_s", "r", "h_419mcar"],
    mcdl: ["h_1588"],
    mchan: ["57"],
    mcle: [""],
    mcmq: ["h_812"],
    mcsd: [""],
    mcsf: [""],
    mcso: ["h_1133"],
    mcsr: ["57"], //
    mcsx: ["57"], // 57+5 /
    mct: ["118"],
    mcy: [""],
    md: [""],
    mda: [""],
    mdb: [""], // 84/61/61 ai_ 并入MDS
    mdbk: [""], //
    mdbm: ["57"], // 57+5 /
    mdbx: [""],
    mdc: ["118"],
    mdd: [""],
    mded: [""],
    mdfd: [""],
    mdgd: [""],
    mdh: [""],
    mdhd: ["104"],
    mdid: [""],
    mdjd: [""],
    mdjy: ["h_618"],
    mdk: [""],
    mdks: [""],
    mdl: [""],
    mdld: [""],
    mdm: ["075"], // mgs新
    mdmb: [""],
    mdmd: [""],
    mdmt: ["5448"],
    mdo: [""],
    mdod: [""],
    mdom: [""],
    mdpa: ["36", "", "", "r"],
    mdss: [""], // 15/首 并入YMDD
    mdst: ["h_189"],
    mdv: ["h_205"],
    mdvd: [""],
    mdvhj: ["48"], //  2种 48开头+3/5位数
    mdwd: [""],
    mdx: [""],
    mdxd: [""],
    mdyn: [""],
    mdz: [""],
    mear: ["h_1133"], // h_1133+5
    mebo: [""],
    meel: ["203"], // mgs新
    mega: ["h_173"],
    mei: ["118"],
    mek: ["118"], //  1种 118开头+3位数
    meki: ["h_1133"], // 1种 h_1133开头+3位数
    mel: ["118"],
    meme: ["", "", "_sm_s"],
    men: [""],
    meod: [""],
    merd: ["h_491"],
    mers: ["h_1133"],
    mesb: [""],
    mesh: ["781"], // MGS新
    mess: ["18"],
    mesu: ["h_086"], //
    mesux: ["h_086"], // h_086+
    met: ["118"],
    metd: [""],
    mete: ["n_1349"],
    mevd: [""],
    meve: ["h_618"],
    mf: ["n_1428"],
    mfc: ["435"], // MGS新
    mfcd: ["h_1711"],
    mfco: ["h_1711"],
    mfcs: ["435"], // MGS新
    mfct: ["h_1711"],
    mfcw: ["435"], // mgs新
    mfo: ["1"],
    mfod: ["1"],
    mfpd: [""],
    mft: ["1"],
    mfth: ["1"],
    mg: ["h_921"],
    mgbs: [""],
    mgcl: [""], // h_1271/h_445 并入EKDV
    mgdn: ["h_254"],
    mgdv: [""], // 49/首 并入EKDV
    mgen: [""], // h_254/h_792 并入AVOP
    mgex: [""],
    mgh: [""],
    mghh: [""],
    mghr: [""],
    mgj: ["23", "", "_sm_s", "d"],
    mgjh: [""],
    mgk: [""],
    mgkd: [""],
    mgks: [""],
    mgld: ["h_687"],
    mgmd: [""],
    mgmh: [""],
		mgnl: ["1"],
    mgo: ["28"],
    mgold: ["1"],
    mgp: ["118"],
    mgq: ["13"],
    mgr: [""],
    mgr: ["051"], // MGS新
    mgs: [""],
    mgsd: ["171", "", "_sm_s"],
    mgt: ["118"],
    mgtd: ["h_1711"],
    mgvr: [""],
    mh: ["111"],
    mhar: ["h_1160"],
    mhd: ["111"],
    mhdd: [""],
    mhip: ["h_618"],
    mhk: [""],
    mhr: [""],
    mhso: ["h_618"],
    mht: [""],
    mhv: ["118"],
    mhy: [""],
    mi: [""],
    mia: ["h_113"],
    miav: ["84"], // 84+
    mibod: [""],
    mibt: ["h_618"],
    mic: [""],
    mica: ["h_1346"],
    mid: [""],
    midi: ["53"],
    mie: ["118"],
    mig: ["h_1533"], // h_1533+
    miha: ["1"],
    miid: [""],
    mijps: ["152"],
    mik: ["h_405"],
    mika: [""],
    mikr: ["1"],
    miks: ["n_707"],
    mild: ["84", "", "_sm_w"], // 84 /
    milf: ["h_189"], // h_189+5
    milh: ["h_1240"], // h_1240+ /
    milk: ["h_1240"], //
    milkvr: [""],
    milp: [""],
    milv: ["84", "", "", "ai"],
    mimi: [""],
    minr: ["h_618"],
    mint: ["", "", "_dm_s"],
    minx: [""],
    mipan: [""],
    miqd: [""],
    mira: ["118"],
    mis: [""],
    mise: ["", "", "_sm_s"],
    misr: ["022"], // mgs新
    mist: ["1"],
    mit: ["118"],
    mitd: ["118"],
    miu: [""],
    mium: ["300"], // MGS新
    mivr: ["h_1145"], // h_1145+5 有mgs资源(都是x) 暂用dmm
    mivrs: ["h_1145"],
    mix: ["12"], // 12+3
    mixd: ["148"],
    mixmix: [""],
    miya: ["118"],
    mjd: ["13"],
    mje: [""],
    mjex: [""],
    mjfd: ["h_188"],
    mjp: ["540"],
    mjpk: ["h_618"],
    mjpt: ["h_618"],
    mjy: [""],
    mk: ["n_1315"],
    mkb: [""],
    mkbs: ["h_445"],
    mkcd: [""],
    mkdd: [""],
    mkds: ["", "", "", "a"],
    mkdv: [""],
    mkg: [""],
    mkk: [""],
    mkmp: [""], // 首字母 或 84
    mkop: ["h_618"],
    mks: ["h_618"],
    mksd: [""],
    mksp: ["h_618"],
    mky: [""],
    mkz: ["h_618"],
    mla: ["476"], // MGS新
    mld: ["143"],
    mldo: ["h_833"],
    mles: ["h_618"],
    mlh: [""],
    mlid: [""],
    mlkvr: [""],
    mlml: [""],
    mlob: ["5050"],
    mlobb: [""],
    mlp: ["h_848"],
    mls: ["118"],
    mlw: ["h_606"],
    mlwt: [""],
    mm: [""],
    mmat: ["18"],
    mmbe: [""],
    mmcpvr: [""],
    mmd: ["12"],
    mmdd: [""],
    mmdv: [""],
    mmdx: [""],
    mme: ["h_606"],
    mmf: ["28"],
    mmfk: [""],
    mmfuku: [""],
    mmg: ["h_606"],
    mmgb: [""],
    mmgh: ["1"],
    mmgm: ["h_618"],
    mmif: ["h_618"],
    mmkd: [""],
    mmktb: ["5448"],
    mmnt: ["84"], // 84/首 并入 MDS
    mmo: ["15"],
    mmr: [""],
    mmraa: ["n_709"],
    mmrab: ["n_709"],
    mmral: ["n_709"],
    mmrau: ["5670"],
    mmrav: ["n_709"],
    mmraz: ["n_709"],
    mmrbd: ["n_709"],
    mmrbf: ["406"],
    mmy: ["118"],
    mmzd: ["5226"],
    mn: ["h_213"],
    mndo: ["h_1160"],
    mnds: ["h_618"],
    mnfc: ["h_173"],
    mnh: ["23"],
    mnim: ["h_618"],
    mnimz: ["h_618"],
    mnri: ["h_618"], // h_618*3
    mnrs: ["h_618"],
    mnsd: ["15"],
    mnsj: ["h_445"],
    mnsk: ["h_618"],
    mntr: ["1"],
    mnyd: ["", "", "_dm_s"],
    mobbv: ["077"], // mgs新
    mobsnd: ["h_108"],
    moc: ["h_924"], // h_924+ /
    mod: ["504"],
    moep: ["004"], // MGS新
    mogi: ["1"],
    moko: ["h_254"], //
    mol: ["h_1563"],
    mold: ["13"],
    molu: ["h_086"],
    mom: ["143"],
    momj: ["18"],
    mona: ["383"], // mgs新
    mone: ["h_1133"],
    monl: ["031"], // MGS新
    moon: [""], // 奇怪的番号系列 lulu 对应 MOON-002 https://pv3001.dmm.com/litevideo/freepv/l/lul/lulu00095/lulu00095_sm_w.mp4
    mop: ["118"],
    mopa: [""], // h_806/首字母 并入 XVSR
    mopb: [""], // h_806/首字母 并入 XVSR
    mopc: ["h_806"], // h_806/首字母 并入 XVSR
    mopf: ["h_806"],
    mor: ["n_1064"],
    mosi: ["h_086"],
    moso: ["h_128"],
    mot: ["h_796"], // h_796+ /
    moto: ["h_924"],
    mox: ["h_924"],
    mpoo: ["h_618"],
    mqsm: ["298"], // mgs新
    mqxt: ["517"], // mgs新
    mrl: ["23"],
    mrq: ["118"],
    mrt: ["118"],
    msaj: ["", "", "_dmb_s"],
    msan: ["h_1133"],
    msbd: ["15"],
    msf: [""], // 并入 OCH
    msfh: ["1"],
    msfhbd: ["1"], // 1+ 去掉BD /
    msh: ["077"],
    msjo: ["33"],
    msjr: [""], // h_1160/h_086并入MEKO
    msk: ["5"],
    mskg: ["1"],
    msmd: ["13"],
    mspk: ["h_491"],
    mspt: ["n_1487"],
    mst: ["h_771"],
    mstg: ["18"],
    msz: ["h_173"],
    mta: ["118"],
    mtabs: ["1"],
    mtall: ["1"],
    mtd: ["24"],
    mtes: ["h_1300"], //
    mtg: ["118"],
    mtk: ["23"],
    mtm: ["118"],
    mtnsero: [""], // SERO系列
    mtr: ["h_970"],
    mtt: ["118"],
    mumo: ["h_445"],
    mvs: ["118"],
    mvt: ["118"],
    mw: ["n_1429"],
    mwbb: ["h_618"],
    mwkd: [""], // 5448/n_650 并入 MCMA
    mxbd: ["h_068"], // h_068+3 /
    mxbv: ["h_068"],
    mxcs: ["h_068"],
    mxd: ["24"],
    mxdlp: ["071"], // MGS新
    mxds: ["", "", "", "", "h_068mx3ds"],
    mxgs: ["h_068"], //
    mxm: ["h_275"],
    mxnb: ["h_068", "", "_sm_s"],
    mxp: [""], // h_1104/h_275 并入MCMA
    mxpc: ["h_068", "", "_sm_s"],
    mxsps: ["h_068"], // h_068+
    mxt: ["1"],
    my: ["292"], // MGS新
    mymn: ["h_618"],
    mys: ["h_618"],
    mzd: ["24"],
		mzk: ["h_1294"],
    mzm: ["118"],
    mzq: ["118"],
    mzro: ["h_618"],
    nabe: ["5050"],
    nabu: ["h_1133"],
    nacr: ["h_237"], //
    nacs: ["h_771"],
    nacx: ["h_237"], //
    nacz: ["h_771"],
    nad: ["24"],
    naen: ["493"], // MGS新
    nafi: ["h_771"], //
    nafz: ["h_771"],
    nag: ["1"],
    naga: ["h_1566"], // h_1566+5位数
    nagae: [""], // MSIN
    nage: ["1", "", "_sm_s"],
    najd: ["", "", "_sm_s"],
    nam: ["118"],
    nama: ["332"], // MGS新
    nambu: ["59", "", "_sm_s"],
    namd: ["15", "", "_sm_s"],
    namh: ["1"],
		namhs: ["1"],
		naac: ["n_1541"],
    nanp: [""], // h_1133/84 并入 MCMA
    napk: ["h_491"],
    nass: ["h_067"],
    naze: ["h_086"],
    nbb: ["33"],
    nbe: ["15"],
    nbsd: ["171", "", "_sm_s"],
    nbss: ["h_114"],
    ncac: ["h_1275"],
    ncd: ["h_496"],
    ncg: ["33"],
    ncgb: ["33"],
    nchj: ["18"],
    ncyy: ["18"],
    ndo: ["h_1292"],
    ndr: ["118", "", "_sm_s"],
    ndx: ["118"],
    nebb: ["5642"],
    nebo: ["h_491"], // h_491+3
    ned: ["24"],
    nego: ["h_086"],
    neko: ["h_496", "", "_sm_w"],
    nem: ["143"],
    neo: ["433"], //
    neob: ["41"],
    neos: ["h_491"], // h_491+ /
    net: ["118"],
		next: ["h_491"],
    ney: ["h_1297"],
    nfdm: ["h_188"],
    nfxv: ["h_105", "", "_sm_s"],
    ngd: ["1", "", "_sm_s"],
    ngea: ["1"],
    ngks: ["1", "", "_sm_s"],
    ngm: ["143"],
    ngss: ["1"],
    nhd: [""], // 24/首字母  并入 ISD
    nhdt: ["1", "", "_sm_s"],
    nhdta: ["1"],
    nhdtb: ["1"],
    nhht: ["h_954"],
    nhm: ["143", "", "_sm_s"],
    nhmsg: ["593"], // MGS新
    niji: ["h_1533"],
    nijt: ["h_445", "", "_sm_s"],
    nikm: ["84"], // 84+3
    niku: ["h_455"],
    nim: ["33", "", "_sm_s"],
    nin: ["12"],
    nine: ["h_1133"],
    nise: ["263"], // mgs新
    nisr: ["h_237"],
    niwa: ["h_086"],
    njbe: ["583"], // mgs新
    njel: ["436", "", "_sm_s"],
    njg: ["118", "", "_sm_s"],
    njh: ["h_848"],
    njjd: ["36", "", "_sm_s"],
    njn: ["h_001", "", "_sm_s"],
    njp: ["h_848"],
    njpd: ["h_1754"],
    njpds: [""], // 152/1 并入 XRW
    njs: [""], // 483和436 并入 sw
    njy: ["436", "", "_sm_s"],
    nka: ["118"],
    nkh: ["483", "", "_sm_s"],
    nkjsero: [""], // SERO系列
    nkm: ["118", "", "_sm_s"],
    nkmc: ["", "", "_sm_s"],
    nkmt: ["h_803"],
    nkmtndvaj: ["yr"], // 特例
    nknkjdvaj: ["yr"], // 特例
    nkrs: ["h_1287"],
    nksd: ["171", "", "_sm_s"],
    nkt: ["h_1033"],
    nktjgdvaj: ["", "", "", "", "yrnktjgdvaj"],
    nl: ["h_113"],
    nlbd: ["019"], // mgs新
    nld: ["24"],
    nle: ["h_1592"], // h_1592+3 /
    nlf: ["118", "", "_dm_s"],
    nly: ["421", "", "_sm_s"],
    nmc: ["118"],
    nmch: ["383"], // MGS新
    nmd: ["24"],
    nmh: ["057"], // MGS 规则
    nmi: ["118"],
    nmin: [""], // 436 483 并入SW
    nmk: ["h_897"], // h_897+ 无
    nmo: ["143"],
    nmp: ["118"],
    nmtsero: [""], // SERO系列
    nmu: ["", "", "_dm_s"],
    nng: ["723"], // mgs独开
    nnk: ["h_859"],
    nnm: ["057"], // mgs新
    nnn: ["080"], // mgs新
    nnnc: ["h_491"], // h_491+3
    nns: ["533"], // mgs新
    nnsd: ["171", "", "_sm_s"],
    no: ["h_100", "", "_sm_s"],
    noav: ["h_445", "", "_dm_s"],
    nod: ["24", "", "_sm_s"],
    nof: ["118"],
    nog: ["483", "", "_sm_s"],
    nogu: ["h_128", "", "_sm_s"],
    nol: ["326"], // MGS新
    non: ["h_127", "", "_sm_s"],
    nop: ["33", "", "_sm_s"],
    nopa: ["33"],
    nopb: ["33"],
    nopc: ["33", "", "_sm_s"],
    noru: ["h_086", "", "_sm_s"],
    noskn: ["1"],
    nosto: ["", "", "_dm_s", "", "n_650tosto"],
    now: ["118"],
    noz: ["h_086"],
    np: ["h_113"],
    npd: ["21", "", "_sm_s"],
    nph: ["1"],
    npp: ["h_1693"],
    nps: ["h_021"], // h_021+3/5
    npv: ["118"], // 118+ 0-11位118 11之后的-系列 mgs集成
    nre: ["118", "", "_sm_s"],
    nrkr: ["h_687"],
    nrs: ["118"],
    ns: ["436"],
    nsbb: ["1"], // 1+5 有mgs对应数据
    nsd: ["h_001", "", "_sm_s"],
    nsgd: ["h_086", "", "_sm_s"],
    nsm: ["346"], // MGS新
    nsr: ["118", "", "_sm_s"],
    nst: ["12", "", "_sm_s"],
    nt: ["h_113"],
    ntk: ["300"], // MGS新
    nto: ["118", "", "_sm_s"],
    ntr: ["1"],
    ntrl: ["031"], // mgs新
    nttr: ["1"],
    ntu: ["33"],
    ntvf: ["h_1472"],
    nu: ["5433"],
    nubi: ["h_1112"],
    nuka: ["h_086"], // h_086+2~5
    nukax: ["h_086"],
    nuku: ["041"], // mgs新
    numl: ["031"], // mgs新
    nure: ["052"], // mgs新
    nv: ["h_1118", "", "_dmb_s"],
    nvt: ["118"],
    nwf: ["3", "", "_sm_s"],
    nxg: ["h_1664"], //
    nxgs: ["h_1664"], //  1-4为h_254前缀 5开始h_1664前缀
    nyh: ["1"],
    nzk: ["118"],
    oass: ["", "", "_dm_s"],
    obal: ["031"], // mgs新
    obse: ["h_406", "", "_sm_w"],
    obt: ["h_001", "", "_dmb_s"],
    oca: ["118"],
    och: ["h_1580"], // h_1580+
    ocn: ["421"], // MGS新
    odfa: ["h_537"], // h_537+ 与前缀 tk 同 并入 mdtm /
    odfb: ["h_537"],
    odfg: ["h_537"],
    odfm: ["h_537"], // h_537+ 与前缀 tk 同 并入 mdtm /
    odfp: ["h_537"],
    odfr: ["h_537"], // h_537+ 与前缀 tk 同 并入 mdtm /
    odfw: ["h_537"],
    odvhj: ["48"], // 48+3
    odvk: ["", "", "_sm_s"],
    oem: ["h_460"],
    of: ["n_1428"],
    ofav: ["118"],
    ofcd: ["15", "", "_sm_s"],
    ofku: ["h_254"],
    ogk: ["33", "", "_sm_s"],
    ogkb: ["33", "", "_sm_s"],
    ogpp: ["18"],
    ogy: ["n_1353"],
    oha: ["118", "", "_sm_s"],
    ohd: ["h_376", "", "_sm_s", "sm"],
    oho: ["h_093"],
    ohp: ["n_707"],
    oig: ["33"],
    oiza: ["h_254"],
    ojk: ["118"],
    ojs: ["118"],
    okad: ["84"],
    okae: ["h_406"],
    okan: ["", "", "_sm_s"],
    okav: ["84", "", "", "ai"],
    okb: ["249"], // MGS新
    okc: ["249"], // MGS新
    okgd: ["h_1347"], // h_1347+ /
    okju: ["84", "", "_sm_s"],
    okk: ["249"], // MGS新
    oko: ["249"], // MGS新
    okp: ["249"], // MGS新
    oks: ["249"], // MGS新
    oksd: ["065"], // MGS新
    okv: ["249"], // MGS新
    okx: ["249"], // MGS新
    okyh: ["1"],
    ol: ["h_113", "", "_sm_s"],
    ola: ["h_113", "", "_sm_s"],
    old: ["24", "", "_sm_s"],
    ols: ["118", "", "_sm_s"],
    omama: ["h_706", "", "", "b"],
    omeg: ["118"],
    omg: ["118"],
    omnb: ["326"], // mgs新
    omo: ["h_1189"],
    omon: ["h_1189"],
    omse: ["h_254", "", "_sm_w"],
    omt: ["h_1359"], //
    omtp: ["h_1359"], //
    omu: ["h_1189"], // h_1189+5 /
    on: ["h_113"],
    onaj: ["031"], // mgs新
    onal: ["031"], // mgs新
    onam: ["33"],
    once: ["118"],
    ond: ["118", "", "_sm_s"],
    one: ["118", "", "_sm_s"],
    oneb: ["118"],
    oneg: ["h_794"],
    onem: ["118", "", "_sm_s"],
    oner: ["118"],
    onet: ["118"],
    onex: ["h_1674"], // h_1674+ /
    onez: ["h_1674"], //
    ongp: ["84"],
    oni: ["12"],
    onk: ["118", "", "_sm_s"],
    onna: ["1"],
    onrj: ["33"],
    ons: ["326"], // mgs新
    oob: ["118", "", "_sm_s"],
    ooniku: ["h_455", "", "_dm_w"],
		oots: ["h_1734"],
    opd: ["15", "", "_sm_s"],
    opdd: ["104", "", "_sm_w"],
    open: [""], // 并入XRW 多种格式
    opmd: ["", "", "_sm_s"],
    oppl: ["031"],
    oppx: ["031"],
    opsd: ["", "", "_dm_s"],
    ord: ["15", "", "_sm_s"],
    ore: ["h_1097"], // h_1097+5
    orea: ["84"],
    orecs: ["h_1732", "", ""],
    oredg: ["230"], // mgs规则
    orep: ["230"], // mgs新
    oretdp: ["230"], // mgs规则
    org: ["h_771"],
    ork: ["118", "", "_sm_s"],
    osbr: ["404"],
    osk: ["118", "", "_sm_s"],
    osm: ["118", "", "_sm_s"],
    osr: ["118", "", "_sm_s"],
    osst: ["h_1450"], // h_1450+ /
    otav: ["118"],
    otd: ["h_1563"], // mgs新 dmm也有资源  难以兼容
    otim: ["393"], // MGS新
    otin: ["h_1133"],
    otkr: ["18"],
    otom: ["052"], // mgs新
    ots: ["1", "", "_sm_s"],
    oty: ["118"],
    ovs: ["483", "", "_sm_s"],
    oyaj: ["h_1001"], // h_1001+5
    oyj: ["h_1003"],
    oyu: ["118", "", "_sm_w"],
    oyvd: ["h_004", "", "_sm_s"],
    ozrs: ["", "", "_dm_s"],
    ozvd: ["h_004", "", "_sm_s"],
    p: ["140"],
    packd: ["5433"],
    pad: ["h_139"],
    paf: ["33"],
    pafa: ["33"],
    pafl: ["33"], // 33+5位数
    pafn: ["33"],
    pagl: ["5433"],
    paioh: ["1"],
    paip: ["n_637", "", "_sm_s"],
    pais: ["h_1133"],
    pak: ["483"], // MGS新
    pako: ["h_1133"], //
    pakx: ["h_1646"], // h_1646+ /
    pale: ["h_491"], // h_491+3
    pamp: ["18"],
    pan: ["12", "", "_sm_s"],
    panp: ["18"],
    pans: ["", "", "_sm_s"],
    pant: ["", "", "_sm_s"],
    papak: ["h_1593"],
    pasf: ["h_1454"],
    pasm: ["h_1651"], // h_1651+ /
    pat: ["118"],
    pkta: ["h_1749"],
    pb: ["h_113"],
    pbb: ["118"],
    pbf: ["436"], //  1种 436开头+3位数
    pbjd: ["h_109"],
    pbpm: ["h_1391"],
    pbs: ["118"],
    pbt: ["5433", "", "_sm_s"],
    pc: ["h_189"], // h_189+ 此系慎入
		pcb: ["118"],
    pcjp: ["h_1391"],
    pck: ["23", "", "_sm_s"],
    pclw: ["h_1391"],
    pcm: ["5"],
    pcwb: ["h_1391"],
    pcxw: ["h_1391"],
    pcxx: ["h_1391"],
    pdc: ["23", "", "_sm_s"],
    pdd: ["24"],
    pdv: ["53"], // 53+
    pear: ["118", "", "_sm_s"],
    ped: ["24"],
    pega: ["118", "", "_sm_s"],
    pel: ["h_001", "", "_sm_s"],
    pen: ["118", "", "_sm_s"],
    pep: [""], // 并入 GVH
    pes: ["h_1664"], //
    pess: ["h_1664"], //
    pet: ["118"],
    pey: ["h_1297"], // h_1297+ /
    pfav: ["", "", "_sm_s"],
    pfck: ["h_406"], // h_406+ /
    pfcl: ["", "", "_sm_s"],
    pft: ["1"],
    pgod: ["5274", "", "_sm_s"],
    phd: ["h_918"], // h_918+
    phmx: ["h_1391"],
    pho: ["h_918"], // h_918+  958 并入MDS/
    phsg: ["504"], // 504+ /
    pia: ["h_254"], // h_254+ /
    pibest: ["1"],
    pidv: ["", "", "", "", "5581dpidv"],
    pih: ["1"],
    pin: ["360"], // mgs新
    pind: ["n_1187"],
    pink: ["h_1391"],
    pira: ["118", "", "_sm_s"],
    pism: ["n_1533"], // n_1533+3
    pist: ["n_1187"],
    pitv: ["n_1187"],
    piyo: ["1"],
    pj: ["h_1094"], // h_1094+ /
		pjam: ["h_1604"],
    pjl: ["23", "", "_sm_s"],
    pjll: ["h_1391"],
    pk: ["h_139"], // h_139+ /
    pkgf: [""], // pkgf指向pkpd
    pkmp: ["84"], // 84+ /
    pkos: ["039"], // mgs新
    plb: ["", "", "_sm_s"],
    plby: ["h_1588"], // h_1588+5 /
    plc: ["23", "", "_sm_s"],
    pld: ["24", "", "_sm_s"],
    plod: ["", "", "_dm_s"],
    pltn: ["h_874"], // h_874+ /
    plus: ["h_1098"], // h_1098+ /
    plvl: ["h_1391"],
    plvo: ["h_1391"],
    ply: ["h_1557"], // h_1557+ /
    plz: ["33", "", "_sm_s"],
    plzb: ["33"], // 33+ /
    pm: ["h_1526"], // h_1526+ /
    pmp: ["5"],
    pmpd: ["77", "", "_sm_s"],
    pmpds: ["77", "", "_sm_s"],
    pms: ["5"],
    pna: ["5"],
    pnch: ["h_803"], // h_803+ /
    pnjm: [""], // h_1094+ h_1614+ 并入 XVSR/
    pnus: ["h_445", "", "_dmb_s"],
    pnvi: ["148", "", "_sm_s"], // 148+ /
    poco: ["h_1133"], // h_1133+ /
    pok: ["534"], // MGS新
		pogx: ["h_1736"],
    pomd: ["h_1718"],
    por: ["h_1140"],
    pore: ["5"],
    porn: ["49"], // 49+ /
    pot: ["77"], // 77+ /
    potyaj: ["h_455", "", "", "re"], // h_455+ 有加后缀和不加后缀两种/
    povr: ["h_1290"], // h_1290+ /
    poxc: ["h_1391"],
    ppa: ["118", "", "_dm_s"],
    ppas: ["18"], // 18+ /
    ppb: ["118", "", "_sm_s"],
    ppbb: ["h_086", "", "_sm_s"],
    ppc: ["118", "", "_sm_s"],
    ppd: ["143"], // 143+ 24+ /
    ppfd: ["", "", "_dm_s"],
    ppft: ["33"],
    ppgd: ["n_650", "", "_dm_s"],
    ppm: ["h_021", "", "_sm_s"], // h_021+ /
    ppmn: ["n_1445"], // n_1445+ /
    ppmnb: [""], // h_706+ n_1445+ 并入THNIB /
    ppn: ["h_189"],
    ppp: ["083"], // MGS新
    ppp: ["118"], // PPP-3位数dmm 4位数mgs
    pps: ["3"], // 3+ /
    ppsf: ["h_1391"],
    ppt: ["118"],
    pptg: ["n_1445"], // n_1445+ /
    pptgb: ["n_1445"], // n_1445+减最后一位 /
    ppud: ["", "", "_dm_s"],
    ppw: ["004"], // mgs新
    ppz: ["563"], // MGS新
    prb: ["118"],
    prbl: ["", "", "_sm_s", "", "23pbl"],
    prbm: ["57"],
    prby: ["n_1334"], // n_1334+ /
    prbyb: ["h_706"], // h_706+5
    prck: ["", "", "_sm_s", "", "23pck"],
    prd: ["118"],
    prdl: ["", "", "_sm_s", "", "23pdl"],
    prdm: ["", "", "_sm_s", "", "23pdm"],
    prdvr: ["118"],
    pre: ["118", "", "_sm_s"],
    prem: ["126"], // mgs新
    prgo: ["594"], // mgs新
    prgs: ["", "", "_sm_s", "", "23pgs"],
    prho: ["", "", "_sm_s", "", "23pho"],
    prjl: ["", "", "_sm_s", "", "23pjl"],
    prlc: ["", "", "_sm_s", "", "23plc"],
    prm: ["h_283", "", "_sm_s"],
    prou: ["n_707"], // n_707+ /
    prp: ["118"],
    prtk: ["23", "", "_sm_s"],
    ps: ["h_113"], // h_113+ /
    pscl: ["h_1391"],
    psd: [""], // 21+ 433+ 并入ISD /
    psdb: ["33"], // 33+ /
    psdk: ["33"], // 33+ /
    psdw: ["h_1391"], // 2种 h_1391+2/5位数
    psdx: ["h_1391"],
    pshd: ["104", "", "_sm_w"],
    psis: ["h_1391"],
    pslp: ["h_1391"],
    pslw: ["h_1391"],
    pssd: ["21"], // 21+ /
    pssp: ["h_1391"],
    psst: ["h_1450"], // h_1450+ /
    pst: ["23"], // 23+ /
    psxa: ["h_1391"],
    ptag: ["h_1391"],
    ptak: ["h_1391"],
    ptav: ["", "", "_sm_s"],
    ptbe: ["h_406"], // h_406+ /
    ptbi: ["h_406", "", "_sm_w"],
    ptfp: ["h_1391"],
    ptkn: ["", "", "_sm_w"],
    ptkx: ["h_1391"],
    ptm: ["h_103"], // h_103+ /
    ptom: ["h_445", "", "_sm_s"],
    ptp: ["042"], // mgs新
    ptpfes: [""], // 同 PFES
    pts: ["h_021"], // h_021+
    ptu: ["h_1727"], // h_1727+3 /
    ptyf: ["h_1391"],
    ptyg: ["h_1391"],
    ptyh: ["h_021"], // h_021+ /
    ptyk: ["h_1391"],
    punu: ["n_650", "", "_sm_w"],
    pupp: ["h_086", "", "_sm_w"],
    pur: ["118", "", "_sm_s"],
    pure: ["1", "", "_sm_s"],
    purin: ["h_496"],
    puw: ["h_113"],
    pvnl: ["", "", "_sm_s", "", "23pnl"],
    pvr: ["118"],
    pvt: ["h_897"], // h_897+ 无
    pwas: ["h_1391"], // h_1391+2
    pwbp: ["h_1391"],
    pwd: ["24"],
    pwdp: ["h_1391"],
    pwfp: ["h_1391"],
    pwn: ["057"], // mgs新
    pwrx: ["h_1391"],
    pxh: ["118"],
    pxhm: ["h_1391"],
    pxhp: ["h_1391"],
    pxlc: ["h_1391"],
    pxsp: ["h_1391"],
    pxv: ["60", "", "_sm_s"],
    pxwr: ["h_1391"],
    pxww: ["h_1391"],
    pydvr: ["h_1321"], //
    pylf: ["h_1391"],
    pym: ["h_283"],
    pypy: ["n_840"], // n_840+ /
    pyu: ["h_1462"], //
    pz: ["", "", "_dm_s", "", "tkpz"],
    pzd: ["24", "", "_sm_s"], // 24+ /
    qass: ["h_089", "", "_sm_s"],
    qbd: ["24", "", "_sm_s"],
    qdn: ["h_205", "", "_sm_s"],
    qha: ["5129", "", "_sm_s", "sm"],
    qhg: [""], // 并入 NATR
    qhp: ["n_1057", "", "_sm_w"],
    qhr: ["13", "", "_sm_s"],
    qhs: [""], // 并入 NATR
    qhx: [""], // 并入 NATR
    qizz: ["h_086"],
    qizzx: ["h_086"],
    qp: ["h_113", "", "_sm_w"], // h_113+ /
    qq: ["13", "", "_dm_s"], // 13+ /
    qqbb: ["h_086", "", "_sm_s"],
    qu: ["23", "", "_sm_s", "d"],
    queen: ["h_687"], // h_687+ /
    r18: ["h_093"], // h_093+ /
    rac: ["h_001", "", "_sm_s"],
    radc: ["18"], // 18+ /
    radd: ["18"], // 18+ /
    rafe: ["h_406"],
    raft: ["h_406"],
    ragi: ["4", "", "_sm_s"],
    rai: ["433"],
    ram: ["436"],
    ran: ["12", "", "_sm_s"],
    rand: ["15", "", "_sm_s"],
    ranjv: ["48"],
    raw: ["118"],
    rba: ["513", "", "_sm_s"], // 513+ /
    rbc: ["h_005", "", "", "ai"],
    rbnr: ["021"], // mgs新
    rcsp: ["", "", "_sm_s"],
    rct: ["1"],
    rctbd: ["", "", "", "", "1rct"],
    rctd: ["1"], // 1+3
    rcts: ["1"],
    rd: ["149"], //  1种 1、149开头+5位数
    rdd: ["118"], //  118+ /
    rddp: ["118"],
    rdamd: ["84", "", "", "ai"],
		rch: ["326"], // mgs新
    rdst: ["h_1392"], // h_1392+ /
    rdt: ["118"], //  2种 1、118+3/5位数
    rdvhj: ["48"], //  2种 1、48+3/5位数
    rdvnj: ["48", "", "_sm_s"], // 48+ /
    re: ["151", "", "_sm_s"], // 151+ /
    reaad: ["24"],
    rebd: ["h_346"], //
    rebn: ["h_254"], // h_254+ /
    rebr: ["9"], // 9+ /
    rebtd: ["2"], // 1种 2开头+5位数
    rec: ["118", "", "_sm_s"], // 118+ /
    reca: ["172", "", "", "ai"],
    red: ["143", "", "_sm_s"], // 143+ /
    reecb: ["2"],
    reexd: ["24"],
    refxd: ["2"],
    regod: ["2"],
    reigx: ["h_1736"],
    reiw: ["383"], // MGS新
    reiwdx: ["383"], // MGS新
    reiwsp: ["383"], // MGS新
    reksd: ["24"],
    relsd: ["24"],
    remtd: ["24"],
    remu: ["", "", "_sm_w", "", "172emu"],
    rena: ["h_491"], // h_491+ /
    renod: ["24"],
    req: ["h_100"], // h_100+ /
    reqbd: ["24"],
    rere: ["h_086", "", "_sm_s"],
    reufd: ["24"], // 24+
    revdd: ["24"],
    revl: ["031"], // mgs新
    rewdi: ["2"], // 2+6
    rey: ["118"],
    rf: ["", "", "", "", "59hf"],
    rff: ["", "", "", "", "59hff"],
    rfg: ["433"], // 433+ /
    rfks: ["h_1452"], // h_1452+ /
    rg: ["dk"], // dk+ /
    rgbh: ["", "", "_sm_s"],
    rgim: ["", "", "_sm_s"],
    rgtv: ["", "", "_sm_s"],
    rgyy: ["", "", "_sm_s"],
    rhe: ["59"], // 59+ she /
    rhav: ["", "", "", "", "h_1472erhav"],
    rimn: ["", "", "_sm_s"],
    rin: [""], // 118+ 143+ 并入NATR /
    ris: ["13", "", "_sm_s"],
    rix: ["118"],
    rjjd: ["h_086", "", "_sm_s"],
    rjk: ["504", "", "_sm_w"], // 504+ /
    rjn: ["118", "", "_sm_s"],
    rjt: ["", "", "", "", "59hjt"],
    rk: ["h_113"], // h_113+ /
    rkc: ["59", "", "_sm_s"],
    rkd: ["383"], // mgs新
    rkm: ["", "", "_sm_s", "", "59hkm"],
    rksk: ["", "", "_dm_s"],
    rman: ["18"], // 18+ /
    rmd: ["61", "", "_sm_w", "ai"], // 61+5 ai
    rmdb: ["", "", "_sm_w", "", "61mdb"],
    rmds: ["61", "", "", "ai"], // 61+5 ai
    rmiad: ["84", "", "", "ai"],
    rmild: ["84", "", "", "ai"],
    rmo: ["118"],
    rmow: ["h_100", "", "_sm_s"], // 并入 OCH /
    rmsq: ["h_1133"],
    rna: ["h_113"], // h_113+ /
    rnb: [""], // 并入OCH /
    rnk: ["59"], // hnk /
    rns: ["n_707"], // n_707+ /
    rnu: ["59"], // 59+ /
    roc: ["59"], // misn
    rod: ["143"], // 143+ /
    rofc: ["e"], // e+
    rofv: ["h_1472e"], // h_1472e+
    rolic: ["504", "", "_sm_w"],
    rokad: ["84", "", "", "ai"],
    roomb: [""], // 暂用 room
    rop: ["433"], // 433+5 /
    ropp: ["5030", "", "_sm_s", "sm"],
    rosd: ["h_086", "", "_sm_s"],
    rose: ["h_676"], // h_676+ /
    rosj: ["031"], // mgs新
    rpd: ["143", "", "_sm_w"],
    rpp: ["118", "", "_dm_s"],
    rre: ["143", "", "_sm_s"],
    rro: ["062"], // mgs新
    rrr: ["77", "", "_sm_s"],
    rrrs: ["77", "", "_sm_s"],
    rrz: ["59"], // msin
    rsa: ["h_405"], // h_405+ /
    rsama: ["h_244"], // h_244+5 ai
    rsb: ["33", "", "_sm_w"],
    rsbx: ["h_355"], // h_355+ /
    rsc: ["59", "", "_sm_s"],
    rscpx: ["h_565"], // msin新
    rsd: ["24"],
    rsdv: ["100", "", "_sm_s"],
    rsino: ["h_210", "", "_sm_w"], // h_210+ /
    rsm: ["59", "", "_sm_s"],
    rss: ["33", "", "_sm_s"],
    rt: ["47"], // 47+5 无
    rtp: ["118"],
    rttk: ["5161"], // 5161+ /
    rtvn: ["18"], // 18+ /
    ruko: ["h_254"], // h_254+ /
    rung: ["h_606"], // h_606+ /
    runn: ["h_086", "", "_sm_w"],
    rus: ["118"],
    rvh: ["13"], // 13+ /
    rvo: ["143", "", "_sm_s"],
    rvy: ["59", "", "_dm_s"],
    rwd: ["24", "", "_sm_w"],
    rwrk: ["172", "", "", "ai"],
    rxd: ["24", "", "_dm_s"],
    ryud: ["h_086", "", "_sm_s"], // h_086+ /
    rzm: ["59"], // MSIN
    sabe: ["h_261", "", "_dm_s"],
    sace: ["1"],
    sacz: ["481"], // MGS新
    sadt: ["h_254", "", "_sm_w"],
    sah: ["h_205"], // h_205+ /
    sai: ["118"],
    sain: ["h_261", "", "_dm_s"],
    sait: ["55"], //
    sajk: ["h_261", "", "_dm_s"],
    saka: ["h_261"],
    sako: ["h_261"],
    saku: ["118"],
    salo: ["84"],
    sama: ["h_244"],
    san: ["h_796"], // 2种 h_796+3/5位数 个别有mgs片源  因易混淆 暂不加
    sank: ["h_086"],
    sans: ["h_1300"],
    saq: ["13", "", "_sm_s"],
    sass: ["h_261", "", "_dm_s"],
    sato: ["h_261", "", "_dm_s"],
    savr: ["h_1241"],
    saw: ["187", "", "_sm_s"],
    sax: ["187", "", "_sm_s"],
    sayu: ["h_261", "", "_dm_s"],
    sbb: ["83", "", "_sm_s"],
    sbci: ["164"],
    sbd: ["143", "", "_sm_s"],
    sbgk: ["n_650", "", "_sm_s"],
    sbhk: ["", "", "_sm_s"],
    sbjn: ["", "", "_sm_s"],
    sbk: ["h_1126"],
    sbkk: ["h_090", "", "_sm_s"],
    sbkr: ["h_395", "", "_sm_w"],
    sbmo: ["n_1044"],
    sbmx: ["60", "", "_sm_w"],
    sbn: ["234"], // mgs新
    sbnc: ["164", "", "_sm_s"],
    sbnr: ["164", "", "", "r"],
    sbt: ["436"], // 436+ /
    sbtt: ["155"], // mgs新
    sbvd: ["n_1155"], // 并入 SW-
    scbb: ["1"],
    scc: ["83", "", "_sm_s"],
    sccc: ["1"],
    scdx: ["h_1655"], // h_1655+
    scer: ["", "", "_sm_s"],
    scg: ["118"],
    sch: ["118"],
    scne: ["n_1064", "", "_dm_s"],
    scnn: ["1"],
    scoh: ["362"], // MGS新
    scpr: ["h_229", "", "_sm_w"],
    scpx: ["84"], //
    scr: ["12"], // 12+3
    sct: ["", "", "_sm_w"],
    scvr: ["h_565"], // VR /
    scx: ["118"],
    sdab: ["1"],
    sdabp: ["1"],
    sdam: ["1"],
    sdca: ["1", "", "_sm_s"],
    sdde: ["1"],
    sddl: ["1", "", "_sm_s"],
    sddm: ["1", "", "_sm_s"],
    sddo: ["1", "", "_sm_s"],
    sdds: ["1", "", "_sm_s"],
    sden: ["1"],
    sdfk: ["1"],
    sdgg: ["1"], //  1种 1开头+3位数
    sdhs: ["1"],
    sdjs: ["1"],
    sdl: ["23", "", "_sm_s"],
    sdmf: ["1"],
    sdmm: ["1"],
    sdms: ["1"],
    sdmt: ["1"],
    sdmu: ["1"],
    sdmua: ["1"],
    sdnd: ["15", "", "_sm_s"],
    sdni: ["1", "", "_sm_s"],
    sdnm: ["1"], // 2 种 1、1+3/5位数
    sdnt: ["1"],
    sdsi: ["1"],
    sdss: ["h_089", "", "_sm_s"],
    sdth: ["1"],
    sdvc: ["1", "", "_sm_s"],
    sdvr: ["118"],
    sdvs: ["1", "", "_sm_s"],
    sdw: ["187", "", "_sm_s"],
    sdz: ["1"],
    se: ["h_113", "", "_sm_w"],
    seed: ["52"], // 52+ /
    sehv: ["h_090", "", "_sm_s"],
    sei: ["502"], // MGS新
    sek: ["118", "", "_sm_w"],
    sekm: ["", "", "_sm_s"],
    seljv: ["062"], // mgs新
    semm: ["h_1422"], // h_1422+ /
    sena: ["h_261", "", "_sm_s"],
    send: ["15", "", "_sm_s"],
    senj: ["031"], // mgs新
    senl: ["031"], // mgs新
    senn: ["1"],
    senz: ["h_086", "", "_sm_w"],
    seo: ["td016"], // td016+ /
    sepvr: ["h_1285"], // VR
    ses: ["057"], // MGS新
    sesp: ["h_1153", "", "_sm_s"],
    sev: ["181"], // MGS新
		seven: ["1"],
    sex: ["148"], // mgs新
    sexy: ["h_697"], // h_697+ /
    sfd: ["24"],
    sfk: ["118"],
    sflb: ["138", "", "_sm_w"],
    sfx: ["187", "", "_sm_s"],
    sg: ["49", "", "", "r"],
    sga: ["118"], // 118+3位数
    sgb: ["", "", "_sm_s"],
    sgcr: ["h_068", "", "_sm_s"],
    sgcrs: ["h_315"], // 此系列无预告片
    sgd: ["24", "", "_sm_w"],
    sgdv: ["49", "", "_sm_w"],
    sgg: ["h_113"], // 1种 h_113+3位数
    sgk: ["483"], // MGS新
    sgki: ["1"],
    sgkx: ["h_1575"], //
    sgkz: ["h_1575"], // h_1575+ /
    sgm: ["143"], // 143+5
    sgmp: ["h_217", "", "_sm_s"],
    sgot: ["h_261", "", "_sm_s"],
    sgq: ["13", "", "_dm_s"],
    sgsd: ["h_068", "", "_sm_s"],
    sgsr: ["57"], //
    sgsx: ["57"],
    sgt: ["h_848"], // h_848+ /
    sgv: ["13"], // 13+ /
    shak: ["n_650"], // n_650+ /
    she: ["59"], // she 变  rhe
    shed: ["104", "", "_sm_s"],
    shem: ["h_697"], // h_697+ /
    shgl: ["", "", "_sm_w"],
    shh: ["1"], // 1种 1+5位数
    shi: ["15", "", "_sm_s"],
    shib: ["h_646", "", "_dm_s"],
    shibp: ["n_1448"], // n_1448+ /
    shibpb: ["n_1448"], // n_1448+  去除最后的b /
    shic: ["h_839"], // 1种 h_839+3位数
    shig: ["h_261", "", "_sm_s"],
    shim: ["18", "", "_sm_s"],
    shin: ["422", "", "_sm_s"],
    shind: ["h_1560"], //
    shj: ["52"], // 52+ /
    shl: ["133"], // mgs新
    shm: ["h_687"], //
    shma: ["", "", "_sm_s"],
    shmj: ["581"], // MGS新
    shn: ["1"], // 1种 1+5位数  素人 mgs也有对应资源
    sho: ["123"], // mgs新
    shot: ["h_261"], // h_261+ /
    shpdv: ["062"], // mgs新
    shrk: ["h_687"], // h_687+ /
    shrkv: ["h_687"], // h_687+ /
    shs: ["118", "", "_sm_s"],
    shsk: ["h_1741"],
    shun: ["h_254"], // h_254+ /
    shw: ["187", "", "_sm_s"],
    shyn: ["1"],
    sib: ["", "", "_sm_w"],
    sid: ["", "", "_dm_w"],
    sih: ["h_205"], // h_205+ /
    sihb: ["h_1664"], // h_1664+3
    siko: ["126"], // mgs新
    silk: ["1"], // 1+5 /
    silkbt: ["1"], // 1+5 /
    silkc: ["1"], // 1种 1+5位数
    silks: ["1"],
    silku: ["1"],
    sim: ["118"],
    simm: ["345"], // MGS新
    sin: ["118"],
    sip: ["h_1688"],
    siror: ["h_1492"], // h_1492+ /
    sis: ["12"], // 12+
    sit: ["118"],
    sitb: ["30"], // 30+ /
    siv: ["118"],
    sizn: ["h_261", "", "_sm_s"],
    sjj: ["h_1292"], // h_1292+ /
    sjkj: ["h_445", "", "_sm_w"],
    simd: ["345"], // mgs新
    sjmn: ["h_445", "", "_sm_s"],
    sjok: ["h_086", "", "_sm_s"],
    sk: ["h_113"], // h_113+ /
    ska: ["118"],
    skbc: ["n_1515"], // n_1515+ /
    skde: ["434", "", "_sm_w"],
    skdv: ["h_179", "", "_sm_w"],
		skgc: ["h_1741"],
    skj: ["33", "", "_sm_s"],
    skjk: ["368"], // MGS新
    skkk: ["h_086"],
    skm: ["h_606"], // h_606+ /
    skmj: ["h_1324"], //
    skmjf: ["h_1324"], // h_1324+ /
    skms: ["h_1133"], // h_1133+ /
    skot: ["235"], // mgs新
    sks: ["83", "", "_sm_s"],
    sksj: ["", "", "_sm_s"],
    sksk: ["118"],
    skss: ["h_086"],
    skstd: ["h_086", "", "_sm_s"],
    skwd: ["24"],
    sl: ["h_113"], // h_113+ /
    slba: ["187", "", "_sm_s"],
    slbb: ["187", "", "_sm_s"],
    sld: ["143", "", "_sm_s"],
    slg: ["118"],
    slk: ["118", "", "_sm_s"],
    sln: ["h_113"], //  h_113+5
    slr: ["h_1539"], // h_1539+5 VR
    slro: ["n_1445"], // n_1445+ /
    slt: ["n_650", "", "_sm_w"],
    slvr: ["366"], // mgs新
    slx: ["187", "", "_sm_s"],
    sm: ["h_113"], // h_113+ /
    smae: ["h_261", "", "_sm_s"],
    smb: ["33", "", "_sm_s"],
    smd: ["143"], // 143+ /
    smdy: ["h_1454"], //
    sme: ["83", "", "_sm_s"],
    smho: ["h_656"], // h_656= /
    smile: ["h_491"], // h_491+ /
    smj: ["057"], // mgs新
    smkcx: ["h_1719"], // h_1719+ /
    sml: ["23", "", "_sm_s"],
    smmy: ["15"], // 15+ /
    smow: ["h_100", "", "_sm_s"],
    smpd: ["104", "", "_sm_w"],
    smr: ["534"], // MGS新
    smw: ["187", "", "_sm_s"],
    sn: ["52"], // 52+ /
    sna: ["057"], // mgs新
    snad: ["", "", "_dm_s"],
    snb: ["390"], // MGS新
    snb: ["390"], // mgs新
    sncd: ["", "", "_sm_s"],
    snd: ["h_205"], // h_205+ /
    snfd: ["", "", "_dm_s"],
    snk: ["118"],
    snkh: ["h_687"], //
    snkp: ["h_687"], // h_687+ /
    sno: ["h_1540"], // h_1540+ /
		snog: ["h_1540"],
    snwd: ["", "", "_dmb_s"],
    snyd: ["", "", "_dmb_s"],
    so: ["h_113"], // h_113+ /
    sods: ["1"], // 1+5 /
    soh: ["326"], // mgs新
    soj: ["031"], // mgs新
    soku: ["18"], // 18+ /
    solo: ["h_213"], // h_213+ /
    some: ["h_261", "", "_sm_s"],
    son: ["49"], // 49+ /
    sop: ["h_113"], // h_113+ /
    sor: ["118"],
    sos: ["h_186"], // h_186+ /
    soud: ["326"], // mgs新
    soul: ["h_086"],
    soulx: ["h_086"],
    sov: ["13"], // 13+ /
    span: ["33"], // 33+ /
    spak: [""], // 新系列 仅1 后期观察
    spc: ["118", "", "_sm_s"],
    spdr: ["n_1154"], // n_1154+ /
    spe: ["", "", "_sm_s"],
    spee: ["", "", "_sm_w"],
    spivr: ["554"], // mgs新
    spjk: ["h_286"], // h_286+ /
    spl: ["33", "", "_sm_s"],
    sply: ["1"],
    spm: ["118", "", "_sm_s"],
    spnd: ["", "", "_dm_s"],
    spo: ["h_113"], // h_113+
    sprd: ["18"], //  2种 1、18+3/5位数
    spro: ["h_1594"], //
    spsa: ["h_173"], // h_173+ /
    spse: ["187"], // 187+ /
    spye: ["h_1000"], // h_1000+
    spz: ["h_254"], //
    spzp: ["h_254"], // h_254+ /
    sqes: ["144"], // mgs新
    sqf: ["057"], // mgs新
    sqset: [""], // msin
    sqv: ["13"], // 13+ /
    sqvr: ["366"], // mgs 新
    sr: ["", "", "_dm_s"],
    sra: ["83", "", "_sm_s"],
    sreal: ["n_1155"], // n_1155+ /
    srebnd: ["24"],
    srg: ["118", "", "_sm_s"],
    srk: ["118", "", "_sm_w"],
    srkt: ["5377"], // 5377+ /
    srnj: ["050"], // mgs新
    srr: ["118", "", "_sm_s"],
    srs: ["118"],
    srsr: ["196"], // mgs 新
    srtd: ["324"], // MGS新
    srtj: ["h_1472", "", "_sm_w"],
    srttc: ["248"], // mgs 新
    srxv: ["60"], // 60+ msin /
    srya: ["417"], // MGS新
    ss: ["13"], // 13+3
    ssgd: ["57", "", "_sm_s"],
    ssgk: ["h_445", "", "_sm_s"],
    sshn: ["1"], // 1种 1+3位数 /
    sshnbd: ["1"], // 1+ 去掉bd /
    ssm: ["h_113"], // h_113+ /
    ssnd: ["h_205", "", "", "a"],
    ssp: ["h_113"], // h_113+ /
    sspo: ["h_261", "", "_sm_s"],
    ssr: ["h_746"], // h_746+ /
    ssrd: ["47"], // msin
    sss: ["1", "", "_sm_s"],
    sst: ["118", "", "_sm_s"],
    ssy: ["h_113", "", "_sm_s."],
		stagcn: ["h_1776"],
    stanzd: [""], // 此番系列似同 anzd 指向的预览地址混乱 调用msin播放页
    stapod: [""], // misn
    star: ["1"], //  2 种 1、1开头+3/5位数
    starbd: [""], // 1+ 去掉bd 同star /
    starg: ["36"], // 36+ /
    stars: ["1"], //  2 种 1、1开头+3/5 /
    starsbd: ["1"], // 1+ 去掉bd 同stars /
    stav: ["118"],
    start: ["1"],
    stcesd: [""], // 此番系列似同 cesd 指向的预览地址混乱 调用msin播放页
    std: ["433"], // 433+ /
    ste: ["23", "", "_sm_s"],
    stemaz: [""], // 此番系列似同 emaz 指向的预览地址混乱 调用msin播放页
    stf: ["h_1726"], // h_1726+
    stfj: ["5141"], // 5141+ /
    stfr: ["118", "", "_sm_s"],
    sthp: ["h_173"], // h_173+ /
    stjk: ["h_1663"], //
		stjrjb: ["h_1776"],
    stkm: ["168"], // mgs新
    stko: ["1"], // 1+5位数
    stln: ["", "", "_sm_s"], //
    stm: ["h_286"], // h_286+ /
    stoc: ["h_128", "", "_dm_s"],
    stpp: ["", "", "_sm_s"],
    stsg: ["h_113"], // h_113+ /
    stsk: ["h_1605"], //
    stss: ["h_113"], // h_113+ /
    sttcd: [""], // MSIN
    stvf: ["h_1472"],
    stvhj: ["48"], // 48+ /
    styn: ["118"],
    suam: ["h_254", "", "_sm_w"],
    sub: ["118"],
    suda: ["h_237"], // h_237+
    sufu: ["h_261", "", "_sm_s"],
    sugad: ["h_086", "", "_sm_s"],
    suk: ["33", "", "_sm_s"],
    suke: [""], // h_1711/h_1760 并入ADK
    sukm: ["n_650", "", "_sm_w"],
    sun: ["1"], // 1+3位数
    suns: ["h_213"], // h_213+3位数
    sunset: ["1"],
    supa: ["h_244"], //
    sups: ["h_150", "", "_sm_s"],
    suss: ["h_237"], // h_237+ /
    suwk: ["1"],
    svbd: ["n_709"], // n_709+ 特殊番号 AA /
    svbgr: ["1"],
    svcao: ["112"], // mgs新
    svd: ["24"],
    svdvd: ["1"],
    svf: [""], // mgs 新
		svgal: ["1"],
    svmgm: ["1"],
    svn: ["h_1294"], //
    svnnp: ["1"],
    svoks: ["1"],
    svomn: ["1"],
    svre: ["112"], // mgs新
    svsha: ["1"],
    svsha: ["112"], // MGS新
    svv: ["118", "", "_sm_s"],
    svvrt: ["1"], //  2种 1开头+3/5位数
    sxar: ["5433"], // 5433+3
    sxbd: ["", "", "_dm_s"],
    sxma: ["h_1133"],
    sxvd: ["", "", "_dm_s"],
    sy: ["h_113"], //
    sys: ["332"], // mgsx新
    sybi: ["1"],
    syd: ["", "", "_sm_w"],
    syk: ["h_113"], // h_113+5
    syo: ["h_405", "", "_sm_w"],
    syun: ["148", "", "_sm_s"],
    sze: ["33", "", "_sm_s"],
    szks: ["18"], // 18+ /
    szm: ["171"], // 171+ /
    szr: ["118"],
    t28: ["55"],
    t38: ["55"],
    t: ["55"], // 55+ /
    tact: ["n_840"], // n_840+ /
    tabf: ["", "", "", "", "118abf"],
    tad: ["h_918"], // h_918+ /
    tag: ["118", "", "_sm_s"],
    tai: ["118"],
    tak: ["h_286"], // h_286+ /
    taked: ["h_086", "", "_sm_s"],
    tama: ["h_254"], // h_254+ /
    tamas: ["h_254"], // h_254+ /
    tamm: ["h_771"],
    tamo: ["h_771"],
    tamz: ["h_771"],
    tan: ["126", "", "_sm_s"],
    tank: ["h_086"],
    tap: ["118"],
    tara: ["h_086", "", "_sm_s"],
    tard: ["18"], // 18+ /
    tatb: ["h_491"], // h_491+ /
    tb: ["h_1231"], // h_1231+ /
    tbak: ["h_254"], // h_254+ /
    tbb: ["h_173"], // h_173+ /
    tbd: ["12"], // 12+ /
    tbkr: ["h_275"],
    tbl: ["118"],
    tbtb: ["49"], // 49+ /
    tbw: ["h_173"], // h_173+2 /
    tcm: ["5"],
    tdan: ["h_1133"],
    tdas: ["h_275"],
    tdbc: ["h_275"],
    tdbr: ["h_275"],
    tdbt: ["h_275", "", "_sm_s"],
    tdco: ["h_275"],
    tdd: ["h_275"],
    tder: ["h_1133"],
    tdgs: ["h_275", "", "_sm_s"],
    tdil: ["h_275", "", "_sm_s"],
    tdjk: ["h_275", "", "_sm_s"],
    tdjm: ["h_275", "", "_sm_s"],
    tdmj: ["h_275", "", "_sm_s"],
    tdmn: ["h_491"], // h_491+3
    tdr: ["497"], // 497+ /
    tds: ["118", "", "_sm_s"],
    tdsb: ["h_275", "", "_sm_s"],
    tdss: ["h_275"],
    tdsu: ["h_139"], // h_139+ /
    tdt: ["118", "", "_sm_w"],
    tdtc: ["h_275", "", "_sm_s"],
    tdtd: ["171", "", "_sm_s"],
    te: ["h_880"], // h_880+ /
    tejo: ["h_128", "", "_dm_s"],
    teko: ["h_128", "", "_sm_s"],
    tem: ["118"],
    tenc: ["1"],
    teng: ["h_1133"], // h_1133+ /
    tenh: ["h_086"],
    tenk: ["h_445", "", "_sm_s"],
    tenn: ["h_491"], // h_491+3
    tenv: ["h_1542"], // h_1542+ /
    tenx: ["h_1542"], // h_1542+ /
    tenz: ["h_254"], // h_254+ /
    ter: ["23", "", "_sm_s", "d"],
    tera: ["18"], // 18+ /
    tfg: ["497"], // 497+ /
    tfh: ["23", "", "_sm_s"],
    tfr: ["13"], // 13+ /
    tg: ["h_1304"], // h_1304+ /
    tgav: ["118"],
    tgbe: ["157"], // mgs新
    tggp: ["h_173"],
    tgni: ["", "", "", "", "118gni"],
    tgrx: ["", "", "_dmb_s"],
    tgs: ["111"],
    tgym: ["h_491"],
    th: ["h_1094"],
    thal: ["18"],
    thdd: ["15", "", "_sm_s"],
    thnd: ["84"], // 84+ /
    thni: ["n_1445"],
    thp: ["h_173"],
    thr: ["118", "", "_dm_s"],
    ths: ["118"],
    thth: ["84"], // 84+5 /
    thtp: ["322"], // MGS新
    thz: ["h_173"], // h_173+3 /
    tia: ["039"], // mgs新
    tichk: ["", "", "", "", "h_1681ichk"],
    tid: ["24"], // 24+3 /
    tifj: ["h_081", "", "_sm_w"],
    tig: ["n_863"], // n_863+3 /
    tiger: ["h_1540"], // h_1540+5 /
    tin: ["h_728"], // h_728+3 /
    tit: ["057"], // mgs新
    titi: ["h_1136"], // h_1136+5 /
    tjk: ["h_1072"], // h_1072+ /
    tjt: ["118"],
    tk: [""], // tktk /
    tkbn: ["h_254", "", "_sm_w"],
    tkbr: ["", "", "", "", "h_1712kbr"],
    tkbt: ["18", "", "_sm_s"],
    tkds: ["", "", "", "a"],
    tkdv: ["53"], // 53+ /
    tki: ["h_286"], // h_286+3 /
    tkj: ["118", "", "_sm_w"],
    tkmxbd: ["h_068"], // h_068+ 去掉 tf 同 mxbd /
    tko: ["433"], // 433+5 /
    tkou: ["h_491"], // h_491+3
    tkpr: ["383"], // mgs新
    tks: ["118"],
    tkt: ["075"], // mgs新
    tkw: ["057"], // mgs新
    tkws: ["", "", "_sm_w"],
    tky: ["118", "", "_dm_s"],
    tldc: ["1"],
    tldsp: ["1"],
    tls: ["118"],
    tlso: ["18", "", "_sm_w"],
    tmam: ["h_452", "", "_sm_w"],
    tmani: ["h_452", "", "_sm_w"],
    tmat: ["149", "", "_sm_w"],
    tmcy: ["h_452", "", "_sm_s"],
    tmdi: ["h_452"],
    tmem: ["h_452"],
    tmga: ["", "", "_sm_w"],
    tmgc: ["", "", "_sm_s"],
    tmge: ["", "", "_sm_w"],
    tmgi: ["", "", "_sm_s"],
    tmgk: ["", "", "_sm_s"],
    tmgm: ["", "", "_sm_w"],
    tmgt: ["", "", "_sm_w"],
    tmgu: ["", "", "_sm_w"],
    tmgv: ["h_1350"],
    tmgx: ["h_1350"],
    tmgy: ["", "", "_sm_s"],
    tmhk: ["49"], // 49+5 /
    tmhp: ["h_452"], // h_452+3/5位数
    tmm: ["h_580"], // h_580+5 /
    tmms: ["149", "", "_dm_s"],
    tmrd: ["149"], // 149+ TMRD 去掉tm
    tms: ["h_580"], // h_580+5 /
    tmsb: ["h_452"],
    tmvi: ["h_452"], // h_452+3/5位数
    tmwd: ["15", "", "_sm_s"],
    tmy: ["h_580"], // h_580+5
    tmyt: ["149", "", "_sm_s"],
    tnd: ["24"], // 24+3 /
    tnh: ["h_1126"], // h_1126+2 /
    tnik: ["h_1133"],
    tnns: ["", "", "_dm_s"],
    tnsd: ["171", "", "_sm_w"],
    tnspd: ["h_086", "", "_sm_s"],
    tnss: ["h_086"], // h_086+5 /
    tnt: ["h_1543"], // h_1543+5 /
    tntn: ["h_086"], // h_086+3 /
    tobd: ["h_128", "", "_sm_s"],
    toc: ["", "", "_sm_s"],
    tod: ["24", "", "_sm_w"],
    toen: ["h_086"], // h_086+2~5
    toenx: ["h_086"], // h_086+2~5 无
    tog: ["118", "", "_sm_s"],
    tok: ["h_086"],
    toki: ["h_1347"],
		tonv: ["h_1719"],
    top: ["h_208", "", "_sm_s"],
    tor: ["118"],
    torg: ["h_771"],
    torx: ["h_771"],
    toss: ["18"],
    tot: ["422", "", "_sm_s"],
		totk: ["h_1133"],
    totte: ["1"],
    toul: ["031"],// MGS新
    tpp: ["h_687"], // h_687+3 /
    tpy: ["h_254"], // h_254+5 /
    tr: ["h_125"], // h_125+5
    trac: ["n_1155"],
    tract: ["n_1155"],
    trct: ["1"], // 1+5 /
    trd: ["118"], //  1种 118开头+3位数
    tre: ["118"],
    trf: ["h_1072"],
    trgl: ["", "", "_sm_s"],
    tri: ["118"],
    tric: ["18"],
    trm: ["h_1072"],
    trnd: ["15", "", "_sm_s"],
    trubm: ["305"], // MGS 新
    truex: ["305"], // MGS新
    trumg: ["305"], // MGS新
    truwa: ["305"], // MGS新
    trvo: ["h_1072"],
    trx: ["483", "", "_sm_s"],
    ts: ["h_921"], // h_921+3 /
    tsb: ["235"], // MGS新
    tsbs: ["n_701"], //
    tsd: ["111", "", "_dmb_s"],
    tsds: ["n_701"], // n_701+5 /
    tsdv: ["5664"], // 5664+5 /
    tsnd: ["h_491"], // h_491+5 /
    tskjk: ["", "", "", "", "h_1681skjk"],
    tspx: ["", "", "_dmb_s"],
    tsr: ["h_1072"],
    tsv: ["118"],
    tsx: ["h_405"], // h_405+2 /
    tt: ["13", "", "_dm_s"],
    ttd: ["24"], // 24+5 /
    ttjb: ["", "", "_dm_s"],
    ttkk: ["49"], // 49+5 /
    ttre: ["235"], // MGS新
    ttyu: ["h_254"], // h_254+ /
    tue: ["12"], // 12+3
    tuma: ["", "", "_dm_s"],
    tuk: ["h_1712"],
    tus: ["118"],
    tuu: ["", "", "_sm_s"],
    tvs: ["33", "", "_sm_s"],
    twbb: ["155"], // MGS新
    twl: ["118", "", "_sm_w"],
    two: ["h_1214"], // 1种 h_1214+5位数
    txxd: ["36", "", "_sm_s"], // 36+2 /
    ty: ["h_113"], // h_113+5 /
    tyd: ["24"],
    tyk: ["041"], // MGS新
    tym: ["118"],
    tynd: ["", "", "_dmb_s"],
    tyoc: ["62", "", "_sm_s"],
    tzz: ["235"], // MGS新
    uaau: ["h_086"],
    uad: ["118", "", "_sm_s"],
    ub: ["h_113", "", "_dmb_s"],
    uby: ["118", "", "_sm_s"],
    uchd: ["h_086", "", "_sm_s"],
    ud: ["125", "", "", "r"], // 125+3 ud变umd MSIN /
    udak: ["h_254"], // h_254+3 /
    ufd: ["24"], // 24+5 /
    ugss: ["18", "", "_dmb_s"],
    ugug: ["18", "", "_dmb_s"],
    uh: ["61", "", "", "ai"],
    uinav: ["h_1472"],
    ukdf: ["23"], // 23+5 /
    ukh: ["h_1600"], //
    uktk: ["", "", "_dmb_s"],
    ult: ["118"],
    ulx: ["13", "", "_sm_s"],
    umad: ["84"], // 84+5 /
    umi: ["118"],
    umma: ["", "", "_sm_w"],
    under: ["", "", "_sm_w"],
    undg: ["1"],
    unps: ["h_593"], // h_593+5 /
    upld: ["18", "", "_sm_w"],
    upsf: ["h_150", "", "_dm_s"],
    upsm: ["h_150", "", "_dm_s"],
    urab: ["", "", "_dmb_s"],
    uras: ["", "", "_dmb_s"],
    urde: ["h_593"],
    urdt: ["h_593"],
    urfd: ["118"],
    urps: ["h_593"], // h_593+5 /
    urpw: ["", "", "_sm_w"],
    ursh: ["h_593", "", "_sm_w"],
    urvk: ["h_593", "", "_sm_w"],
    ury: ["118"],
    usbc: ["33"], // 33+5 /
    usd: ["118", "", "_sm_s"],
    usod: ["15", "", "_sm_s"], // 15+2 /
    ussh: ["326"],
    uta: ["h_189"], // h_189+5
    ute: ["118", "", "_sm_s"],
    utm: ["13"], // 13+5 /
    utsu: ["279"], // MGS新
    uuru: ["h_086", "", "_sm_w"],
    uwki: ["583"], // MGS新
    ux: ["61", "", "", "ai"],
    uzu: ["h_1716"], // h_1716+ /
    vahe: ["h_086", "", "_sm_w"],
    val: ["12"], // 12+5 /
    van: ["h_859"], // h_859+5
    vandr: ["42"], // 42+5
    var: ["2"],
    varm: ["11"], // 11+5
    vbh: ["050"], // MGS新
    vdd: ["24"], //  2种 24+3/5 /
    vdf: ["050"], // MGS新
    veas: ["80", "", "_sm_s", "sm"],
    ved: ["143", "", "_sm_s"],
    veen: ["h_086"], // h_086+5 /
    veenx: ["h_086"], // h_086+5 /
    vepd: ["80", "", "_sm_s", "sm"],
    verus: ["h_697"], // h_697+5 /
    very: ["h_491"], // h_491+5 /
    ves: ["", "", "_sm_w"],
    vex: ["", "", "_sm_w"],
    vf: ["49", "", "_sm_s"],
    vfdv: ["49", "", "_sm_s"],
    vgd: ["h_172"], // h_172+5
    vgq: ["13"], // 13+5 /
    vgs: ["143"], // 143+5 /
    viaa: ["h_086"], // h_086+5 /
    vikg: ["h_254"], // h_254+3 /
    vio: ["h_189"], // h_189+5 //
    vipd: ["62", "", "_sm_s"],
    vips: ["h_261", "", "_sm_s"],
    vis: ["49", "", "_sm_w"],
    vixbm: ["57"], // 57+5 /
    vixn: ["h_1588"], // h_1588+5 /
    vizd: ["", "", "_dm_s"],
    vnds: ["h_1664"], // h_1664+5 /
    vntg: ["h_1566", "", "_mhb_s"],
    vobb: ["1"], // 1+5 /
    voc: ["", "", "_sm_w"],
    vol: ["h_205", "", "_sm_s"],
    vola: ["536"], // MGS新
    vorm: ["h_1127"],
    vosf: ["h_1127"], // VR
    vosm: ["h_1127"],
    votan: ["1"],
    vov: ["h_1350"], //
    vovs: ["h_1127"], // h_1127+5  VR /
    vpc: ["118"],
    vrgc: ["1"],
    vrkm: ["84"], //
    vrnc: ["1"],
    vrpn: ["h_898"],
    vrtm: ["h_910"], // h_910+ /
    vrvr: ["h_910"], // h_910+5 VR /
    vrxm: ["077"], // MGS新
    vrxs: ["h_898"], // h_898+5 /
    vrxss: ["h_898"],
    vrxsvr: ["42"], // VR /
    vsed: ["h_1060"], // h_1060+5 /
    vspa: ["031"], // MGS新
    vspd: ["", "", "_dm_s"],
    vti: ["h_405"], // h_405+/
    vto: ["118"],
    vvp: ["118"],
    vvpn: ["111", "", "_dm_s"],
    vwd: ["111", "", "_dm_s"],
    wa: ["h_047"],  //
    wab: ["3"],
    wabb: ["h_1643"], // h_1643+  VR
    waka: ["", "", "_sm_s"],
    walu: ["h_1564"],
    wan: ["h_254", "", "_sm_w"],
    wap: ["118", "", "_dm_w"],
    war: ["h_1564"],
    warc: ["2"],
    was: ["h_047"],
    wat: ["118"],
    wawa: ["1"],
    wb: ["h_113", "", "_sm_s", "r"],
    wbls: ["33"],
    wbmd: ["33"],
    wbmk: ["171"],
    wbtk: ["171"],
    wbw: ["h_848"],
    wcd: ["13"],
    wcsd: ["13"],
    wdc: ["118"],
    wdd: ["24"],
    wdi: ["2"],
    wed: ["28"],
    wei: ["118"],
    wep: ["118"],
    wf: ["3"],
    wfr: ["2"],
    wfs: ["3"],
    wh: ["15"],
    whan: ["h_706"],
    when: ["h_803"],
    whx: ["h_849"],
    why: ["118"],
    wid: ["15"],
    wif: ["005"], // MGS新
    wife: ["18"],
    wil: ["118"],
    will: ["h_086"],
    wing: ["57"],
    wka: ["118"],
    wkd: ["2"],
    wks: ["031"], // MGS新
    wlt: ["540"],
    wn: ["h_113"],
    wnes: ["196"], // MGS新
    wnxg: ["h_254"],
    wny: ["h_848"],
    wo: ["1"],
    wond: ["h_086"],
    world: ["h_227"], //无
    wow: ["h_227"], //无
    wowo: ["h_227"], //无
    wpc: ["118"],
    wpe: ["540"],
    wplvr: ["2"],
    wpom: ["2"],
    wps: ["118"],
    wpsl: ["h_1639"],
    wpsvr: ["2"],
    wpw: ["2"],
    wrc: ["3"],
    wrdj: ["n_1445"],
    wrdjb: ["n_1466"],
    wrg: ["540"],
    wrm: ["504"],
    wsd: ["3"],
    wse: ["3"],
    wshd: ["104"],
    wsnw: ["49"],
    wsot: ["h_114"],
    wsp: ["2"],
    wss: ["2"],
    wssr: ["57"], // 57+5 mgs对应资源
    wstd: ["15"],
    wtk: ["1"],
    wtm: ["057"], // mgs新
    wvr4k: ["h_1290"],
    wvr6d: ["h_1337"], // h_1337+ VR /
    wvr: ["h_1337"],
    wwd: ["143"],
    wwf: ["2"],
    wwk: ["2"],
    wwt: ["2"],
    www: ["2"],
    wwy: ["2"],
    wwz: ["2"],
    wza: ["h_205"],
    wzen: ["2"],
    wzenvr: ["2"],
    xdo: ["118"],
    xjr: ["118", "", "_sm_s"],
    xkk: ["13"],
    xmm: ["13"],
    xmom: ["h_086"],
    xox: ["h_1472"],
    xv: ["60"],
    xymk: ["h_1133"],
    ya: ["h_1651"],
    yako: ["h_1133"],
		yal: ["h_127"], // YAL有很多带字母后缀的番号，后期再处理
    yaria: ["1"],
    ymtk: ["h_525"],
    yob: ["h_113"],
    yoch: ["h_086"],
    yrh: ["118"],
		ysad: ["540"],
    ysn: ["h_127"],
    yst: ["540"],
    yrk: ["118"],
    ytr: ["h_127"],
    yurd: ["n_650"],
    yzf: ["118"], // 118+5 MGS待独开
    zax: ["h_720"],
    zeaa: ["h_086"],
    zen: ["057"], // mgs新
    zmar: ["h_237"],
    zmen: ["h_1371"],
    zooo: ["h_1515"],
    zozo: ["1"],
    zrc: ["099"], // mgs新
  };
  /**
   * 左则补零
   * @param num
   * @param len
   * @returns {*}
   */
  function format_zero (num, len) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
  }
  class Request {
    constructor() {
      this.lock = [];
    }
    send (url, successCallback) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        let index = _this.lock.indexOf(url);
        if (index === -1) {
          _this.lock.push(url);
          GM_xmlhttpRequest({
            url,
            method: 'GET',
            headers: {
              "Cache-Control": "no-cache"
            },
            timeout: 30000,
            onload: function (response) {
              console.log(url + ' success');
              _this.lock.splice(index, 1);
              resolve(response);
            },
            onabort: (e) => {
              console.log(url + " abort");
              reject("wrong");
            },
            onerror: (e) => {
              console.log(url + " error");
              console.log(e);
              reject("wrong");
            },
            ontimeout: (e) => {
              console.log(url + " timeout");
              reject("wrong");
            },
          });
        } else {
          reject("发送请求ing");
        }
      }).then(function (response) {
        successCallback(response);
      }, function (err) {
        console.log(err)
      });
    }
  }
  class Base {
    addVideo (code, obj) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let vSeries = codeArr[0].toLowerCase(); // 番号系列
      let videoSeries = codeArr[0].replace("MSFHBD", "MSFH").replace("SSHNBD", "SSHN").replace("STARBD", "STAR").replace("STARSBD", "STARS").replace("TKIDBD", "IDBD").replace("TKMXBD", "MXBD").replace("BDCLB", "CLB").replace("TMRD", "RD").replace("GRABD", "GRACE").replace("PKGF", "PKPD").replace("BUNF", "DUNF").replace("BUNF", "DUNF").toLowerCase(); //grabd更换为grace
      let videoNo = format_zero(codeArr[1], 5); //不足5位数补0
      let videoOne = codeArr[1].substring(codeArr[1].length - 1); // 数字截取后1位
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2); // 数字截取后2位
      let videoThree = codeArr[1].substring(codeArr[1].length - 3); // 数字截取后3位
      let videoThrBu = format_zero(codeArr[1], 3); // 1位或2位补足3位 区别与直接截取后3位
      let videoFour = format_zero(codeArr[1], 4); //不足4位数补0
      let videoSix = format_zero(codeArr[1], 6); //不足6位数补0
      let videoSerFour = videoSeries.substr(0, 4); // 番号截掉最后1位
      let idNum = codeArr[1];
      let postfix = "_dm_w"; // 3(分辨率默认定于为 _dmb_w 和 _dm_w,此两项无需在对象列表声明)
      let chehz = ""; // 4(车牌后缀)此项定义来源:大部分完整车牌都有固定规律,但还是出现了个别番号系列在完整车牌后还加了个别字母 例如:a_dmb_w.mp4\re_dmb_w.mp4等特殊规则，有人会问为什么不加入postfix中，细心的会发现这个字母还会再上级路径出现，所以特别摘出来定义。后期会逐渐在对象列表添加，删除下面的特例规则。
      let cheqz = ""; // 1(车牌前缀)
      let ling = ""; // 空值null,避免undefine
      let kong = ""; // 空值null,避免undefine
      if (fanxi[videoSeries]) {
        cheqz = fanxi[videoSeries][0] ? fanxi[videoSeries][0] : cheqz;
        chehz = fanxi[videoSeries][3] ? fanxi[videoSeries][3] : chehz;
        postfix = fanxi[videoSeries][2] ? fanxi[videoSeries][2] : postfix;
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        ling = fanxi[videoSeries][1] ? fanxi[videoSeries][1] : kong;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries + ling;
        if (videoSeries.length == 1) { videoSeries = fanxi[videoSeries][0] + videoSeries + codeArr[1].substr(0, 2); }
        else if (videoSeries.length == 2) { videoSeries = fanxi[videoSeries][0] + videoSeries + codeArr[1].substr(0, 1); }
      } else {
        idNum = "00" + idNum;
      }
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      //let videoUrl666 = ' + avsrc + ';
      if (code.indexOf('HEYZ') !== -1) {
        videoUrl = 'https://www.heyzo.com/contents/3000/' + codeArr[1] + '/heyzo_hd_' + codeArr[1] + '_sample.mp4'
      }
      if (code.indexOf('HEYZO') !== -1) {
        videoUrl = 'https://sample.heyzo.com/contents/3000/' + codeArr[1] + '/sample.mp4'
      } // HEYZO-1031 https://sample.heyzo.com/contents/3000/1031/sample.mp4
      if (code.indexOf('HDG-') !== -1) {
        videoUrl = 'https://sample.mgstage.com/sample/shiroutotouch/248' + videoSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + '_sample.mp4'
      } // HDG-375 https://sample.mgstage.com/sample/shiroutotouch/248hdg/375/HDG-375_sample.mp4
      if (code.indexOf('fc2') !== -1) {
        videoUrl = 'https://contents.fc2.com/embed/' + codeArr[1] + '?i=TXpjd01Ua3hORGc9'
      } // fc2-ppv-3155426 https://contents.fc2.com/embed/3155426?i=TXpjd01Ua3hORGc9
      if (null != code.match(/^(KU-096)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707ku096a/n_707ku096a_dmb_w.mp4' }//KU-系列仅此三个
      if (null != code.match(/^(KU-123)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1233ku123/n_1233ku123_dmb_w.mp4' }
      if (null != code.match(/^(KU-124)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1233ku124/n_1233ku124_dmb_w.mp4' }
      if (null != code.match(/^(MIDE-377)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/a/avo/avop00210/avop00210_dmb_w.mp4' }
      if (null != code.match(/^(UMD-021)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd21/143umd21_dmb_w.mp4' }
      if (null != code.match(/^(UMD-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd04/143umd04_dmb_w.mp4' }
      if (null != code.match(/^(UMD-010)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd10/143umd10_dmb_w.mp4' }
      if (null != code.match(/^(UMD-011)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd11/143umd11_dmb_w.mp4' }
      if (null != code.match(/^(UMD-016)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd16/143umd16_dmb_w.mp4' }
      if (null != code.match(/^(UMD-019)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd19/143umd19_dmb_w.mp4' }
      if (null != code.match(/^(UMD-021)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd21/143umd21_dmb_w.mp4' }
      if (null != code.match(/^(UMD-022)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd22/143umd22_dmb_w.mp4' }
      if (null != code.match(/^(UMD-037)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd37/143umd37_dmb_w.mp4' }
      if (null != code.match(/^(UMD-055)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143umd55/143umd55_dmb_w.mp4' }
      if (null != code.match(/^(CASMANI-022)/i)) { videoUrl = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1116casmani00022/h_1116casmani00022vrlite.mp4' }
      if (null != code.match(/^(SHIC-122)/i)) { videoUrl = 'https://sample.mgstage.com/sample/shisyunki/307shic/122/307shic-122_20201203T122300.mp4' }
      if (null != code.match(/^(SHIC-260)/i)) { videoUrl = 'https://sample.mgstage.com/sample/shisyunki/307shic/260/307shic-260_20230209T164802.mp4' }
      if (null != code.match(/^(MIDE-377)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/a/avo/avop00210/avop00210_dm_w.mp4' }
      if (null != code.match(/^(BDSR-016)/i)) { videoUrl = 'https://sample.mgstage.com/sample/bigmorkal/022bdsr/016/BDSR-016.mp4' }
      if (null != code.match(/^(BDSR-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/bigmorkal/022bdsr/001/BDSR-001.mp4' }
      if (null != code.match(/^(BLB-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143blb01/143blb01_mhb_w.mp4' }
      if (null != code.match(/^(NXGS-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254nxgs001/h_254nxgs001_dmb_w.mp4' }
      if (null != code.match(/^(NXGS-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254nxgs002/h_254nxgs002_dmb_w.mp4' }
      if (null != code.match(/^(NXGS-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254nxgs003/h_254nxgs003_dmb_w.mp4' }
      if (null != code.match(/^(NXGS-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254nxgs004/h_254nxgs004_dmb_w.mp4' }
      if (null != code.match(/^(ANAB-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/lahaina/031anab/003/ANAB_003.mp4' }
      if (null != code.match(/^(PIBEST-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/hiyoko/342pibest/001/342pibest-001_20220419T185302.mp4' }
      if (null != code.match(/^(PIBEST-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/1pi/1pibest00002/1pibest00002_mhb_w.mp4' }
      if (null != code.match(/^(ARKSB-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/505/5050arks00008/5050arks00008_dm_w.mp4' }
      if (null != code.match(/^(ARKSB-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_8/n_840arks003/n_840arks003_dm_w.mp4' }
      if (null != code.match(/^(ATC-502)/i)) { videoUrl = 'https://sample.mgstage.com/sample/plum/168atc/502/168ATC-502_sample.mp4' }
      if (null != code.match(/^(ATHB-36)/i)) { videoUrl = 'https://sample.mgstage.com/sample/giga/235athb/36/ATHB-36.mp4' }
      if (null != code.match(/^(ATNF-10)/i)) { videoUrl = 'https://sample.mgstage.com/sample/lahaina/031atnf/10/ATNF-10.mp4' }
      if (null != code.match(/^(AWS-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_848aws00006/h_848aws00006_sm_w.mp4' }
      if (null != code.match(/^(AWS-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/33a/33aws002/33aws002_sm_s.mp4' }
      if (null != code.match(/^(BALL-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254tga013/h_254tga013_dm_w.mp4' }
      if (null != code.match(/^(BDQBD-050)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24b/24bdqbd050/24bdqbd050_dmb_w.mp4' }
      if (null != code.match(/^(BDQBD-053)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24q/24qbd053/24qbd053_sm_s.mp4' }
      if (null != code.match(/^(BDQBD-052)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24q/24qbd052/24qbd052_sm_s.mp4' }
      if (null != code.match(/^(BDSAMA-022)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244bdsama022/h_244bdsama022_sm_s.mp4' }
      if (null != code.match(/^(BDSAMA-023)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244bdsama023/h_244bdsama023_dm_w.mp4' }
      if (null != code.match(/^(BDSAMA-024)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244bdsama024/h_244bdsama024_dm_w.mp4' }
      if (null != code.match(/^(BDSAMA-049)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244bdsama049/h_244bdsama049_dm_w.mp4' }
      if (null != code.match(/^(BDSAMA-051)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244sama737/h_244sama737_dm_w.mp4' }
      if (null != code.match(/^(BDUFD-030)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24u/24ufd030/24ufd030_dm_w.mp4' }
      if (null != code.match(/^(BND-015)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24b/24bnd015/24bnd015_sm_s.mp4' }
      if (null != code.match(/^(BND-018)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24b/24bnd018/24bnd018_sm_s.mp4' }
      if (null != code.match(/^(BPDV-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/11d/11dpdv001/11dpdv001_dm_w.mp4' }
      if (null != code.match(/^(BROZ-087)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_004ozvd199/h_004ozvd199_sm_w.mp4' }
      if (null != code.match(/^(OCH-1000)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580och01000001/h_1580och01000001_dmb_w.mp4' }
      if (null != code.match(/^(OCH-1100)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580och01100001/h_1580och01100001_dmb_w.mp4' }
      if (null != code.match(/^(OCH-900)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580och00900003/h_1580och00900003_dmb_w.mp4' }
      if (null != code.match(/^(BUD-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24b/24bud001/24bud001_sm_w.mp4' }
      if (null != code.match(/^(BUD-03)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_001bud03/h_001bud03_sm_s.mp4' }
      if (null != code.match(/^(BUD-04)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_001bud04/h_001bud04_sm_s.mp4' }
      if (null != code.match(/^(BUD-06)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_001bud06/h_001bud06_sm_s.mp4' }
      if (null != code.match(/^(BZEX-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021zex069/h_021zex069_dm_w.mp4' }
      if (null != code.match(/^(WRDJ-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1466wrdj004/n_1466wrdj004_dm_w.mp4' }
      if (null != code.match(/^(TONY-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/digitalark/066tony/002/066TONY-002.mp4' }
      if (null != code.match(/^(TONY-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/digitalark/066tony/003/066TONY-003.mp4' }
      if (null != code.match(/^(TMMS-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/149/149ams00001/149ams00001_dm_s.mp4' }
      if (null != code.match(/^(TK-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/tkt/tktk00002/tktk00002_dm_w.mp4' }
      if (null != code.match(/^(SVD-002x)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24s/24svd002/24svd002_dm_w.mp4' }
      if (null != code.match(/^(SVD-002r)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/24s/24svd002/24svd002_dm_w.mp4' }
      if (null != code.match(/^(SUPZ-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/s/sup/supd00100/supd00100_dm_w.mp4' }
      if (null != code.match(/^(STE-011)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/23s/23ste11d/23ste11d_sm_s.mp4' }
      if (null != code.match(/^(SQSET-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/s/sqt/sqte00361/sqte00361_dm_w.mp4' }
      if (null != code.match(/^(SQSET-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/s/sqt/sqte309/sqte309_dmb_w.mp4' }
      if (null != code.match(/^(SQSET-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/s/sqt/sqte400/sqte400_dmb_w.mp4' }
      if (null != code.match(/^(SQSET-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/s/sqt/sqte414/sqte414_sm_w.mp4' }
      if (null != code.match(/^(SPRL-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00001/h_706sprbd00001_dm_w.mp4' }
      if (null != code.match(/^(SPRL-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00002/h_706sprbd00002_dm_w.mp4' }
      if (null != code.match(/^(SPRL-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00004/h_706sprbd00004_dm_w.mp4' }
      if (null != code.match(/^(SPRL-005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00005/h_706sprbd00005_dm_w.mp4' }
      if (null != code.match(/^(SPRL-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00006/h_706sprbd00006_dm_w.mp4' }
      if (null != code.match(/^(SPRL-007)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00007/h_706sprbd00007_dm_w.mp4' }
      if (null != code.match(/^(SPRL-008)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00008/h_706sprbd00008_dm_w.mp4' }
      if (null != code.match(/^(SPRL-009)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00009/h_706sprbd00009_dm_w.mp4' }
      if (null != code.match(/^(SPRL-010)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00010/h_706sprbd00010_dm_w.mp4' }
      if (null != code.match(/^(SPRL-011)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00011/h_706sprbd00011_dm_w.mp4' }
      if (null != code.match(/^(SPRL-012)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706sprbd00012/h_706sprbd00012_dm_w.mp4' }
      if (null != code.match(/^(SJPDR-0108)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152rjpddr1584r/152rjpddr1584r_dm_s.mp4' }
      if (null != code.match(/^(SJPDR-0102)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152rjpddr1578r/152rjpddr1578r_sm_s.mp4' }
      if (null != code.match(/^(SJPDR-103)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152rjpddr1579r/152rjpddr1579r_sm_s.mp4' }
      if (null != code.match(/^(SJPDR-105)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152rjpddr1581r/152rjpddr1581r_sm_s.mp4' }
      if (null != code.match(/^(SJPDR-109)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152jpddr1586/152jpddr1586_sm_s.mp4' }
      if (null != code.match(/^(SJPDR-111)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152jpddr1588/152jpddr1588_sm_s.mp4' }
      if (null != code.match(/^(FIG-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/fig/001/fig-001_20230620T163301.mp4' }
      if (null != code.match(/^(SGKM-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/hamechan/483sgkm/001/483sgkm-001_20221102T172502.mp4' }
      if (null != code.match(/^(SGDV-047)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/49s/49sg047r/49sg047r_sm_w.mp4' }
      if (null != code.match(/^(SGDV-048)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/49s/49sg048r/49sg048r_sm_w.mp4' }
      if (null != code.match(/^(SGDV-050)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/49s/49sg050r/49sg050r_sm_w.mp4' }
      if (null != code.match(/^(SGDV-049)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/49s/49sg049r/49sg049r_sm_w.mp4' }
      if (null != code.match(/^(SBMOB-1004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1044sbmo01175/n_1044sbmo01175_sm_w.mp4' }
      if (null != code.match(/^(SBMOB-1003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1044sbmo01173/n_1044sbmo01173_sm_w.mp4' }
      if (null != code.match(/^(SBMOB-1005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1044sbmo01179/n_1044sbmo01179_sm_w.mp4' }
      if (null != code.match(/^(SBMOB-1005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1044sbmo01179/n_1044sbmo01179_mhb_w.mp4' }
      if (null != code.match(/^(SBMOB-1003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1044sbmo01173/n_1044sbmo01173_mhb_w.mp4' }
      if (null != code.match(/^(SB-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb002/h_113sb002_sm_w.mp4' }
      if (null != code.match(/^(SB-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb003/h_113sb003_sm_w.mp4' }
      if (null != code.match(/^(SB-005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb005/h_113sb005_sm_w.mp4' }
      if (null != code.match(/^(SB-011)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb011/h_139dksb011_dm_w.mp4' }
      if (null != code.match(/^(SB-014)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb014/h_139dksb014_dm_w.mp4' }
      if (null != code.match(/^(SB-017)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb017/h_139dksb017_dm_w.mp4' }
      if (null != code.match(/^(SB-019)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb019/h_139dksb019_dm_w.mp4' }
      if (null != code.match(/^(SB-035)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb035/h_139dksb035_dm_w.mp4' }
      if (null != code.match(/^(SB-038)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb038/h_139dksb038_dm_w.mp4' }
      if (null != code.match(/^(SB-041)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36d/36dksb00041/36dksb00041_dm_w.mp4' }
      if (null != code.match(/^(SB-044)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36d/36dksb00044/36dksb00044_dm_w.mp4' }
      if (null != code.match(/^(SB-042)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36d/36dksb00042/36dksb00042_dmb_w.mp4' }
      if (null != code.match(/^(SB-039)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb039/h_139dksb039_dm_w.mp4' }
      if (null != code.match(/^(SB-015)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb015/h_139dksb015_dm_w.mp4' }
      if (null != code.match(/^(SB-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb001/h_113sb001_sm_w.mp4' }
      if (null != code.match(/^(SB-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb006/h_113sb006_sm_w.mp4' }
      if (null != code.match(/^(SB-016)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb016/h_139dksb016_dm_w.mp4' }
      if (null != code.match(/^(SB-040)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb040/h_139dksb040_dm_w.mp4' }
      if (null != code.match(/^(SB-043)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36d/36dksb00043/36dksb00043_dm_w.mp4' }
      if (null != code.match(/^(SB-045)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36d/36dksb00045/36dksb00045_dm_w.mp4' }
      if (null != code.match(/^(SB-018)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb018/h_139dksb018_dm_w.mp4' }
      if (null != code.match(/^(SB-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb004/h_113sb004_dm_w.mp4' }
      if (null != code.match(/^(SB-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb001/h_113sb001_sm_w.mp4' }
      if (null != code.match(/^(SB-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113sb006/h_113sb006_sm_w.mp4' }
      if (null != code.match(/^(SB-012)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb012/h_139dksb012_dm_w.mp4' }
      if (null != code.match(/^(SB-036)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb036/h_139dksb036_dm_w.mp4' }
      if (null != code.match(/^(SB-037)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139dksb037/h_139dksb037_dm_w.mp4' }
      if (null != code.match(/^(RNTR-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd001/18ntrd001_dm_w.mp4' }
      if (null != code.match(/^(RNTR-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd003/18ntrd003_dm_w.mp4' }
      if (null != code.match(/^(RNTR-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd005/18ntrd005_dm_w.mp4' }
      if (null != code.match(/^(RNTR-005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd009/18ntrd009_dm_w.mp4' }
      if (null != code.match(/^(RNTR-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd010/18ntrd010_dm_s.mp4' }
      if (null != code.match(/^(RNTR-007)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd012/18ntrd012_dm_s.mp4' }
      if (null != code.match(/^(RNTR-008)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd014/18ntrd014_dm_s.mp4' }
      if (null != code.match(/^(RNTR-009)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18n/18ntrd023/18ntrd023_dm_w.mp4' }
      if (null != code.match(/^(USDX-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/usdx/003/usdx-003_20220330T181002.mp4' }
      if (null != code.match(/^(USDX-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/usdx/002/usdx-002_20220330T181002.mp4' }
      if (null != code.match(/^(USDX-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/usdx/001/usdx-001_20211201T115302.mp4' }
      if (null != code.match(/^(COMPI-005)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/compi/005/compi-005_20221102T194001.mp4' }
      if (null != code.match(/^(COMPI-004)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/compi/004/compi-004_20221031T211001.mp4' }
      if (null != code.match(/^(COMPI-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/compi/002/compi-002_20220831T214502.mp4' }
      if (null != code.match(/^(COMPI-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/compi/001/compi-001_20220901T193502.mp4' }
      if (null != code.match(/^(MGSMUCHI-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/mgsmuchi/002/mgsmuchi-002_20230118T174803.mp4' }
      if (null != code.match(/^(MGSMUCHI-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/mgsmuchi/001/mgsmuchi-001_20221020T095302.mp4' }
      if (null != code.match(/^(MGSSLND-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/mgsslnd/001/mgsslnd-001_20230207T172303.mp4' }
      if (null != code.match(/^(GWGANA-001)/i)) { videoUrl = ' https://sample.mgstage.com/sample/prestige/gwgana/001/gwgana-001_20210324T092301.mp4' }
      if (null != code.match(/^(GWNTR-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwntr/001/gwntr-001_20210324T163301.mp4' }
      if (null != code.match(/^(THU-006)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/thu/006/thu-006_20230725T170302.mp4' }
      if (null != code.match(/^(SPAK-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/spak/001/spak-001_20230913T190502.mp4' }
      if (null != code.match(/^(SETM-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/sodcreate/107setm/001/107setm-001_20230907T153301.mp4' }
      if (null != code.match(/^(MLOBB-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/505/5050mlob00008/5050mlob00008_dm_w.mp4' }
      if (null != code.match(/^(MDNW-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/tkm/tkmdnw002/tkmdnw002_dm_w.mp4' }
      if (null != code.match(/^(MDNW-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/m/mdn/mdnw001/mdnw001_sm_w.mp4' }
      if (null != code.match(/^(LVMFC-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/001/435lvmfc-001_20210422T181802.mp4' }
      if (null != code.match(/^(LVMFC-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/002/435lvmfc-002_20210430T101804.mp4' }
      if (null != code.match(/^(LVMFC-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/003/435lvmfc-003_20210427T143307.mp4' }
      if (null != code.match(/^(LVMFC-004)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/004/435lvmfc-004_20210726T155801.mp4' }
      if (null != code.match(/^(LVMFC-005)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/005/435lvmfc-005_20211122T174801.mp4' }
      if (null != code.match(/^(LVMFC-006)/i)) { videoUrl = 'https://sample.mgstage.com/sample/moonforce/435lvmfc/006/435lvmfc-006_20221115T123003.mp4' }
      if (null != code.match(/^(GWNAMA-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwnama/003/gwnama-003_20211202T101301.mp4' }
      if (null != code.match(/^(GWNAMA-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwnama/002/gwnama-002_20210727T094801.mp4' }
      if (null != code.match(/^(GWNAMA-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwnama/001/gwnama-001_20210324T093301.mp4' }
      if (null != code.match(/^(GWTORA-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwtora/001/gwtora-001_20210324T093301.mp4' }
      if (null != code.match(/^(GWTORA-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwtora/002/gwtora-002_20210721T194302.mp4' }
      if (null != code.match(/^(GWTORA-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwtora/003/gwtora-003_20211129T175301.mp4' }
      if (null != code.match(/^(GWJAC-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwjac/001/gwjac-001_20210324T163301.mp4' }
      if (null != code.match(/^(GWHASI-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwhasi/002/gwhasi-002_20210727T180802.mp4' }
      if (null != code.match(/^(GWHASI-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwhasi/001/gwhasi-001_20210324T163301.mp4' }
      if (null != code.match(/^(GWDCV-003)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwdcv/003/gwdcv-003_20211203T132301.mp4' }
      if (null != code.match(/^(GWDCV-002)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwdcv/002/gwdcv-002_20210727T174302.mp4' }
      if (null != code.match(/^(GWDCV-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/prestige/gwdcv/001/gwdcv-001_20210326T092801.mp4' }
      if (null != code.match(/^(FRNCB-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1393frnc004/n_1393frnc004_dm_w.mp4' }
      if (null != code.match(/^(FRNCB-005)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/505/5050frnc00008/5050frnc00008_dm_w.mp4' }
      if (null != code.match(/^(FKKRM-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kru/kru00040/kru00040_dm_w.mp4' }
      if (null != code.match(/^(ERE-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_921ere001/h_921ere001_dm_w.mp4' }
      if (null != code.match(/^(ERE-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_968ere002/h_968ere002_dm_w.mp4' }
      if (null != code.match(/^(OKL-001)/i)) { videoUrl = 'https://sample.mgstage.com/sample/oyajino/249okl/001/249okl-001_20240207T111802.mp4' }
      if (null != code.match(/^(DYNE-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/187/187dyne001/187dyne001_dmb_w.mp4' }
      if (null != code.match(/^(DYNE-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/d/dyn/dyne002/dyne002_dmb_w.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_s.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_s.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_s.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'a/' + videoSeries + videoNo + 'a_dmb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'a/' + videoSeries + videoNo + 'a_mhb_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'b/' + videoSeries + videoNo + 'b_dmb_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'b/' + videoSeries + videoNo + 'b_mhb_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'z/' + videoSeries + videoNo + 'z_dmb_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + '/' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + '/' + videoSeries + videoTwo + '_sm_s.mp4'; // ARKX-016 https://pv3001.dmm.com/litevideo/freepv/a/ark/arkx00016/arkx00016_sm_s.mp4
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'a/' + videoSeries + codeArr[1] + 'a_dmb_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 're/' + videoSeries + codeArr[1] + 're_dmb_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 're/' + videoSeries + codeArr[1] + 're_dm_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'z/' + videoSeries + codeArr[1] + 'z_dmb_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_dmb_s.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_dmb_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_dm_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_mhb_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td027' + videoSeries + videoNo + '/td027' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/vrsample/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'e/' + videoSeries + codeArr[1] + 'e_mhb_w.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'e/' + videoSeries + codeArr[1] + 'e_dm_w.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'e/' + videoSeries + videoNo + 'e_mhb_w.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'e/' + videoSeries + videoNo + 'e_dm_w.mp4';
      let videoUrl38 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'e/' + videoSeries + videoNo + 'e_dmb_w.mp4';
      let videoUrl39 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'e/' + videoSeries + codeArr[1] + 'e_dmb_w.mp4';
      let videoUrl40 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'r/' + videoSeries + codeArr[1] + 'r_sm_s.mp4'; //WB-015 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113wb015r/h_113wb015r_sm_s.mp4
      let videoUrl41 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + '/' + videoSeries + videoTwo + '_dmb_w.mp4';
      let videoUrl42 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + '/' + videoSeries + videoTwo + '_mhb_w.mp4';
      let videoUrl100 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_s.mp4'; //番号系列三位补0
      let videoUrl101 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_s.mp4';  //番号系列三位补0
      let videoUrl102 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4'; //番号系列三位补0
      let videoUrl103 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';  //番号系列三位补0 	// CS-028 https://pv3001.dmm.com/litevideo/freepv/c/cs0/cs028/cs028_sm_w.mp4
      let videoUrl104 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_s.mp4';  //番号系列三位补0 	// WW-071 https://pv3001.dmm.com/litevideo/freepv/w/ww0/ww071/ww071_dm_s.mp4
      let videoUrl110 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4'; //番号系列三位补0
      let videoUrl111 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';  //番号系列三位补0
      let videoUrl112 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_s.mp4';  //番号系列三位补0
      let videoUrl200 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSerFour + videoNo + '/' + videoSerFour + videoNo + '_dm_w.mp4'; // 5位番号截掉第5位 ARKSB-003 //pv3001.dmm.com/litevideo/freepv/5/505/5050arks00008/5050arks00008_dm_w.mp4
      let videoUrl210 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSerFour + codeArr[1] + '/' + videoSerFour + codeArr[1] + '_dmb_w.mp4'; // 5位番号截掉第5位 WRDJB-004 https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1466wrdj004/n_1466wrdj004_dmb_w.mp4
      let videoUrl211 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSerFour + codeArr[1] + '/' + videoSerFour + codeArr[1] + '_dm_w.mp4'; // 5位番号截掉第5位
      let videoUrl212 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSerFour + codeArr[1] + '/' + videoSerFour + codeArr[1] + '_sm_s.mp4'; // 5位番号截掉第5位
      let videoUrl300 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + '/' + videoSeries + videoThree + '_dmb_s.mp4';
      let videoUrl301 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + '/' + videoSeries + videoThree + '_dmb_w.mp4';
      let videoUrl302 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + '/' + videoSeries + videoThree + '_dm_w.mp4';
      let videoUrl303 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + '/' + videoSeries + videoThree + '_mhb_w.mp4';
      let videoUrl400 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'ad/' + videoSeries + videoNo + 'ad_sm_w.mp4'; // ARKX-013 https://pv3001.dmm.com/litevideo/freepv/a/ark/arkx00013ad/arkx00013ad_sm_w.mp4
      let videoUrl500 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + '/' + videoSeries + videoTwo + '_sm_w.mp4';  //数字截取2位 BEBE-021  https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086bebe21/h_086bebe21_sm_w.mp4
      let videoUrl600 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_dmb_s.mp4'; // 6位数字补0 TNB-002 https://pv3001.dmm.com/litevideo/freepv/t/tnb/tnb000002/tnb000002_dm_w.mp4
      let videoUrl601 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_dm_s.mp4';
      let videoUrl602 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_dm_w.mp4';
      let videoUrl603 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_mhb_s.mp4';
      let videoUrl604 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_mhb_w.mp4';
      let videoUrl605 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_sm_s.mp4';
      let videoUrl606 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_sm_w.mp4';
      let videoUrl800 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'ai/' + videoSeries + videoNo + 'ai_mhb_w.mp4';
      let videoUrl801 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'ai/' + videoSeries + videoNo + 'ai_dm_w.mp4';
      let videoUrl802 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'ai/' + videoSeries + videoNo + 'ai_dmb_w.mp4';
      let videoUrl803 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries.substr(0, 9) + codeArr[1] + '/' + videoSeries.substr(0, 9) + codeArr[1] + '_dmb_w.mp4';
      let videoUrl804 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + 's' + videoNo + '/' + videoSeries + 's' + videoNo + '_dmb_w.mp4'; //DVDM-956  https://pv3001.dmm.com/litevideo/freepv/d/dvd/dvdms00956/dvdms00956_dmb_w.mp4 特殊:在字母后加s
      let videoUrl805 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSerFour + videoNo + '/' + videoSerFour + videoNo + '_dmb_w.mp4'; // 5位字母截掉最后一位
      let videoUrl806 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + 'nkj/' + videoSeries + videoNo + 'nkj_dmb_w.mp4';
      let videoUrl989 = 'https://sample.mgstage.com/sample/ikinarierozanmai/425' + videoSeries.replace(/[a-zA-Z]{1}_[0-9]+/g, "") + '/' + codeArr[1] + '/425' + code + '.mp4'; // BMST-004 https://sample.mgstage.com/sample/ikinarierozanmai/425bmst/004/425BMST-004.mp4
      let videoUrl990 = 'https://sample.mgstage.com/sample/lahaina/031' + videoSeries + '/' + codeArr[1] + '/' + code + '_sam.mp4';  // BEST-009 https://sample.mgstage.com/sample/lahaina/031best/009/BEST-009_sam.mp4
      let videoUrl991 = 'https://sample.mgstage.com/sample/lahaina/031' + videoSeries + '/' + codeArr[1] + '/' + code + '.mp4'; // ATNF-10 https://sample.mgstage.com/sample/lahaina/031atnf/10/ATNF-10.mp4
      let videoUrl992 = 'https://sample.mgstage.com/sample/giga/235' + videoSeries + '/' + codeArr[1] + '/' + code + '.mp4'; // ATHB-36 https://sample.mgstage.com/sample/giga/235athb/36/ATHB-36.mp4
      let videoUrl993 = 'https://sample.mgstage.com/sample/mercury/298' + videoSeries + '/' + codeArr[1] + '/' + code + '_sample.mp4';
      let videoUrl994 = 'https://sample.mgstage.com/sample/prestige/' + videoSeries + '/' + codeArr[1] + '/BLO-040_90.mp4';
      let videoUrl995 = 'https://sample.mgstage.com/sample/prestige/' + videoSeries + '/' + codeArr[1] + '/' + code + '.mp4';
      let videoUrl996 = 'https://sample.mgstage.com/sample/mirai/064' + videoSeries + '/' + codeArr[1] + '/' + videoSeries + '-' + codeArr[1] + '.mp4';
      let videoUrl997 = 'https://sample.mgstage.com/sample/mirai/064' + videoSeries + '/' + codeArr[1] + '/' + videoSeries + '-' + videoThree + '.mp4';
      let videoUrl998 = 'https://sample.mgstage.com/sample/nadeshiko/171' + videoSeries + '/' + codeArr[1] + '/171' + code + '.mp4';
      let videoUrl999 = 'https://sample.mgstage.com/sample/bigmorkal/022' + videoSeries + '/' + codeArr[1] + '/' + code + '.mp4'; // BDSR-001 https://sample.mgstage.com/sample/bigmorkal/022bdsr/001/BDSR-001.mp4
      let videoUrl1000 = 'https://sample.mgstage.com/sample/around/' + videoSeries + '/' + codeArr[1] + '/' + videoSeries.replace(/[0-9]+/g, "") + '_' + videoNo + '_sample.mp4'; // https://sample.mgstage.com/sample/around/119arie/11001/arie_11001_sample.mp(对)4和https://sample.mgstage.com/sample/around/119arie/11001/arie-11001_sample.mp4(错)有区别 系列之前被被加了数字,这里又要去掉数字 此规则适用于个别番号
      let videoUrl1001 = 'http://sdn.aurora-pro.com/contents/mp4/pc/' + code.toLowerCase() + '_sam.mp4'; // 此规则为https://sec.aurora-pro.com专属专用 含多个系列 部分系列无资源 APAA-408 http://sdn.aurora-pro.com/contents/mp4/pc/apaa-408_sam.mp4
      // 自2023.5.10开始 将于番号系列表加入每个番号最常用分辨率 以快速适配
      let videoUrl1002 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1003 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl1004 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + chehz + '/' + videoSeries + videoTwo + chehz + postfix + '.mp4';
      let videoUrl1005 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + chehz + '/' + videoSeries + videoFour + chehz + postfix + '.mp4';
      let videoUrl1006 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1007 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl1008 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + chehz + '/' + videoSeries + videoThree + chehz + postfix + '.mp4';
      let videoUrl1009 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThrBu + chehz + '/' + videoSeries + videoThrBu + chehz + postfix + '.mp4';
      let videoUrl1010 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + cheqz + vSeries.substr(0, 5) + codeArr[1] + chehz + '/' + cheqz + vSeries.substr(0, 5) + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1011 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + postfix + '.mp4'; // 去掉后缀
      let videoUrl1012 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoOne + chehz + '/' + videoSeries + videoOne + chehz + postfix + '.mp4';
      let videoUrl1013 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'dm.mp4';
      let videoUrl1014 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'sm.mp4';
      let videoUrl1015 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + 'dm.mp4';
      let videoUrl1016 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + 'sm.mp4';
      let videoUrl1017 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + chehz + '/' + videoSeries + videoTwo + chehz + 'dm.mp4';
      let videoUrl1018 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries[0] + codeArr[1].substr(0, 2) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'dm.mp4';
      let videoUrl1019 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThrBu + chehz + '/' + videoSeries + videoThrBu + chehz + '_sm_w.mp4';
      let videoUrl1020 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + '_dm_s.mp4';
      let videoUrl1021 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'hhb.mp4';
      let videoUrl1022 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + 'hhb.mp4';
      let videoUrl1023 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'hhbs.mp4';
      let videoUrl1024 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + 'hhbs.mp4';
      let videoUrl1025 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + 'mhb.mp4';
      let videoUrl1026 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + 'mhb.mp4';
      let videoUrl1027 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + '.mp4';
      let videoUrl1028 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + '.mp4';
      let videoUrl1029 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + '4k.mp4';
      let videoUrl1030 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + '4k.mp4';
      let videoUrl1031 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + '4ks.mp4';
      let videoUrl1032 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + '4ks.mp4';
      // Y-014 https://pv3001.dmm.com/litevideo/freepv/y/y01/y014/y014dm.mp4
      // https://pv3001.dmm.com/litevideo/freepv/7/70c/70chc001/70chc001sm.mp4
      // 以下数据在待测试数据全部完成后删除
      let videoUrl2000 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2001 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2002 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2003 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2004 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2005 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2006 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2007 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2008 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl2009 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl2010 = 'https://pv3001.dmm.com/litevideo/freepv/1/11' + videoSeries[0] + '/11' + videoSeries + videoNo + '/11' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2011 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2012 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2013 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2014 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + videoNo + '/118' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2015 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries[0] + '/12' + videoSeries + codeArr[1] + '/12' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2016 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries[0] + '/12' + videoSeries + videoNo + '/12' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2017 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries[0] + '/12' + videoSeries + videoNo + '/12' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2018 = 'https://pv3001.dmm.com/litevideo/freepv/1/125/125' + videoSeries + codeArr[1] + '/125' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2019 = 'https://pv3001.dmm.com/litevideo/freepv/1/125/125' + videoSeries + codeArr[1] + '/125' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2020 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2021 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2022 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl2023 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2024 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2025 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2026 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2027 = 'https://pv3001.dmm.com/litevideo/freepv/1/149/149' + videoSeries + videoNo + '/149' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2028 = 'https://pv3001.dmm.com/litevideo/freepv/1/149/149' + videoSeries + videoNo + '/149' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2029 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2030 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2031 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2032 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2033 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2034 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl2035 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + videoNo + '/172' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2036 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + videoNo + '/172' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2037 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + videoNo + '/18' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2038 = 'https://pv3001.dmm.com/litevideo/freepv/2/2' + videoSeries.substr(0, 2) + '/2' + videoSeries + videoNo + '/2' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2039 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries.substr(0, 1) + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2040 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries.substr(0, 1) + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl2041 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries.substr(0, 1) + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2042 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries.substr(0, 1) + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2043 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries.substr(0, 1) + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2044 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl2045 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2046 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl2047 = 'https://pv3001.dmm.com/litevideo/freepv/3/33' + videoSeries[0] + '/33' + videoSeries + codeArr[1] + '/33' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2048 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2049 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2050 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl2051 = 'https://pv3001.dmm.com/litevideo/freepv/4/406/406' + videoSeries + videoNo + '/406' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2052 = 'https://pv3001.dmm.com/litevideo/freepv/4/41' + videoSeries.substr(0, 1) + '/41' + videoSeries + videoNo + '/41' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2053 = 'https://pv3001.dmm.com/litevideo/freepv/4/421/421' + videoSeries + codeArr[1] + '/421' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2054 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2055 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2056 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2057 = 'https://pv3001.dmm.com/litevideo/freepv/4/48' + videoSeries.substr(0, 1) + '/48' + videoSeries + codeArr[1] + '/48' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2058 = 'https://pv3001.dmm.com/litevideo/freepv/4/48' + videoSeries.substr(0, 1) + '/48' + videoSeries + videoNo + '/48' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2059 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries.substr(0, 1) + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2060 = 'https://pv3001.dmm.com/litevideo/freepv/5/504/504' + videoSeries + codeArr[1] + 'z/504' + videoSeries + codeArr[1] + 'z_dmb_w.mp4';
      let videoUrl2061 = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2062 = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2063 = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_mmb_w.mp4';
      let videoUrl2064 = 'https://pv3001.dmm.com/litevideo/freepv/5/53' + videoSeries.substr(0, 1) + '/53' + videoSeries + codeArr[1] + '/53' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2065 = 'https://pv3001.dmm.com/litevideo/freepv/5/53' + videoSeries.substr(0, 1) + '/53' + videoSeries + codeArr[1] + '/53' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2066 = 'https://pv3001.dmm.com/litevideo/freepv/5/53' + videoSeries.substr(0, 1) + '/53' + videoSeries + videoFour + '/53' + videoSeries + videoFour + '_dmb_w.mp4';
      let videoUrl2067 = 'https://pv3001.dmm.com/litevideo/freepv/5/540/540' + videoSeries + codeArr[1] + '/540' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2068 = 'https://pv3001.dmm.com/litevideo/freepv/5/540/540' + videoSeries + videoNo + '/540' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2069 = 'https://pv3001.dmm.com/litevideo/freepv/5/55' + videoSeries.substr(0, 1) + '/55' + videoSeries + codeArr[1] + '/55' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2070 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + codeArr[1] + '/57' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2071 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + codeArr[1] + '/57' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2072 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + codeArr[1] + '/57' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2073 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + codeArr[1] + '/57' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2074 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + videoNo + '/57' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2075 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + videoNo + '/57' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2076 = 'https://pv3001.dmm.com/litevideo/freepv/5/59' + videoSeries.substr(0, 1) + '/59' + videoSeries + codeArr[1] + '/59' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2077 = 'https://pv3001.dmm.com/litevideo/freepv/5/59' + videoSeries.substr(0, 1) + '/59' + videoSeries + codeArr[1] + '/59' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2078 = 'https://pv3001.dmm.com/litevideo/freepv/5/59' + videoSeries[0] + '/59' + videoSeries + videoNo + '/59' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2079 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2080 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2081 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl2082 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2083 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2084 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2085 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2086 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2087 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl2088 = 'https://pv3001.dmm.com/litevideo/freepv/7/71' + videoSeries[0] + '/71' + videoSeries + videoNo + '/71' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2089 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2090 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2091 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2092 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2093 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2094 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl2095 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2096 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2097 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2098 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2099 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2100 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries[0] + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2101 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries[0] + '/84' + videoSeries + videoNo + '/84' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2102 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_019' + videoSeries + codeArr[1] + '/h_019' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2103 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_019' + videoSeries + videoNo + '/h_019' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2104 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_019' + videoSeries + videoNo + '/h_019' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2105 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2106 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2107 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2108 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2109 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_047' + videoSeries + codeArr[1] + '/h_047' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2110 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + codeArr[1] + '/h_067' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2111 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_068' + videoSeries + codeArr[1] + '/h_068' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2112 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_068' + videoSeries + codeArr[1] + '/h_068' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2113 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_068' + videoSeries + codeArr[1] + '/h_068' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2114 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + codeArr[1] + '/h_086' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2115 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoNo + '/h_086' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2116 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoNo + '/h_086' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2117 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_dmb_w.mp4';
      let videoUrl2118 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl2119 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_sm_w.mp4';
      let videoUrl2120 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1002' + videoSeries + codeArr[1] + '/h_1002' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2121 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1100' + videoSeries + codeArr[1] + '/h_1100' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2122 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1100' + videoSeries + codeArr[1] + '/h_1100' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2123 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2124 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2125 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2126 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + videoNo + '/h_113' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2127 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1133' + videoSeries + codeArr[1] + '/h_1133' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2128 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + codeArr[1] + '/h_1160' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2129 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + '/h_1160' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2130 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + 'a/' + videoSeries + videoNo + 'a_mhb_w.mp4';
      let videoUrl2131 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + 'b/' + videoSeries + videoNo + 'b_dmb_w.mp4';
      let videoUrl2132 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoTwo + '/h_1160' + videoSeries + videoTwo + '_dmb_w.mp4';
      let videoUrl2133 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoTwo + '/h_1160' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl2134 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1165' + videoSeries + videoNo + '/h_1165' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2135 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1240' + videoSeries + videoNo + '/h_1240' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2136 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1240' + videoSeries + videoNo + '/h_1240' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2137 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1245' + videoSeries + videoNo + '/h_1245' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2138 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_127' + videoSeries + codeArr[1] + '/h_127' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2139 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_127' + videoSeries + videoNo + '/h_127' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2140 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_128' + videoSeries + codeArr[1] + '/h_128' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2141 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + codeArr[1] + '/h_1300' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2142 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + videoNo + '/h_1300' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2143 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1324' + videoSeries + codeArr[1] + '/h_1324' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2144 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1324' + videoSeries + videoNo + '/h_1324' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2145 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1350' + videoSeries + videoNo + '/h_1350' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2146 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1350' + videoSeries + videoNo + '/h_1350' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2147 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + codeArr[1] + '/h_1359' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2148 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + codeArr[1] + '/h_1359' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2149 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + videoNo + '/h_1359' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2150 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1371' + videoSeries + codeArr[1] + '/h_1371' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2151 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1378' + videoSeries + videoNo + '/h_1378' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2152 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1378' + videoSeries + videoNo + '/h_1378' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2153 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1386' + videoSeries + videoNo + '/h_1386' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2154 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2155 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2156 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2157 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1391' + videoSeries + videoNo + '/h_1391' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2158 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1416' + videoSeries + videoNo + '/h_1416' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2159 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1435' + videoSeries + videoNo + '/h_1435' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2160 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1435' + videoSeries + videoNo + '/h_1435' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2161 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1440' + videoSeries + videoNo + '/h_1440' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2162 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1440' + videoSeries + videoNo + '/h_1440' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2163 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1454' + videoSeries + videoNo + '/h_1454' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2164 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1454' + videoSeries + videoNo + '/h_1454' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2165 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1462' + videoSeries + videoNo + '/h_1462' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2166 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1472' + videoSeries + videoNo + '/h_1472' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2167 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1472' + videoSeries + videoNo + '/h_1472' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2168 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1489' + videoSeries + codeArr[1] + 'a/h_1489' + videoSeries + codeArr[1] + 'a_dmb_w.mp4';
      let videoUrl2169 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1495' + videoSeries + codeArr[1] + '/h_1495' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2170 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1495' + videoSeries + videoNo + '/h_1495' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2171 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1515' + videoSeries + videoNo + '/h_1515' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2172 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1534' + videoSeries + videoNo + '/h_1534' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2173 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1560' + videoSeries + videoNo + '/h_1560' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2174 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1575' + videoSeries + videoNo + '/h_1575' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2175 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580' + videoSeries + videoNo + '/h_1580' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2176 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580' + videoSeries + videoNo + '/h_1580' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2177 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1594' + videoSeries + videoNo + '/h_1594' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2178 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1596' + videoSeries + codeArr[1] + '/h_1596' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2179 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1600' + videoSeries + videoNo + '/h_1600' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2180 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1605' + videoSeries + videoNo + '/h_1605' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2181 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1614' + videoSeries + videoNo + '/h_1614' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2182 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1615' + videoSeries + videoNo + '/h_1615' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2183 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1615' + videoSeries + videoNo + '/h_1615' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2184 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1616' + videoSeries + videoNo + '/h_1616' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2185 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1631' + videoSeries + videoNo + '/h_1631' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2186 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1638' + videoSeries + codeArr[1] + '/h_1638' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2187 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1650' + videoSeries + videoNo + '/h_1650' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2188 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1664' + videoSeries + codeArr[1] + '/h_1664' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2189 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1668' + videoSeries + videoNo + '/h_1668' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2190 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1674' + videoSeries + codeArr[1] + '/h_1674' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2191 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_170' + videoSeries + codeArr[1] + '/h_170' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2192 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1712' + videoSeries + codeArr[1] + '/h_1712' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2193 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1712' + videoSeries + codeArr[1] + '/h_1712' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2194 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1714' + videoSeries + videoNo + '/h_1714' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2195 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1714' + videoSeries + videoNo + '/h_1714' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2196 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1718' + videoSeries + videoNo + '/h_1718' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2197 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1718' + videoSeries + videoNo + '/h_1718' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2198 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_172' + videoSeries + videoNo + '/h_172' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2199 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2200 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2201 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2202 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_227' + videoSeries + codeArr[1] + '/h_227' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2203 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_227' + videoSeries + videoNo + '/h_227' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2204 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_237' + videoSeries + codeArr[1] + '/h_237' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2205 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244' + videoSeries + codeArr[1] + '/h_244' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2206 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2207 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + videoNo + '/h_254' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2208 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_283' + videoSeries + codeArr[1] + '/h_283' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2209 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_346' + videoSeries + codeArr[1] + '/h_346' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2210 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_422' + videoSeries + videoFour + '/h_422' + videoSeries + videoFour + '_dm_w.mp4';
      let videoUrl2211 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_452' + videoSeries + codeArr[1] + '/h_452' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2212 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_458' + videoSeries + videoNo + '/h_458' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2213 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_458' + videoSeries + videoNo + '/h_458' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2214 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_480' + videoSeries + videoNo + '/h_480' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2215 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2216 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2217 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2218 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_585' + videoSeries + codeArr[1] + '/h_585' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2219 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_585' + videoSeries + codeArr[1] + '/h_585' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2220 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_635' + videoSeries + codeArr[1] + '/h_635' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2221 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_635' + videoSeries + codeArr[1] + '/h_635' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2222 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_635' + videoSeries + codeArr[1] + '/h_635' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl2223 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_687' + videoSeries + codeArr[1] + '/h_687' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2224 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_687' + videoSeries + videoNo + '/h_687' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2225 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_687' + videoSeries + videoNo + '/h_687' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2226 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2227 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2228 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2229 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2230 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2231 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2232 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + videoNo + '/h_720' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2233 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + videoNo + '/h_720' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2234 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_771' + videoSeries + codeArr[1] + '/h_771' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2235 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_796' + videoSeries + codeArr[1] + '/h_796' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2236 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_796' + videoSeries + videoNo + '/h_796' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2237 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_796' + videoSeries + videoNo + '/h_796' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2238 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2239 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2240 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2241 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2242 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1233' + videoSeries + codeArr[1] + '/n_1233' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2243 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445' + videoSeries.substr(0, 4) + codeArr[1] + '/n_1445' + videoSeries.substr(0, 4) + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2244 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2245 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2246 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + 'a/n_707' + videoSeries + codeArr[1] + 'a_dmb_w.mp4';
      let videoUrl2247 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_709' + videoSeries + codeArr[1] + '/n_709' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl2248 = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td027' + videoSeries + videoNo + '/td027' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl2249 = 'https://pv3001.dmm.com/vrsample/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2250 = 'https://pv3001.dmm.com/vrsample/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2251 = 'https://pv3001.dmm.com/vrsample/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2252 = 'https://pv3001.dmm.com/vrsample/5/55' + videoSeries[0] + '/55' + videoSeries + videoNo + '/55' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2253 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1248' + videoSeries + videoNo + '/h_1248' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2254 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1321' + videoSeries + videoNo + '/h_1321' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2255 = 'https://pv3001.dmm.com/vrsample/h/h_9/h_955' + videoSeries + videoNo + '/h_955' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl2256 = 'https://sample.mgstage.com/sample/documentdehamehame/498' + videoSeries.substr(0, 3) + '/' + codeArr[1] + '/498' + code + '_sample.mp4';
      let videoUrl2257 = 'https://sample.mgstage.com/sample/documentv/277' + videoSeries.substr(0, 3) + '/' + codeArr[1] + '/277' + code + '_sample.mp4';
      let videoUrl2258 = 'https://sample.mgstage.com/sample/luxutv/259luxu/' + codeArr[1] + '/259' + code + '_sample.mp4';
      let videoUrl2259 = 'https://sample.mgstage.com/sample/mercury/298' + videoSeries + '/' + codeArr[1] + '/' + code + '_sample.mp4';
      let videoUrl2260 = 'https://sample.mgstage.com/sample/reiwashirouto/383' + videoSeries.substr(0, 4) + '/' + codeArr[1] + '/383' + code + '_sample.mp4';
      // 以上数据在待测试数据全部完成后删除
      // 以下数据位mgs规则匹配 待完成后删除上面的单个规则
      let videoUrl2700 = 'https://sample.mgstage.com/sample/around/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '_' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2701 = 'https://sample.mgstage.com/sample/bigmorkal/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2702 = 'https://sample.mgstage.com/sample/documentdehamehame/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2703 = 'https://sample.mgstage.com/sample/documentv/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2704 = 'https://sample.mgstage.com/sample/giga/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2705 = 'https://sample.mgstage.com/sample/ikinarierozanmai/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2706 = 'https://sample.mgstage.com/sample/lahaina/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4'; //
      let videoUrl2707 = 'https://sample.mgstage.com/sample/lahaina/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sam.mp4';
      let videoUrl2708 = 'https://sample.mgstage.com/sample/luxutv/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2709 = 'https://sample.mgstage.com/sample/mercury/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2710 = 'https://sample.mgstage.com/sample/mirai/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2711 = 'https://sample.mgstage.com/sample/mirai/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + videoThree + chehz + '.mp4';
      let videoUrl2712 = 'https://sample.mgstage.com/sample/nadeshiko/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2713 = 'https://sample.mgstage.com/sample/nanpatv/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2714 = 'https://sample.mgstage.com/sample/plum/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2715 = 'https://sample.mgstage.com/sample/prestige/' + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2716 = 'https://sample.mgstage.com/sample/reiwashirouto/' + cheqz + vSeries.substr(0, 4) + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      let videoUrl2717 = 'https://sample.mgstage.com/sample/scute/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '_' + codeArr[1] + chehz + '.mp4';
      let videoUrl2718 = 'https://sample.mgstage.com/sample/trump/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4';
      let videoUrl2719 = 'https://sample.mgstage.com/sample/trump/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4';
      if (null != code.match(/^(ORETDP-)/i)) { videoUrl = 'https://sample.mgstage.com/sample/orenoshirouto/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4' }
      // https://sample.mgstage.com/sample/orenoshirouto/230oretdp/001/230ORETDP-001.mp4
      if (null != code.match(/^(OREDG-)/i)) { videoUrl = 'https://sample.mgstage.com/sample/orenoshirouto/' + cheqz + vSeries + '/' + codeArr[1] + '/' + cheqz + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '_sample.mp4' }
      // https://sample.mgstage.com/sample/orenoshirouto/230oredg/001/230OREDG-001_sample.mp4
      if (null != code.match(/^(OPPX|OPPL)/i)) { videoUrl = 'https://sample.mgstage.com/sample/lahaina/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '_' + codeArr[1] + chehz + '.mp4' }
      // https://sample.mgstage.com/sample/lahaina/031oppx/002/OPPX_002.mp4
      // https://sample.mgstage.com/sample/lahaina/031oppl/311/OPPL_311.mp4
      if (null != code.match(/^(NMH-)/i)) { videoUrl = 'https://sample.mgstage.com/sample/koyacho/' + cheqz + vSeries + '/' + codeArr[1] + '/' + vSeries.toUpperCase() + '-' + codeArr[1] + chehz + '.mp4' }
      // https://sample.mgstage.com/sample/koyacho/057nmh/04/NMH-04.mp4
      // https://sample.mgstage.com/sample/koyacho/057nmh/03/NMH-03.mp4
      // mgs规则匹配结束
      let videoUrl9990 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.m3u8';
      let videoUrl9991 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.m3u8';
      let videoUrl9992 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'mmb.m3u8';
      let videoUrl9993 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/playlist.m3u8';
      let videoUrl9996 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.m3u8';
      let videoUrl9997 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.m3u8';
      let videoUrl9998 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'mmb.m3u8';
      let videoUrl9999 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/playlist.m3u8';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl1013} type="video/mp4" />
                          <source src=${videoUrl1014} type="video/mp4" />
                          <source src=${videoUrl1015} type="video/mp4" />
                          <source src=${videoUrl1016} type="video/mp4" />
                          <source src=${videoUrl1017} type="video/mp4" />
                          <source src=${videoUrl1018} type="video/mp4" />
                          <source src=${videoUrl1019} type="video/mp4" />
                          <source src=${videoUrl1020} type="video/mp4" />
                          <source src=${videoUrl1021} type="video/mp4" />
                          <source src=${videoUrl1022} type="video/mp4" />
                          <source src=${videoUrl1023} type="video/mp4" />
                          <source src=${videoUrl1024} type="video/mp4" />
                          <source src=${videoUrl1025} type="video/mp4" />
                          <source src=${videoUrl1026} type="video/mp4" />
                          <source src=${videoUrl1027} type="video/mp4" />
                          <source src=${videoUrl1028} type="video/mp4" />
                          <source src=${videoUrl1029} type="video/mp4" />
                          <source src=${videoUrl1030} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl1002} type="video/mp4" />
                          <source src=${videoUrl1003} type="video/mp4" />
                          <source src=${videoUrl1004} type="video/mp4" />
                          <source src=${videoUrl1005} type="video/mp4" />
                          <source src=${videoUrl1006} type="video/mp4" />
                          <source src=${videoUrl1007} type="video/mp4" />
                          <source src=${videoUrl1008} type="video/mp4" />
                          <source src=${videoUrl1009} type="video/mp4" />
                          <source src=${videoUrl1010} type="video/mp4" />
                          <source src=${videoUrl1011} type="video/mp4" />
                          <source src=${videoUrl1012} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl1001} type="video/mp4" />
                          <source src=${videoUrl1000} type="video/mp4" />
                          <source src=${videoUrl100} type="video/mp4" />
                          <source src=${videoUrl102} type="video/mp4" />
                          <source src=${videoUrl103} type="video/mp4" />
                          <source src=${videoUrl104} type="video/mp4" />
                          <source src=${videoUrl200} type="video/mp4" />
                          <source src=${videoUrl400} type="video/mp4" />
                          <source src=${videoUrl500} type="video/mp4" />
                          <source src=${videoUrl803} type="video/mp4" />
                          <source src=${videoUrl804} type="video/mp4" />
                          <source src=${videoUrl805} type="video/mp4" />
                          <source src=${videoUrl806} type="video/mp4" />
                          <source src=${videoUrl110} type="video/mp4" />
                          <source src=${videoUrl111} type="video/mp4" />
                          <source src=${videoUrl112} type="video/mp4" />
                          <source src=${videoUrl9990} type="application/x-mpegurl" />
                          <source src=${videoUrl9991} type="application/x-mpegurl" />
                          <source src=${videoUrl9992} type="application/x-mpegurl" />
                          <source src=${videoUrl9993} type="application/x-mpegurl" />
                          <source src=${videoUrl9996} type="application/x-mpegurl" />
                          <source src=${videoUrl9997} type="application/x-mpegurl" />
                          <source src=${videoUrl9998} type="application/x-mpegurl" />
                          <source src=${videoUrl9999} type="application/x-mpegurl" />
                          <source src=${videoUrl2700} type="video/mp4" />
                          <source src=${videoUrl2701} type="video/mp4" />
                          <source src=${videoUrl2702} type="video/mp4" />
                          <source src=${videoUrl2703} type="video/mp4" />
                          <source src=${videoUrl2704} type="video/mp4" />
                          <source src=${videoUrl2705} type="video/mp4" />
                          <source src=${videoUrl2706} type="video/mp4" />
                          <source src=${videoUrl2707} type="video/mp4" />
                          <source src=${videoUrl2708} type="video/mp4" />
                          <source src=${videoUrl2709} type="video/mp4" />
                          <source src=${videoUrl2710} type="video/mp4" />
                          <source src=${videoUrl2711} type="video/mp4" />
                          <source src=${videoUrl2712} type="video/mp4" />
                          <source src=${videoUrl2713} type="video/mp4" />
                          <source src=${videoUrl2714} type="video/mp4" />
                          <source src=${videoUrl2715} type="video/mp4" />
                          <source src=${videoUrl2716} type="video/mp4" />
                          <source src=${videoUrl2717} type="video/mp4" />
                          <source src=${videoUrl2718} type="video/mp4" />
                          <source src=${videoUrl2719} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl38} type="video/mp4" />
                          <source src=${videoUrl39} type="video/mp4" />
                          <source src=${videoUrl40} type="video/mp4" />
                          <source src=${videoUrl41} type="video/mp4" />
                          <source src=${videoUrl42} type="video/mp4" />
                          <source src=${videoUrl300} type="video/mp4" />
                          <source src=${videoUrl301} type="video/mp4" />
                          <source src=${videoUrl302} type="video/mp4" />
                          <source src=${videoUrl303} type="video/mp4" />
                          <source src=${videoUrl101} type="video/mp4" />
                          <source src=${videoUrl600} type="video/mp4" />
                          <source src=${videoUrl601} type="video/mp4" />
                          <source src=${videoUrl602} type="video/mp4" />
                          <source src=${videoUrl603} type="video/mp4" />
                          <source src=${videoUrl604} type="video/mp4" />
                          <source src=${videoUrl605} type="video/mp4" />
                          <source src=${videoUrl606} type="video/mp4" />
                          <source src=${videoUrl210} type="video/mp4" />
                          <source src=${videoUrl211} type="video/mp4" />
                          <source src=${videoUrl212} type="video/mp4" />
                          <source src=${videoUrl800} type="video/mp4" />
                          <source src=${videoUrl801} type="video/mp4" />
                          <source src=${videoUrl802} type="video/mp4" />
                          <source src=${videoUrl989} type="video/mp4" />
                          <source src=${videoUrl990} type="video/mp4" />
                          <source src=${videoUrl991} type="video/mp4" />
                          <source src=${videoUrl992} type="video/mp4" />
                          <source src=${videoUrl993} type="video/mp4" />
                          <source src=${videoUrl994} type="video/mp4" />
                          <source src=${videoUrl995} type="video/mp4" />
                          <source src=${videoUrl996} type="video/mp4" />
                          <source src=${videoUrl997} type="video/mp4" />
                          <source src=${videoUrl998} type="video/mp4" />
                          <source src=${videoUrl999} type="video/mp4" />
                          <source src=${videoUrl2000} type="video/mp4" />
                          <source src=${videoUrl2001} type="video/mp4" />
                          <source src=${videoUrl2002} type="video/mp4" />
                          <source src=${videoUrl2003} type="video/mp4" />
                          <source src=${videoUrl2004} type="video/mp4" />
                          <source src=${videoUrl2005} type="video/mp4" />
                          <source src=${videoUrl2006} type="video/mp4" />
                          <source src=${videoUrl2007} type="video/mp4" />
                          <source src=${videoUrl2008} type="video/mp4" />
                          <source src=${videoUrl2009} type="video/mp4" />
                          <source src=${videoUrl2010} type="video/mp4" />
                          <source src=${videoUrl2011} type="video/mp4" />
                          <source src=${videoUrl2012} type="video/mp4" />
                          <source src=${videoUrl2013} type="video/mp4" />
                          <source src=${videoUrl2014} type="video/mp4" />
                          <source src=${videoUrl2015} type="video/mp4" />
                          <source src=${videoUrl2016} type="video/mp4" />
                          <source src=${videoUrl2017} type="video/mp4" />
                          <source src=${videoUrl2018} type="video/mp4" />
                          <source src=${videoUrl2019} type="video/mp4" />
                          <source src=${videoUrl2020} type="video/mp4" />
                          <source src=${videoUrl2021} type="video/mp4" />
                          <source src=${videoUrl2022} type="video/mp4" />
                          <source src=${videoUrl2023} type="video/mp4" />
                          <source src=${videoUrl2024} type="video/mp4" />
                          <source src=${videoUrl2025} type="video/mp4" />
                          <source src=${videoUrl2026} type="video/mp4" />
                          <source src=${videoUrl2027} type="video/mp4" />
                          <source src=${videoUrl2028} type="video/mp4" />
                          <source src=${videoUrl2029} type="video/mp4" />
                          <source src=${videoUrl2030} type="video/mp4" />
                          <source src=${videoUrl2031} type="video/mp4" />
                          <source src=${videoUrl2032} type="video/mp4" />
                          <source src=${videoUrl2033} type="video/mp4" />
                          <source src=${videoUrl2034} type="video/mp4" />
                          <source src=${videoUrl2035} type="video/mp4" />
                          <source src=${videoUrl2036} type="video/mp4" />
                          <source src=${videoUrl2037} type="video/mp4" />
                          <source src=${videoUrl2038} type="video/mp4" />
                          <source src=${videoUrl2039} type="video/mp4" />
                          <source src=${videoUrl2040} type="video/mp4" />
                          <source src=${videoUrl2041} type="video/mp4" />
                          <source src=${videoUrl2042} type="video/mp4" />
                          <source src=${videoUrl2043} type="video/mp4" />
                          <source src=${videoUrl2044} type="video/mp4" />
                          <source src=${videoUrl2045} type="video/mp4" />
                          <source src=${videoUrl2046} type="video/mp4" />
                          <source src=${videoUrl2047} type="video/mp4" />
                          <source src=${videoUrl2048} type="video/mp4" />
                          <source src=${videoUrl2049} type="video/mp4" />
                          <source src=${videoUrl2050} type="video/mp4" />
                          <source src=${videoUrl2051} type="video/mp4" />
                          <source src=${videoUrl2052} type="video/mp4" />
                          <source src=${videoUrl2053} type="video/mp4" />
                          <source src=${videoUrl2054} type="video/mp4" />
                          <source src=${videoUrl2055} type="video/mp4" />
                          <source src=${videoUrl2056} type="video/mp4" />
                          <source src=${videoUrl2057} type="video/mp4" />
                          <source src=${videoUrl2058} type="video/mp4" />
                          <source src=${videoUrl2059} type="video/mp4" />
                          <source src=${videoUrl2060} type="video/mp4" />
                          <source src=${videoUrl2061} type="video/mp4" />
                          <source src=${videoUrl2062} type="video/mp4" />
                          <source src=${videoUrl2063} type="video/mp4" />
                          <source src=${videoUrl2064} type="video/mp4" />
                          <source src=${videoUrl2065} type="video/mp4" />
                          <source src=${videoUrl2066} type="video/mp4" />
                          <source src=${videoUrl2067} type="video/mp4" />
                          <source src=${videoUrl2068} type="video/mp4" />
                          <source src=${videoUrl2069} type="video/mp4" />
                          <source src=${videoUrl2070} type="video/mp4" />
                          <source src=${videoUrl2071} type="video/mp4" />
                          <source src=${videoUrl2072} type="video/mp4" />
                          <source src=${videoUrl2073} type="video/mp4" />
                          <source src=${videoUrl2074} type="video/mp4" />
                          <source src=${videoUrl2075} type="video/mp4" />
                          <source src=${videoUrl2076} type="video/mp4" />
                          <source src=${videoUrl2077} type="video/mp4" />
                          <source src=${videoUrl2078} type="video/mp4" />
                          <source src=${videoUrl2079} type="video/mp4" />
                          <source src=${videoUrl2080} type="video/mp4" />
                          <source src=${videoUrl2081} type="video/mp4" />
                          <source src=${videoUrl2082} type="video/mp4" />
                          <source src=${videoUrl2083} type="video/mp4" />
                          <source src=${videoUrl2084} type="video/mp4" />
                          <source src=${videoUrl2085} type="video/mp4" />
                          <source src=${videoUrl2086} type="video/mp4" />
                          <source src=${videoUrl2087} type="video/mp4" />
                          <source src=${videoUrl2088} type="video/mp4" />
                          <source src=${videoUrl2089} type="video/mp4" />
                          <source src=${videoUrl2090} type="video/mp4" />
                          <source src=${videoUrl2091} type="video/mp4" />
                          <source src=${videoUrl2092} type="video/mp4" />
                          <source src=${videoUrl2093} type="video/mp4" />
                          <source src=${videoUrl2094} type="video/mp4" />
                          <source src=${videoUrl2095} type="video/mp4" />
                          <source src=${videoUrl2096} type="video/mp4" />
                          <source src=${videoUrl2097} type="video/mp4" />
                          <source src=${videoUrl2098} type="video/mp4" />
                          <source src=${videoUrl2099} type="video/mp4" />
                          <source src=${videoUrl2100} type="video/mp4" />
                          <source src=${videoUrl2101} type="video/mp4" />
                          <source src=${videoUrl2102} type="video/mp4" />
                          <source src=${videoUrl2103} type="video/mp4" />
                          <source src=${videoUrl2104} type="video/mp4" />
                          <source src=${videoUrl2105} type="video/mp4" />
                          <source src=${videoUrl2106} type="video/mp4" />
                          <source src=${videoUrl2107} type="video/mp4" />
                          <source src=${videoUrl2108} type="video/mp4" />
                          <source src=${videoUrl2109} type="video/mp4" />
                          <source src=${videoUrl2110} type="video/mp4" />
                          <source src=${videoUrl2111} type="video/mp4" />
                          <source src=${videoUrl2112} type="video/mp4" />
                          <source src=${videoUrl2113} type="video/mp4" />
                          <source src=${videoUrl2114} type="video/mp4" />
                          <source src=${videoUrl2115} type="video/mp4" />
                          <source src=${videoUrl2116} type="video/mp4" />
                          <source src=${videoUrl2117} type="video/mp4" />
                          <source src=${videoUrl2118} type="video/mp4" />
                          <source src=${videoUrl2119} type="video/mp4" />
                          <source src=${videoUrl2120} type="video/mp4" />
                          <source src=${videoUrl2121} type="video/mp4" />
                          <source src=${videoUrl2122} type="video/mp4" />
                          <source src=${videoUrl2123} type="video/mp4" />
                          <source src=${videoUrl2124} type="video/mp4" />
                          <source src=${videoUrl2125} type="video/mp4" />
                          <source src=${videoUrl2126} type="video/mp4" />
                          <source src=${videoUrl2127} type="video/mp4" />
                          <source src=${videoUrl2128} type="video/mp4" />
                          <source src=${videoUrl2129} type="video/mp4" />
                          <source src=${videoUrl2130} type="video/mp4" />
                          <source src=${videoUrl2131} type="video/mp4" />
                          <source src=${videoUrl2132} type="video/mp4" />
                          <source src=${videoUrl2133} type="video/mp4" />
                          <source src=${videoUrl2134} type="video/mp4" />
                          <source src=${videoUrl2135} type="video/mp4" />
                          <source src=${videoUrl2136} type="video/mp4" />
                          <source src=${videoUrl2137} type="video/mp4" />
                          <source src=${videoUrl2138} type="video/mp4" />
                          <source src=${videoUrl2139} type="video/mp4" />
                          <source src=${videoUrl2140} type="video/mp4" />
                          <source src=${videoUrl2141} type="video/mp4" />
                          <source src=${videoUrl2142} type="video/mp4" />
                          <source src=${videoUrl2143} type="video/mp4" />
                          <source src=${videoUrl2144} type="video/mp4" />
                          <source src=${videoUrl2145} type="video/mp4" />
                          <source src=${videoUrl2146} type="video/mp4" />
                          <source src=${videoUrl2147} type="video/mp4" />
                          <source src=${videoUrl2148} type="video/mp4" />
                          <source src=${videoUrl2149} type="video/mp4" />
                          <source src=${videoUrl2150} type="video/mp4" />
                          <source src=${videoUrl2151} type="video/mp4" />
                          <source src=${videoUrl2152} type="video/mp4" />
                          <source src=${videoUrl2153} type="video/mp4" />
                          <source src=${videoUrl2154} type="video/mp4" />
                          <source src=${videoUrl2155} type="video/mp4" />
                          <source src=${videoUrl2156} type="video/mp4" />
                          <source src=${videoUrl2157} type="video/mp4" />
                          <source src=${videoUrl2158} type="video/mp4" />
                          <source src=${videoUrl2159} type="video/mp4" />
                          <source src=${videoUrl2160} type="video/mp4" />
                          <source src=${videoUrl2161} type="video/mp4" />
                          <source src=${videoUrl2162} type="video/mp4" />
                          <source src=${videoUrl2163} type="video/mp4" />
                          <source src=${videoUrl2164} type="video/mp4" />
                          <source src=${videoUrl2165} type="video/mp4" />
                          <source src=${videoUrl2166} type="video/mp4" />
                          <source src=${videoUrl2167} type="video/mp4" />
                          <source src=${videoUrl2168} type="video/mp4" />
                          <source src=${videoUrl2169} type="video/mp4" />
                          <source src=${videoUrl2170} type="video/mp4" />
                          <source src=${videoUrl2171} type="video/mp4" />
                          <source src=${videoUrl2172} type="video/mp4" />
                          <source src=${videoUrl2173} type="video/mp4" />
                          <source src=${videoUrl2174} type="video/mp4" />
                          <source src=${videoUrl2175} type="video/mp4" />
                          <source src=${videoUrl2176} type="video/mp4" />
                          <source src=${videoUrl2177} type="video/mp4" />
                          <source src=${videoUrl2178} type="video/mp4" />
                          <source src=${videoUrl2179} type="video/mp4" />
                          <source src=${videoUrl2180} type="video/mp4" />
                          <source src=${videoUrl2181} type="video/mp4" />
                          <source src=${videoUrl2182} type="video/mp4" />
                          <source src=${videoUrl2183} type="video/mp4" />
                          <source src=${videoUrl2184} type="video/mp4" />
                          <source src=${videoUrl2185} type="video/mp4" />
                          <source src=${videoUrl2186} type="video/mp4" />
                          <source src=${videoUrl2187} type="video/mp4" />
                          <source src=${videoUrl2188} type="video/mp4" />
                          <source src=${videoUrl2189} type="video/mp4" />
                          <source src=${videoUrl2190} type="video/mp4" />
                          <source src=${videoUrl2191} type="video/mp4" />
                          <source src=${videoUrl2192} type="video/mp4" />
                          <source src=${videoUrl2193} type="video/mp4" />
                          <source src=${videoUrl2194} type="video/mp4" />
                          <source src=${videoUrl2195} type="video/mp4" />
                          <source src=${videoUrl2196} type="video/mp4" />
                          <source src=${videoUrl2197} type="video/mp4" />
                          <source src=${videoUrl2198} type="video/mp4" />
                          <source src=${videoUrl2199} type="video/mp4" />
                          <source src=${videoUrl2200} type="video/mp4" />
                          <source src=${videoUrl2201} type="video/mp4" />
                          <source src=${videoUrl2202} type="video/mp4" />
                          <source src=${videoUrl2203} type="video/mp4" />
                          <source src=${videoUrl2204} type="video/mp4" />
                          <source src=${videoUrl2205} type="video/mp4" />
                          <source src=${videoUrl2206} type="video/mp4" />
                          <source src=${videoUrl2207} type="video/mp4" />
                          <source src=${videoUrl2208} type="video/mp4" />
                          <source src=${videoUrl2209} type="video/mp4" />
                          <source src=${videoUrl2210} type="video/mp4" />
                          <source src=${videoUrl2211} type="video/mp4" />
                          <source src=${videoUrl2212} type="video/mp4" />
                          <source src=${videoUrl2213} type="video/mp4" />
                          <source src=${videoUrl2214} type="video/mp4" />
                          <source src=${videoUrl2215} type="video/mp4" />
                          <source src=${videoUrl2216} type="video/mp4" />
                          <source src=${videoUrl2217} type="video/mp4" />
                          <source src=${videoUrl2218} type="video/mp4" />
                          <source src=${videoUrl2219} type="video/mp4" />
                          <source src=${videoUrl2220} type="video/mp4" />
                          <source src=${videoUrl2221} type="video/mp4" />
                          <source src=${videoUrl2222} type="video/mp4" />
                          <source src=${videoUrl2223} type="video/mp4" />
                          <source src=${videoUrl2224} type="video/mp4" />
                          <source src=${videoUrl2225} type="video/mp4" />
                          <source src=${videoUrl2226} type="video/mp4" />
                          <source src=${videoUrl2227} type="video/mp4" />
                          <source src=${videoUrl2228} type="video/mp4" />
                          <source src=${videoUrl2229} type="video/mp4" />
                          <source src=${videoUrl2230} type="video/mp4" />
                          <source src=${videoUrl2231} type="video/mp4" />
                          <source src=${videoUrl2232} type="video/mp4" />
                          <source src=${videoUrl2233} type="video/mp4" />
                          <source src=${videoUrl2234} type="video/mp4" />
                          <source src=${videoUrl2235} type="video/mp4" />
                          <source src=${videoUrl2236} type="video/mp4" />
                          <source src=${videoUrl2237} type="video/mp4" />
                          <source src=${videoUrl2238} type="video/mp4" />
                          <source src=${videoUrl2239} type="video/mp4" />
                          <source src=${videoUrl2240} type="video/mp4" />
                          <source src=${videoUrl2241} type="video/mp4" />
                          <source src=${videoUrl2242} type="video/mp4" />
                          <source src=${videoUrl2243} type="video/mp4" />
                          <source src=${videoUrl2244} type="video/mp4" />
                          <source src=${videoUrl2245} type="video/mp4" />
                          <source src=${videoUrl2246} type="video/mp4" />
                          <source src=${videoUrl2247} type="video/mp4" />
                          <source src=${videoUrl2248} type="video/mp4" />
                          <source src=${videoUrl2249} type="video/mp4" />
                          <source src=${videoUrl2250} type="video/mp4" />
                          <source src=${videoUrl2251} type="video/mp4" />
                          <source src=${videoUrl2252} type="video/mp4" />
                          <source src=${videoUrl2253} type="video/mp4" />
                          <source src=${videoUrl2254} type="video/mp4" />
                          <source src=${videoUrl2255} type="video/mp4" />
                          <source src=${videoUrl2256} type="video/mp4" />
                          <source src=${videoUrl2257} type="video/mp4" />
                          <source src=${videoUrl2258} type="video/mp4" />
                          <source src=${videoUrl2259} type="video/mp4" />
                          <source src=${videoUrl2260} type="video/mp4" />
                          </video>
                          </div>`;
      // 下面为调试使用,不喜欢的可以把两段注释中间的删掉(显示番号和预览片地址:检查是否存在番号错误\张冠李戴等现象)
      //  片商faleno.jp内部地址 暂不支持
      if (code.match(/[a-zA-Z]{2,12}-\d{2,12}/i)) {
        if (code.match(/^(ADN-|ADS-|ATAD-|ATID-|ATKD-|ATVR-|AVGL-002|AVGL-102|AVOP-002|AVOP-164|AVOP-263|AVOP-355|AVOP-445|DSP-|JBD-|PFES-007|PFES-029|RBD-|RBK-|SAME-|SHK-|SHKD-|SSPD-|AZSD-|YUJ-)/i)) {
          var host = 'https://attackers.net/works/detail';
          var maker = 'Attackers(凌辱剧情专门制造商)';
        } else if (code.match(/^(AVGL-105|AVOP-454|AVOP-305|AVOP-203|AVOP-125|AVOP-014|DMM-|EBOD-|EBVR-|EYAN-|MKCK-|PFES-014|PFES-051|EBWH-)/i)) {
          var host = 'https://av-e-body.com/works/detail';
          var maker = 'Av-E-BODY(各类单体女优制造商)';
        } else if (code.match(/^(OPVR-|OPBD-|OPUD-|AAJB-006|AVOP-135|AVGL-114|AAJB-006)/i)) {
          var host = 'https://av-opera.jp/works/detail';
          var maker = 'Av-opera(恋屎癖专门制造商)';
        } else if (code.match(/^(BF-|PFES-|AVGL-134|AVOP-386)/i)) {
          var host = 'https://befreebe.com/works/detail';
          var maker = 'Befreebe(Cosplay单体女优制造商)';
        } else if (code.match(/^(AVOP-309|AVOP-205|AVOP-064|BBI-|BEB-|BIB-|BID-|BIST-|BWB-|CJOB-|CJOD-|CJVR-|PFES-054)/i)) {
          var host = 'https://bi-av.com/works/detail';
          var maker = 'Bi-av美(痴女专门制造商)';
        } else if (code.match(/^(AVOP-428|AVOP-320|AVOP-272|BBAN-|BBSS-|BBVR-|LLAN-|PFES-010|PFES-043|PTPFES-)/i)) {
          var host = 'https://bibian-av.com/works/detail';
          var maker = 'Bibian-avビビアン(女同性恋专门制造商)';
        } else if (code.match(/^(AVGL-128|AVOP-423|AVOP-319|AVOP-256|AVOP-169|AVOP-061|AVOPVR-025|DASD-|DASS-|DAZD-|DMM-|DSVR-|KDASD-|PFES-015|PFES-041|PLA-|PLB-)/i)) {
          var host = 'https://dasdas.jp/works/detail';
          var maker = 'Dasdasダスッ！(QJ中出专门制造商)';
        } else if (code.match(/^(AVOP-451|AVOP-304|AVOP-207|AVOP-174|AVOP-041|FCVR-|FINH-|GCF-|JFB-|JUFE-|JUNY-|NIMA-|NYB-|PFES-002|PFES-034)/i)) {
          var host = 'https://fitch-av.com/works/detail';
          var maker = 'Fitch(熟女、人妻专门制造商)';
        } else if (code.match(/^(AVGL-|HJBB-|HJMO-|AVOP-344|AVOP-226)/i)) {
          var host = 'https://hajimekikaku.com/works/detail';
          var maker = 'Hajimekikaku宇宙企划(素人女优制造商)';
        } else if (code.match(/^(HBLA-|HBVR-|HHF-|HHHVR-|HUNBL-|HUNT-|HUNTA-|HUNTB-|HUNVR-|HUNVRC-|PFES-008|PFES-044|ROYD-|TYSF-)/i)) {
          var host = 'https://hhh-av.com/works/detail';
          var maker = 'Hhh-av(Hunter)';
        } else if (code.match(/^(AVOP-410|AVOP-314|AVOPVR-042|HMN-|HND-|HNDB-|HNDS-|HNIM-|HNJC-|HNKY-|HNSE-|HNTV-|HNVR-|KRND-|PFES-022|PFES-055)/i)) {
          var host = 'https://honnaka.jp/works/detail';
          var maker = 'Honnaka本中(中出専门制造商)';
        } else if (code.match(/^(ALAD-|AN-|AND-|ANPD-|AVGL-001|AVGL-101|AVOP-401|AVOP-301|AVOP-201|AVOP-124|AVOP-001|AVOPVR-001|COSD-|DAN-|HP-|HPD-|IDBD-|IPIT-|IPSD-|IPTD-|IPVR-|IPX-|IPZZ-|IPZ-|KIPX-|PFES-012|PFES-038|SUPD-|SUPZ-)/i)) {
          var host = 'https://ideapocket.com/works/detail';
          var maker = 'IdeaPocket(专属女优制造商/开发单体女优为主)';
        } else if (code.match(/^(AVGL-012|AVGL-117|AVOP-056|AVOP-104|AVOP-212|AVOP-348|AVOP-437|CAWD-|KANE-|KAPD-|KAVR-|KAWD-|KCAWD-|KWBD-|KWSD-|KWSR-|NTRK-|PFES-021|PFES-032)/i)) {
          var host = 'https://kawaiikawaii.jp/works/detail';
          var maker = 'kawaii(女大学生专门制造商)';
        } else if (code.match(/^(BLK-|KIBD-|KIFD-|KIRD-|KISD-|KIVR-|SET-|AVOP-349)/i)) {
          var host = 'https://kirakira-av.com/works/detail';
          var maker = 'kira☆kira(辣妹专门制造商)';
        } else if (code.match(/^(ACHJ-|AVOP-187|AVOP-282|AVOP-464|JFB-|JUC-|JUK-|JUKD-|JUL-|JUMS-|JUQ-|JUSD-|JUVR-|JUX-|JUY-|MDON-|OBA-|OBE-|PFES-006|PFES-039|ROE-|ROEB-|URE-|UREC-)/i)) {
          var host = 'https://madonna-av.com/works/detail';
          var maker = 'Madonna(熟女、人妻专门制造商)';
        } else if (code.match(/^(AOM-|MMND-|MMVR-|MMXD-|AVOP-143)/i)) {
          var host = 'https://miman.jp/works/detail';
          var maker = 'Miman(巨乳少女制造商)';
        } else if (code.match(/^(EMLB-|MVR-|MISM-|AVOP-447)/i)) {
          var host = 'https://mko-labo.net/works/detail';
          var maker = 'Mko-labo(M女専门制造商)';
        } else if (code.match(/^(AVGL-027|AVOP-210|AVOP-009|FKMDZ-|KMIDE-|MDED-|MDE-|MDFD-|MDF-|MDGD-|MDG-|MDID-|MDI-|MDJD-|MDJ-|MDLD-|MDL-|MDMD-|MDOD-|MDPD-|MDQD-|MDRD-|MDUD-|MDVD-|MDVR-|MDWD-|MIAA-|MIAD-|MIAE-|MIAS-|MIBD-|MIDD-|MIDE-|MIDV-|MIFD-|MIGD-|MIID-|MIMK-|MIMU-|MINT-|MIQD-|MIRD-|MIVD-|MIXS-|MIZD-|OPEN-|PFES-001|PFES-028)/i)) {
          var host = 'https://moodyz.com/works/detail';
          var maker = 'MOODYZ(专属女优制造商)';
        } else if (code.match(/^(AVGL-028|AVGL-143|AVOP-381|AVOP-228|AVOP-163|AVOP-047|MUCD-|MUDR-|MUKC-|MUKD-|MUVR-|NMU-|PFES-016|PFES-050|PTPFES-|SMCD-)/i)) {
          var host = 'https://muku.tv/works/detail';
          var maker = '無垢(JK制服美少女专门制造商)';
        } else if (code.match(/^(AVGL-008|AVGL-111|AVOP-316|AVOP-245|AVOP-166|MVBD-|MVFD-|MVGD-|MVMD-|MVSD-|PFES-019|PFES-046)/i)) {
          var host = 'https://mvg.jp/works/detail';
          var maker = 'エムズビデオグループMVG（吞精专门制造商）';
        } else if (code.match(/^(NJVR-|NNPJ-|NPJB-)/i)) {
          var host = 'https://nanpa-japan.jp/works/detail';
          var maker = 'Nanpa-japan(素人猎艳専门制造商)';
        } else if (code.match(/^(AVGL-113|AVOP-418|AVOP-383|AVOP-246|AVOP-147|AVOP-055|PFES-017|PFES-052|PPBD-|PPFD-|PPMD-|PPPD-|PPPE-|PPSD-|PPUD-|PPVR-)/i)) {
          var host = 'https://oppai-av.com/works/detail';
          var maker = 'OPPAI(恋胸癖専门制造商)';
        } else if (code.match(/^(AVGL-024|AVGL-135|AVOP-239|AVOP-129|AVOP-067|KPRED-|PBD-|PFES-009|PFES-048|PGD-|PID-|PJD-|PRED-|PRMJ-|PRTD-|PRVR-|PTV-|PXD-)/i)) {
          var host = 'https://premium-beauty.com/works/detail';
          var maker = 'Premium(专属女优制造商/单体女优)';
        } else if (code.match(/^(RVR-|RBB-|RKI-|AVOP-412)/i)) {
          var host = 'https://rookie-av.jp/works/detail';
          var maker = 'Rookie-av(企划专门制造商)';
        } else if (code.match(/^(AVOP-127|FKONE-|KSSIS-|OFJE-|ONE-|ONED-|ONSD-|PFES-005|PFES-040|SIVR-|SNIS-|SOE-|SPND-|SPS-|SSIS-|SSNI-)/i)) {
          var host = 'https://s1s1s1.com/works/detail';
          var maker = 'S1 NO.1 STYLE(专属女优制造商/人气女优与美形女优)';
        } else if (code.match(/^(AVGL-018|AVGL-129|AVOP-368|AVOP-185|AVOP-032|MBYD-|MDYD-|MEVR-|MEYD-|MNYD-|MTYD-|MXYD-|PFES-013|PFES-047)/i)) {
          var host = 'https://tameikegoro.jp/works/detail';
          var maker = '溜池ゴロー(熟女、人妻专门制造商)';
        } else if (code.match(/^(CLVR-|STOL-|CLUB-|AVOP-330)/i)) {
          var host = 'https://to-satsu.com/works/detail';
          var maker = 'To-satsu(按摩偷窥専门制造商)';
        } else if (code.match(/^(VVVD-|VICD-|VIZD-|VSPD-|AVGL-107|AVOP-165)/i)) {
          var host = 'https://v-av.com/works/detail';
          var maker = 'V-av(SM专门制造商)';
        } else if (code.match(/^(JUFD-)/i)) {
          if (code.match(/^JUFD-(0\d{2}|1[0-3]\d|14[0-3])/i)) {
            var host = 'https://madonna-av.com/works/detail';
            var maker = 'Madonna(熟女、人妻专门制造商)';
          } else {
            var host = 'https://fitch-av.com/works/detail';
            var maker = 'Fitch(熟女、人妻专门制造商)';
          }
        } else {
          var host = 'https://wanz-factory.com/works/detail';
          var maker = 'Wanz Factory(中出单体女优制造商)';
        }
        let codee = code.replace("-", "");
        GM_xmlhttpRequest({
          url: host + `/` + codee,
          method: "GET",
          responseType: "document",
          onload: ({ response }) => {
            var isLoading = true;
            if (!response) {
              isLoading = false;
              return;
            }
            const avsrc = response
              ?.querySelector(".video video")?.getAttribute("src") ?? "";
            if (!avsrc) {
              isLoading = false;
              return;
            }
            let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                          ' + code + ' ' + avsrc + ' <a href="' + avsrc + '" target="_blank"><strong>播放</strong></a>\
                          <BR>此处为片商  <a href="' + host + `/` + codee + '" target="_blank"><strong>"' + maker + '"</strong></a>  直获地址,区别与上面的规则匹配,如果存在资源,可能比规则匹配速度快些\
                          </div>');
            $(obj).before(video)
          },
        });
      }
      // 不喜欢的可以把上下两段注释中间的删掉
      // sod start avsrc参数只为校验页面是否存在 此页面的mp4播放地址不可外链 不可直接播放
      if (code.match(/^(STARS-|SODS-|DSVR-)/i)) {
        var host = 'https://ec.sod.co.jp/prime/videos/sample.php?id=';
        var maker = 'SOD Create';
        GM_xmlhttpRequest({
          url: host + code,
          method: "GET",
          responseType: "document",
          onload: ({ response }) => {
            var isLoading = true;
            if (!response) {
              isLoading = false;
              return;
            }
            const avsrc = response
              ?.querySelector(".videos_favoriteb a")?.getAttribute("href") ?? "";
            if (!avsrc) {
              isLoading = false;
              return;
            }
            let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                          ' + code + '：此处为片商  <a href="' + host + code + '" target="_blank"><strong>"' + maker + '"</strong></a>  预览页面,区别与上面的规则匹配,如显示此提示，可移步查看\
                          </div>');
            $(obj).before(video)
          },
        });
      }
      // sod end
      $(obj).before(video)
    }
    //msin 开
    addVideoMSIN (code, objMSIN) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let vSeries = codeArr[0].toLowerCase(); // 番号系列
      let videoSeries = codeArr[0].replace("BDCLB", "CLB").replace("TMRD", "RD").replace("GRABD", "GRACE").replace("PKGF", "PKPD").replace("BUNF", "DUNF").replace("RRZ", "HRZ").replace("ROC", "HOC").replace("RNU", "HNU").toLowerCase(); //grabd更换为grace
      let videoNo = format_zero(codeArr[1], 5); //不足5位数补0
      let idNum = codeArr[1];
      let postfix = "_dm_w"; // 3(分辨率默认定于为 _dmb_w 和 _dm_w,此两项无需在对象列表声明)
      let chehz = ""; // 4(车牌后缀)此项定义来源:大部分完整车牌都有固定规律,但还是出现了个别番号系列在完整车牌后还加了个别字母 例如:a_dmb_w.mp4\re_dmb_w.mp4等特殊规则，有人会问为什么不加入postfix中，细心的会发现这个字母还会再上级路径出现，所以特别摘出来定义。后期会逐渐在对象列表添加，删除下面的特例规则。
      let cheqz = ""; // 1(车牌前缀)
      if (fanxi[videoSeries]) {
        cheqz = fanxi[videoSeries][0] ? fanxi[videoSeries][0] : cheqz;
        chehz = fanxi[videoSeries][3] ? fanxi[videoSeries][3] : chehz;
        postfix = fanxi[videoSeries][2] ? fanxi[videoSeries][2] : postfix;
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }
      let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                    <iframe src="https://db.msin.jp/.play/sample.fanza?id=' + cheqz + vSeries + videoNo + chehz + '" style="width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;">\
                    </iframe>\
                    </div>');
      $(objMSIN).before(video)
    }
    //msin 终
    //MGS- 开
    addVideoMGS (code, objMGS) {
      let codeArr = code.split(/-/); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let vSeries = codeArr[0].replace(/^[0-9]+/g, "").toUpperCase(); // 番号系列
      let videoSeries = codeArr[0].toLowerCase(); //grabd更换为grace
      let idNum = codeArr[1];
      let postfix = "_dm_w"; // 3(分辨率默认定于为 _dmb_w 和 _dm_w,此两项无需在对象列表声明)
      let chehz = ""; // 4(车牌后缀)此项定义来源:大部分完整车牌都有固定规律,但还是出现了个别番号系列在完整车牌后还加了个别字母 例如:a_dmb_w.mp4\re_dmb_w.mp4等特殊规则，有人会问为什么不加入postfix中，细心的会发现这个字母还会再上级路径出现，所以特别摘出来定义。后期会逐渐在对象列表添加，删除下面的特例规则。
      let cheqz = ""; // 1(车牌前缀)
      if (fanxi[videoSeries]) {
        cheqz = fanxi[videoSeries][0] ? fanxi[videoSeries][0] : cheqz;
        chehz = fanxi[videoSeries][3] ? fanxi[videoSeries][3] : chehz;
        postfix = fanxi[videoSeries][2] ? fanxi[videoSeries][2] : postfix;
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }
      let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                            <iframe src="https://www.mgstage.com/api/affiliate_sample_movie.php?p=' + cheqz + vSeries + '-' + codeArr[1] + chehz + '&w=1060&h=630" style="width:99%;height:640px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;">\
                            </iframe>\
                            </div>');
      $(objMGS).before(video)
    }
    //MGS- 终
    addVideoN (code, objN) {
      let videoUrl = 'https://my.cdn.tokyo-hot.com/media/samples/' + code + '.mp4';
      if (null != location.href.match(/crazyasia/i)) {
        videoUrl = 'https://my.cdn.tokyo-hot.com/media/samples/' + code + '.mp4'
      }  //东京热 tokyo-hot AB-001
      if (null != code.match(/RED048/i)) {
        videoUrl = 'https://my.cdn.tokyo-hot.com/media/samples/5923.mp4'
      }
      if (null != code.match(/RED065/i)) {
        videoUrl = 'https://my.cdn.tokyo-hot.com/media/samples/5924.mp4'
      }
      let videoUrl2 = 'https://ppvclips02.aventertainments.com/00m3u8/' + code + '/' + code + '.mp4';
      let videoUrl3 = 'https://my.cdn.tokyo-hot.com/media/samples/' + code.toLowerCase() + '.mp4';
      //https://ppvclips02.aventertainments.com/00m3u8/RED170/RED170.m3u8
      //https://ppvclips02.aventertainments.com/00m3u8/RHJ-210/RHJ-210.m3u8
      //https://ppvclips02.aventertainments.com/00m3u8/RED170/stream-2-2200000/index.m3u8
      let videoUrl4 = 'https://ppvclips02.aventertainments.com/00m3u8/' + code + '/' + code + '.m3u8';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl4} type="application/x-mpegurl" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          </video>
                          </div>`;
      $(objN).before(video)
    }
    addVideoY (code, objY) {
      let videoUrl = 'http://smovie.1pondo.tv/sample/movies/' + code + '/1080p.mp4';
      let videoUrl2 = 'https://smovie.1pondo.tv/sample/movies/' + code + '/480p.mp4';
      let videoUrl3 = 'https://smovie.1pondo.tv/sample/movies/' + code + '/520p.mp4';
      let videoUrl4 = 'https://smovie.1pondo.tv/sample/movies/' + code + '/720p.mp4';
      let videoUrl5 = 'https://ppvclips02.aventertainments.com/01m3u8/1pon_' + code + '/1pon_' + code + '.m3u8'; //  https://ppvclips02.aventertainments.com/01m3u8/1pon_010323_001/1pon_010323_001.m3u8
      let videoUrl6 = 'https://fms.1pondo.tv/sample/' + code + '/ts.1080p.mp4.m3u8'; // https://fms.1pondo.tv/sample/010323_001/ts.1080p.mp4.m3u8
      //一本道 +pacopacomama 数字规则一致
      let videoUrl7 = 'https://fms.pacopacomama.com/hls/sample/pacopacomama.com/' + code + '/1080p.mp4';
      let videoUrl8 = 'https://fms.pacopacomama.com/hls/sample/pacopacomama.com/' + code + '/720p.mp4';
      let videoUrl9 = 'https://smovie.pacopacomama.com/sample/movies/' + code + '/480p.mp4';
      let videoUrl10 = 'http://smovie.1pondo.tv/sample/movies/' + code + '/480p.mp4';
      // 013123_788 https://smovie.pacopacomama.com/sample/movies/013123_788/480p.mp4
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="application/x-mpegurl" />
                          <source src=${videoUrl6} type="application/x-mpegurl" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          </video>
                          </div>`;
      $(objY).before(video)
    }
    addVideoC (code, objC) {
      let videoUrl = 'https://smovie.caribbeancom.com/sample/movies/' + code + '/1080p.mp4';
      let videoUrl2 = 'https://smovie.caribbeancom.com/sample/movies/' + code + '/720p.mp4';
      let videoUrl3 = 'https://smovie.caribbeancom.com/sample/movies/' + code + '/480p.mp4';
      //加勒比
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          </video>
                          </div>`;
      $(objC).before(video)
    }
    addVideoH (code, objH) {
      let videoUrl = 'https://v4.dmmav.top/sample/movies/' + code + '/1080p.mp4';
      let videoUrl2 = 'https://smovie.10musume.com/sample/movies/' + code + '/1080p.mp4';
      let videoUrl3 = 'https://smovie.10musume.com/sample/movies/' + code + '/720p.mp4';
      let videoUrl4 = 'https://v4.dmmav.top/sample/movies/' + code + '/720p.mp4';
      let videoUrl5 = 'https://smovie.10musume.com/sample/movies/' + code + '/520p.mp4';
      let videoUrl6 = 'https://v4.dmmav.top/sample/movies/' + code + '/520p.mp4';
      let videoUrl7 = 'https://smovie.10musume.com/sample/movies/' + code + '/480p.mp4';
      let videoUrl8 = 'https://v4.dmmav.top/sample/movies/' + code + '/480p.mp4';
      //天然むすめ https://smovie.10musume.com/sample/movies/052319_01/1080p.mp4
      //天然むすめ https://v4.dmmav.top/sample/movies/051822_01/480p.mp4 无需翻墙
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          </video>
                          </div>`;
      $(objH).before(video)
    }
    addVideoPM (code, objPM) {
      let videoUrl = 'https://fms.pacopacomama.com/hls/sample/pacopacomama.com/' + code + '/1080p.mp4';
      let videoUrl2 = 'https://fms.pacopacomama.com/hls/sample/pacopacomama.com/' + code + '/720p.mp4';
      let videoUrl9 = 'https://smovie.pacopacomama.com/sample/movies/' + code + '/480p.mp4';
      //https://fms.pacopacomama.com/hls/sample/pacopacomama.com/103115_520/1080p.mp4
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          </video>
                          </div>`;
      $(objPM).before(video)
    }
    // VR-系列 特殊系列:3DSVR-  https://pv3001.dmm.com/vrsample/2/2wp/2wpvr00197/2wpvr00197vrlite.mp4
    addVideoVR (code, objVR) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let idNum = codeArr[1];
      if (fanxi[videoSeries]) {
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }//https://pv3001.dmm.com/vrsample/h/h_1/h_1285bikmvr00162/h_1285bikmvr00162vrlite.mp4
      let videoUrl = 'https://pv3001.dmm.com/vrsample/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'vrlite.mp4';
      if (null != code.match(/^(ADVR-073)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0304/43adv0304_sm_s.mp4' }
      if (null != code.match(/^(ADVR-083)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advr0083/43advr0083_sm_s.mp4' }
      if (null != code.match(/^(ADVR-099)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0344/43adv0344_sm_s.mp4' }
      if (null != code.match(/^(ADVR-110)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0357/43adv0357_sm_s.mp4' }
      if (null != code.match(/^(ADVR-110)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0357/43adv0357_sm_s.mp4' }
      if (null != code.match(/^(ADVR-115)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0364/43adv0364_sm_s.mp4' }
      if (null != code.match(/^(ADVR-137)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0393/43adv0393_sm_s.mp4' }
      if (null != code.match(/^(ADVR-138)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0395/43adv0395_sm_s.mp4' }
      if (null != code.match(/^(ADVR-139)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0396/43adv0396_sm_s.mp4' }
      if (null != code.match(/^(ADVR-142)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43adv0403/43adv0403_sm_s.mp4' }
      if (null != code.match(/^(ADVR-149)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advvsr0423/43advvsr0423_sm_s.mp4' }
      if (null != code.match(/^(ADVR-158)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advvsr0436/43advvsr0436_sm_s.mp4' }
      if (null != code.match(/^(ADVR-159)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advvsr0439/43advvsr0439_sm_s.mp4' }
      if (null != code.match(/^(ADVR-160)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advvsr0440/43advvsr0440_sm_s.mp4' }
      if (null != code.match(/^(ADVR-246)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advvsr0425/43advvsr0425_sm_s.mp4' }
      if (null != code.match(/^(ADVR-515)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/43a/43advr0515r/43advr0515r_sm_s.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/vrsample/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/vrsample/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/vrsample/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/vrsample/h/h_9/h_955' + videoSeries + videoNo + '/h_955' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1248' + videoSeries + videoNo + '/h_1248' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1321' + videoSeries + videoNo + '/h_1321' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1245' + videoSeries + videoNo + '/h_1245' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/vrsample/5/55' + videoSeries[0] + '/55' + videoSeries + videoNo + '/55' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/vrsample/2/2' + videoSeries.substr(0, 2) + '/2' + videoSeries + videoNo + '/2' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1127' + videoSeries + videoNo + '/h_1127' + videoSeries + videoNo + 'vrlite.mp4';	// GOPJ-382 https://pv3001.dmm.com/vrsample/h/h_1/h_1127gopj00382/h_1127gopj00382vrlite.mp4
      let videoUrl17 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1468' + videoSeries + videoNo + '/h_1468' + videoSeries + videoNo + 'vrlite.mp4'; // COSVR-001 https://pv3001.dmm.com/vrsample/h/h_1/h_1468cosvr00001/h_1468cosvr00001vrlite.mp4
      let videoUrl18 = 'https://pv3001.dmm.com/vrsample/h/h_1/h_1256' + videoSeries + videoNo + '/h_1256' + videoSeries + videoNo + 'vrlite.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/5/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + 'r/' + videoSeries + codeArr[1] + 'r_sm_s.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1248' + videoSeries + videoNo + '/h_1248' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1248' + videoSeries + videoNo + '/h_1248' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_173' + videoSeries + videoNo + '/h_173' + videoSeries + videoNo + '_dm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          </video>
                          </div>`;
      // sod start avsrc参数只为校验页面是否存在 此页面的mp4播放地址不可外链 不可直接播放
      if (code.match(/^(STARS-|SODS-|DSVR-)/i)) {
        var host = 'https://ec.sod.co.jp/prime/videos/sample.php?id=';
        var maker = 'SOD Create';
        let codee = code.replace("DSVR", "3DSVR");
        GM_xmlhttpRequest({
          url: host + codee,
          method: "GET",
          responseType: "document",
          onload: ({ response }) => {
            var isLoading = true;
            if (!response) {
              isLoading = false;
              return;
            }
            const avsrc = response
              ?.querySelector(".videos_favoriteb a")?.getAttribute("href") ?? "";
            if (!avsrc) {
              isLoading = false;
              return;
            }
            let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                          ' + code + '：此处为片商  <a href="' + host + codee + '" target="_blank"><strong>"' + maker + '"</strong></a>  预览页面,区别与上面的规则匹配,如显示此提示，可移步查看\
                          </div>');
            $(objVR).before(video)
          },
        });
      }
      // sod end
      $(objVR).before(video)
    }
    //适配dandan-系列 全5位00 DMM分辨率 mhb_w.mp4=3000 kbps\dmb_w.mp4=1500 kbps\dm_w.mp4=1000 kbps\sm_w.mp4=300 kbps
    // MDTM-系列 1、已有两种84和m开头 2、id仅有3位数  MDTM-804 https://pv3001.dmm.com/litevideo/freepv/m/mdt/mdtm00804/mdtm00804_dmb_w.mp4 https://pv3001.dmm.com/litevideo/freepv/8/84m/84mdtm528/84mdtm528_dmb_w.mp4
    addVideoMDTM (code, objMDTM) {
      var reg = /(\d{2,15})/i;
      var qhzNum = code.match(reg)[0];
      let codeArr = code.replace("TKZUKO", "ZUKO").replace("TKXRW", "XRW").replace("TKWANZ", "WANZ").replace("TKVRTM", "VRTM").replace("TKURAD", "URAD").replace("TKUMSO", "UMSO").replace("TKTYOD", "TYOD").replace("TKTMVI", "TMVI").replace("TKTMHP", "TMHP").replace("TKTMEM", "TMEM").replace("TKTMDI", "TMDI").replace("TKTEAM", "TEAM").replace("TKTAMM", "TAMM").replace("TKSORA", "SORA").replace("TKSOE", "SOE").replace("TKPGD", "PGD").replace("TKPID", "PID").replace("TKPLA", "PLA").replace("TKREAL", "REAL").replace("TKRKI", "RKI").replace("TKSERO", "SERO").replace("TKSIB", "SIB").replace("TKMDB", "MDB").replace("TKMDHC", "MDHC").replace("TKMDJM", "MDJM").replace("TKMDLJ", "MDLJ").replace("TKMDNH", "MDNH").replace("TKMDOG", "MDOG").replace("TKMDPW", "MDPW").replace("TKMDS", "MDS").replace("TKMDSH", "MDSH").replace("TKMDSR", "MDSR").replace("TKMDTM", "MDTM").replace("TKMEYD", "MEYD").replace("TKMIDD", "MIDD").replace("TKMIDE", "MIDE").replace("TKMIGD", "MIGD").replace("TKMILD", "MILD").replace("TKMIMK", "MIMK").replace("TKMKMP", "MKMP").replace("TKMRXD", "MRXD").replace("TKMUKD", "MUKD").replace("TKMUM", "MUM").replace("TKMUML", "MUML").replace("TKMUNJ", "MUNJ").replace("TKMVSD", "MVSD").replace("TKNDRA", "NDRA").replace("TKODFA", "ODFA").replace("TKODFM", "ODFM").replace("TKODFR", "ODFR").replace("TKDVAJ", "DVAJ").replace("TKDXMG", "DXMG").replace("TKEBOD", "EBOD").replace("TKEYAN", "EYAN").replace("TKGDTM", "GDTM").replace("TKGENT", "GENT").replace("TKGROO", "GROO").replace("TKHERY", "HERY").replace("TKHND", "HND").replace("TKHNDB", "HNDB").replace("TKHNDS", "HNDS").replace("TKHRRB", "HRRB").replace("TKIDBD", "IDBD").replace("TKILLE", "ILLE").replace("TKINCT", "INCT").replace("TKIPSD", "IPSD").replace("TKIPZ", "IPZ").replace("TKJUC", "JUC").replace("TKJUFD", "JUFD").replace("TKJUX", "JUX").replace("TKKAWD", "KAWD").replace("TKKIRD", "KIRD").replace("TKKRND", "KRND").replace("TKLZTD", "LZTD").replace("TKBI", "KBI").replace("TKBF", "BF").replace("TKAMEB", "AMEB").replace("TKAPKH", "APKH").replace("TKARBB", "ARBB").replace("TKARM", "ARM").replace("TKAWT", "AWT").replace("TKBBI", "BBI").replace("TKBDMDS", "BDMDS").replace("TKBDMILD", "BDMILD").replace("TKBDPKMP", "BDPKMP").replace("TKBLK", "BLK").replace("TKBOKD", "BOKD").replace("TKCEAD", "CEAD").replace("TKCESD", "CESD").replace("TKCHIJ", "CHIJ").replace("TKCND", "CND").replace("TKCRMN", "CRMN").replace("TKDASD", "DASD").replace("TKDBNG", "DBNG").replace("TKDIGI", "DIGI").replace("TKIPX", "IPX").split(/-/);
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(qhzNum, 5);
      let idNum = codeArr[1];
      if (fanxi[videoSeries]) {
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }
      let postfix = "_dm_w"; // 3(分辨率默认定于为 _dmb_w 和 _dm_w,此两项无需在对象列表声明)
      let chehz = ""; // 4(车牌后缀)此项定义来源:大部分完整车牌都有固定规律,但还是出现了个别番号系列在完整车牌后还加了个别字母 例如:a_dmb_w.mp4\re_dmb_w.mp4等特殊规则，有人会问为什么不加入postfix中，细心的会发现这个字母还会再上级路径出现，所以特别摘出来定义。后期会逐渐在对象列表添加，删除下面的特例规则。
      let cheqz = ""; // 1(车牌前缀)
      if (fanxi[videoSeries]) {
        cheqz = fanxi[videoSeries][0] ? fanxi[videoSeries][0] : cheqz;
        chehz = fanxi[videoSeries][3] ? fanxi[videoSeries][3] : chehz;
        postfix = fanxi[videoSeries][2] ? fanxi[videoSeries][2] : postfix;
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + qhzNum + '/84' + videoSeries + qhzNum + '_mhb_w.mp4';
      if (null != code.match(/^(TKC-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/ktk/ktkc003/ktkc003_dm_w.mp4' }
      if (null != code.match(/^(TKC-03)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/ktk/ktkc003/ktkc003_dm_w.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + qhzNum + '/84' + videoSeries + qhzNum + '_dmb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + qhzNum + '/84' + videoSeries + qhzNum + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + qhzNum + '/84' + videoSeries + qhzNum + '_sm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + qhzNum + '/' + videoSeries + qhzNum + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + qhzNum + '/' + videoSeries + qhzNum + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + qhzNum + '/' + videoSeries + qhzNum + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + qhzNum + '/' + videoSeries + qhzNum + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + qhzNum + '/3' + videoSeries + qhzNum + '_mhb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + qhzNum + '/3' + videoSeries + qhzNum + '_dmb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + qhzNum + '/3' + videoSeries + qhzNum + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + qhzNum + '/3' + videoSeries + qhzNum + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + videoNo + '/3' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + videoNo + '/3' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + videoNo + '/3' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + videoNo + '/3' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + qhzNum + '/h_910' + videoSeries + qhzNum + '_mhb_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + qhzNum + '/h_910' + videoSeries + qhzNum + '_dmb_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + qhzNum + '/h_910' + videoSeries + qhzNum + '_dm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + qhzNum + '/h_910' + videoSeries + qhzNum + '_sm_w.mp4';
      let videoUrl1002 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1003 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl1004 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1005 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + qhzNum + '/' + videoSeries + qhzNum + 'dm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl1002} type="video/mp4" />
                          <source src=${videoUrl1003} type="video/mp4" />
                          <source src=${videoUrl1004} type="video/mp4" />
                          <source src=${videoUrl1005} type="video/mp4" />
                          </video>
                          </div>`;
      $(objMDTM).before(video)
    }
    //db无码legsjapan系列 Digital J 制作商  因此系列地址无规则，用的编号后随机字符，所以把所有数据弄下来啦
    addVideolegsjapan (code, objlegsjapan) {
      let videoUrl = 'https://cdn.legsjapan.com/samples/003f7386/sample.mp4'; //如果脚本数据里没有则默认显示003的预览
      if (code.indexOf('003') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/003f7386/sample.mp4' }
      if (code.indexOf('005') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/005svnvl/sample.mp4' }
      if (code.indexOf('007') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/007d8q8a/sample.mp4' }
      if (code.indexOf('009') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/009l3sw9/sample.mp4' }
      if (code.indexOf('011') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/011awxdf/sample.mp4' }
      if (code.indexOf('013') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/013h4raz/sample.mp4' }
      if (code.indexOf('015') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/015eu2rm/sample.mp4' }
      if (code.indexOf('0188') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0188kl4g/sample.mp4' }
      if (code.indexOf('020') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/020z6z0t/sample.mp4' }
      if (code.indexOf('022') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/022b4rc3/sample.mp4' }
      if (code.indexOf('024') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/024ewta0/sample.mp4' }
      if (code.indexOf('026') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/026wbfmu/sample.mp4' }
      if (code.indexOf('02889') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/02889gzs/sample.mp4' }
      if (code.indexOf('030644') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/030644s6/sample.mp4' }
      if (code.indexOf('033') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/033pgjlv/sample.mp4' }
      if (code.indexOf('035') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/035ctn5t/sample.mp4' }
      if (code.indexOf('037') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/037pryla/sample.mp4' }
      if (code.indexOf('039') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/039vk0te/sample.mp4' }
      if (code.indexOf('041') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/041s8ktd/sample.mp4' }
      if (code.indexOf('043') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/043si18i/sample.mp4' }
      if (code.indexOf('045') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/045ceuwi/sample.mp4' }
      if (code.indexOf('0489') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0489ytob/sample.mp4' }
      if (code.indexOf('050') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/050i9s31/sample.mp4' }
      if (code.indexOf('0523') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0523dvo4/sample.mp4' }
      if (code.indexOf('0548') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0548r56u/sample.mp4' }
      if (code.indexOf('056') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/056cq8ju/sample.mp4' }
      if (code.indexOf('058') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/058cwrag/sample.mp4' }
      if (code.indexOf('060') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/060wfd8z/sample.mp4' }
      if (code.indexOf('063') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/063c7nrq/sample.mp4' }
      if (code.indexOf('065') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/065bb7br/sample.mp4' }
      if (code.indexOf('067261') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/067261c0/sample.mp4' }
      if (code.indexOf('069') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/069s6cu8/sample.mp4' }
      if (code.indexOf('071') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/071vjvwe/sample.mp4' }
      if (code.indexOf('07382') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/07382tba/sample.mp4' }
      if (code.indexOf('075') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/075b1d1r/sample.mp4' }
      if (code.indexOf('0771') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0771lshk/sample.mp4' }
      if (code.indexOf('080') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/080oitor/sample.mp4' }
      if (code.indexOf('083') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/083w5mwq/sample.mp4' }
      if (code.indexOf('086') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/086asld5/sample.mp4' }
      if (code.indexOf('08800') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/08800vm8/sample.mp4' }
      if (code.indexOf('090') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/090hoe8y/sample.mp4' }
      if (code.indexOf('092') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/092hklz1/sample.mp4' }
      if (code.indexOf('094') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/094jpmf8/sample.mp4' }
      if (code.indexOf('097') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/097cwyb9/sample.mp4' }
      if (code.indexOf('0995') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/0995d3lw/sample.mp4' }
      if (code.indexOf('1001') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1001rbxe/sample.mp4' }
      if (code.indexOf('1003') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1003dcoh/sample.mp4' }
      if (code.indexOf('1005') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1005bxjw/sample.mp4' }
      if (code.indexOf('1007') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1007ucld/sample.mp4' }
      if (code.indexOf('1009') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1009powz/sample.mp4' }
      if (code.indexOf('1011') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1011smvy/sample.mp4' }
      if (code.indexOf('1013') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1013qxaa/sample.mp4' }
      if (code.indexOf('1015') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1015mgmg/sample.mp4' }
      if (code.indexOf('1017') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1017xqfs/sample.mp4' }
      if (code.indexOf('1019') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1019bkmo/sample.mp4' }
      if (code.indexOf('1021') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1021nxhn/sample.mp4' }
      if (code.indexOf('1023') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1023clhj/sample.mp4' }
      if (code.indexOf('1025') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1025sqhz/sample.mp4' }
      if (code.indexOf('1027') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1027agfm/sample.mp4' }
      if (code.indexOf('1029') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1029wwlb/sample.mp4' }
      if (code.indexOf('1031') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1031bvzp/sample.mp4' }
      if (code.indexOf('1033') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1033tzwi/sample.mp4' }
      if (code.indexOf('1035') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1035yqdr/sample.mp4' }
      if (code.indexOf('1037') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1037zhxh/sample.mp4' }
      if (code.indexOf('1039') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1039lmtq/sample.mp4' }
      if (code.indexOf('103') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/103rgal2/sample.mp4' }
      if (code.indexOf('1041') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1041yrtf/sample.mp4' }
      if (code.indexOf('1043') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1043ajlw/sample.mp4' }
      if (code.indexOf('1045') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1045xcwt/sample.mp4' }
      if (code.indexOf('1047') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1047eqcn/sample.mp4' }
      if (code.indexOf('1049') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1049lose/sample.mp4' }
      if (code.indexOf('1051') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1051cyin/sample.mp4' }
      if (code.indexOf('1053') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1053ykvj/sample.mp4' }
      if (code.indexOf('1055') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1055pwvx/sample.mp4' }
      if (code.indexOf('1057') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1057eqog/sample.mp4' }
      if (code.indexOf('1059') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1059gciz/sample.mp4' }
      if (code.indexOf('1061') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1061kshe/sample.mp4' }
      if (code.indexOf('1063') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1063jakn/sample.mp4' }
      if (code.indexOf('1065') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1065vrcn/sample.mp4' }
      if (code.indexOf('1067') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1067yzue/sample.mp4' }
      if (code.indexOf('1069') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1069ecrj/sample.mp4' }
      if (code.indexOf('1071') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1071xsel/sample.mp4' }
      if (code.indexOf('1073') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1073fglx/sample.mp4' }
      if (code.indexOf('1075') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1075qyef/sample.mp4' }
      if (code.indexOf('1077') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1077oaen/sample.mp4' }
      if (code.indexOf('1078') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1078ou76/sample.mp4' }
      if (code.indexOf('1079') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1079epnh/sample.mp4' }
      if (code.indexOf('1081') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1081nrti/sample.mp4' }
      if (code.indexOf('1083') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1083bdrk/sample.mp4' }
      if (code.indexOf('1085') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1085duga/sample.mp4' }
      if (code.indexOf('1087') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1087hnff/sample.mp4' }
      if (code.indexOf('1089') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1089wajn/sample.mp4' }
      if (code.indexOf('1091') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1091lqar/sample.mp4' }
      if (code.indexOf('1093') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1093fecn/sample.mp4' }
      if (code.indexOf('1095') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1095hgmz/sample.mp4' }
      if (code.indexOf('1097') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1097gncl/sample.mp4' }
      if (code.indexOf('1099') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1099wraa/sample.mp4' }
      if (code.indexOf('109') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/109pb42v/sample.mp4' }
      if (code.indexOf('1101') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1101jrix/sample.mp4' }
      if (code.indexOf('1103') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1103lzlo/sample.mp4' }
      if (code.indexOf('1105') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1105rhyr/sample.mp4' }
      if (code.indexOf('1107') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1107wpxl/sample.mp4' }
      if (code.indexOf('1109') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1109hefw/sample.mp4' }
      if (code.indexOf('1111') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1111fosi/sample.mp4' }
      if (code.indexOf('1113') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1113ufqk/sample.mp4' }
      if (code.indexOf('1115') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1115zhdh/sample.mp4' }
      if (code.indexOf('1117') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1117eaal/sample.mp4' }
      if (code.indexOf('1119') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1119ilnk/sample.mp4' }
      if (code.indexOf('1121') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1121zpex/sample.mp4' }
      if (code.indexOf('1123') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1123wpci/sample.mp4' }
      if (code.indexOf('1125') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1125azfh/sample.mp4' }
      if (code.indexOf('1127') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1127leqg/sample.mp4' }
      if (code.indexOf('1129') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1129jxza/sample.mp4' }
      if (code.indexOf('112') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/112whon5/sample.mp4' }
      if (code.indexOf('1131') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1131sceo/sample.mp4' }
      if (code.indexOf('1133') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1133zokt/sample.mp4' }
      if (code.indexOf('1135') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1135aecx/sample.mp4' }
      if (code.indexOf('1137') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1137shaw/sample.mp4' }
      if (code.indexOf('1139') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1139qopr/sample.mp4' }
      if (code.indexOf('1141') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1141zdkr/sample.mp4' }
      if (code.indexOf('1143') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1143dfen/sample.mp4' }
      if (code.indexOf('1145') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1145mdar/sample.mp4' }
      if (code.indexOf('1147') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1147wjhz/sample.mp4' }
      if (code.indexOf('1149') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1149bpso/sample.mp4' }
      if (code.indexOf('115') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/115xnok3/sample.mp4' }
      if (code.indexOf('117') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/117sb3di/sample.mp4' }
      if (code.indexOf('119') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/119v29gl/sample.mp4' }
      if (code.indexOf('121') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/121rt53d/sample.mp4' }
      if (code.indexOf('123') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/123zqja6/sample.mp4' }
      if (code.indexOf('125') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/125h4gu8/sample.mp4' }
      if (code.indexOf('127') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/127j0fa9/sample.mp4' }
      if (code.indexOf('1299') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1299svs7/sample.mp4' }
      if (code.indexOf('131') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/131gkbj8/sample.mp4' }
      if (code.indexOf('133') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/133fz2ma/sample.mp4' }
      if (code.indexOf('1359') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1359kmom/sample.mp4' }
      if (code.indexOf('138') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/138rrbib/sample.mp4' }
      if (code.indexOf('140') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/140uy0m2/sample.mp4' }
      if (code.indexOf('142') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/142lcnrz/sample.mp4' }
      if (code.indexOf('144') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/144ph14i/sample.mp4' }
      if (code.indexOf('146') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/146oz6dl/sample.mp4' }
      if (code.indexOf('14859') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/14859gs0/sample.mp4' }
      if (code.indexOf('1506') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1506y0f1/sample.mp4' }
      if (code.indexOf('153') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/153gom6y/sample.mp4' }
      if (code.indexOf('155') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/155zhuhs/sample.mp4' }
      if (code.indexOf('157') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/157hpc80/sample.mp4' }
      if (code.indexOf('159') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/159a9v20/sample.mp4' }
      if (code.indexOf('161') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/161m6flm/sample.mp4' }
      if (code.indexOf('163') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/163dw9g8/sample.mp4' }
      if (code.indexOf('165') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/165ci1xf/sample.mp4' }
      if (code.indexOf('168') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/168jvxs4/sample.mp4' }
      if (code.indexOf('171') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/171z1nk5/sample.mp4' }
      if (code.indexOf('174') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/174fl8o2/sample.mp4' }
      if (code.indexOf('176') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/176bs2rm/sample.mp4' }
      if (code.indexOf('178') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/178b8ah5/sample.mp4' }
      if (code.indexOf('180') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/180bxdw0/sample.mp4' }
      if (code.indexOf('183') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/183wys91/sample.mp4' }
      if (code.indexOf('185') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/185w55xu/sample.mp4' }
      if (code.indexOf('187') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/187zp2bc/sample.mp4' }
      if (code.indexOf('189') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/189y9zxx/sample.mp4' }
      if (code.indexOf('1910') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1910htdy/sample.mp4' }
      if (code.indexOf('1934') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/19340vrn/sample.mp4' }
      if (code.indexOf('195') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/195gtkjd/sample.mp4' }
      if (code.indexOf('1988') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/1988r12d/sample.mp4' }
      if (code.indexOf('2008') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2008gbb4/sample.mp4' }
      if (code.indexOf('2021') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2021rw39/sample.mp4' }
      if (code.indexOf('204') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/204e25hr/sample.mp4' }
      if (code.indexOf('206949') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/206949ci/sample.mp4' }
      if (code.indexOf('208') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/208dct6n/sample.mp4' }
      if (code.indexOf('210') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/210xraj0/sample.mp4' }
      if (code.indexOf('213') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/213c7gcs/sample.mp4' }
      if (code.indexOf('215') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/215aaqxm/sample.mp4' }
      if (code.indexOf('217') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/217pfiuy/sample.mp4' }
      if (code.indexOf('2196') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2196qmlc/sample.mp4' }
      if (code.indexOf('22194') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/22194ags/sample.mp4' }
      if (code.indexOf('223') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/223amh31/sample.mp4' }
      if (code.indexOf('225') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/225hlhka/sample.mp4' }
      if (code.indexOf('228') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/228ar6i6/sample.mp4' }
      if (code.indexOf('231') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/231g25q6/sample.mp4' }
      if (code.indexOf('23424') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/23424hif/sample.mp4' }
      if (code.indexOf('236') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/236kawal/sample.mp4' }
      if (code.indexOf('2386550') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2386550k/sample.mp4' }
      if (code.indexOf('240') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/240dm6z1/sample.mp4' }
      if (code.indexOf('242') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/242cfij0/sample.mp4' }
      if (code.indexOf('244') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/244gwhgt/sample.mp4' }
      if (code.indexOf('246') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/246af2ae/sample.mp4' }
      if (code.indexOf('248') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/248n5tha/sample.mp4' }
      if (code.indexOf('250953') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/250953fr/sample.mp4' }
      if (code.indexOf('252') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/252e77ix/sample.mp4' }
      if (code.indexOf('254') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/254bsn3p/sample.mp4' }
      if (code.indexOf('257') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/257e1cmf/sample.mp4' }
      if (code.indexOf('2598') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2598yjxw/sample.mp4' }
      if (code.indexOf('261') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/261urdyb/sample.mp4' }
      if (code.indexOf('263') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/263nn6hf/sample.mp4' }
      if (code.indexOf('265') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/265jl54g/sample.mp4' }
      if (code.indexOf('267') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/267ndn3i/sample.mp4' }
      if (code.indexOf('269') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/269aum0p/sample.mp4' }
      if (code.indexOf('272') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/272bqdgj/sample.mp4' }
      if (code.indexOf('275') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/275mt1cl/sample.mp4' }
      if (code.indexOf('277') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/277ynqst/sample.mp4' }
      if (code.indexOf('27988') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/27988tb9/sample.mp4' }
      if (code.indexOf('281') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/281x7gbu/sample.mp4' }
      if (code.indexOf('2836') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2836ubyw/sample.mp4' }
      if (code.indexOf('286') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/286qohis/sample.mp4' }
      if (code.indexOf('288') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/288l6wet/sample.mp4' }
      if (code.indexOf('290') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/290toaza/sample.mp4' }
      if (code.indexOf('292') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/292pdsdn/sample.mp4' }
      if (code.indexOf('2946') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2946ty6w/sample.mp4' }
      if (code.indexOf('296') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/296wmbov/sample.mp4' }
      if (code.indexOf('2985') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/2985vvtf/sample.mp4' }
      if (code.indexOf('3010') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3010w6fx/sample.mp4' }
      if (code.indexOf('303') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/303trwpl/sample.mp4' }
      if (code.indexOf('3054') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3054m25z/sample.mp4' }
      if (code.indexOf('3077') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3077w9sl/sample.mp4' }
      if (code.indexOf('309') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/309eekdd/sample.mp4' }
      if (code.indexOf('311') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/311lzpiz/sample.mp4' }
      if (code.indexOf('313') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/313v5162/sample.mp4' }
      if (code.indexOf('3158') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3158tei7/sample.mp4' }
      if (code.indexOf('317') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/317zxbur/sample.mp4' }
      if (code.indexOf('3190') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3190xa1l/sample.mp4' }
      if (code.indexOf('321') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/321jf036/sample.mp4' }
      if (code.indexOf('323') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/323phxm2/sample.mp4' }
      if (code.indexOf('3252') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3252y6t2/sample.mp4' }
      if (code.indexOf('327') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/327o2hls/sample.mp4' }
      if (code.indexOf('3307') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3307l2cg/sample.mp4' }
      if (code.indexOf('3324') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3324ltot/sample.mp4' }
      if (code.indexOf('33471') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/33471f13/sample.mp4' }
      if (code.indexOf('336') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/336yxldg/sample.mp4' }
      if (code.indexOf('338') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/338npj0g/sample.mp4' }
      if (code.indexOf('3408') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3408s4ig/sample.mp4' }
      if (code.indexOf('342') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/342oxvb1/sample.mp4' }
      if (code.indexOf('344') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/344ne3y4/sample.mp4' }
      if (code.indexOf('3469129') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3469129k/sample.mp4' }
      if (code.indexOf('348') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/348fnp0d/sample.mp4' }
      if (code.indexOf('350') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/350cxxyc/sample.mp4' }
      if (code.indexOf('352') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/352raznw/sample.mp4' }
      if (code.indexOf('354') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/354js8qo/sample.mp4' }
      if (code.indexOf('356') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/356c15be/sample.mp4' }
      if (code.indexOf('359') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/359d8nx2/sample.mp4' }
      if (code.indexOf('361') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/361ux6q6/sample.mp4' }
      if (code.indexOf('3631') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3631eury/sample.mp4' }
      if (code.indexOf('365') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/365mjhhp/sample.mp4' }
      if (code.indexOf('367') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/367hkfbd/sample.mp4' }
      if (code.indexOf('369') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/369owojh/sample.mp4' }
      if (code.indexOf('372') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/372nbvr7/sample.mp4' }
      if (code.indexOf('375') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/375ldjdk/sample.mp4' }
      if (code.indexOf('377') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/377qees6/sample.mp4' }
      if (code.indexOf('379') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/379uxyp5/sample.mp4' }
      if (code.indexOf('38119') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/38119ix8/sample.mp4' }
      if (code.indexOf('383') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/383ywz83/sample.mp4' }
      if (code.indexOf('385') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/385s5t51/sample.mp4' }
      if (code.indexOf('3875') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3875ur0d/sample.mp4' }
      if (code.indexOf('390') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/390xgkya/sample.mp4' }
      if (code.indexOf('392') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/392jxl8t/sample.mp4' }
      if (code.indexOf('3942') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/3942dzwx/sample.mp4' }
      if (code.indexOf('396') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/396l670k/sample.mp4' }
      if (code.indexOf('398') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/398vcy3h/sample.mp4' }
      if (code.indexOf('400') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/400kjv70/sample.mp4' }
      if (code.indexOf('403') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/403c2qu7/sample.mp4' }
      if (code.indexOf('405') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/405c6gyd/sample.mp4' }
      if (code.indexOf('407') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/407cfe7p/sample.mp4' }
      if (code.indexOf('409') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/409zm7hi/sample.mp4' }
      if (code.indexOf('4117690') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4117690q/sample.mp4' }
      if (code.indexOf('413') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/413nzeqq/sample.mp4' }
      if (code.indexOf('416') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/416xgkkc/sample.mp4' }
      if (code.indexOf('418') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/418bn64j/sample.mp4' }
      if (code.indexOf('420') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/420o61bz/sample.mp4' }
      if (code.indexOf('422') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/422kqu7d/sample.mp4' }
      if (code.indexOf('4244') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4244giee/sample.mp4' }
      if (code.indexOf('426') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/426qj96z/sample.mp4' }
      if (code.indexOf('429') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/429k1eev/sample.mp4' }
      if (code.indexOf('43188') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/43188voc/sample.mp4' }
      if (code.indexOf('433611') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/433611ab/sample.mp4' }
      if (code.indexOf('4354') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4354dyit/sample.mp4' }
      if (code.indexOf('4375') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4375ae6s/sample.mp4' }
      if (code.indexOf('439') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/439w1tsb/sample.mp4' }
      if (code.indexOf('441') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/441jlbl4/sample.mp4' }
      if (code.indexOf('443') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/443ek9th/sample.mp4' }
      if (code.indexOf('445') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/445qg8xp/sample.mp4' }
      if (code.indexOf('447') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/447k60s5/sample.mp4' }
      if (code.indexOf('449') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/449zjkxc/sample.mp4' }
      if (code.indexOf('4517') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4517zyl3/sample.mp4' }
      if (code.indexOf('453') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/453j4tp3/sample.mp4' }
      if (code.indexOf('455') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/455uoobe/sample.mp4' }
      if (code.indexOf('457') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/457xhh48/sample.mp4' }
      if (code.indexOf('460') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/460uu2p6/sample.mp4' }
      if (code.indexOf('462') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/462o2hw8/sample.mp4' }
      if (code.indexOf('4641') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4641teow/sample.mp4' }
      if (code.indexOf('46664') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/46664w8w/sample.mp4' }
      if (code.indexOf('4684') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4684k93j/sample.mp4' }
      if (code.indexOf('470') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/470kf201/sample.mp4' }
      if (code.indexOf('472') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/472dmpyl/sample.mp4' }
      if (code.indexOf('4753') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4753ulrd/sample.mp4' }
      if (code.indexOf('477') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/477kfwza/sample.mp4' }
      if (code.indexOf('479') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/479b8bkc/sample.mp4' }
      if (code.indexOf('481') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/481hwwjd/sample.mp4' }
      if (code.indexOf('483') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/483bjz33/sample.mp4' }
      if (code.indexOf('485') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/485e1ubj/sample.mp4' }
      if (code.indexOf('4886') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4886d610/sample.mp4' }
      if (code.indexOf('49006') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/49006pt8/sample.mp4' }
      if (code.indexOf('4929') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/4929djj3/sample.mp4' }
      if (code.indexOf('494') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/494kuft9/sample.mp4' }
      if (code.indexOf('49638') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/49638ia3/sample.mp4' }
      if (code.indexOf('498') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/498fck3c/sample.mp4' }
      if (code.indexOf('500') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/500cacc3/sample.mp4' }
      if (code.indexOf('503') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/503ix6xt/sample.mp4' }
      if (code.indexOf('505') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/505u2mpm/sample.mp4' }
      if (code.indexOf('507') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/507dmyyo/sample.mp4' }
      if (code.indexOf('509') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/509m7t8t/sample.mp4' }
      if (code.indexOf('51149') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/51149sex/sample.mp4' }
      if (code.indexOf('513') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/513rih4m/sample.mp4' }
      if (code.indexOf('515') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/515w1cye/sample.mp4' }
      if (code.indexOf('517') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/517pkcu6/sample.mp4' }
      if (code.indexOf('520') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/520amm4b/sample.mp4' }
      if (code.indexOf('5225') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5225h84y/sample.mp4' }
      if (code.indexOf('524') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/524qrxtr/sample.mp4' }
      if (code.indexOf('526') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/526l1xi8/sample.mp4' }
      if (code.indexOf('528') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/528zilrm/sample.mp4' }
      if (code.indexOf('5308') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5308v7jc/sample.mp4' }
      if (code.indexOf('5327') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5327oq0b/sample.mp4' }
      if (code.indexOf('534') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/534usryf/sample.mp4' }
      if (code.indexOf('536') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/536kpzxz/sample.mp4' }
      if (code.indexOf('538') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/538gp18p/sample.mp4' }
      if (code.indexOf('540') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/540wg8av/sample.mp4' }
      if (code.indexOf('5420') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5420kpec/sample.mp4' }
      if (code.indexOf('544') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/544z9lwt/sample.mp4' }
      if (code.indexOf('546') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/546xluqy/sample.mp4' }
      if (code.indexOf('548') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/548gvixw/sample.mp4' }
      if (code.indexOf('5512') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5512qn51/sample.mp4' }
      if (code.indexOf('5532') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5532ypug/sample.mp4' }
      if (code.indexOf('5552') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5552r37b/sample.mp4' }
      if (code.indexOf('557') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/557h12vw/sample.mp4' }
      if (code.indexOf('5597') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5597q79p/sample.mp4' }
      if (code.indexOf('561') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/561klol5/sample.mp4' }
      if (code.indexOf('563') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/563dtm1e/sample.mp4' }
      if (code.indexOf('565') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/565gmy9s/sample.mp4' }
      if (code.indexOf('568') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/568bcn3x/sample.mp4' }
      if (code.indexOf('57099') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/57099yv0/sample.mp4' }
      if (code.indexOf('572') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/572huact/sample.mp4' }
      if (code.indexOf('57427') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/57427jwj/sample.mp4' }
      if (code.indexOf('5767') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5767a9ib/sample.mp4' }
      if (code.indexOf('578') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/578xlmph/sample.mp4' }
      if (code.indexOf('58051') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/58051s4k/sample.mp4' }
      if (code.indexOf('582') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/582c75qj/sample.mp4' }
      if (code.indexOf('584') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/584nzqpe/sample.mp4' }
      if (code.indexOf('586') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/586e47ty/sample.mp4' }
      if (code.indexOf('588079') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/588079qe/sample.mp4' }
      if (code.indexOf('5907') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5907ewl7/sample.mp4' }
      if (code.indexOf('5922') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/5922sndl/sample.mp4' }
      if (code.indexOf('594') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/594lam2w/sample.mp4' }
      if (code.indexOf('597') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/597rvbpy/sample.mp4' }
      if (code.indexOf('599') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/599wfclc/sample.mp4' }
      if (code.indexOf('601') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/601lux89/sample.mp4' }
      if (code.indexOf('603') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/603paz69/sample.mp4' }
      if (code.indexOf('605') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/605m2mnw/sample.mp4' }
      if (code.indexOf('607') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/607e0mbp/sample.mp4' }
      if (code.indexOf('609') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/609zdube/sample.mp4' }
      if (code.indexOf('611') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/611yjpca/sample.mp4' }
      if (code.indexOf('613') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/613zcplw/sample.mp4' }
      if (code.indexOf('615') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/615qu0s5/sample.mp4' }
      if (code.indexOf('617') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/617tcshm/sample.mp4' }
      if (code.indexOf('6196723') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6196723v/sample.mp4' }
      if (code.indexOf('623') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/623aelkv/sample.mp4' }
      if (code.indexOf('6259') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6259kfza/sample.mp4' }
      if (code.indexOf('627') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/627uib2u/sample.mp4' }
      if (code.indexOf('630') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/630pevv0/sample.mp4' }
      if (code.indexOf('633') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/633ruz71/sample.mp4' }
      if (code.indexOf('6369') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6369lvw3/sample.mp4' }
      if (code.indexOf('638') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/638l2pco/sample.mp4' }
      if (code.indexOf('6403') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6403klii/sample.mp4' }
      if (code.indexOf('64278') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/64278uu5/sample.mp4' }
      if (code.indexOf('644') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/644nzvec/sample.mp4' }
      if (code.indexOf('646') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/646yeefr/sample.mp4' }
      if (code.indexOf('6650') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6650qw7y/sample.mp4' }
      if (code.indexOf('668') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/668kz15c/sample.mp4' }
      if (code.indexOf('6709') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6709blo5/sample.mp4' }
      if (code.indexOf('672') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/672dfqyj/sample.mp4' }
      if (code.indexOf('674') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/674s9cmj/sample.mp4' }
      if (code.indexOf('676') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/676skwtk/sample.mp4' }
      if (code.indexOf('678') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/678wuyas/sample.mp4' }
      if (code.indexOf('6807') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6807zbum/sample.mp4' }
      if (code.indexOf('682') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/682hm2zm/sample.mp4' }
      if (code.indexOf('684') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/684rkmr3/sample.mp4' }
      if (code.indexOf('6860') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6860jm9q/sample.mp4' }
      if (code.indexOf('688') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/688hrzpw/sample.mp4' }
      if (code.indexOf('690') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/690vse7l/sample.mp4' }
      if (code.indexOf('6921') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/6921tb0v/sample.mp4' }
      if (code.indexOf('694') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/694rxr6n/sample.mp4' }
      if (code.indexOf('696') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/696pfsmy/sample.mp4' }
      if (code.indexOf('698') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/698zpppj/sample.mp4' }
      if (code.indexOf('700') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/700h59gw/sample.mp4' }
      if (code.indexOf('702') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/702zjchq/sample.mp4' }
      if (code.indexOf('703') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/703gbsfs/sample.mp4' }
      if (code.indexOf('7058703') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7058703v/sample.mp4' }
      if (code.indexOf('707') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/707o0c2r/sample.mp4' }
      if (code.indexOf('7092') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7092xcyx/sample.mp4' }
      if (code.indexOf('711') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/711ce9o0/sample.mp4' }
      if (code.indexOf('713') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/713k0u71/sample.mp4' }
      if (code.indexOf('7155') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7155uera/sample.mp4' }
      if (code.indexOf('7177') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7177rw6p/sample.mp4' }
      if (code.indexOf('719') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/719wfksj/sample.mp4' }
      if (code.indexOf('721') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/721a91ck/sample.mp4' }
      if (code.indexOf('723') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/723tkwg3/sample.mp4' }
      if (code.indexOf('725') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/725gc1w8/sample.mp4' }
      if (code.indexOf('7279') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7279bc92/sample.mp4' }
      if (code.indexOf('7295') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7295af8d/sample.mp4' }
      if (code.indexOf('731') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/731ikba6/sample.mp4' }
      if (code.indexOf('7330') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7330y262/sample.mp4' }
      if (code.indexOf('735') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/735ngxch/sample.mp4' }
      if (code.indexOf('7377') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7377fga4/sample.mp4' }
      if (code.indexOf('739') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/739c2lya/sample.mp4' }
      if (code.indexOf('741') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/741cfgkv/sample.mp4' }
      if (code.indexOf('743') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/743tzxs2/sample.mp4' }
      if (code.indexOf('74695') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/74695dv7/sample.mp4' }
      if (code.indexOf('748') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/748fdnjb/sample.mp4' }
      if (code.indexOf('750') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/750q84ya/sample.mp4' }
      if (code.indexOf('7520') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7520xbg5/sample.mp4' }
      if (code.indexOf('75465') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/75465p95/sample.mp4' }
      if (code.indexOf('75662407') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/75662407/sample.mp4' }
      if (code.indexOf('758') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/758cqcs6/sample.mp4' }
      if (code.indexOf('760') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/760n2zp0/sample.mp4' }
      if (code.indexOf('762') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/762gfyk5/sample.mp4' }
      if (code.indexOf('764074') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/764074td/sample.mp4' }
      if (code.indexOf('766') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/766dj1e0/sample.mp4' }
      if (code.indexOf('768') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/768smzvk/sample.mp4' }
      if (code.indexOf('770') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/770oqpc8/sample.mp4' }
      if (code.indexOf('7723') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7723kfwj/sample.mp4' }
      if (code.indexOf('774') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/774xdfy3/sample.mp4' }
      if (code.indexOf('7766') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7766fk3t/sample.mp4' }
      if (code.indexOf('778') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/778px6yg/sample.mp4' }
      if (code.indexOf('7801') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7801cmks/sample.mp4' }
      if (code.indexOf('7828') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7828jyju/sample.mp4' }
      if (code.indexOf('7848') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7848vobv/sample.mp4' }
      if (code.indexOf('7863') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7863cdhl/sample.mp4' }
      if (code.indexOf('788') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/788knxin/sample.mp4' }
      if (code.indexOf('7906') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/7906zskr/sample.mp4' }
      if (code.indexOf('792') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/792wklsa/sample.mp4' }
      if (code.indexOf('794') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/794wtzln/sample.mp4' }
      if (code.indexOf('796') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/796wl2bv/sample.mp4' }
      if (code.indexOf('798') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/798kl6rh/sample.mp4' }
      if (code.indexOf('800') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/800k0l0t/sample.mp4' }
      if (code.indexOf('802') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/802lqa9r/sample.mp4' }
      if (code.indexOf('804') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/804m2t73/sample.mp4' }
      if (code.indexOf('806') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/806ak5pb/sample.mp4' }
      if (code.indexOf('809') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/809b2bpk/sample.mp4' }
      if (code.indexOf('8111') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8111jiug/sample.mp4' }
      if (code.indexOf('813') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/813umfqq/sample.mp4' }
      if (code.indexOf('815') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/815fz9h1/sample.mp4' }
      if (code.indexOf('817') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/817jwbxt/sample.mp4' }
      if (code.indexOf('8192722') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8192722b/sample.mp4' }
      if (code.indexOf('82105') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/82105dkl/sample.mp4' }
      if (code.indexOf('8241') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8241daba/sample.mp4' }
      if (code.indexOf('827') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/827yoqrc/sample.mp4' }
      if (code.indexOf('829') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/829hjhd0/sample.mp4' }
      if (code.indexOf('831') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/831m450o/sample.mp4' }
      if (code.indexOf('83342') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/83342gpl/sample.mp4' }
      if (code.indexOf('835') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/835c6ck1/sample.mp4' }
      if (code.indexOf('837') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/837ut1pp/sample.mp4' }
      if (code.indexOf('839') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/839eo0a9/sample.mp4' }
      if (code.indexOf('841') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/841rd9vw/sample.mp4' }
      if (code.indexOf('8431') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8431qgtf/sample.mp4' }
      if (code.indexOf('8457') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8457ojtn/sample.mp4' }
      if (code.indexOf('847') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/847cfilf/sample.mp4' }
      if (code.indexOf('849') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/849i9wbp/sample.mp4' }
      if (code.indexOf('851') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/851cypwi/sample.mp4' }
      if (code.indexOf('853') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/853hojeo/sample.mp4' }
      if (code.indexOf('8554') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8554rsdg/sample.mp4' }
      if (code.indexOf('858') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/858xe0db/sample.mp4' }
      if (code.indexOf('860') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/860oyutp/sample.mp4' }
      if (code.indexOf('86228') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/86228c0w/sample.mp4' }
      if (code.indexOf('864') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/864foziu/sample.mp4' }
      if (code.indexOf('866') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/866m031k/sample.mp4' }
      if (code.indexOf('868') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/868mmydi/sample.mp4' }
      if (code.indexOf('870') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/870xenfc/sample.mp4' }
      if (code.indexOf('8725387') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8725387o/sample.mp4' }
      if (code.indexOf('875') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/875zix1w/sample.mp4' }
      if (code.indexOf('8776') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8776aosw/sample.mp4' }
      if (code.indexOf('879') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/879mcqpk/sample.mp4' }
      if (code.indexOf('881') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/881mdmr6/sample.mp4' }
      if (code.indexOf('883') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/883nelcm/sample.mp4' }
      if (code.indexOf('885') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/885h8rq5/sample.mp4' }
      if (code.indexOf('8879') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/8879jjlk/sample.mp4' }
      if (code.indexOf('889') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/889jy8kc/sample.mp4' }
      if (code.indexOf('892') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/892fcr7g/sample.mp4' }
      if (code.indexOf('894') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/894knhvx/sample.mp4' }
      if (code.indexOf('89620') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/89620k1s/sample.mp4' }
      if (code.indexOf('898') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/898rusl9/sample.mp4' }
      if (code.indexOf('9000') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9000ybqj/sample.mp4' }
      if (code.indexOf('902') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/902tpno8/sample.mp4' }
      if (code.indexOf('9046') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9046rc5q/sample.mp4' }
      if (code.indexOf('906') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/906g9ofc/sample.mp4' }
      if (code.indexOf('909') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/909fw7br/sample.mp4' }
      if (code.indexOf('9116') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9116zagi/sample.mp4' }
      if (code.indexOf('913') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/913apnrh/sample.mp4' }
      if (code.indexOf('915') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/915bhm07/sample.mp4' }
      if (code.indexOf('917') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/917o9xxu/sample.mp4' }
      if (code.indexOf('9199') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9199wbtx/sample.mp4' }
      if (code.indexOf('921') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/921cmx2o/sample.mp4' }
      if (code.indexOf('923') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/923ikz1r/sample.mp4' }
      if (code.indexOf('9252') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9252qk6d/sample.mp4' }
      if (code.indexOf('927') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/927p4797/sample.mp4' }
      if (code.indexOf('9299') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9299qr3j/sample.mp4' }
      if (code.indexOf('931') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/931l2p53/sample.mp4' }
      if (code.indexOf('933') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/933l8gea/sample.mp4' }
      if (code.indexOf('935') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/935mcgj8/sample.mp4' }
      if (code.indexOf('937') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/937k0ll6/sample.mp4' }
      if (code.indexOf('939') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/939fjwey/sample.mp4' }
      if (code.indexOf('9412') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9412lonn/sample.mp4' }
      if (code.indexOf('943') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/943h55p1/sample.mp4' }
      if (code.indexOf('945') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/945m8a0k/sample.mp4' }
      if (code.indexOf('947') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/947gu3a8/sample.mp4' }
      if (code.indexOf('949') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/949frjsc/sample.mp4' }
      if (code.indexOf('951') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/951j1vca/sample.mp4' }
      if (code.indexOf('953') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/953liyvp/sample.mp4' }
      if (code.indexOf('955') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/955gqjp9/sample.mp4' }
      if (code.indexOf('957') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/957y4b99/sample.mp4' }
      if (code.indexOf('959') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/959lqaz7/sample.mp4' }
      if (code.indexOf('961') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/961udlh1/sample.mp4' }
      if (code.indexOf('9631') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9631sf8j/sample.mp4' }
      if (code.indexOf('9651') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9651q13f/sample.mp4' }
      if (code.indexOf('967') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/967xlq9c/sample.mp4' }
      if (code.indexOf('969') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/969ycqoc/sample.mp4' }
      if (code.indexOf('972') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/972gvlkx/sample.mp4' }
      if (code.indexOf('974') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/974su4c2/sample.mp4' }
      if (code.indexOf('976') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/976dnbbt/sample.mp4' }
      if (code.indexOf('978') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/978gt6gh/sample.mp4' }
      if (code.indexOf('980') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/980tsi8o/sample.mp4' }
      if (code.indexOf('982') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/982diizq/sample.mp4' }
      if (code.indexOf('984') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/984nm5kb/sample.mp4' }
      if (code.indexOf('987') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/987l45tm/sample.mp4' }
      if (code.indexOf('989') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/989wkccy/sample.mp4' }
      if (code.indexOf('991335') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/991335aj/sample.mp4' }
      if (code.indexOf('993') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/993mw06d/sample.mp4' }
      if (code.indexOf('995') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/995x9u13/sample.mp4' }
      if (code.indexOf('9970') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/9970by24/sample.mp4' }
      if (code.indexOf('999') !== -1) { videoUrl = 'https://cdn.legsjapan.com/samples/999bt703/sample.mp4' }
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          </video>
                          </div>`;
      $(objlegsjapan).before(video)
    }
    // XVSR-系列 3种格式 多种后缀  1、6开头+3位数 2、x开头+3/5位数  / TASKW-系列 5319+5 n_992+3 / tasks-系列 5319+5 n_992+3
    addVideoXVSR (code, objXVSR) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/6/60' + videoSeries.substr(0, 1) + '/60' + videoSeries + codeArr[1] + '/60' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_9/n_992' + videoSeries + codeArr[1] + '/n_992' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/5/531/5319' + videoSeries + videoNo + '/5319' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1614' + videoSeries + videoNo + '/h_1614' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1094' + videoSeries + videoNo + '/h_1094' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/8/82' + videoSeries.substr(0, 1) + '/82' + videoSeries + codeArr[1] + '/82' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/5/5' + videoSeries.substr(0, 2) + '/5' + videoSeries + codeArr[1] + '/5' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_806' + videoSeries + codeArr[1] + '/h_806' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_231' + videoSeries + codeArr[1] + '/h_231' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + videoNo + '/h_1074' + videoSeries + videoNo + '_dm_s.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + videoNo + '/h_1074' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1514' + videoSeries + videoNo + '/h_1514' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1514' + videoSeries + videoNo + '/h_1514' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244' + videoSeries + videoNo + '/h_244' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_244' + videoSeries + videoNo + '/h_244' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_970' + videoSeries + codeArr[1] + '/h_970' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_970' + videoSeries + codeArr[1] + '/h_970' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/4/422/422' + videoSeries + videoNo + '/422' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/4/422/422' + videoSeries + videoNo + '/422' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1136' + videoSeries + videoNo + '/h_1136' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1136' + videoSeries + videoNo + '/h_1136' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_355' + videoSeries + videoTwo + '/h_355' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_355' + videoSeries + videoTwo + '/h_355' + videoSeries + videoTwo + '_sm_w.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/5/50' + videoSeries.substr(0, 1) + '/50' + videoSeries + codeArr[1] + '/50' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl38 = 'https://pv3001.dmm.com/litevideo/freepv/5/50' + videoSeries.substr(0, 1) + '/50' + videoSeries + codeArr[1] + '/50' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl39 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_909' + videoSeries + videoTwo + '/h_909' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl40 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_909' + videoSeries + videoTwo + '/h_909' + videoSeries + videoTwo + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl38} type="video/mp4" />
                          <source src=${videoUrl39} type="video/mp4" />
                          <source src=${videoUrl40} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          </video>
                          </div>`;
      $(objXVSR).before(video)
    }
    // BF-系列 包含HDBF-、JIBF-、MBRBF-、PBF-、MBF-、HDBF- 已精简
    // SVVRT-系列 2种格式 已精简
    // DCV-系列 多种格式 MGS集成
    // NMCH-系列 多种格式 MGS集成
    // DDH-系列 多种格式 MGS集成
    // MDTE-系列 两种 已精简
    // KU-系列 SILKU- 两种 SILKU-092 https://pv3001.dmm.com/litevideo/freepv/1/1si/1silku00092/1silku00092_sm_w.mp4
    // 以下识别符暂未调用
    addVideoKUDETA (code, objKUDETA) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + 'a/n_707' + videoSeries + codeArr[1] + 'a_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1233' + videoSeries + codeArr[1] + '/n_1233' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/4/406/406' + videoSeries + videoNo + '/406' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_709' + videoSeries + codeArr[1] + '/n_709' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          </video>
                          </div>`; 6
      $(objKUDETA).before(video)
    }
    //MDS系列 mds、mdsc、mdsh、ymds  HMDSX-006 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1472hmdsx00006/h_1472hmdsx00006_mhb_w.mp4 此系列加入后需要重新匹配   / SMT-系列 1\首字母+5 2\h_1513+3+_dmb_s /SMSD-系列 171/h_859/h_1126/h_1096+3+_sm_w / bdmds
    addVideoMDS (code, objMDS) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2); // 数字截取后2位
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_585' + videoSeries + codeArr[1] + '/h_585' + videoSeries + codeArr[1] + '_sm_w.mp4';
      // MDS-692 https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_585mds692/h_585mds692_sm_s.mp4
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_585' + videoSeries + codeArr[1] + '/h_585' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + '/61' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1472' + videoSeries + videoNo + '/h_1472' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1472' + videoSeries + videoNo + '/h_1472' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1513' + videoSeries + codeArr[1] + '/h_1513' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/1/171/171' + videoSeries + codeArr[1] + '/171' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_859' + videoSeries + codeArr[1] + '/h_859' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1126' + videoSeries + codeArr[1] + '/h_1126' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1096' + videoSeries + codeArr[1] + '/h_1096' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/1/171/171' + videoSeries + videoTwo + '/171' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_859' + videoSeries + videoTwo + '/h_859' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1126' + videoSeries + videoTwo + '/h_1126' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_918' + videoSeries + codeArr[1] + '/h_918' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_406' + videoSeries + videoNo + '/h_406' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/4/422/422' + videoSeries + videoNo + '/422' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/6/61' + videoSeries[0] + '/61' + videoSeries + videoNo + 'ai/61' + videoSeries + videoNo + 'ai_sm_w.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1454' + videoSeries + codeArr[1] + '/h_1454' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1454' + videoSeries + codeArr[1] + '/h_1454' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1350' + videoSeries + videoNo + '/h_1350' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1350' + videoSeries + videoNo + '/h_1350' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl38 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_918' + videoSeries + codeArr[1] + '/h_918' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl39 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'dm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl38} type="video/mp4" />
                          <source src=${videoUrl39} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          </video>
                          </div>`;
      $(objMDS).before(video)
    }
    // PPPD-系列 009预览片地址 https://c3001.dmm.com/litevideo/freepv/p/ppp/pppd0019/pppd0019_dmb_s.mp4 (四位) bus和db番号显示不一 所以增加videoFour四位来适配
    // HEZ-系列 https://pv3001.dmm.com/litevideo/freepv/5/59h/59hez001/59hez001_dmb_w.mp4 https://pv3001.dmm.com/litevideo/freepv/5/59h/59hez477/59hez477_mhb_w.mp4
    // 259LUXU-系列  需翻墙 部分国家或地区无法访问 自行切换节点尝试
    // MGS集成: MFC系列 包含 MFC- MFCX- MFCC- MFCS-  需翻墙 部分国家或地区无法访问 自行切换节点尝试 已集成或精简
    //SAN系列 SAN、FSAN、SANK、SANP、SANS 已精简
    //OCH系列 COCH / TMSG-系列 并入 / TMSA-系列 并入 (OCH系列 COCH、KOCH 有个别特殊地址  SKBK-系列 h_885/h_687+ tmsa系列 / tmsg: ["49","","","r"], // 4/49s/49sg040r/49sg040r_dm_w.mp4 四字母保留后两位+后缀r
    addVideoOCH (code, objOCH) {
      let codeArr = code.split(/-/); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let vSeries = codeArr[0].toLowerCase(); // 番号系列
      let videoSeries = codeArr[0].replace("TMSG", "SG").replace("TMSA", "ATM").replace("RMOW", "SMOW").toLowerCase(); //grabd更换为grace
      let videoNo = format_zero(codeArr[1], 5); //不足5位数补0
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2); // 数字截取后2位
      let videoThree = codeArr[1].substring(codeArr[1].length - 3); // 数字截取后3位
      let videoThrBu = format_zero(codeArr[1], 3); // 1位或2位补足3位 区别与直接截取后3位
      let videoFour = format_zero(codeArr[1], 4); //不足4位数补0
      let videoSix = format_zero(codeArr[1], 6); //不足6位数补0
      let videoSerFour = videoSeries.substr(0, 4); // 番号截掉最后1位
      let idNum = codeArr[1];
      let postfix = "_dm_w"; // 3(分辨率默认定于为 _dmb_w 和 _dm_w,此两项无需在对象列表声明)
      let chehz = ""; // 4(车牌后缀)此项定义来源:大部分完整车牌都有固定规律,但还是出现了个别番号系列在完整车牌后还加了个别字母 例如:a_dmb_w.mp4\re_dmb_w.mp4等特殊规则，有人会问为什么不加入postfix中，细心的会发现这个字母还会再上级路径出现，所以特别摘出来定义。后期会逐渐在对象列表添加，删除下面的特例规则。
      let cheqz = ""; // 1(车牌前缀)
      if (fanxi[videoSeries]) {
        cheqz = fanxi[videoSeries][0] ? fanxi[videoSeries][0] : cheqz;
        chehz = fanxi[videoSeries][3] ? fanxi[videoSeries][3] : chehz;
        postfix = fanxi[videoSeries][2] ? fanxi[videoSeries][2] : postfix;
        idNum = fanxi[videoSeries][1] ? fanxi[videoSeries][1] + idNum : idNum;
        videoSeries = fanxi[videoSeries][4] ? fanxi[videoSeries][4] : fanxi[videoSeries][0] + videoSeries;
      } else {
        idNum = "00" + idNum;
      }
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580' + videoSeries + videoNo + '/h_1580' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1580' + videoSeries + videoNo + '/h_1580' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries.substr(0, 1) + '/49' + videoSeries + codeArr[1] + 'r/49' + videoSeries + codeArr[1] + 'r_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries.substr(0, 1) + '/49' + videoSeries + codeArr[1] + 'r/49' + videoSeries + codeArr[1] + 'r_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/149/149' + videoSeries + videoNo + 'r/149' + videoSeries + videoNo + 'r_dm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/149/149' + videoSeries + videoNo + 'r/149' + videoSeries + videoNo + 'r_sm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/111/111' + videoSeries + videoNo + '/111' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_580' + videoSeries + videoNo + '/h_580' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_580' + videoSeries + videoNo + '/h_580' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_878' + videoSeries + codeArr[1] + '/h_878' + videoSeries + codeArr[1] + '_sm_w.mp4';
      if (null != code.match(/^(COCH-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_803coch00001/h_803coch00001_dm_w.mp4' }
      if (null != code.match(/^(COCH-002)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_803coch00002/h_803coch00002_dm_w.mp4' }
      if (null != code.match(/^(COCH-003)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch003/n_1445coch003_mhb_w.mp4' }
      if (null != code.match(/^(COCH-004)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_803coch00004/h_803coch00004_dm_w.mp4' }
      if (null != code.match(/^(COCH-006)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_803coch00006/h_803coch00006_dm_w.mp4' }
      if (null != code.match(/^(COCH-007)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch007/n_1445coch007_mhb_w.mp4' }
      if (null != code.match(/^(COCH-009)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch009/n_1445coch009_dmb_w.mp4' }
      if (null != code.match(/^(COCH-010)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch010/n_1445coch010_dmb_w.mp4' }
      if (null != code.match(/^(COCH-011)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch011/n_1445coch011_dmb_w.mp4' }
      if (null != code.match(/^(COCH-014)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706coch00014b/h_706coch00014b_dmb_w.mp4' }
      if (null != code.match(/^(COCH-016)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445coch016/n_1445coch016_dmb_w.mp4' }
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_687' + videoSeries + codeArr[1] + '/h_687' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_885' + videoSeries + codeArr[1] + '/h_885' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1490' + videoSeries + codeArr[1] + '/n_1490' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/5/505/5050' + videoSeries + videoNo + '/5050' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl1002 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1003 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl1004 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoTwo + chehz + '/' + videoSeries + videoTwo + chehz + postfix + '.mp4';
      let videoUrl1005 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + chehz + '/' + videoSeries + videoFour + chehz + postfix + '.mp4';
      let videoUrl1006 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + codeArr[1] + chehz + '/' + videoSeries + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl1007 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 2) + '0/' + videoSeries + videoNo + chehz + '/' + videoSeries + videoNo + chehz + postfix + '.mp4';
      let videoUrl1008 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThree + chehz + '/' + videoSeries + videoThree + chehz + postfix + '.mp4';
      let videoUrl1009 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThrBu + chehz + '/' + videoSeries + videoThrBu + chehz + postfix + '.mp4';
      let videoUrl1010 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + cheqz + vSeries.substr(0, 5) + codeArr[1] + chehz + '/' + cheqz + vSeries.substr(0, 5) + codeArr[1] + chehz + postfix + '.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_sm_s.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoSix + '/' + videoSeries + videoSix + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/1/187/187' + videoSeries + codeArr[1] + '/187' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl1002} type="video/mp4" />
                          <source src=${videoUrl1003} type="video/mp4" />
                          <source src=${videoUrl1004} type="video/mp4" />
                          <source src=${videoUrl1005} type="video/mp4" />
                          <source src=${videoUrl1006} type="video/mp4" />
                          <source src=${videoUrl1007} type="video/mp4" />
                          <source src=${videoUrl1008} type="video/mp4" />
                          <source src=${videoUrl1009} type="video/mp4" />
                          <source src=${videoUrl1010} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          </video>
                          </div>`;
      $(objOCH).before(video)
    }
    // KING-系列
    addVideoKING (code, objKING) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoFour = format_zero(codeArr[1], 4);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_mhb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_dm_w.mp4';
      if (null != code.match(/^(KING-001)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1152king001/h_1152king001_dm_w.mp4' }
      if (null != code.match(/^(KING-017)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0017/king0017_mhb_w.mp4' }
      if (null != code.match(/^(KING-021)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0021/king0021_dm_w.mp4' }
      if (null != code.match(/^(KING-022)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0022/king0022_dm_w.mp4' }
      if (null != code.match(/^(KING-023)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0023/king0023_dm_w.mp4' }
      if (null != code.match(/^(KING-024)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0024/king0024_mhb_w.mp4' }
      if (null != code.match(/^(KING-027)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0027/king0027_dm_w.mp4' }
      if (null != code.match(/^(KING-033)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0033/king0033_dm_w.mp4' }
      if (null != code.match(/^(KING-034)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0034/king0034_dm_w.mp4' }
      if (null != code.match(/^(KING-035)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0035/king0035_dm_w.mp4' }
      if (null != code.match(/^(KING-036)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0036/king0036_mhb_w.mp4' }
      if (null != code.match(/^(KING-038)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0038/king0038_mhb_w.mp4' }
      if (null != code.match(/^(KING-046)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0046/king0046_mhb_w.mp4' }
      if (null != code.match(/^(KING-053)/i)) { videoUrl = 'https://sample.mgstage.com/sample/shiroutosanka/444king/053/444king-053_20211015T120301.mp4' }
      if (null != code.match(/^(KING-051)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0051/king0051_mhb_w.mp4' }
      if (null != code.match(/^(KING-066)/i)) { videoUrl = 'https://sample.mgstage.com/sample/shiroutosanka/444king/066/444king-066_20220302T154004.mp4' }
      if (null != code.match(/^(KING-064)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0064/king0064_mhb_w.mp4' }
      if (null != code.match(/^(KING-068)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0068/king0068_mhb_w.mp4' }
      if (null != code.match(/^(KING-076)/i)) { videoUrl = 'https://sample.mgstage.com/sample/shiroutosanka/444king/076/444king-076_20220513T194502.mp4' }
      if (null != code.match(/^(KING-078)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0078/king0078_mhb_w.mp4' }
      if (null != code.match(/^(KING-079)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0079/king0079_mhb_w.mp4' }
      if (null != code.match(/^(KING-080)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0080/king0080_mhb_w.mp4' }
      if (null != code.match(/^(KING-081)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0081/king0081_mhb_w.mp4' }
      if (null != code.match(/^(KING-082)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0082/king0082_mhb_w.mp4' }
      if (null != code.match(/^(KING-083)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0083/king0083_mhb_w.mp4' }
      if (null != code.match(/^(KING-091)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0091/king0091_mhb_w.mp4' }
      if (null != code.match(/^(KING-092)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0092/king0092_mhb_w.mp4' }
      if (null != code.match(/^(KING-093)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0093/king0093_mhb_w.mp4' }
      if (null != code.match(/^(KING-094)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0094/king0094_mhb_w.mp4' }
      if (null != code.match(/^(KING-100)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0100/king0100_mhb_w.mp4' }
      if (null != code.match(/^(KING-101)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0101/king0101_mhb_w.mp4' }
      if (null != code.match(/^(KING-102)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0102/king0102_mhb_w.mp4' }
      if (null != code.match(/^(KING-108)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0108/king0108_mhb_w.mp4' }
      if (null != code.match(/^(KING-109)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0109/king0109_mhb_w.mp4' }
      if (null != code.match(/^(KING-110)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0110/king0110_mhb_w.mp4' }
      if (null != code.match(/^(KING-111)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0111/king0111_mhb_w.mp4' }
      if (null != code.match(/^(KING-112)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0112/king0112_mhb_w.mp4' }
      if (null != code.match(/^(KING-113)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0113/king0113_mhb_w.mp4' }
      if (null != code.match(/^(KING-114)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0114/king0114_mhb_w.mp4' }
      if (null != code.match(/^(KING-115)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/k/kin/king0115/king0115_mhb_w.mp4' }
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          </video>
                          </div>`;
      $(objKING).before(video)
    }
    //DTSL系列 已精简
    //ZEX系列 多个前缀 / TRK-系列 h_1595+5  h_1561+5 / TRK-系列
    addVideoZEX (code, objZEX) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_021' + videoSeries + codeArr[1] + '/h_021' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + codeArr[1] + '/h_720' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + videoNo + '/h_720' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_720' + videoSeries + videoNo + '/h_720' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1595' + videoSeries + videoNo + '/h_1595' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1595' + videoSeries + videoNo + '/h_1595' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1561' + videoSeries + videoNo + '/h_1561' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1561' + videoSeries + videoNo + '/h_1561' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/4/497/497' + videoSeries + videoNo + '/497' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_606' + videoSeries + codeArr[1] + '/h_606' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_606' + videoSeries + codeArr[1] + '/h_606' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1464' + videoSeries + codeArr[1] + '/n_1464' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1464' + videoSeries + codeArr[1] + '/n_1464' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1266' + videoSeries + codeArr[1] + 's/h_1266' + videoSeries + codeArr[1] + 's_dm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1155' + videoSeries + codeArr[1] + '/n_1155' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_173' + videoSeries + codeArr[1] + '/h_173' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/5/529/5294' + videoSeries + videoNo + '/5294' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/5/52' + videoSeries.substr(0, 1) + '/52' + videoSeries + videoNo + '/52' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/5/52' + videoSeries.substr(0, 1) + '/52' + videoSeries + videoNo + '/52' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_109pb' + videoSeries + videoNo + '/h_109pb' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1154' + videoSeries.substr(0, 5) + videoNo + '/h_1154' + videoSeries.substr(0, 5) + videoNo + '_dm_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1154' + videoSeries.substr(0, 5) + videoNo + '/h_1154' + videoSeries.substr(0, 5) + videoNo + '_sm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1418' + videoSeries.substr(0, 5) + codeArr[1] + '/n_1418' + videoSeries.substr(0, 5) + codeArr[1] + '_dm_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1418' + videoSeries.substr(0, 5) + codeArr[1] + '/n_1418' + videoSeries.substr(0, 5) + codeArr[1] + '_sm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_173' + videoSeries + codeArr[1] + '/h_173' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_173' + videoSeries + videoTwo + '/h_173' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/5/522/5226' + videoSeries + videoNo + 'sm/5226' + videoSeries + videoNo + 'sm_sm_w.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/5/561/5619' + videoSeries + videoNo + '/5619' + videoSeries + videoNo + '_dm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          </video>
                          </div>`;
      $(objZEX).before(video)
    }
    //PPP-系列 需翻 后面随机地址有规律，可以写匹配规则
    //PSDW系列 已精简
    // DVAJ-系列 两种格式 有4位数 所以增加videoFour四位来适配 https://pv3001.dmm.com/litevideo/freepv/d/dva/dvaj00598/dvaj00598_dmb_w.mp4 https://pv3001.dmm.com/litevideo/freepv/5/53d/53dvaj0016/53dvaj0016_dmb_w.mp4
    addVideoDVAJ (code, objDVAJ) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoFour = format_zero(codeArr[1], 4);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_dmb_s.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/5/53' + videoSeries.substr(0, 1) + '/53' + videoSeries + videoFour + '/53' + videoSeries + videoFour + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1352' + videoSeries + codeArr[1] + '/h_1352' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1352' + videoSeries + codeArr[1] + '/h_1352' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1488' + videoSeries + codeArr[1] + '/n_1488' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1488' + videoSeries + codeArr[1] + '/n_1488' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + 'sp/n_707' + videoSeries + codeArr[1] + 'sp_dm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/3/301/301' + videoSeries + videoNo + '/301' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/3/301/301' + videoSeries + videoNo + '/301' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1072' + videoSeries + codeArr[1] + '/n_1072' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1345' + videoSeries + codeArr[1] + '/h_1345' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1345' + videoSeries + codeArr[1] + '/h_1345' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1345' + videoSeries + videoNo + '/h_1345' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1345' + videoSeries + videoNo + '/h_1345' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          </video>
                          </div>`;
      $(objDVAJ).before(video)
    }
    // SERO-系列  4种格式 1、h_422+补齐四位 2、s开头+3/5位数 3、td027开头+5位数    SERO-025 https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_422sero0025/h_422sero0025_dm_w.mp4
    addVideoSERO (code, objSERO) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoFour = format_zero(codeArr[1], 4);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_422' + videoSeries + videoFour + '/h_422' + videoSeries + videoFour + '_dm_w.mp4';
      if (null != code.match(/^(MTNSERO-086)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046mtnsero00086/td046mtnsero00086_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-093)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048mtnsero00093/td048mtnsero00093_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-096)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048mtnsero00096/td048mtnsero00096_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-314)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046mtnsero00314/td046mtnsero00314_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-323)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046mtnsero00323/td046mtnsero00323_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-326)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046mtnsero00326/td046mtnsero00326_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-344)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045mtnsero00344/td045mtnsero00344_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-347)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045mtnsero00347/td045mtnsero00347_dmb_w.mp4' }
      if (null != code.match(/^(MTNSERO-355)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045mtnsero00355/td045mtnsero00355_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-089)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nkjsero00089/td046nkjsero00089_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-090)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048nkjsero00090/td048nkjsero00090_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-091)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048nkjsero00091/td048nkjsero00091_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-095)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048nkjsero00095/td048nkjsero00095_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-336)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nkjsero00336/td046nkjsero00336_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-349)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nkjsero00349/td045nkjsero00349_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-350)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nkjsero00350/td045nkjsero00350_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-363)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nkjsero00363/td045nkjsero00363_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-377)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nkjsero00377/td045nkjsero00377_dmb_w.mp4' }
      if (null != code.match(/^(NKJSERO-394)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nkjsero00394/td044nkjsero00394_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-017)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td049nmtsero00017/td049nmtsero00017_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-067)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00067/td044nmtsero00067_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-087)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td048nmtsero00087/td048nmtsero00087_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-321)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00321/td046nmtsero00321_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-325)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00325/td046nmtsero00325_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-329)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00329/td046nmtsero00329_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-333)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00333/td046nmtsero00333_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-335)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00335/td046nmtsero00335_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-341)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00341/td046nmtsero00341_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-362)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td046nmtsero00341/td046nmtsero00341_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-367)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nmtsero00367/td045nmtsero00367_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-372)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nmtsero00372/td045nmtsero00372_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-376)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nmtsero00376/td045nmtsero00376_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-378)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td045nmtsero00378/td045nmtsero00378_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-380)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00380/td044nmtsero00380_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-384)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00384/td044nmtsero00384_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-386)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00386/td044nmtsero00386_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-387)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00387/td044nmtsero00387_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-395)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00395/td044nmtsero00395_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-396)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00396/td044nmtsero00396_dmb_w.mp4' }
      if (null != code.match(/^(NMTSERO-399)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td044nmtsero00399/td044nmtsero00399_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-161)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00161/yrnkmtnsero00161_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-266)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00266/yrnkmtnsero00266_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-276)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00276/yrnkmtnsero00276_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-284)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00284/yrnkmtnsero00284_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-374)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00374/yrnkmtnsero00374_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-378)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00378/yrnkmtnsero00378_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-387)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00387/yrnkmtnsero00387_dmb_w.mp4' }
      if (null != code.match(/^(YRNKMTNSERO-402)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnkmtnsero00402/yrnkmtnsero00402_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-049)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00049/yrnknkjsero00049_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-220)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00220/yrnknkjsero00220_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-258)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00258/yrnknkjsero00258_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-267)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00267/yrnknkjsero00267_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-290)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00290/yrnknkjsero00290_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-313)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00313/yrnknkjsero00313_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-358)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00358/yrnknkjsero00358_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-384)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00384/yrnknkjsero00384_dmb_w.mp4' }
      if (null != code.match(/^(YRNKNKJSERO-397)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/y/yrn/yrnknkjsero00397/yrnknkjsero00397_dmb_w.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4'; //SERO-387 https://pv3001.dmm.com/litevideo/freepv/s/ser/sero00387/sero00387_dmb_w.mp4
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // SERO-313 https://pv3001.dmm.com/litevideo/freepv/s/ser/sero313/sero313_dmb_w.mp4
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/t/td0/td027' + videoSeries + videoNo + '/td027' + videoSeries + videoNo + '_mhb_w.mp4';	// SERO-307 https://pv3001.dmm.com/litevideo/freepv/t/td0/td027sero00307/td027sero00307_mhb_w.mp4
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          </video>
                          </div>`;
      $(objSERO).before(video)
    }
    // MCMA-系列  2种格式 1、298+番号 2、h_1133+3位数 dmm和MGS都有 独开  AMCMA // MCST-系列 h_1133+3/5 57+5 并入 MCMA
    addVideoMCMA (code, objMCMA) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1133' + videoSeries + codeArr[1] + '/h_1133' + videoSeries + codeArr[1] + '_dmb_w.mp4'; //   MCMA-002 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1133mcma002/h_1133mcma002_dmb_w.mp4
      let videoUrl2 = 'https://sample.mgstage.com/sample/mercury/298' + videoSeries + '/' + codeArr[1] + '/' + code + '_sample.mp4'; // MCMA-001 https://sample.mgstage.com/sample/mercury/298mcma/001/MCMA-001_sample.mp4
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1133' + videoSeries + codeArr[1] + '/h_1133' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1133' + videoSeries + videoNo + '/h_1133' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/5/57' + videoSeries.substr(0, 1) + '/57' + videoSeries + videoNo + '/57' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1104' + videoSeries + codeArr[1] + '/h_1104' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_275' + videoSeries + videoNo + '/h_275' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/5/544/5448' + videoSeries + videoNo + '/5448' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_650' + videoSeries + codeArr[1] + '/n_650' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_6/h_647' + videoSeries + codeArr[1] + '/h_647' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_650' + videoSeries + codeArr[1] + '/n_650' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1064' + videoSeries + codeArr[1] + '/n_1064' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          </video>
                          </div>`;
      $(objMCMA).before(video)
    }
    // CMA-系列 51/c
    addVideoCMA (code, objCMA) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // CMA-001 https://pv3001.dmm.com/litevideo/freepv/5/51c/51cma001/51cma001_dmb_w.mp4
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_mmb_w.mp4'; //
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/5/51' + videoSeries.substr(0, 1) + '/51' + videoSeries + codeArr[1] + '/51' + videoSeries + codeArr[1] + '_dmb_s.mp4'; // CMA-019 https://pv3001.dmm.com/litevideo/freepv/5/51c/51cma019/51cma019_dmb_s.mp4
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4'; // CND-144 https://pv3001.dmm.com/litevideo/freepv/c/cnd/cnd00144/cnd00144_dmb_w.mp4
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_s.mp4'; // CMA-029 https://pv3001.dmm.com/litevideo/freepv/c/cma/cma00029/cma00029_dmb_s.mp4
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_s.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // CMA-098 https://pv3001.dmm.com/litevideo/freepv/c/cma/cma098/cma098_dmb_w.mp4
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_s.mp4';  // CMA-112 https://pv3001.dmm.com/litevideo/freepv/c/cma/cma112/cma112_mhb_s.mp4
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          </video>
                          </div>`;
      $(objCMA).before(video)
    }
    // MEKO-系列   5种格式  h_086+2/5位数 h_1160+2/3/5位数
    addVideoMEKO (code, objMEKO) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoNo + '/h_086' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoTwo + '/h_1160' + videoSeries + videoTwo + '_dmb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + '/h_1160' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoTwo + '/h_1160' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + codeArr[1] + '/h_1160' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + 'a/' + videoSeries + videoNo + 'a_mhb_w.mp4';// MEKO-262 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160meko00262a/h_1160meko00262a_mhb_w.mp4
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160' + videoSeries + videoNo + 'b/' + videoSeries + videoNo + 'b_dmb_w.mp4'; // MEKO-262 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1160meko00262b/h_1160meko00262b_dmb_w.mp4
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'dm.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoNo + '/h_086' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + codeArr[1] + '/h_086' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/3/33' + videoSeries[0] + '/33' + videoSeries + codeArr[1] + '/33' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/3/33' + videoSeries[0] + '/33' + videoSeries + codeArr[1] + '/33' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + codeArr[1] + '/h_086' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + codeArr[1] + '/18' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086' + videoSeries + videoTwo + '/h_086' + videoSeries + videoTwo + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          </video>
                          </div>`;
      $(objMEKO).before(video)
    }
    // XRW-系列 3种格式 1、84开头+3位数  2、X开头+3位 3、172开头+5位数
    addVideoXRW (code, objXRW) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoFour = format_zero(codeArr[1], 4); //不足4位数补0
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // XRW-008 https://pv3001.dmm.com/litevideo/freepv/8/84x/84xrw008/84xrw008_dmb_w.mp4
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + videoNo + '/172' + videoSeries + videoNo + '_dmb_w.mp4'; //  XRW-339 https://pv3001.dmm.com/litevideo/freepv/1/172/172xrw00339/172xrw00339_dmb_w.mp4
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // XRW-998 https://pv3001.dmm.com/litevideo/freepv/x/xrw/xrw998/xrw998_dmb_w.mp4
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_s.mp4';  //
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_068' + videoSeries + videoFour + '/h_068' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoFour + '/' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + videoFour + '/172' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + videoFour + '/118' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoFour + '/1' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/3/3' + videoSeries.substr(0, 2) + '/3' + videoSeries + videoFour + '/3' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_237' + videoSeries + codeArr[1] + '/h_237' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_100' + videoSeries + codeArr[1] + '/h_100' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + codeArr[1] + '/172' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/1/172/172' + videoSeries + codeArr[1] + '/172' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries.substr(0, 1) + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/1/152/152' + videoSeries + videoFour + '/152' + videoSeries + videoFour + '_sm_s.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_179' + videoSeries + codeArr[1] + '/h_179' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_186' + videoSeries + codeArr[1] + '/h_186' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          </video>
                          </div>`;
      $(objXRW).before(video)
    }
    // THNIB-系列 2种格式 1、n_1445+截掉b+3位数 2、h_706+5位数
    addVideoTHNIB (code, objTHNIB) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_dmb_w.mp4'; // THNIB-026 https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706thnib00026/h_706thnib00026_dmb_w.mp4
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_mhb_w.mp4'; // THNIB-041 https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706thnib00041/h_706thnib00041_mhb_w.mp4
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_dm_w.mp4'; // THNIB-023 https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706thnib00023/h_706thnib00023_dm_w.mp4
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445' + videoSeries.substr(0, 4) + codeArr[1] + '/n_1445' + videoSeries.substr(0, 4) + codeArr[1] + '_dmb_w.mp4'; // THNIB-025 https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1445thni025/n_1445thni025_dmb_w.mp4
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1425' + videoSeries + videoNo + '/n_1425' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1425' + videoSeries + codeArr[1] + '/n_1425' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1425' + videoSeries.substr(0, 4) + codeArr[1] + '/n_1425' + videoSeries.substr(0, 4) + codeArr[1] + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1075' + videoSeries + codeArr[1] + '/h_1075' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + videoNo + '/h_205' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1075' + videoSeries + videoNo + '/h_1075' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_310' + videoSeries + codeArr[1] + '/h_310' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_310' + videoSeries + codeArr[1] + '/h_310' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_310' + videoSeries + codeArr[1] + '/h_310' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          </video>
                          </div>`;
      $(objTHNIB).before(video)
    }
    // GVH-系列 4种格式 1、13+3/5位数 2、首字母+3/5位数 /GST-
    addVideoGVH (code, objGVH) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries.substr(0, 1) + '/12' + videoSeries + codeArr[1] + '/12' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries.substr(0, 1) + '/12' + videoSeries + videoNo + '/12' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries.substr(0, 1) + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'dm.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'sm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          </video>
                          </div>`;
      $(objGVH).before(video)
    }
    // ARSO-系列 2种格式  h_1378/1/  H-系列 140+ 首字母+
    addVideoARSO (code, objARSO) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1378' + videoSeries + videoNo + '/h_1378' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1378' + videoSeries + videoNo + '/h_1378' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/140/140' + videoSeries + codeArr[1] + '/140' + videoSeries + codeArr[1] + '_dm_s.mp4'; // H-2055 https://pv3001.dmm.com/litevideo/freepv/1/140/140h2055/140h2055_dm_s.mp4
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 1) + codeArr[1].substr(0, 2) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4'; // H-621 https://pv3001.dmm.com/litevideo/freepv/h/h62/h621/h621_dm_w.mp4
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 1) + codeArr[1].substr(0, 2) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 1) + codeArr[1].substr(0, 2) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 1) + codeArr[1].substr(0, 2) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4'; // H-643 https://pv3001.dmm.com/litevideo/freepv/h/h64/h643/h643_dmb_w.mp4
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/5/559/5593' + videoSeries + videoNo + '/5593' + videoSeries + videoNo + '_dm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          </video>
                          </div>`;
      $(objARSO).before(video)
    }
    // DOKS-系列 2种格式 h_139+3位数 2、36+5位数 / TSM-系列  h_189+5 36+2
    addVideoDOKS (code, objDOKS) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_mhb_w.mp4';//DOKS-573 https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139doks573/h_139doks573_mhb_w.mp4
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_189' + videoSeries + videoNo + '/h_189' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_189' + videoSeries + videoNo + '/h_189' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_189' + videoSeries + videoNo + '/h_189' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoTwo + '/36' + videoSeries + videoTwo + '_dm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoTwo + '/36' + videoSeries + videoTwo + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoTwo + '/36' + videoSeries + videoTwo + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_139' + videoSeries + codeArr[1] + '/h_139' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + videoNo + '/36' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_189' + videoSeries + codeArr[1] + '/h_189' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/3/36' + videoSeries[0] + '/36' + videoSeries + codeArr[1] + '/36' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_706' + videoSeries + videoNo + '/h_706' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1263' + videoSeries + videoNo + '/h_1263' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1263' + videoSeries + videoNo + '/h_1263' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/7/77' + videoSeries[0] + '/77' + videoSeries + codeArr[1] + '/77' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/7/71' + videoSeries[0] + '/71' + videoSeries + codeArr[1] + '/71' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          </video>
                          </div>`;
      $(objDOKS).before(video)
    }
    // YMDD-系列 2种格式 1、15+3/5位数 2、首字母+3/5位数 /TMD-系列 首+3/5 15+
    addVideoYMDD (code, objYMDD) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + videoNo + '/15' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/1/15' + videoSeries[0] + '/15' + videoSeries + codeArr[1] + '/15' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl9990 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.m3u8';
      let videoUrl9991 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.m3u8';
      let videoUrl9992 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'mmb.m3u8';
      let videoUrl9993 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/playlist.m3u8';
      let videoUrl9996 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.m3u8';
      let videoUrl9997 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.m3u8';
      let videoUrl9998 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'mmb.m3u8';
      let videoUrl9999 = 'https://pv3001.dmm.com/hlsvideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/playlist.m3u8';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl9990} type="application/x-mpegurl" />
                          <source src=${videoUrl9991} type="application/x-mpegurl" />
                          <source src=${videoUrl9992} type="application/x-mpegurl" />
                          <source src=${videoUrl9993} type="application/x-mpegurl" />
                          <source src=${videoUrl9996} type="application/x-mpegurl" />
                          <source src=${videoUrl9997} type="application/x-mpegurl" />
                          <source src=${videoUrl9998} type="application/x-mpegurl" />
                          <source src=${videoUrl9999} type="application/x-mpegurl" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          </video>
                          </div>`;
      $(objYMDD).before(video)
    }
    // SW-系列   ASW-、AVSW-、DISW-、DXSW-、HOISW-、KSWP-、OSW-无 、SW-、SWAC-、SWAR-无、SWAT-无、SWC-、SWD-、SWDF-、SWF-无、SWH-、SWS-无、SWSG-无、SWSM-无、SWA-、SWAG-、SWBD-、SWCN-、SWE-、SWFD-无、SWHD-无、SWJS-无、SWKI-、SWN-无、SWWC-  VOIC-系列 调用SW-规则 /TRST-系列  n_681+4 5141+5 n_1155+4  / voic-
    addVideoSW (code, objSW) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoFour = format_zero(codeArr[1], 4);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2); // 数字截取后2位
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + codeArr[1] + '/436' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/4/421/421' + videoSeries + codeArr[1] + '/421' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_967' + videoSeries + codeArr[1] + '/h_967' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_175' + videoSeries + codeArr[1] + '/h_175' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_491' + videoSeries + codeArr[1] + '/h_491' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + codeArr[1] + '/h_1359' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + codeArr[1] + '/h_1359' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1359' + videoSeries + videoNo + '/h_1359' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_113' + videoSeries + codeArr[1] + '/h_113' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/3/33' + videoSeries[0] + '/33' + videoSeries + codeArr[1] + '/33' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_650' + videoSeries + codeArr[1] + '/n_650' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_650' + videoSeries + codeArr[1] + '/n_650' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_650' + videoSeries + codeArr[1] + '/n_650' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries[0] + '/12' + videoSeries + codeArr[1] + '/12' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/1/12' + videoSeries[0] + '/12' + videoSeries + codeArr[1] + '/12' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/5/514/5141' + videoSeries + codeArr[1] + '/5141' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl38 = 'https://pv3001.dmm.com/litevideo/freepv/5/514/5141' + videoSeries + videoNo + '/5141' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl39 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl40 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_681' + videoSeries + videoFour + '/n_681' + videoSeries + videoFour + '_sm_w.mp4';
      let videoUrl41 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1155' + videoSeries + videoFour + '/n_1155' + videoSeries + videoFour + '_dmb_w.mp4';
      let videoUrl42 = 'https://pv3001.dmm.com/litevideo/freepv/5/529/5294' + videoSeries + videoNo + '/5294' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl43 = 'https://pv3001.dmm.com/litevideo/freepv/4/483/483' + videoSeries + videoNo + '/483' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl44 = 'https://pv3001.dmm.com/litevideo/freepv/4/483/483' + videoSeries + videoNo + '/483' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl45 = 'https://pv3001.dmm.com/litevideo/freepv/4/483/483' + videoSeries + videoNo + '/483' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl46 = 'https://pv3001.dmm.com/litevideo/freepv/4/483/483' + videoSeries + videoNo + '/483' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl47 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + videoTwo + '/436' + videoSeries + videoTwo + '_sm_w.mp4';
      let videoUrl48 = 'https://pv3001.dmm.com/litevideo/freepv/4/436/436' + videoSeries + videoTwo + '/436' + videoSeries + videoTwo + '_sm_s.mp4';
      let videoUrl49 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl50 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_955' + videoSeries + codeArr[1] + '/h_955' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl51 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_157' + videoSeries + codeArr[1] + '/h_157' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl52 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_157' + videoSeries + videoTwo + '/h_157' + videoSeries + videoTwo + '_sm_s.mp4';
      let videoUrl53 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + 'dm.mp4';
      let videoUrl54 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + 'sm.mp4';
      let videoUrl55 = 'https://pv3001.dmm.com/litevideo/freepv/5/514/5141' + videoSeries + videoNo + '/5141' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl56 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl57 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_707' + videoSeries + codeArr[1] + '/n_707' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl53} type="video/mp4" />
                          <source src=${videoUrl54} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl38} type="video/mp4" />
                          <source src=${videoUrl39} type="video/mp4" />
                          <source src=${videoUrl40} type="video/mp4" />
                          <source src=${videoUrl41} type="video/mp4" />
                          <source src=${videoUrl42} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl43} type="video/mp4" />
                          <source src=${videoUrl44} type="video/mp4" />
                          <source src=${videoUrl45} type="video/mp4" />
                          <source src=${videoUrl46} type="video/mp4" />
                          <source src=${videoUrl47} type="video/mp4" />
                          <source src=${videoUrl48} type="video/mp4" />
                          <source src=${videoUrl49} type="video/mp4" />
                          <source src=${videoUrl50} type="video/mp4" />
                          <source src=${videoUrl51} type="video/mp4" />
                          <source src=${videoUrl52} type="video/mp4" />
                          <source src=${videoUrl55} type="video/mp4" />
                          <source src=${videoUrl56} type="video/mp4" />
                          <source src=${videoUrl57} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          </video>
                          </div>`;
      $(objSW).before(video)
    }
    // SMA-系列 DSMA2个资源 3种格式 1、83+3/5位数 2、首字母+3/5位数  / SMS-系列 83/首字母+3+_sm_w 并入 SMA
    addVideoSMA (code, objSMA) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      if (code.indexOf('DSMA-01') !== -1) { videoUrl = 'https://sample.mgstage.com/sample/mirai/064dsma/01/DSMA-01.mp4' }
      if (code.indexOf('DSMA-02') !== -1) { videoUrl = 'https://sample.mgstage.com/sample/mirai/064dsma/02/DSMA-002.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + videoNo + '/83' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/8/83' + videoSeries[0] + '/83' + videoSeries + codeArr[1] + '/83' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          </video>
                          </div>`;
      $(objSMA).before(video)
    }
    // AVOP-系列 9种格式 1、1/11/18/59/84/首/h_910/h_254  CRDD-系列 h_1518/首
    addVideoAVOP (code, objAVOP) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/11' + videoSeries[0] + '/11' + videoSeries + videoNo + '/11' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + videoNo + '/18' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/5/59' + videoSeries[0] + '/59' + videoSeries + videoNo + '/59' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries[0] + '/84' + videoSeries + videoNo + '/84' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + videoNo + '/h_254' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_910' + videoSeries + videoNo + '/h_910' + videoSeries + videoNo + '_dmb_w.mp4';
      // https://pv3001.dmm.com/litevideo/freepv/a/avo/avop00127/avop00127_dmb_w.mp4
      // https://pv3001.dmm.com/litevideo/freepv/a/avo/avop00127/avop00127_sm_w.mp4
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_792' + videoSeries + videoNo + '/h_792' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_792' + videoSeries + videoNo + '/h_792' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1518' + videoSeries + codeArr[1] + '/h_1518' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_5/h_559' + videoSeries + videoNo + '/h_559' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_848' + videoSeries + videoNo + '/h_848' + videoSeries + videoNo + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          </video>
                          </div>`;
      // 下面为调试使用,不喜欢的可以把两段注释中间的删掉(显示番号和预览片地址:检查是否存在番号错误\张冠李戴等现象) 有些可能片商存在番号 但是没有预告片
      if (code.match(/[a-zA-Z]{2,12}-\d{2,12}/i)) {
        if (code.match(/^(AVOP-187|AVOP-282|AVOP-464)/i)) {
          var host = 'https://madonna-av.com/works/detail';
          var maker = 'Madonna(熟女、人妻专门制造商)';
        } else if (code.match(/^(AVOP-056|AVOP-104|AVOP-212|AVOP-348|AVOP-437)/i)) {
          var host = 'https://kawaiikawaii.jp/works/detail';
          var maker = 'kawaii(女大学生专门制造商)';
        } else if (code.match(/^(AVOP-002|AVOP-164|AVOP-263|AVOP-355|AVOP-445|YUJ-)/i)) {
          var host = 'https://attackers.net/works/detail';
          var maker = 'Attackers(凌辱剧情专门制造商)';
        } else if (code.match(/^(OPVR-|OPBD-|OPUD-|AAJB-006|AVOP-135)/i)) {
          var host = 'https://av-opera.jp/works/detail';
          var maker = 'Av-opera(恋屎癖专门制造商)';
        } else if (code.match(/^(BF-|PFES-|AVGL-134|AVOP-386)/i)) {
          var host = 'https://befreebe.com/works/detail';
          var maker = 'Befreebe(Cosplay单体女优制造商)';
        } else if (code.match(/^(AVOP-309|AVOP-205|AVOP-064)/i)) {
          var host = 'https://bi-av.com/works/detail';
          var maker = 'Bi-av美(痴女专门制造商)';
        } else if (code.match(/^(AVOP-454|AVOP-305|AVOP-203|AVOP-125|AVOP-014|EBWH-)/i)) {
          var host = 'https://av-e-body.com/works/detail';
          var maker = 'Av-E-BODY(各类单体女优制造商)';
        } else if (code.match(/^(AVOP-428|AVOP-320|AVOP-272)/i)) {
          var host = 'https://bibian-av.com/works/detail';
          var maker = 'Bibian-avビビアン(女同性恋专门制造商)';
        } else if (code.match(/^(AVOP-423|AVOP-319|AVOP-256|AVOP-169|AVOP-061)/i)) {
          var host = 'https://dasdas.jp/works/detail';
          var maker = 'Dasdasダスッ！(QJ中出专门制造商)';
        } else if (code.match(/^(AVOP-451|AVOP-304|AVOP-207|AVOP-174|AVOP-041)/i)) {
          var host = 'https://fitch-av.com/works/detail';
          var maker = 'Fitch(熟女、人妻专门制造商)';
        } else if (code.match(/^(AVGL-|HJBB-|HJMO-|AVOP-344|AVOP-226)/i)) {
          var host = 'https://hajimekikaku.com/works/detail';
          var maker = 'Hajimekikaku宇宙企划(素人女优制造商)';
        } else if (code.match(/^(AVOP-410|AVOP-314)/i)) {
          var host = 'https://honnaka.jp/works/detail';
          var maker = 'Honnaka本中(中出専门制造商)';
        } else if (code.match(/^(AVOP-401|AVOP-301|AVOP-201|AVOP-124|AVOP-001)/i)) {
          var host = 'https://ideapocket.com/works/detail';
          var maker = 'IdeaPocket(专属女优制造商/开发单体女优为主)';
        } else if (code.match(/^(AOM-|MMND-|MMVR-|MMXD-|AVOP-143)/i)) {
          var host = 'https://miman.jp/works/detail';
          var maker = 'Miman(巨乳少女制造商)';
        } else if (code.match(/^(EMLB-|MVR-|MISM-|AVOP-447)/i)) {
          var host = 'https://mko-labo.net/works/detail';
          var maker = 'Mko-labo(M女専门制造商)';
        } else if (code.match(/^(AVOP-210|AVOP-009)/i)) {
          var host = 'https://moodyz.com/works/detail';
          var maker = 'MOODYZ(专属女优制造商)';
        } else if (code.match(/^(AVOP-381|AVOP-228|AVOP-163|AVOP-047)/i)) {
          var host = 'https://muku.tv/works/detail';
          var maker = '無垢(JK制服美少女专门制造商)';
        } else if (code.match(/^(AVOP-316|AVOP-245|AVOP-166)/i)) {
          var host = 'https://mvg.jp/works/detail';
          var maker = 'エムズビデオグループMVG（吞精专门制造商）';
        } else if (code.match(/^(BLK-|KIBD-|KIFD-|KIRD-|KISD-|KIVR-|SET-|AVOP-349|AVOP-105|AVOP-057)/i)) {
          var host = 'https://kirakira-av.com/works/detail';
          var maker = 'kira☆kira(辣妹专门制造商)';
        } else if (code.match(/^(AVOP-418|AVOP-383|AVOP-246|AVOP-147|AVOP-055)/i)) {
          var host = 'https://oppai-av.com/works/detail';
          var maker = 'OPPAI(恋胸癖専门制造商)';
        } else if (code.match(/^(AVOP-239|AVOP-129|AVOP-067)/i)) {
          var host = 'https://premium-beauty.com/works/detail';
          var maker = 'Premium(专属女优制造商/单体女优)';
        } else if (code.match(/^(RVR-|RBB-|RKI-|AVOP-412)/i)) {
          var host = 'https://rookie-av.jp/works/detail';
          var maker = 'Rookie-av(企划专门制造商)';
        } else if (code.match(/^(AVOP-127)/i)) {
          var host = 'https://s1s1s1.com/works/detail';
          var maker = 'S1 NO.1 STYLE(专属女优制造商/人气女优与美形女优)';
        } else if (code.match(/^(AVOP-368|AVOP-185|AVOP-032)/i)) {
          var host = 'https://tameikegoro.jp/works/detail';
          var maker = '溜池ゴロー(熟女、人妻专门制造商)';
        } else if (code.match(/^(CLVR-|STOL-|CLUB-|AVOP-330)/i)) {
          var host = 'https://to-satsu.com/works/detail';
          var maker = 'To-satsu(按摩偷窥専门制造商)';
        } else if (code.match(/^(VVVD-|VICD-|VIZD-|VSPD-|AVGL-107|AVOP-165)/i)) {
          var host = 'https://v-av.com/works/detail';
          var maker = 'V-av(SM专门制造商)';
        } else {
          var host = 'https://wanz-factory.com/works/detail';
          var maker = 'Wanz Factory(中出单体女优制造商)';
        }
        let codee = code.replace("-", "");
        GM_xmlhttpRequest({
          url: host + `/` + codee,
          method: "GET",
          responseType: "document",
          onload: ({ response }) => {
            if (!response) {
              isLoading = false;
              return;
            }
            const avsrc = response
              ?.querySelector(".video video")?.getAttribute("src") ?? "";
            if (!avsrc) {
              isLoading = false;
              return;
            }
            let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                          ' + code + ' ' + avsrc + ' <a href="' + avsrc + '" target="_blank"><strong>播放</strong></a>\
                          <BR>此处为片商  <a href="' + host + `/` + codee + '" target="_blank"><strong>"' + maker + '"</strong></a>  直获地址,区别与上面的规则匹配,如果存在资源,可能比规则匹配速度快些\
                          </div>');
            $(objAVOP).before(video)
          },
        });
      }
      // 不喜欢的可以把上下两段注释中间的删掉
      // sod start avsrc参数只为校验页面是否存在 此页面的mp4播放地址不可外链 不可直接播放
      if (code.match(/^(STARS-|SODS-|DSVR-)/i)) {
        var host = 'https://ec.sod.co.jp/prime/videos/sample.php?id=';
        var maker = 'SOD Create';
        GM_xmlhttpRequest({
          url: host + code,
          method: "GET",
          responseType: "document",
          onload: ({ response }) => {
            var isLoading = true;
            if (!response) {
              isLoading = false;
              return;
            }
            const avsrc = response
              ?.querySelector(".videos_favoriteb a")?.getAttribute("href") ?? "";
            if (!avsrc) {
              isLoading = false;
              return;
            }
            let video = $('<div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">\
                          ' + code + '：此处为片商  <a href="' + host + code + '" target="_blank"><strong>"' + maker + '"</strong></a>  预览页面,区别与上面的规则匹配,如显示此提示，可移步查看\
                          </div>');
            $(obj).before(video)
          },
        });
      }
      // sod end
      $(objAVOP).before(video)
    }
    // BAZX-系列 84/首
    addVideoBAZX (code, objBAZX) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/8/84' + videoSeries[0] + '/84' + videoSeries + codeArr[1] + '/84' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          </video>
                          </div>`;
      $(objBAZX).before(video)
    }
    // VSPDS-系列 1+3/5位数 42+3位数
    addVideoVSPDS (code, objVSPDS) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + codeArr[1] + '/1' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/4/42' + videoSeries[0] + '/42' + videoSeries + codeArr[1] + '/42' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/4/42' + videoSeries[0] + '/42' + videoSeries + codeArr[1] + '/42' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/4/42' + videoSeries[0] + '/42' + videoSeries + codeArr[1] + '/42' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          </video>
                          </div>`;
      $(objVSPDS).before(video)
    }
    // NATR-系列 种  h_067+3位数 首字母+3/5位数  / TGA-系列 h_254+3 h_1577+5 / TEN-系列  143+2 h_859+3 (  \raf-首字母+3/5 143+ \  / TEN-系列  143+2 h_859+3 / TGA-系列 h_254+3 h_1577+5 并入 NATR )
    addVideoNATR (code, objNATR) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + codeArr[1] + '/h_067' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + codeArr[1] + '/h_067' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + codeArr[1] + '/h_067' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + codeArr[1] + '/h_067' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_254' + videoSeries + codeArr[1] + '/h_254' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1577' + videoSeries + videoNo + '/h_1577' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1577' + videoSeries + videoNo + '/h_1577' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1577' + videoSeries + videoNo + '/h_1577' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1577' + videoSeries + videoNo + '/h_1577' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143' + videoSeries + videoTwo + '/143' + videoSeries + videoTwo + '_sm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_8/h_859' + videoSeries + codeArr[1] + '/h_859' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143' + videoSeries + codeArr[1] + '/143' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/1/118/118' + videoSeries + codeArr[1] + '/118' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143' + videoSeries + videoTwo + '/143' + videoSeries + videoTwo + '_sm_s.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/5/512/5129' + videoSeries + videoNo + '/5129' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1057' + videoSeries + codeArr[1] + '/n_1057' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1057' + videoSeries + codeArr[1] + '/n_1057' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/1/143/143' + videoSeries + codeArr[1] + '/143' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/g/gk' + videoSeries.substr(0, 1) + '/gk' + videoSeries + codeArr[1] + '/gk' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          </video>
                          </div>`;
      $(objNATR).before(video)
    }
    // EKDV-系列 3种 49+3/5位数 首字母+5位数
    addVideoEKDV (code, objEKDV) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + codeArr[1] + '/49' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + codeArr[1] + '/49' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + codeArr[1] + '/49' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + codeArr[1] + '/49' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/4/49' + videoSeries[0] + '/49' + videoSeries + videoNo + '/49' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1271' + videoSeries + videoNo + '/h_1271' + videoSeries + videoNo + '_sm_s.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_4/h_445' + videoSeries + codeArr[1] + '/h_445' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'dm.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'sm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          </video>
                          </div>`;
      $(objEKDV).before(video)
    }
    // STCV-系列 首字母+3位数 h_1616+5位数 1+5位数
    addVideoSTCV (code, objSTCV) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1616' + videoSeries + videoNo + '/h_1616' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1616' + videoSeries + videoNo + '/h_1616' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1616' + videoSeries + videoNo + '/h_1616' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/1/1' + videoSeries.substr(0, 2) + '/1' + videoSeries + videoNo + '/1' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          </video>
                          </div>`;
      $(objSTCV).before(video)
    }
    // NASH-系列 2种 h_067+3位数 首字母+3位数
    addVideoNASH (code, objNASH) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + videoNo + '/h_067' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + videoNo + '/h_067' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_067' + videoSeries + videoNo + '/h_067' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl8 = 'https://sample.mgstage.com/sample/nadeshiko/171' + videoSeries + '/' + codeArr[1] + '/171' + code + '.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/4/406/406' + videoSeries + videoNo + '/406' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_7/n_709' + videoSeries + codeArr[1] + '/n_709' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          </video>
                          </div>`;
      $(objNASH).before(video)
    }
    // KTRA-系列 4种 h_094+3/5位数 首字母+3/5位数
    addVideoKTRA (code, objKTRA) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + '/h_094' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + '/h_094' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + '/h_094' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + 'e/h_094' + videoSeries + videoNo + 'e_dmb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + 'e/h_094' + videoSeries + videoNo + 'e_mhb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + videoNo + 'e/h_094' + videoSeries + videoNo + 'e_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + '/h_094' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + '/h_094' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + '/h_094' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + 'e/h_094' + videoSeries + codeArr[1] + 'e_dmb_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + 'e/h_094' + videoSeries + codeArr[1] + 'e_mhb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_094' + videoSeries + codeArr[1] + 'e/h_094' + videoSeries + codeArr[1] + 'e_dm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          </video>
                          </div>`;
      $(objKTRA).before(video)
    }
    // MOND-系列 首字母+5位数 18+3位数
    addVideoMOND (code, objMOND) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + codeArr[1] + '/18' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + codeArr[1] + '/18' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/18' + videoSeries[0] + '/18' + videoSeries + codeArr[1] + '/18' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'sm.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + 'dm.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'sm.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + 'dm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          </video>
                          </div>`;
      $(objMOND).before(video)
    }
    // ADK-系列 h_747/h_908
    addVideoADK (code, objADK) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1121' + videoSeries + codeArr[1] + '/n_1121' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1121' + videoSeries + codeArr[1] + '/n_1121' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_305' + videoSeries + codeArr[1] + '/h_305' + videoSeries + codeArr[1] + '_dmb_w.mp4'
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_305' + videoSeries + codeArr[1] + '/h_305' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_3/h_305' + videoSeries + codeArr[1] + '/h_305' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1278' + videoSeries + videoNo + '/h_1278' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1278' + videoSeries + videoNo + '/h_1278' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1283' + videoSeries + videoNo + '/h_1283' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1283' + videoSeries + videoNo + '/h_1283' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + videoNo + '/h_1300' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + videoNo + '/h_1300' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + codeArr[1] + '/h_1300' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1300' + videoSeries + codeArr[1] + '/h_1300' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1348' + videoSeries + codeArr[1] + '/h_1348' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1348' + videoSeries + codeArr[1] + '/h_1348' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + codeArr[1] + '/h_1074' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + codeArr[1] + '/h_1074' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_205' + videoSeries + codeArr[1] + '/h_205' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1522' + videoSeries + videoNo + '/h_1522' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1522' + videoSeries + videoNo + '/h_1522' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1428' + videoSeries + codeArr[1] + '/n_1428' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_1/n_1428' + videoSeries + codeArr[1] + '/n_1428' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + videoNo + '/h_1074' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1074' + videoSeries + videoNo + '/h_1074' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1760' + videoSeries + videoNo + '/h_1760' + videoSeries + videoNo + 'dm.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1760' + videoSeries + videoNo + '/h_1760' + videoSeries + videoNo + 'sm.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1711' + videoSeries + videoNo + '/h_1711' + videoSeries + videoNo + 'dm.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_1711' + videoSeries + videoNo + '/h_1711' + videoSeries + videoNo + 'sm.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          </video>
                          </div>`;
      $(objADK).before(video)
    }
    // ENFD-系列 5626/5664+5 n_641+默认
    addVideoENFD (code, objENFD) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/562/5626' + videoSeries + videoNo + '/5626' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/5/562/5626' + videoSeries + videoNo + '/5626' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/5/562/5626' + videoSeries + videoNo + '/5626' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/5/562/5626' + videoSeries + videoNo + '/5626' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/5/566/5664' + videoSeries + videoNo + '/5664' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/5/566/5664' + videoSeries + videoNo + '/5664' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/5/566/5664' + videoSeries + videoNo + '/5664' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/5/566/5664' + videoSeries + videoNo + '/5664' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_641' + videoSeries + codeArr[1] + '/n_641' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_641' + videoSeries + codeArr[1] + '/n_641' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_641' + videoSeries + codeArr[1] + '/n_641' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/n/n_6/n_641' + videoSeries + codeArr[1] + '/n_641' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          </video>
                          </div>`;
      $(objENFD).before(video)
    }
    // ISD-系列 13\17\21\24 首字母  https://pv3001.dmm.com/litevideo/freepv/2/21i/21isd067/21isd067_dmb_s.mp4  skd并入ISD
    addVideoISD (code, objISD) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoTwo = codeArr[1].substring(codeArr[1].length - 2); // 数字截取后2位
      let videoThrBu = format_zero(codeArr[1], 3); // 1位或2位补足3位 区别与直接截取后3位
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl8 = 'https://pv3001.dmm.com/litevideo/freepv/1/17' + videoSeries[0] + '/17' + videoSeries + videoNo + '/17' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl9 = 'https://pv3001.dmm.com/litevideo/freepv/1/17' + videoSeries[0] + '/17' + videoSeries + videoNo + '/17' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl10 = 'https://pv3001.dmm.com/litevideo/freepv/1/17' + videoSeries[0] + '/17' + videoSeries + videoNo + '/17' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl11 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + videoNo + '/21' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl12 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + videoNo + '/21' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl13 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + videoNo + '/21' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl14 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + codeArr[1] + '/21' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl15 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + codeArr[1] + '/21' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl16 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + codeArr[1] + '/21' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl17 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_dmb_w.mp4';
      let videoUrl18 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl19 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl20 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoNo + '/' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl21 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoNo + '/13' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl22 = 'https://pv3001.dmm.com/litevideo/freepv/1/17' + videoSeries[0] + '/17' + videoSeries + videoNo + '/17' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl23 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + videoNo + '/21' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl24 = 'https://pv3001.dmm.com/litevideo/freepv/2/21' + videoSeries[0] + '/21' + videoSeries + codeArr[1] + '/21' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl25 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + videoNo + '/24' + videoSeries + videoNo + '_dmb_s.mp4';
      let videoUrl26 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl27 = 'https://pv3001.dmm.com/litevideo/freepv/4/433/433' + videoSeries + codeArr[1] + '/433' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl28 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl29 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl30 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl31 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl32 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_dmb_s.mp4';
      let videoUrl33 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + codeArr[1] + '/13' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl34 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_s.mp4';
      let videoUrl35 = 'https://pv3001.dmm.com/litevideo/freepv/1/13' + videoSeries[0] + '/13' + videoSeries + videoTwo + '/13' + videoSeries + videoTwo + '_sm_s.mp4';
      let videoUrl36 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_sm_s.mp4';
      let videoUrl37 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl38 = 'https://pv3001.dmm.com/litevideo/freepv/2/24' + videoSeries[0] + '/24' + videoSeries + codeArr[1] + '/24' + videoSeries + codeArr[1] + '_sm_w.mp4';
      let videoUrl39 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + codeArr[1] + '/' + videoSeries + codeArr[1] + '_sm_s.mp4'
      let videoUrl40 = 'https://pv3001.dmm.com/litevideo/freepv/' + videoSeries[0] + '/' + videoSeries.substr(0, 3) + '/' + videoSeries + videoThrBu + '/' + videoSeries + videoThrBu + '_dm_w.mp4'
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          <source src=${videoUrl10} type="video/mp4" />
                          <source src=${videoUrl13} type="video/mp4" />
                          <source src=${videoUrl16} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl26} type="video/mp4" />
                          <source src=${videoUrl27} type="video/mp4" />
                          <source src=${videoUrl28} type="video/mp4" />
                          <source src=${videoUrl29} type="video/mp4" />
                          <source src=${videoUrl30} type="video/mp4" />
                          <source src=${videoUrl31} type="video/mp4" />
                          <source src=${videoUrl32} type="video/mp4" />
                          <source src=${videoUrl33} type="video/mp4" />
                          <source src=${videoUrl34} type="video/mp4" />
                          <source src=${videoUrl35} type="video/mp4" />
                          <source src=${videoUrl36} type="video/mp4" />
                          <source src=${videoUrl37} type="video/mp4" />
                          <source src=${videoUrl38} type="video/mp4" />
                          <source src=${videoUrl39} type="video/mp4" />
                          <source src=${videoUrl40} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl8} type="video/mp4" />
                          <source src=${videoUrl9} type="video/mp4" />
                          <source src=${videoUrl11} type="video/mp4" />
                          <source src=${videoUrl12} type="video/mp4" />
                          <source src=${videoUrl14} type="video/mp4" />
                          <source src=${videoUrl15} type="video/mp4" />
                          <source src=${videoUrl17} type="video/mp4" />
                          <source src=${videoUrl18} type="video/mp4" />
                          <source src=${videoUrl19} type="video/mp4" />
                          <source src=${videoUrl20} type="video/mp4" />
                          <source src=${videoUrl21} type="video/mp4" />
                          <source src=${videoUrl22} type="video/mp4" />
                          <source src=${videoUrl23} type="video/mp4" />
                          <source src=${videoUrl24} type="video/mp4" />
                          <source src=${videoUrl25} type="video/mp4" />
                          </video>
                          </div>`;
      $(objISD).before(video)
    }
    // AVGP-系列 复杂的番号系列
    addVideoAVGP (code, objAVGP) {
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_dm_w.mp4';
      if (null != code.match(/^(AVGP-013)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/540/540avgp013/540avgp013_sm_s.mp4' }
      if (null != code.match(/^(AVGP-014)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/140/140avgp014/140avgp014_sm_s.mp4' }
      if (null != code.match(/^(AVGP-102)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/504/504avgp102/504avgp102_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-104)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/148/148avgp104/148avgp104_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-105)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_274avgp105/h_274avgp105_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-106)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_269avgp106/h_269avgp106_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-107)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_229avgp107/h_229avgp107_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-108)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/46a/46avgp108/46avgp108_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-109)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/36a/36avgp109/36avgp109_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-110)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/6/66a/66avgp110/66avgp110_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-112)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/47a/47avgp112/47avgp112_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-113)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/48a/48avgp113/48avgp113_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-114)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/12a/12avgp114/12avgp114_dm_s.mp4' }
      if (null != code.match(/^(AVGP-115)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/13a/13avgp115/13avgp115_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-116)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/50a/50avgp116/50avgp116_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-117)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_273avgp117/h_273avgp117_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-118)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_240avgp118/h_240avgp118_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-119)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/540/540avgp119/540avgp119_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-120)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/140/140avgp120/140avgp120_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-123)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_164avgp123/h_164avgp123_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-124)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_152avgp124/h_152avgp124_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-125)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_0/h_086avgp125/h_086avgp125_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-126)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/171/171avgp126/171avgp126_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-127)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/18a/18avgp127/18avgp127_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-128)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_268avgp128/h_268avgp128_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-129)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_236avgp129/h_236avgp129_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-130)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/4/434/434avgp130/434avgp130_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-131)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/55a/55avgp131/55avgp131_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-132)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_275avgp132/h_275avgp132_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-134)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_127avgp134/h_127avgp134_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-135)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_267avgp135/h_267avgp135_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-136)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_172avgp136/h_172avgp136_dm_s.mp4' }
      if (null != code.match(/^(AVGP-137)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/28a/28avgp137/28avgp137_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-138)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/57a/57avgp138/57avgp138_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-141)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_276avgp141/h_276avgp141_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-142)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/5/59a/59avgp142/59avgp142_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-143)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/6/62a/62avgp143/62avgp143_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-144)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/23a/23avgp144/23avgp144_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-145)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/189/189avgp145/189avgp145_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-146)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/h/h_2/h_204avgp146/h_204avgp146_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-147)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/1/17a/17avgp147/17avgp147_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-148)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/2/2av/2avgp148/2avgp148_dmb_s.mp4' }
      if (null != code.match(/^(AVGP-150)/i)) { videoUrl = 'https://pv3001.dmm.com/litevideo/freepv/3/3av/3avgp150/3avgp150_dmb_s.mp4' }
      let videoUrl2 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_mhb_w.mp4';
      let videoUrl3 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_9/h_908' + videoSeries + videoNo + '/h_908' + videoSeries + videoNo + '_sm_w.mp4';
      let videoUrl4 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_dm_w.mp4';
      let videoUrl5 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_dmb_w.mp4';
      let videoUrl6 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_7/h_747' + videoSeries + codeArr[1] + '/h_747' + videoSeries + codeArr[1] + '_mhb_w.mp4';
      let videoUrl7 = 'https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_172' + videoSeries + codeArr[1] + '/h_172' + videoSeries + codeArr[1] + '_dm_s.mp4'; // https://pv3001.dmm.com/litevideo/freepv/h/h_1/h_172avgp136/h_172avgp136_dm_s.mp4
      let video = `
						  <div style="text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;">
                          <video id="my_video" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsinline autoplay muted loop preload="auto" data-setup='{}' style="width: 99%;">
                          <source src=${videoUrl} type="video/mp4" />
                          <source src=${videoUrl2} type="video/mp4" />
                          <source src=${videoUrl3} type="video/mp4" />
                          <source src=${videoUrl4} type="video/mp4" />
                          <source src=${videoUrl5} type="video/mp4" />
                          <source src=${videoUrl6} type="video/mp4" />
                          <source src=${videoUrl7} type="video/mp4" />
                          </video>
                          </div>`;
      $(objAVGP).before(video)
    }
    // 数据节点Base结束
  }
  class JavBus extends Base {
    constructor(Request) {
      super(Request);
      GM_addStyle(`
                .info a.red {color:red;padding-left:2px;padding-right:2px;}
            `);
      if ($('.col-md-3.info').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let info = $('.col-md-3.info');
      let yulan = $('.row.movie');
      let changyulan = $('#mag-submit-show');
      //标题
      let title = $('.container > h3').text();
      //识别码
      let codeRow = info.find('p').eq(0);
      let code = codeRow.find('span').eq(1).html().replace("SR-0029", "SR-29").replace("SR-0030", "SR-30").replace("SR-0031", "SR-31").replace("SR-0032", "SR-32").replace("SR-0033", "SR-33").replace("SR-0034", "SR-34").replace("SR-0035", "SR-35").replace("SR-0036", "SR-36").replace("SR-0037", "SR-37").replace("SR-0038", "SR-38").replace("SR-0039", "SR-39").replace("SR-0040", "SR-40").replace("SR-0041", "SR-41").replace("SR-0042", "SR-42").replace("SR-0043", "SR-43").replace("SR-0044", "SR-44").replace("SR-0045", "SR-45").replace("SR-0046", "SR-46").replace("SR-0047", "SR-47").replace("SR-0048", "SR-48").replace("SR-0049", "SR-49").replace("SR-0050", "SR-50").replace("SR-0051", "SR-51").replace("SR-0052", "SR-52").replace("SR-0053", "SR-53").replace("SR-0054", "SR-54").replace("SR-0055", "SR-55").replace("SR-0056", "SR-56").replace("SR-0057", "SR-57").replace("SR-0058", "SR-58").replace("SR-0059", "SR-59").replace("SR-0060", "SR-60");
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let h3Elements = document.querySelectorAll('h3');
      h3Elements.forEach(function (h3Element) {
        h3Element.insertAdjacentHTML(
          'beforeend',
          '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
        );
      });
      //BUS添加预告视频观看按钮
      if (code.match(/^[01]\d{5}\-(?:1)?\d{2,3}$/i)) { this.addVideoC(code, yulan); }  // カリビアンコム|Caribbeancom 加勒比 http://smovie.caribbeancom.com/sample/movies/code/480p.mp4
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); } // 東京熱|Tokyo-Hot|レッドホットコレクション n1234
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoY(code, yulan); }  // 一本道|1pondo  http://smovie.1pondo.tv/sample/movies/code/480p.mp4
      else if (code.match(/^[01]\d{5}_0[12]$/)) { this.addVideoH(code, yulan); } // 天然むすめ|10musume
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoPM(code, yulan); } // 111619_207 パコパコママ|pacopacomama
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
      //JavBus添加跳转到链接
      info.append("<p><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><BR><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a><br><a class='red' href='https://www.javbus.com/search/" + videoSeries + "&type=&parent=ce' target='_blank'>查看本番 " + videoSeries + " 所有作品</a><BR><a class='red' href='https://db.msin.jp/jp.search/movie?str=" + videoSeries + "-' target='_blank'>查看 " + videoSeries + " 系列MSIN收录作品</a></p>");
      //emby插入开始 javbus
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $(".star-show").before(
              '<div style="border:3px solid HotPink;padding:10px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=5>&nbsp;&nbsp;跳转到emby👉</font></b></a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      changyulan.before("<h4>长缩略图 " + code + " &nbsp;&nbsp;在<a href='https://img.javstore.net/search/images/?q=%22" + code + "%22' target='_blank'>javstore</a>搜索长缩略图</h4><div style='text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;'><a href='https://image.memojav.com/image/screenshot/" + code + ".jpg' target='_blank'><img src='https://image.memojav.com/image/screenshot/" + code + ".jpg'></a></div>");
      //
    }
  }
  // JavLibrary u65w.com c70j
  class JavLibrary extends Base {
    constructor(Request) {
      super(Request);
      GM_addStyle(`
                .header a.red {color:red;padding-right:8px;}
                #video_info td { vertical-align: text-bottom; }
                #video_jacket { position: relative; }
                #video_jacket a {
                    position: absolute;
					background: #fff;
                    background:rgba(255,255,255,0.7);
                    font-size: 12px;
                    right: 20px;
                    top: 5px;
                    border:0px solid;
                    border-radius: 4px;
                    padding: 2px 3px;
                    border-radius: 5px;
                }
            `);
      if ($('#video_info').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let info = $('#video_info');
      let yulan = $('#video_jacket_info');
      let changyulan = $('.grey');
      //标题
      let title = $('.post-title').text();
      //识别码
      let codeRow = info.find('.item').eq(0);
      let code = codeRow.find('.text').html();
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let h3Elements = document.querySelectorAll('h3');
      h3Elements.forEach(function (h3Element) {
        h3Element.insertAdjacentHTML(
          'beforeend',
          '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
        );
      });
      //JavLibrary添加跳转到链接
      info.append("<div class='item'><table><tbody><tr><td class='header'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><BR><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a></td></tr></tbody></table></div>");
      //emby插入开始 javlib
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $("#video_info").after(
              '<div style="border:3px solid HotPink;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=6>跳转到emby👉</font></b></a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      //演员
      info.find('a').attr('target', '_blank');
      //lib添加预告视频观看按钮
      if (code.match(/^[01]\d{5}\-(?:1)?\d{2,3}$/i)) { this.addVideoC(code, yulan); }  // カリビアンコム|Caribbeancom 加勒比 http://smovie.caribbeancom.com/sample/movies/code/480p.mp4
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); } // 東京熱|Tokyo-Hot|レッドホットコレクション n1234
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoY(code, yulan); }  // 一本道|1pondo  http://smovie.1pondo.tv/sample/movies/code/480p.mp4
      else if (code.match(/^[01]\d{5}_0[12]$/)) { this.addVideoH(code, yulan); } // 天然むすめ|10musume
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoPM(code, yulan); } // 111619_207 パコパコママ|pacopacomama
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
      //封面图添加下载按钮
      changyulan.before("<h4>长缩略图 " + code + " &nbsp;&nbsp;在<a href='https://img.javstore.net/search/images/?q=%22" + code + "%22' target='_blank'>javstore</a>搜索长缩略图</h4><div style='text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;'><a href='https://image.memojav.com/image/screenshot/" + code + ".jpg' target='_blank'><img src='https://image.memojav.com/image/screenshot/" + code + ".jpg'></a></div>");
    }
  }
  //新增db支持
  class Javdb extends Base {
    constructor(Request) {
      super(Request);
      GM_addStyle(`
                .header a.red {color:red;padding-left:2px;padding-right:2px;line-height:22px;}
				.video-meta-panel { height: auto; overflow:hidden; padding-bottom:5%; }
				.video-meta-panel img{}
                .column.column-video-cover { position: relative; }
                .column.column-video-cover a {
                    position: absolute;
					background: #fff;
                    background:rgba(255,255,255,0.7);
                    font-size: 12px;
                    right: 20px;
                    top: 5px;
                    border:0px solid;
                    border-radius: 4px;
                    padding: 2px 3px;
                    border-radius: 5px;
                }
            `);
      if ($('.video-meta-panel').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let info = $('.panel.movie-panel-info');
      let yulan = $('.video-meta-panel');
      //let yulan = $('[data-controller="movie-tab"]');
      let changyulan = $('#modal-comment-warning');
      //标题
      let title = $('.title.is-4').text().trim();
      //识别码
      let code = $('body > section > div > div.video-detail > h2 > strong').text().trim().replace("10musu\_", "").replace("ALOVE", "LOVE").replace("AAQUA", "AQUA").replace("AMCMA", "MCMA").replace("STSSIS", "SSIS").replace("TPSSIS", "SSIS").replace("FTKTKBI", "KBI").replace("SNA-00", "SNA-0").replace("SMJ-00", "SMJ-0").replace("SHE-", "RHE-").replace("PTPFES", "PFES").replace("RNK", "59HNK").replace("HITOUB-", "HITOUD-").split(' ')[0]; // 番号替换是因为db写错番号
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let searchi = $('#search-bar-container');
      let videourl = document.querySelector("#preview-video source")?.src;
      // 提取页面下面的播放地址
      if (videourl && videourl != location.href) {
        searchi.after("<BR><font size='3'>" + code + " " + videourl + " <a href=" + videourl + " target='_blank'>播放</a></font>(此数据来自db)");
      }
      let h3Elements = document.querySelectorAll('.current-title');
      h3Elements.forEach(function (h3Element) {
        h3Element.insertAdjacentHTML(
          'beforeend',
          '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
        );
      });
      //Javdb添加跳转到链接
      info.append("<div class='item'><table><tbody><tr><td class='header'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><BR><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a><BR><a class='red' href='https://db.msin.jp/jp.search/movie?str=" + videoSeries + "-' target='_blank'>查看 " + videoSeries + " 系列MSIN收录作品</a></td></tr></tbody></table></div>");
      //emby插入开始 Javdb
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $(".panel.movie-panel-info").after(
              '<div style="border:3px solid HotPink;padding:20px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=6>&nbsp;&nbsp;跳转到emby👉</font></b></a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      //db站添加预告视频观看按钮
      if (code.match(/^[01]\d{5}\-(?:1)?\d{2,3}$/i)) { this.addVideoC(code, yulan); }  // カリビアンコム|Caribbeancom 加勒比 http://smovie.caribbeancom.com/sample/movies/code/480p.mp4
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); } // 東京熱|Tokyo-Hot|レッドホットコレクション n1234
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoY(code, yulan); }  // 一本道|1pondo  http://smovie.1pondo.tv/sample/movies/code/480p.mp4
      else if (code.match(/^[01]\d{5}_0[12]$/)) { this.addVideoH(code, yulan); } // 天然むすめ|10musume
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoPM(code, yulan); } // 111619_207 パコパコママ|pacopacomama
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/FC2-/)) { yulan.before("<iframe src = 'https://contents.fc2.com/embed/" + code.replace('FC2-', "") + "' style='width:99%;height:610px;text-align: center;padding: 2px;border-radius: 4px;border: 1px solid #ccc;'></iframe>"); }
      else { this.addVideo(code, yulan); }
      //javdb封面图添加下载按钮
      changyulan.before("<div class='columns'><div class='column'><article class='message video-panel'><div class='message-header'><p>长缩略图 " + code + " &nbsp;&nbsp;在<a href='https://img.javstore.net/search/images/?q=%22" + code + "%22' target='_blank'>javstore</a>搜索长缩略图</p></div><div class='message-body'><div style='text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;'><a href='https://image.memojav.com/image/screenshot/" + code + ".jpg' target='_blank'><img src='https://image.memojav.com/image/screenshot/" + code + ".jpg'></a></div></div></article></div></div>");
    }
  }
  //db段结束
  //新增 javbooks 支持
  class javbooks extends Base {
    constructor(Request) {
      super(Request);
      GM_addStyle(`
                .header a.red {color:red;padding-right:8px;}
            `);
      if ($('#info').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let info = $('#info');
      let yulan = $('#info');
      $('#Preview_vedio_area > a > img').remove();
      $('body > p > a > img').remove();
      //标题
      let title = $('#title').text().trim();
      //识别码
      let code = $('#info > div:nth-child(2) > font').text().trim().replace("10musu\_", "").split(' ')[0];
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let h3Elements = document.querySelectorAll('#title');
      h3Elements.forEach(function (h3Element) {
        h3Element.insertAdjacentHTML(
          'beforeend',
          '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
        );
      });
      //javbooks添加跳转到链接
      info.append("<div class='infobox'><b>跳转：</b><table><tbody><tr><td class='header'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><BR><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a><BR><a class='red' href='https://db.msin.jp/jp.search/movie?str=" + videoSeries + "-' target='_blank'>查看 " + videoSeries + " 系列MSIN收录作品</a></td></tr></tbody></table></div>");
      //emby插入开始 javbooks
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $("#info").before(
              '<div style="border:3px solid HotPink;padding:20px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=6>&nbsp;&nbsp;跳转到emby👉</font></b>" + _emby_url + "</a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      //javbooks添加预告视频观看按钮
      if (code.match(/^[01]\d{5}\-(?:1)?\d{2,3}$/i)) { this.addVideoC(code, yulan); }  // カリビアンコム|Caribbeancom 加勒比 http://smovie.caribbeancom.com/sample/movies/code/480p.mp4
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); } // 東京熱|Tokyo-Hot|レッドホットコレクション n1234
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoY(code, yulan); }  // 一本道|1pondo  http://smovie.1pondo.tv/sample/movies/code/480p.mp4
      else if (code.match(/^[01]\d{5}_0[12]$/)) { this.addVideoH(code, yulan); } // 天然むすめ|10musume
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoPM(code, yulan); } // 111619_207 パコパコママ|pacopacomama
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != code.match(/^(MAGD-)/i)) { yulan.before("<center><iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + videoSeries.replace("magd", "077MAGD") + "-" + videoTwo + "&w=1120&h=600' style='width:1200px;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe></center>"); }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
      //封面图添加下载按钮
    }
  }
  //javbooks段结束
  //AVMOO 开始 https://tellme.pw/avmoo  avsox
  class avmoo extends Base {
    constructor(Request) {
      super(Request);
      GM_addStyle(`
                .info a.red {color:red;padding-right:8px;}
            `);
      if ($('.col-md-3.info').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let info = $('.col-md-3.info');
      let yulan = $('.row.movie');
      let changyulan = $('#movie-share');
      //标题
      let title = $('.container > h3').text();
      //识别码
      let codeRow = info.find('p').eq(0);
      let code = codeRow.find('span').eq(1).html();
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      //AVMOO添加预告视频观看按钮
      if (code.match(/^[01]\d{5}\-(?:1)?\d{2,3}$/i)) { this.addVideoC(code, yulan); }  // カリビアンコム|Caribbeancom 加勒比 http://smovie.caribbeancom.com/sample/movies/code/480p.mp4
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); } // 東京熱|Tokyo-Hot|レッドホットコレクション n1234
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoY(code, yulan); }  // 一本道|1pondo  http://smovie.1pondo.tv/sample/movies/code/480p.mp4
      else if (code.match(/^[01]\d{5}_0[12]$/)) { this.addVideoH(code, yulan); } // 天然むすめ|10musume
      else if (code.match(/^[01]\d{5}_\d{3}$/)) { this.addVideoPM(code, yulan); } // 111619_207 パコパコママ|pacopacomama
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != code.match(/FC2-/)) { document.querySelector("#movie-share").innerHTML = '<br><iframe src = https://contents.fc2.com/embed/' + code.replace('FC2-PPV-', "") + ' style="width:99%;height:1000px;text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;"></iframe><br>' }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
      //avmoo添加跳转到链接
      info.append("<p><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><BR><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a></p>");
      //封面图添加下载按钮
      changyulan.before("<h4>长缩略图 " + code + " &nbsp;&nbsp;在<a href='https://img.javstore.net/search/images/?q=%22" + code + "%22' target='_blank'>javstore</a>搜索长缩略图</h4><div style='text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;'><a href='https://image.memojav.com/image/screenshot/" + code + ".jpg' target='_blank'><img src='https://image.memojav.com/image/screenshot/" + code + ".jpg'></a></div>");
      //emby插入开始 AVMOO
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $(".col-md-3.info").after(
              '<div style="padding:10px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=5>&nbsp;&nbsp;跳转到emby👉</font></b></a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
    }
  }
  //AVMOO 结束
  //sehuatang 98色花堂开始  经blc指点，引入jquery文件 预览片插入调试完毕
  class sehuatang extends Base {
    constructor(Request) {
      super(Request);
      if ($('#pgt').length > 0) {
        this.detailPage();
      }
    }
    detailPage () {
      let _this = this;
      let yulan = $('#pgt');
      var reg = /([a-zA-Z]{2,15}[-\s]?\d{2,15}|FC2PPV-[^\d]{0,5}\d{6,7})/i;
      var str = document.title.split(" ")[0].split("   ")[0].split("【")[0].split("[")[0].split("-carib")[0].split("-10mu-")[0].split("-paco-")[0].split("-1pon-")[0].replace("SSSIS-", "SSIS-").replace("BBOBB-", "BOBB-").replace("SET-628", "FSET-628"); // 此行replace用来替换马虎的98发帖人错误番号
      var code = str.match(reg)[0];
      // 123abc-456 数字字母-数字
      //if (str.match(/\d{3}[a-zA-Z]{2,15}[-\s]?\d{2,15}/i)) {
      //    code = str.slice(3)
      //}
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let title = document.title;
      if (document.title.match(/(高清中文字幕|亚洲有码原创|亚洲无码原创|4K原版|素人有码系列|PPV)/i)) {
        GM_addStyle(`
                #tiaozhuan a.red {margin-right:15px; padding:3px 5px;background-color:rgb(255, 215, 0);font-size: large;}
				#tiaozhuan a {color:rgb(255, 0, 0) !important;color: inherit;}
            `);
        if (document.querySelector("#switchwidth").innerHTML == '切换到宽版') { widthauto(this); }
        let h3Elements = document.querySelectorAll('#thread_subject');
        h3Elements.forEach(function (h3Element) {
          h3Element.insertAdjacentHTML(
            'beforeend',
            '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
          );
        });
        yulan.before("<div id='tiaozhuan'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>javlib<sup>预</sup></a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>javbus<sup>预</sup></a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>javdb<sup>预</sup></a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>javbooks<sup>预</sup></a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>javspyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98色花堂</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a></div>");
      }
      //emby插入开始 98
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $("#pgt").after(
              '<div style="border:3px solid HotPink;padding:20px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=6>&nbsp;&nbsp;跳转到emby👉</font></b>" + _emby_url + "</a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      //98添加预告视频观看按钮 色花堂无码区命名不规范，无码部分只适配部分厂商，素人有码区命名不规范（不做精确匹配）
      if (null != title.match(/-carib/ig)) { this.addVideoC(code, yulan); }
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); }
      else if (null != title.match(/一本道|-1pon-/ig)) { this.addVideoY(code, yulan); }
      else if (null != title.match(/天然むすめ|-10mu-/ig)) { this.addVideoH(code, yulan); }
      else if (null != title.match(/パコパコママ|-paco-/ig)) { this.addVideoPM(code, yulan); }
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:97%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != code.match(/FC2PPV-/i)) { yulan.before("<br><iframe src = 'https://contents.fc2.com/embed/" + code.replace('FC2PPV-', "") + "' style='width:97%;height:1000px;text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;'></iframe><br>"); }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
    }

  }
  //sehuatang 结束
  //MSIN 开始 */
  if (null != location.hostname.match(/msin/)) {
    (() => {
      GM_addStyle(`
                #tiaozhuan a.red {margin-right:15px; padding:3px 5px;background-color:rgb(255, 215, 0);font-size: large;}
				#tiaozhuan a {color:rgb(255, 0, 0) !important;color: inherit;}
             `)
    })();
  }
  class msin extends Base {
    constructor(Request) {
      super(Request);
      this.detailPage();
    }
    detailPage () {
      let _this = this;
      let info = $('#top_content');
      let yulan = $('#breadcrumb');
      // FC2判别部分
      if (null != location.href.match(/db.msin.jp\/jp.page\/movie/)) {
        var code = $('div.mv_pn').text().trim().split(' ')[0];
      } else {
        var code = $('div.mv_fileName').text().trim().split(' ')[0].replace("fc2-ppv-", "fc2-");
      }
      let cidcode = $('div.mv_fileName').text().trim().split(' ')[0];
      let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
      let videoSeries = codeArr[0].toLowerCase();
      let videoNo = format_zero(codeArr[1], 5);
      let title = document.title;
      let h3Elements = document.querySelectorAll('.mv_title');
      h3Elements.forEach(function (h3Element) {
        h3Element.insertAdjacentHTML(
          'beforeend',
          '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
        );
      });
      info.append("<div id='tiaozhuan'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + cidcode + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='dmm片花' href='https://www.dmm.com/litevideo/-/part/=/cid=" + cidcode + "/size=720_480/affi_id=ProgramDMM-001/' target='_blank'>dmm播放页<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a><BR>查看本番<a class='red' href='https://db.msin.jp/jp.search/movie?str=" + videoSeries + "-' target='_blank'>" + videoSeries + "</a>所有作品</div>");
      //emby插入开始 msin
      GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $("#top_content").after(
              '<div style="border:3px solid HotPink;padding:20px;"><a href="' + _emby_url + '" target="_blank" >' +
              "<b><font size=6>&nbsp;&nbsp;跳转到emby👉</font></b>" + _emby_url + "</a>" +
              "</div>"
            );
          }
        },
      });
      //emby插入结束
      // https://www.dmm.com/litevideo/-/part/=/cid=adn00332/size=720_480/affi_id=ProgramDMM-001/
      // https://db.msin.jp/jp.search/movie?str=HTM
      //msin添加预告视频观看按钮
      if (null != title.match(/-carib/)) { this.addVideoC(code, yulan); }
      else if (code.match(/^[a-zA-Z]{1,16}\d{4}$|video_\d{3}$|^[a-zA-Z]{1,16}\d{3}$|^[a-zA-Z]{1,16}\d{5}$|gedo43|gedo58|tcp1001un|^(RED-|S2MBD-|NKD-|RHJ-|bgc_|elm_|HO-|vset_)\d{3}$|PARTY-SEIRA|^(sol_|KG-)\d{2}$|^\d{5}$|atamikb1|AVJI-|False_Advertising_|felicia_vina_|Gia_|Japanese_|Little_Asian_Cocksuckers_|marie_berger_|Teenthailand_|Spankingthemonkey|stacy_Cruz_|Taboo_|Teenthailand9_|Teeny_|Teen_|Tokyo_|tthm2497|Zuzu_$/i)) { this.addVideoN(code, yulan); }
      else if (null != title.match(/一本道|-1pon-/)) { this.addVideoY(code, yulan); }
      else if (null != title.match(/天然むすめ|-10mu-/)) { this.addVideoH(code, yulan); }
      else if (null != title.match(/パコパコママ|-paco-/)) { this.addVideoPM(code, yulan); }
      else if (null != code.match(/legsjapan/i)) { this.addVideolegsjapan(code, yulan); }
      else if (null != code.match(/^(MDTM-|TKZUKO-|TKXRW-|TKWANZ-|TKVRTM-|TKURAD-|TKUMSO-|TKTYOD-|TKTMVI-|TKTMHP-|TKTMEM-|TKTMDI-|TKTEAM-|TKTAMM-|TKSORA-|TKSOE-|TKPGD-|TKPID-|TKPLA-|TKREAL-|TKRKI-|TKSERO-|TKSIB-|TKMDB-|TKMDHC-|TKMDJM-|TKMDLJ-|TKMDNH-|TKMDOG-|TKMDPW-|TKMDS-|TKMDSH-|TKMDSR-|TKMDTM-|TKMEYD-|TKMIDD-|TKMIDE-|TKMIGD-|TKMILD-|TKMIMK-|TKMKMP-|TKMRXD-|TKMUKD-|TKMUM-|TKMUML-|TKMUNJ-|TKMVSD-|TKNDRA-|TKODFA-|TKODFM-|TKODFR-|TKDVAJ-|TKDXMG-|TKEBOD-|TKEYAN-|TKGDTM-|TKGENT-|TKGROO-|TKHERY-|TKHND-|TKHNDB-|TKHNDS-|TKHRRB-|TKIDBD-|TKILLE-|TKINCT-|TKIPSD-|TKIPZ-|TKJUC-|TKJUFD-|TKJUX-|TKKAWD-|TKKIRD-|TKKRND-|TKLZTD-|TKBI-|TKBF-|TKAMEB-|TKAPKH-|TKARBB-|TKARM-|TKAWT-|TKBBI-|TKBDMDS-|TKBDMILD-|TKBDPKMP-|TKBLK-|TKBOKD-|TKCEAD-|TKCESD-|TKCHIJ-|TKCND-|TKCRMN-|TKDASD-|TKDBNG-|TKDIGI-|TKIPX-|HYAS-)/i)) { this.addVideoMDTM(code, yulan); }
      else if (null != code.match(/^(XVSR-|TASKW-|TASKS-|PNJM-|PMS-|MOPC-|MOPB-|MOPA-|LAIM-|KTF-|KBTV-|KAGH-|JUKU-|JS-)/i)) { this.addVideoXVSR(code, yulan); }
      else if (null != code.match(/^(BAMA-|BDSAMA-)/i)) { this.addVideo(code, yulan); }
      else if (null != code.match(/^(MDS-|SMT-|SMSD-|SBK-|PHO-|PFCK-|MMNT-|MDB-|MCSF-|JJAA-|EGE-)/i)) { this.addVideoMDS(code, yulan); }
      else if (null != code.match(/^ENFD-/i)) { this.addVideoENFD(code, yulan); }
      else if (null != code.match(/^(COCH-|TMSG-|TMSA-|TMS-|SKBK-|RNB-|RMOW-|MSF-|DYNC-)/i)) { this.addVideoOCH(code, yulan); }
      else if (null != code.match(/^(KING-)/i)) { this.addVideoKING(code, yulan); }
      else if (null != code.match(/^(ZEX-|TRK-|LES-|JNOB-|JMRD-|JD-|IMPJO-|IMPJOB-|IMPNO-|IMPNOB-|IMPTO-|IMPTOB-|IMPVE-|IMPVEB-|GSAD-|EART-)/i)) { this.addVideoZEX(code, yulan); }
      else if (null != code.match(/^(DVAJ-|KNMD-|JED-|ISCR-|GNAX-|DXMG-)/i)) { this.addVideoDVAJ(code, yulan); }
      else if (null != code.match(/(SERO-)/i)) { this.addVideoSERO(code, yulan); }
      else if (null != code.match(/^(MCMA-|MCST-|NANP-|MXP-|MWKD-|MERD-|MADA-|HITOUD-|HITOUB-)/i)) { this.addVideoMCMA(code, yulan); }
      else if (null != code.match(/^(CMA-)/i)) { this.addVideoCMA(code, yulan); }
      else if (null != code.match(/^(MEKO-|MSJR-|KOP-|KONN-|JKRD-|EROC-)/i)) { this.addVideoMEKO(code, yulan); }
      else if (null != code.match(/^(XRW-|OPEN-|ONGP-|EC-|NJPDS-|JKB-|HSP-|EMU-)/i)) { this.addVideoXRW(code, yulan); }
      else if (null != code.match(/^(THNIB-|PPMNB-|HAHOB-|GYU-|GLT-)/i)) { this.addVideoTHNIB(code, yulan); }
      else if (null != code.match(/^(GVH-|PEP-|GST-|GQE-)/i)) { this.addVideoGVH(code, yulan); }
      else if (null != code.match(/^(ARSO-|H-|IDOL-)/i)) { this.addVideoARSO(code, yulan); }
      else if (null != code.match(/^(DOKS-|TSM-|KSBT-|JKS-|GCRD-|GCAL-|GASW-)/i)) { this.addVideoDOKS(code, yulan); }
      else if (null != code.match(/^(YMDD-|TMD-|MDSS-|LOMD-)/i)) { this.addVideoYMDD(code, yulan); }
      else if (null != code.match(/^(SW-|VOIC-|TRST-|SBVD-|NMIN-|NJS-|MTD-|MDSM-|KVS-|KNGR-|KANO-|KGAI-|JFIC-|DXNH-|DXMJ-|DXHK-|DXDB-|DXCK-|DXBK-|DXBG-|DXBB-)/i)) { this.addVideoSW(code, yulan); }
      else if (null != code.match(/^(SMA-|SMS-)/i)) { this.addVideoSMA(code, yulan); }
      else if (null != code.match(/^(AVOP-|MGEN-|CRDD-|FAS-)/i)) { this.addVideoAVOP(code, yulan); }
      else if (null != code.match(/^(BAZX-)/i)) { this.addVideoBAZX(code, yulan); }
      else if (null != code.match(/^(VSPDS-)/i)) { this.addVideoVSPDS(code, yulan); }
      else if (null != code.match(/^(NATR-|TGA-|TEN-|RIN-|RAF-|QHX-|QHS-|QHG-|PPD-|HM-)/i)) { this.addVideoNATR(code, yulan); }
      else if (null != code.match(/^(EKDV-|MGDV-|MGCL-)/i)) { this.addVideoEKDV(code, yulan); }
      else if (null != code.match(/^(STCV-)/i)) { this.addVideoSTCV(code, yulan); }
      else if (null != code.match(/^(NASH-|MBRAP-)/i)) { this.addVideoNASH(code, yulan); }
      else if (null != code.match(/^(KTRA-)/i)) { this.addVideoKTRA(code, yulan); }
      else if (null != code.match(/^(MOND-)/i)) { this.addVideoMOND(code, yulan); }
      else if (null != code.match(/^(ADK-|GIHHD-|FUDOU-|FTDS-|FSG-|FS-|FNK-|SUKE-)/i)) { this.addVideoADK(code, yulan); }
      else if (null != code.match(/^(AVGP-)/i)) { this.addVideoAVGP(code, yulan); }
      else if (null != code.match(/^(ISD-|SKD-|PSD-|NHD-|LGD-|GKD-)/i)) { this.addVideoISD(code, yulan); }
      else if (null != code.match(/^(NPV-)/i)) {
        if (null != code.match(/^NPV-(00\d{1}|010|011)$/i)) {
          this.addVideo(code, yulan);
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(STCESD-|STANZD-|STEMAZ-|STAPOD-|CRFV-|PKGF-|DDTJ-|FUKS-|EVIF-|DRSR-|RBFB-|OPHK-|MOPE-|MAXAF-|KTFB-|GMSP-|FTKR-|JJDX-|FRGD-|FAX-|UD-|SRXV-|TCHR-|STTCD-|SSRD-|RZM-|RVY-|RSCPX-|RRZ-|ROC-|RNU-|RHE-|NAGAE-|FKNBES-)/i)) { this.addVideoMSIN(code, yulan); }
      else if (null != code.match(/^(YMYM-)/i)) {
        if (null != code.match(/^YMYM-00[1-6]$/i)) {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        } else {
          yulan.before("<iframe src = 'https://www.mgstage.com/api/affiliate_sample_movie.php?p=" + code.replace("YMYM-", "777YMYM-") + "&w=1120&h=600' style='width:99%;height:610px;text-align: center;padding: 3px;border-radius: 4px;border: 1px solid #ccc;'></iframe>");
        }
      }
      else if (null != code.match(/^(LVMAAN-|MAAN-|LUXU-|ARA-|MIUM-|SIRO-|GANA-|ADZ-|AECB-|AEPP-|MAGD-|AGIS-|AGIS-|DCV-|(?<!\w|-|\/)\d{3}[a-zA-Z]{2,5}[-\s]?\d{3,4}|PPP[-\s]?\d{4}|DCV-|NMCH-|DDH-|AHSHIRO-|AID-|ALMD-|AMA-|AMCF-|AOI-|MLA-|DDHP-|HMT-|THTP-|POK-|FCP-|SIMM-|KNB-|ICHK-|SACZ-|VOLA-|LOG-|OTIM-|NOL-|SGK-|NTK-|MGC-|KPB-|PPZ-|JAC-|HGP-|GHZ-|MY-|SVSHA-|REIW-|FCT-|JNT-|ARA-|IENFH-|SRTD-|MAG-|SCOH-|DTT-|COSX-|OKK-|OKB-|OKP-|OKS-|ENE-|NSM-|SKJK-|OCN-|DCX-|SMR-|REIWSP-|ARMS-|ATGO-|PAK-|NHMSG-|FZR-|SHMJ-|CRT-|REIWDX-|UTSU-|ERKR-|OKV-|MGSREV-|KITAIKE-|LOST-|MXDLP-|DRECUT-|KSS-|DG-|EVA-|MGR-|SNB-|GERK-|NAMA-|SRYA-|MFC-|GCB-|SEI-|MFCC-|MFCS-|BRM-|BUCH-|WNES-|WKS-|WIF-|NAEN-|VSPA-|VRXM-|VDF-|VBH-|UWKI-|TZZ-|TYK-|TWBB-|TTRE-|TSB-|TRUWA-|TRUMG-|TRUEX-|TOUL-|SVCAO-|NNG-|TKT-|TKPR-|TIT-|TIA-|TGBE-|SVRE-|SVF-|STKM-|LVSUKE-|GAREA-|PRPR-|SRTTC-|SRSR-|SRNJ-|SQVR-|SQF-|SPIVR-|SEX-|SEV-|SES-|SENL-|SENJ-|SELJV-|NISE-|LSSE-|JSE-|HSE-|SOUD-|SOJ-|SOH-|SQES-|ZEN-|WTM-|TKW-|AOS-|SNA-|SMJ-|SLVR-|SKOT-|GOJI-|SIKO-|SHPDV-|SHO-|SHL-|MFCW-|SBTT-|SBN-|IND-|KRNK-|RRO-|ROY-|ROSJ-|PPX-|BESMEN-|ZRC-|RKD-|REVL-|KBL-|GOOL-|ONS-|RBNR-|QTD-|PWN-|SYS-|PTP-|PRGO-|PREM-|PPW-|PKOS-|PIN-|OTOM-|OSBR-|OREP-|ONAL-|ONAJ-|GESY-|SIMD-|OMNB-|OKX-|OKSD-|OKO-|OIL-|OBAL-|NURE-|NUML-|NUKU-|NTRL-|NNS-|NNN-|NNM-|NLBD-|NJBE-|MESH-|JIRU-|MSH-|MQXT-|MQSM-|MPC-|MONL-|MONA-|MOEP-|MOBBV-|OKC-|MISR-|MEEL-|MDM-|MCD-|MAZJ-|MATE-|MANA-|LMPI-|LLJW-|GPH-|LHJF-|LHD-|LFLJ-|LESL-|LESJ-|LEG-|LDJJ-|LCSD-|LAMA-|LAJ-|LAHA-|MBST-|KYO-|KUSL-|KTIF-|KNSD-|SHF-|DLV-|ANG-|KKA-|KGDV-|KDVR-|KDD-|JYK-|ILK-|IGAD-|IFRI-|IEQP-|IEAN-|HOJ-|HNBP-|HMPG-|HMJM-|HMHM-|HLM-|HKE-|HITL-|HITJ-|ZRR-|GOIN-|DOCD-|HIK-|HFDD-|HEW-|HDG-|HBSD-|HARJ-|HAJ-|HAG-|GYH-|GTRL-|GOMK-|GODS-|GLI-|GLD-|GMMD-|FIT-|JFM-|GEXP-|GDO-|GDMH-|GDJU-|MMNM-|FTIK-|FOJ-|FEX-|FETL-|FETJ-|FCMQ- |FAJ-|EZN-|EUD-|ETR-|ETQT-|ERTS-|ELV-|HMRK-|USSH-|DYG-|RCH-|MTMD-)/i)) { this.addVideoMGS(code, yulan); }
      else if (null != code.match(/fc2-/)) { document.querySelector("#breadcrumb").innerHTML = '<br><iframe src = https://contents.fc2.com/embed/' + code.replace('fc2-', "") + ' style="width:99%;height:1000px;text-align: center;padding-top: 5px;padding-right: 150px;padding-bottom: 5px;padding-left: 150px;border-radius: 4px;border: 1px solid #ccc;margin: 5px;"></iframe>' }
      else if (null != title.match(/\【VR/i)) { this.addVideoVR(code, yulan); }
      else if (null != code.match(/VR-/i)) { this.addVideoVR(code, yulan); }
      else { this.addVideo(code, yulan); }
    }
  }
  //MSIN 结束
  /* javdb */
  if (null != location.hostname.match(/javdb/i)) {
    //const showBoxes = $('.box');
    const showBoxesA = document.querySelectorAll('.item a[href*="/v/"]');
    const showBoxesB = document.querySelectorAll('.box.actor-box a[href*="/actors/"]');
    if (showBoxesA.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxesA[0].href; }
    if (showBoxesB.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxesB[0].href; }
  }
  /* end*/
  // javbus/avmoo https://www.javsee.lol/search/322&type=&parent=ce
  if (null != location.href.match(/\/search\//)) {
    const showBoxes = $('.movie-box');
    if (showBoxes.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxes[0].href; }
  }
  // end
  // xslist https://xslist.org/search?query=ADN-327&lg=tw
  if (null != location.href.match(/xslist.org\/search/)) {
    var searchResults = document.querySelectorAll('.clearfix');
    if (searchResults.length === 1) {
      var linkA = searchResults[0].querySelector('a');
      if (linkA) { linkA.click(); }
    }
  }
  //end
  /* since 有码详情页添加跳转开始 */
  if (null != location.pathname.match(/works\/detail/i)) {
    GM_addStyle(`
                #tiaozhuan a.red {margin-right:15px; padding:3px 5px;background-color:rgb(255, 215, 0);font-size: large;}
								#tiaozhuan a {color:rgb(255, 0, 0) !important;color: inherit;}
                sub, sup {  font-size: 75%;  line-height: 0;  position: relative;  vertical-align: baseline;}
                sup {  top: -0.5em;}
                sub {  bottom: -0.25em;}
             `)
    let info = $('body > main > section:nth-child(3) > div > p');
    let code = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
    if (code.match((/^[a-z|A-Z]{2,8}\d{2,5}$/i))) {
      var number = code.search(/\d/);
      if (number > 0) {
        code = code.slice(0, number) + "-" + code.slice(number)
      }
    }
    let liebiao = $('.p-workPage__table');
    let codeArr = code.split(/-/).map(item => item.toLowerCase()); // 特殊番号 SVBD-AA002 须要将AA也转换为小写 mp4地址方有效
    let videoSeries = codeArr[0].toLowerCase();
    let videoNo = format_zero(codeArr[1], 5);
    let title = document.title;
    let h3Elements = document.querySelectorAll('.p-workPage__title');
    h3Elements.forEach(function (h3Element) {
      h3Element.insertAdjacentHTML(
        'beforeend',
        '<b>&nbsp;&nbsp;<font color=blue>全片:</font></b><a href=https://missav.com/search/' + code + ' target=_blank>missav</a>&nbsp;&nbsp;<a href=https://thisav.com/cn/' + code + ' target=_blank>thisav</a>'
      );
    });
    info.append("<div id='tiaozhuan'><a class='red' href='https://javtrailers.com/ja/search/" + code + "' target='_blank'>trai</a><a class='red' href='http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" + code + "' target='_blank'>lib</a><a class='red' href='https://www.javbus.com/" + code + "' target='_blank'>bus</a><a class='red' href='https://javdb.com/search?q=" + code.replace("-", "_") + "' target='_blank'>db</a><a class='red' href='https://jbk009.cc/serch_censored.htm?skey=" + code + "' target='_blank'>books</a><a class='red' href='https://javspyl.eu.org/" + code + "' target='_blank'>spyl</a><a class='red' href='https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true' target='_blank'>98</a><a class='red' title='btsow磁力链搜索' href='https://btsow.motorcycles/search/" + code + "' target='_blank'>btsow</a><a class='red' title='在线观看' href='https://maa1829.com/zh/fc_search/all/" + code + "/1.html' target='_blank'>18av</a><a class='red' title='查看演员资料' href='https://xslist.org/search?query=" + code + "&lg=tw' target='_blank'>xslist</a><a class='red' title='查看品番名' href='https://db.msin.jp/jp.search/movie?str=" + code + "' target='_blank'>msin</a><a class='red' title='dmm片花' href='https://www.dmm.com/digital/videoa/-/detail/=/cid=" + videoSeries + videoNo + "/' target='_blank'>dmm<sup>JP代</sup></a><a class='red' title='mgstage片花' href='https://www.mgstage.com/search/cSearch.php?search_word=" + code + "' target='_blank'>mgstage<sup>SG代</sup></a><BR>查看本番<a class='red' href='https://db.msin.jp/jp.search/movie?str=" + videoSeries + "-' target='_blank'>" + videoSeries + "</a>所有作品</div>");
    // 此处加入识别码 以适配 根据番号搜索(自行去掉头部排除域名) 直接查询emby库中是否存在此番
    liebiao.append("<div class='item'><div class='th'>识别码</div><div class='td'><div class='item -minW'><p>" + code + "</p></div></div></div>");
    //emby插入开始 since
    GM_xmlhttpRequest({
      method: "GET",
      url:
        embyBaseUrl + "emby/Users/" + embyAPI + "/Items?api_key=" + embyAPI +
        "&Recursive=true&IncludeItemTypes=Movie&SearchTerm=" + code,
      headers: {
        accept: "application/json",
      },
      onload: (res) => {
        let rr = JSON.parse(res.responseText);
        console.log(rr);
        for (let idx = 0; idx < rr.Items.length; idx++) {
          let _emby_url =
            embyBaseUrl +
            "web/index.html#!/item?id=" +
            rr.Items[idx].Id +
            "&serverId=" +
            rr.Items[idx].ServerId;
          console.log(_emby_url);
          $(".p-workPage__text").after(
            '<div style="border:3px solid HotPink;padding:20px;"><a href="' + _emby_url + '" target="_blank" >' +
            "<b><font size=6>&nbsp;&nbsp;跳转到emby👉</font></b>" + _emby_url + "</a>" +
            "</div>"
          );
        }
      },
    });
    //emby插入结束
  }
  /* since 有码详情页添加跳转结束*/
  class Main {
    constructor() {
      if ($("footer:contains('JavBus')").length) { this.site = 'javBus'; }
      else if ($("#bottomcopyright:contains('JAVLibrary')").length) { this.site = 'javLibrary' }
      else if ($("#footer:contains('javdb')").length) { this.site = 'javdb' }
      else if ($("#Declare_box:contains('javbooks')").length) { this.site = 'javbooks' }
      else if ($("footer:contains('AVMOO')").length) { this.site = 'avmoo' }
      else if ($("#flk:contains('色花堂')").length) { this.site = 'sehuatang' }
      else if ($("#footer:contains('db.msin.jp')").length) { this.site = 'msin' }
    }
    make () {
      let requestObj = new Request();
      let obj;
      switch (this.site) {
        case 'javBus':
          obj = new JavBus(requestObj);
          break;
        case 'javLibrary':
          obj = new JavLibrary(requestObj);
          break;
        case 'javdb':
          obj = new Javdb(requestObj);
          break;
        case 'javbooks':
          obj = new javbooks(requestObj);
          break;
        case 'avmoo':
          obj = new avmoo(requestObj);
          break;
        case 'sehuatang':
          obj = new sehuatang(requestObj);
          break;
        case 'msin':
          obj = new msin(requestObj);
          break;
      }
      return obj;
    }
  }
  let main = new Main();
  main.make();
})();