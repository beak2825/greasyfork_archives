// ==UserScript==
// @name         真白萌 板块图标切换图片
// @version      1.2
// @description  新增一个能将板块图标切换成作品封面的按钮
// @author       tony0815
// @match        *://masiro.moe/*
// @icon         https://masiro.moe/data/attachment/forum/202007/03/122648maylkk94f39lrvqk.jpg
// @namespace    https://greasyfork.org/users/239832
// @downloadURL https://update.greasyfork.org/scripts/392959/%E7%9C%9F%E7%99%BD%E8%90%8C%20%E6%9D%BF%E5%9D%97%E5%9B%BE%E6%A0%87%E5%88%87%E6%8D%A2%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/392959/%E7%9C%9F%E7%99%BD%E8%90%8C%20%E6%9D%BF%E5%9D%97%E5%9B%BE%E6%A0%87%E5%88%87%E6%8D%A2%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

function msr_bookcover_main(){
let image_pool = {
    // V1 data
    "56":"https://masiro.moe/data/attachment/forum/202007/03/071759fnjpyjmdjiqddd5y.jpg",
    "57":"https://masiro.moe/data/attachment/forum/202007/03/072536v7ylf11l2jcfup0u.jpg",
    "74":"https://masiro.moe/data/attachment/forum/202007/03/072654fkpbkp6k5scwrwxz.jpg",
    "87":"https://masiro.moe/data/attachment/forum/202007/03/072659arqf92fbfzmrbz6u.jpg",
    "98":"https://masiro.moe/data/attachment/forum/202007/03/072117ur1vzkk1ttzq9kr4.jpg",
    "105":"https://masiro.moe/data/attachment/forum/202007/03/072333ow7o9somk6yckw4o.jpg",
    "123":"https://masiro.moe/data/attachment/forum/202007/03/072546fkyhxk3caqyy6on8.jpg",
    "179":"https://masiro.moe/data/attachment/forum/202007/03/072657sumh22544zuuchz3.jpg",
    "188":"https://masiro.moe/data/attachment/forum/202007/03/072651t7dkdkh2dddkk7ki.jpg",
    "192":"https://masiro.moe/data/attachment/forum/202007/03/072803wrlqvhmyhz5he9hd.jpg",
    "199":"https://masiro.moe/data/attachment/forum/202007/03/071752u7k8kj7rw1ku5n7j.jpg",
    "207":"https://masiro.moe/data/attachment/forum/202007/03/072700ykyxkthkgtq33cge.jpg",
    "48":"https://masiro.moe/data/attachment/forum/202007/03/072802vtl51vhy1ymc1p75.jpg",
    "49":"https://masiro.moe/data/attachment/forum/202007/03/072114v03dqzfw0qh7zd44.jpg",
    "51":"https://masiro.moe/data/attachment/forum/202007/03/072120e68yxe886szwopxe.jpg",
    "53":"https://masiro.moe/data/attachment/forum/202007/03/072338wyehjymyhkgqrkrr.jpg",
    "54":"https://masiro.moe/data/attachment/forum/202007/03/072345luooazr5amsa5rzs.jpg",
    "55":"https://masiro.moe/data/attachment/forum/202007/03/072550p3qbdi3hbv0is3tb.jpg",
    "59":"https://masiro.moe/data/attachment/forum/202007/03/072804ijeezoeebgglojei.jpg",
    "60":"https://masiro.moe/data/attachment/forum/202007/03/072647k96cmsvlsl3lcs0z.jpg",
    "61":"https://masiro.moe/data/attachment/forum/202007/03/072805dlv5dv1aj2mv31em.jpg",
    "63":"https://masiro.moe/data/attachment/forum/202007/03/071756k0082m02f4nfof1c.jpg",
    "64":"https://masiro.moe/data/attachment/forum/202007/03/072652xhs3ror5hjrtnt0r.jpg",
    "66":"https://masiro.moe/data/attachment/forum/202007/03/072336e4yd3z4ifjbh44y2.jpg",
    "68":"https://masiro.moe/data/attachment/forum/202007/03/072806bjco40ppcxqxqopd.jpg",
    "71":"https://masiro.moe/data/attachment/forum/202007/03/072535wkyii7li22dg8e3i.jpg",
    "73":"https://masiro.moe/data/attachment/forum/202007/03/072538ajwtytujgr8pngry.jpg",
    "75":"https://masiro.moe/data/attachment/forum/202007/03/072541mcmidum0ttx00rz0.jpg",
    "65":"https://masiro.moe/data/attachment/forum/202007/03/072804ivxfxxejm8vgh7xl.jpg",
    "78":"https://masiro.moe/data/attachment/forum/202007/03/072703sakd4kdc82ttz3dk.jpg",
    "79":"https://masiro.moe/data/attachment/forum/202007/03/071750dzvsiiic1c1fz32m.jpg",
    "80":"https://masiro.moe/data/attachment/forum/202007/03/072342ed9zz44r4ubsr4uf.jpg",
    "88":"https://masiro.moe/data/attachment/forum/202007/03/072651cwm26oo606av9o2i.jpg",
    "89":"https://masiro.moe/data/attachment/forum/202007/03/072538edhw8pnc5u8jhhup.jpg",
    "96":"https://masiro.moe/data/attachment/forum/202007/03/072112e22pu22pkkd54kkb.jpg",
    "97":"https://masiro.moe/data/attachment/forum/202007/03/072540auwdmrp9vf12b3rp.jpg",
    "101":"https://masiro.moe/data/attachment/forum/202007/03/072340jjkzk0svlxosz1tx.jpg",
    "103":"https://masiro.moe/data/attachment/forum/202007/03/072347ohd63jvhb43jjvpy.jpg",
    "104":"https://masiro.moe/data/attachment/forum/202007/03/072646emp5xfshmo55poyy.jpg",
    "107":"https://masiro.moe/data/attachment/forum/202007/03/072544ozrw77y555eieseq.jpg",
    "110":"https://masiro.moe/data/attachment/forum/202007/03/072702lmolmh2mdw866k88.jpg",
    "112":"https://masiro.moe/data/attachment/forum/202007/03/072341ffb9189w4b55na0f.jpg",
    "117":"https://masiro.moe/data/attachment/forum/202007/03/122652f9jq1vqhtovazvvy.jpg",
    "120":"https://masiro.moe/data/attachment/forum/202007/03/072104nzbt2o1ktaf6r6na.jpg",
    "125":"https://masiro.moe/data/attachment/forum/202007/03/072346w87dkzkkxdzuxi88.jpg",
    "126":"https://masiro.moe/data/attachment/forum/202007/03/072112q9qqbmwfhucuwyy3.jpg",
    "128":"https://masiro.moe/data/attachment/forum/202007/03/072658lzxpvydyzy496xjy.jpg",
    "131":"https://masiro.moe/data/attachment/forum/202007/03/072810zqxj0r6pcr34z3ci.jpg",
    "134":"https://masiro.moe/data/attachment/forum/202007/03/072335ll54dv6uxuovlvzz.jpg",
    "136":"https://masiro.moe/data/attachment/forum/202007/03/072656qypzy9xjcjxfnnhc.jpg",
    "138":"https://masiro.moe/data/attachment/forum/202007/03/072757nafoxuxhvzwa2lk7.jpg",
    "140":"https://masiro.moe/data/attachment/forum/202007/03/072119qz9uzg3robdx6x3o.jpg",
    "142":"https://masiro.moe/data/attachment/forum/202007/03/072539f298nzhqvqjvhhze.jpg",
    "143":"https://masiro.moe/data/attachment/forum/202007/03/072549ma3oon9kdnoodo3o.jpg",
    "145":"https://masiro.moe/data/attachment/forum/202007/03/072800f065ko1ldc1jsj2f.jpg",
    "149":"https://masiro.moe/data/attachment/forum/202007/03/072111b5z1m2m16caj14jz.jpg",
    "150":"https://masiro.moe/data/attachment/forum/202007/03/072344g7z7rw0miwhxmhiy.jpg",
    "157":"https://masiro.moe/data/attachment/forum/202007/03/072551fcglxlxqgs24d2e3.jpg",
    "158":"https://masiro.moe/data/attachment/forum/202007/03/072649oqmo8mpoogk6ao9p.jpg",
    "161":"https://masiro.moe/data/attachment/forum/202007/03/072330r6chll18stnz8j13.jpg",
    "167":"https://masiro.moe/data/attachment/forum/202007/03/072808en4bc8b0cvvubabu.jpg",
    "168":"https://masiro.moe/data/attachment/forum/202007/03/072123gck3zjt5cigiz2gn.jpg",
    "170":"https://masiro.moe/data/attachment/forum/202007/03/072344a5yo9k6aiggj424y.jpg",
    "171":"https://masiro.moe/data/attachment/forum/202007/03/071754yq5f3papg5nfzrr2.jpg",
    "174":"https://masiro.moe/data/attachment/forum/202007/03/072543cn0bn1glnngvy8gs.jpg",
    "177":"https://masiro.moe/data/attachment/forum/202007/03/072655k4fzwjh994ippbpz.jpg",
    "76" :"https://masiro.moe/data/attachment/forum/202007/03/072116dihb6aqbie3hc2ec.jpg",
    "180":"https://masiro.moe/data/attachment/forum/202007/03/072339qh2hkknkhh2bznv8.jpg",
    "181":"https://masiro.moe/data/attachment/forum/202007/03/072121wwbhj3bgj47uj1ag.jpg",
    "183":"https://masiro.moe/data/attachment/forum/202007/03/072548ajekw4kml333yi3i.jpg",
    "189":"https://masiro.moe/data/attachment/forum/202007/03/072338muugqwzpg56vb56q.jpg",
    "190":"https://masiro.moe/data/attachment/forum/202007/03/072114de7i6iee8keke7zz.jpg",
    "191":"https://masiro.moe/data/attachment/forum/202007/03/071805j44i03dx1dxezy4w.jpg",
    "193":"https://masiro.moe/data/attachment/forum/202007/03/072123vu6za6rkwuf66fxm.jpg",
    "194":"https://masiro.moe/data/attachment/forum/202007/03/072755x5esn5nz6hesqwnv.jpg",
    "200":"https://masiro.moe/data/attachment/forum/202007/03/072334zmhhjhamcmvz9nmv.jpg",
    "201":"https://masiro.moe/data/attachment/forum/202007/03/071758vv1mfm62xaszg0zt.jpg",
    "202":"https://masiro.moe/data/attachment/forum/202007/03/072809e6tewdawgzwgzdnd.jpg",
    "203":"https://masiro.moe/data/attachment/forum/202007/03/071755hh4vvvavdtc66kol.jpg",
    "208":"https://masiro.moe/data/attachment/forum/202007/03/072124c4ljjj5ljrllka5j.jpg",
    "209":"https://masiro.moe/data/attachment/forum/202007/03/072115xshmwhuafl2xtnhs.jpg",
    "211":"https://masiro.moe/data/attachment/forum/202007/03/072110jgv2vuqpgzgynp6n.jpg",
    "218":"https://masiro.moe/data/attachment/forum/202007/03/071806wf1hvc13w3111xs1.jpg",
    "219":"https://masiro.moe/data/attachment/forum/202007/03/072331ka1p8jc6rb7ze77f.jpg",
    "224":"https://masiro.moe/data/attachment/forum/202007/03/071757e748b75rei3jt13t.jpg",
    "225":"https://masiro.moe/data/attachment/forum/202007/03/072108ublvvhyxzava9b5a.jpg",
    "226":"https://masiro.moe/data/attachment/forum/202007/03/071801bs2kg0pgy1s11y2p.jpg",
    "227":"https://masiro.moe/data/attachment/forum/202007/03/072547l4332l43eawumlxn.jpg",
    "228":"https://masiro.moe/data/attachment/forum/202007/03/072542r66rjsfk4qs2zn48.jpg",
    "230":"https://masiro.moe/data/attachment/forum/202007/03/072758oez3nygcj865my42.jpg",
    "231":"https://masiro.moe/data/attachment/forum/202007/03/072811q9silbblybytotd2.jpg",
    "232":"https://masiro.moe/data/attachment/forum/202007/03/072807qf557lyfmn1ndhlz.jpg",
    "233":"https://masiro.moe/data/attachment/forum/202007/03/072118rbz4eisrsijxej84.jpg",
    "237":"https://masiro.moe/data/attachment/forum/202007/03/072754ce3e0flh3l1fk643.jpg",
    "238":"https://masiro.moe/data/attachment/forum/202007/03/071800zyzt1y17z1gxxyuk.jpg",
    "239":"https://masiro.moe/data/attachment/forum/202007/03/072106z22w5c2euwle3bud.jpg",
    "241":"https://masiro.moe/data/attachment/forum/202007/03/071751m30hft36hq2a8tf0.jpg",
    "243":"https://masiro.moe/data/attachment/forum/202007/03/072701bdokci4pswtaidzz.jpg",
    "247":"https://masiro.moe/data/attachment/forum/202007/03/072658beqh9ewj90ap0hl0.jpg",
    "249":"https://masiro.moe/data/attachment/forum/202007/03/072552je0b7g0qk9qj8gg0.jpg",
    "250":"https://masiro.moe/data/attachment/forum/202007/03/072108r3v3xeovj5l8hdrj.jpg",
    "251":"https://masiro.moe/data/attachment/forum/202007/03/071803tuuyfiuuuly48i8l.jpg",
    "254":"https://masiro.moe/data/attachment/forum/202007/03/072106jlyybypajpucbgjp.jpg",
    "255":"https://masiro.moe/data/attachment/forum/202007/03/072648xpxmp7hzr70zi2oe.jpg",
    "256":"https://masiro.moe/data/attachment/forum/202007/03/072348f7zsm77blnlii2mx.jpg",
    "260":"https://masiro.moe/data/attachment/forum/202007/03/072759mlbtbullmhv1o88o.jpg",
    //V1.2 New (Boys)
    "293":"https://masiro.moe/data/attachment/forum/202007/03/122649mjy9kk175gg3kwy7.jpg",
    "116":"https://masiro.moe/data/attachment/forum/202007/03/122651dpq7y2owjyz2n6e7.jpg",
    "118":"https://masiro.moe/data/attachment/forum/202007/03/122654jvmukng7400ul7nu.jpg",
    "206":"https://masiro.moe/data/attachment/forum/202007/03/122655ohzhm915amg5i484.jpg",
    "216":"https://masiro.moe/data/attachment/forum/202007/03/122656esfhyyckzfhxylry.jpg",
    "245":"https://masiro.moe/data/attachment/forum/202007/03/122656yhf8vx6zq4xgev1k.jpg",
    "263":"https://masiro.moe/data/attachment/forum/202007/03/122657gz4cz1b3k25o7rx9.jpg",
    "264":"https://masiro.moe/data/attachment/forum/202007/03/122659jltl2la44lbajllq.jpg",
    "266":"https://masiro.moe/data/attachment/forum/202007/03/122700w1ttsna05df24e24.jpg",
    "269":"https://masiro.moe/data/attachment/forum/202007/03/122702ki4ih8nn8vi5450r.jpg",
    "272":"https://masiro.moe/data/attachment/forum/202007/03/122704vk9biolk6eokbq24.jpg",
    "273":"https://masiro.moe/data/attachment/forum/202007/03/122704d0lzmhkplvrlcpcc.jpg",
    "274":"https://masiro.moe/data/attachment/forum/202007/03/122705g82ll282l6yan8a0.jpg",
    "275":"https://masiro.moe/data/attachment/forum/202007/03/122706lgrqda6qqgkqsz59.jpg",
    "276":"https://masiro.moe/data/attachment/forum/202007/03/122707afb5nvaurjpr8ufr.jpg",
    "281":"https://masiro.moe/data/attachment/forum/202007/03/122708edmdzchge7hvv8yo.jpg",
    "285":"https://masiro.moe/data/attachment/forum/202007/03/122708kq63tc3ohtx6thtm.jpg",
    "294":"https://masiro.moe/data/attachment/forum/202007/03/122709ngjbr5ntfjrr3b5m.jpg",
    "298":"https://masiro.moe/data/attachment/forum/202007/03/122710zwuwkrbbkhcnsbzg.jpg",
    "305":"https://masiro.moe/data/attachment/forum/202007/03/122711ha0aoaaj57ma5akq.jpg",
    "306":"https://masiro.moe/data/attachment/forum/202007/03/122802xlzrz04tzbnwjtrv.jpg",
    "311":"https://masiro.moe/data/attachment/forum/202007/03/122804gd7krrfv8bgfzb7i.jpg",
    "313":"https://masiro.moe/data/attachment/forum/202007/03/122805dqqbnj99zqvso26x.jpg",
    "315":"https://masiro.moe/data/attachment/forum/202007/03/122806wzbllhx6ivjeljpl.jpg",
    "320":"https://masiro.moe/data/attachment/forum/202007/03/122807ht266l4q1xlx6r81.jpg",
    "321":"https://masiro.moe/data/attachment/forum/202007/03/122808c8wjoolkkpkzkl28.jpg",
    "323":"https://masiro.moe/data/attachment/forum/202007/03/122809nmba4z1a5yp3q1kn.jpg",
    "326":"https://masiro.moe/data/attachment/forum/202007/03/122809grgl8qc0kug0pkp4.jpg",
    "328":"https://masiro.moe/data/attachment/forum/202007/03/122811olddcudpj2urd289.jpg",
    "330":"https://masiro.moe/data/attachment/forum/202007/03/122812wlbdlygig7ygshby.jpg",
    "333":"https://masiro.moe/data/attachment/forum/202007/03/122812y0e2rlurls2a282l.jpg",
    "334":"https://masiro.moe/data/attachment/forum/202007/03/122813tdtyn6wzu11rgwyz.jpg",
    "349":"https://masiro.moe/data/attachment/forum/202007/03/122815bkxm000eak3ajae0.jpg",
    "355":"https://masiro.moe/data/attachment/forum/202007/03/122815ftl4w1jw4vjj4jz4.jpg",
    "363":"https://masiro.moe/data/attachment/forum/202007/03/122816nkg9znguu35u9rue.jpg",
    "365":"https://masiro.moe/data/attachment/forum/202007/03/122817d2oy6kabzgph6yzx.jpg",
    "371":"https://masiro.moe/data/attachment/forum/202007/03/122818qar0k0qjee4s2eke.jpg",
    "373":"https://masiro.moe/data/attachment/forum/202007/03/122819es19trists4tgh91.jpg",
    "374":"https://masiro.moe/data/attachment/forum/202007/03/122820xfb04kyf4bd0muob.jpg",
    "375":"https://masiro.moe/data/attachment/forum/202007/03/122821x466e7hzvh4hgg9e.jpg",
    "376":"https://masiro.moe/data/attachment/forum/202007/03/122822md7drrm5blt72rxz.jpg",
    //V1.2 New (Girls)
    "44":"https://masiro.moe/data/attachment/forum/202007/03/122935q5wso0sow01ogs9o.jpg",
    "67":"https://masiro.moe/data/attachment/forum/202007/03/122936e7x3nxkek8xu7k58.jpg",
    "70":"https://masiro.moe/data/attachment/forum/202007/03/122937ypwmjsvxjwsw70ao.jpg",
    "84":"https://masiro.moe/data/attachment/forum/202007/03/122938uvgebv8b72bbda25.jpg",
    "90":"https://masiro.moe/data/attachment/forum/202007/03/122939cf362936fxrf9ex7.jpg",
    "91":"https://masiro.moe/data/attachment/forum/202007/03/122940k8m1iny9ui9zbuwz.jpg",
    "93":"https://masiro.moe/data/attachment/forum/202007/03/122941msyl5z6njoqw66io.jpg",
    "95":"https://masiro.moe/data/attachment/forum/202007/03/122942tdzk18v1uq885x15.jpg",
    "99":"https://masiro.moe/data/attachment/forum/202007/03/122943angcqcjug31lzsgn.jpg",
    "102":"https://masiro.moe/data/attachment/forum/202007/03/122945co9515z4bz1cbbg1.jpg",
    "109":"https://masiro.moe/data/attachment/forum/202007/03/122945w4ax4qji2x1f4gim.jpg",
    "111":"https://masiro.moe/data/attachment/forum/202007/03/122946e7uf5cxvuovvvphz.jpg",
    "115":"https://masiro.moe/data/attachment/forum/202007/03/122947hjwzojuhlbadwy5y.jpg",
    "130":"https://masiro.moe/data/attachment/forum/202007/03/122948wf68ih5anymh779m.jpg",
    "137":"https://masiro.moe/data/attachment/forum/202007/03/122949q05h5by256smgg10.jpg",
    "139":"https://masiro.moe/data/attachment/forum/202007/03/122949dujgw5lznuttptge.jpg",
    "147":"https://masiro.moe/data/attachment/forum/202007/03/122950s90bqqqd64irzpj8.jpg",
    "148":"https://masiro.moe/data/attachment/forum/202007/03/122951veb942q9g4z9yqeg.jpg",
    "152":"https://masiro.moe/data/attachment/forum/202007/03/122952jgtk4ebk4btbjin2.jpg",
    "153":"https://masiro.moe/data/attachment/forum/202007/03/122952bama4z88i28qumje.jpg",
    "159":"https://masiro.moe/data/attachment/forum/202007/03/122953djw4wiibwbp3i3nc.jpg",
    "160":"https://masiro.moe/data/attachment/forum/202007/03/122954hl0qe742q0eevvyo.jpg",
    "166":"https://masiro.moe/data/attachment/forum/202007/03/123054cgp3dkrwwzftws9s.jpg",
    "169":"https://masiro.moe/data/attachment/forum/202007/03/123055qdpjplixpczel6xi.jpg",
    "173":"https://masiro.moe/data/attachment/forum/202007/03/123056w2i84u4fq4aioxoj.jpg",
    "175":"https://masiro.moe/data/attachment/forum/202007/03/123057ufwbuz4ynzbbs44w.jpg",
    "178":"https://masiro.moe/data/attachment/forum/202007/03/123059xiocfxbqbaixmncc.jpg",
    "184":"https://masiro.moe/data/attachment/forum/202007/03/123100d6z7zcmcc7sslbc1.jpg",
    "186":"https://masiro.moe/data/attachment/forum/202007/03/123101cj9s0ww9j29jy5e5.jpg",
    "187":"https://masiro.moe/data/attachment/forum/202007/03/123102hbw66jt6gv3jr1bk.jpg",
    "197":"https://masiro.moe/data/attachment/forum/202007/03/123103a0uecwle3ve6015d.jpg",
    "198":"https://masiro.moe/data/attachment/forum/202007/03/123103u9ofo9tafoa9odyo.jpg",
    "210":"https://masiro.moe/data/attachment/forum/202007/03/123105qv42ycol2x427ozs.jpg",
    "212":"https://masiro.moe/data/attachment/forum/202007/03/123106vajjf2pft0tv0jvu.jpg",
    "213":"https://masiro.moe/data/attachment/forum/202007/03/123107ze9orlub9bulwqxn.jpg",
    "215":"https://masiro.moe/data/attachment/forum/202007/03/123107dqetby0ackyladlq.jpg",
    "217":"https://masiro.moe/data/attachment/forum/202007/03/123108y3bu9qgivg5b7bxu.jpg",
    "220":"https://masiro.moe/data/attachment/forum/202007/03/123109j5ochcrqf1fit9qf.jpg",
    "221":"https://masiro.moe/data/attachment/forum/202007/03/123109ip4ttnnp3kpqgg4t.jpg",
    "222":"https://masiro.moe/data/attachment/forum/202007/03/123110dl8u8nqnz4ajjou8.jpg",
    "229":"https://masiro.moe/data/attachment/forum/202007/03/123113ysl5qps4ngzsmesg.jpg",
    "234":"https://masiro.moe/data/attachment/forum/202007/03/123113itdorlmod7ezsloo.jpg",
    "236":"https://masiro.moe/data/attachment/forum/202007/03/123114cnf4pfgpdffvgqgf.jpg",
    "242":"https://masiro.moe/data/attachment/forum/202007/03/123115p1kl2unzd1azdku1.jpg",
    "246":"https://masiro.moe/data/attachment/forum/202007/03/123244zjn0l2nlleu22m42.jpg",
    "248":"https://masiro.moe/data/attachment/forum/202007/03/123246n0wozypfx0hwh09h.jpg",
    "257":"https://masiro.moe/data/attachment/forum/202007/03/123248dehwj2t7vlwr47hs.jpg",
    "259":"https://masiro.moe/data/attachment/forum/202007/03/123250vb414czwpzq4noy1.jpg",
    "261":"https://masiro.moe/data/attachment/forum/202007/03/123251ree7pyezfvcsvpig.jpg",
    "268":"https://masiro.moe/data/attachment/forum/202007/03/123251lx4h2d8pd8yhxzdn.jpg",
    "271":"https://masiro.moe/data/attachment/forum/202007/03/123253w5x5xg1n1gd2u415.jpg",
    "278":"https://masiro.moe/data/attachment/forum/202007/03/123254w6qo4vk88slbj5ll.jpg",
    "280":"https://masiro.moe/data/attachment/forum/202007/03/123255fxrq3uuforddmsbe.jpg",
    "284":"https://masiro.moe/data/attachment/forum/202007/03/123256oku1nb22n8dbrbu5.jpg",
    "297":"https://masiro.moe/data/attachment/forum/202007/03/123256fzasvgrg2sc70uuu.jpg",
    "302":"https://masiro.moe/data/attachment/forum/202007/03/123257j4cfvee9e94ljl0n.jpg",
    "304":"https://masiro.moe/data/attachment/forum/202007/03/123258yxvyy3a2g3xxoxx3.jpg",
    "308":"https://masiro.moe/data/attachment/forum/202007/03/123259pmdj3clhe35pmmfy.jpg",
    "309":"https://masiro.moe/data/attachment/forum/202007/03/123300ac5txfx74uzyfc5p.jpg",
    "319":"https://masiro.moe/data/attachment/forum/202007/03/123300vov00s6soowqqm1m.jpg",
    "332":"https://masiro.moe/data/attachment/forum/202007/03/123301pux8paalpam2rpl8.jpg",
    "335":"https://masiro.moe/data/attachment/forum/202007/03/123302b5575tfnpocstbs5.jpg",
    "344":"https://masiro.moe/data/attachment/forum/202007/03/123303wjddapzfqp2ksmzj.jpg",
    "345":"https://masiro.moe/data/attachment/forum/202007/03/123304u6oulb40oz6b6o6b.jpg",
    "348":"https://masiro.moe/data/attachment/forum/202007/03/123304uhbh8wu1z9n5n5qh.jpg",
    "352":"https://masiro.moe/data/attachment/forum/202007/03/123305qpn6v73637vt6nob.jpg",
    "354":"https://masiro.moe/data/attachment/forum/202007/03/123307r006fcogp3us83cb.jpg",
    "356":"https://masiro.moe/data/attachment/forum/202007/03/123308opojboun44n8dbz4.jpg",
    "357":"https://masiro.moe/data/attachment/forum/202007/03/123309dc2glstwwg2niw31.jpg",
    "360":"https://masiro.moe/data/attachment/forum/202007/03/123311pk1kfff0mkg0urx5.jpg",
    "362":"https://masiro.moe/data/attachment/forum/202007/03/123312p5jhd7d5zc8ob5jo.jpg",
    "364":"https://masiro.moe/data/attachment/forum/202007/03/123313kg21201rsegzkfs5.jpg",
    "367":"https://masiro.moe/data/attachment/forum/202007/03/123314vidywtocmt8t5yoi.jpg",
    "369":"https://masiro.moe/data/attachment/forum/202007/03/123315y33f3kekji3i63lq.jpg",
    "370":"https://masiro.moe/data/attachment/forum/202007/03/123316fdziui63uidug114.jpg",
    "372":"https://masiro.moe/data/attachment/forum/202007/03/123319uasd3sz3iood3kck.jpg"
};
    let isMatch = false;
    document.querySelectorAll('table.fl_tb td.fl_g').forEach(ele => {
        let forumid = ele.querySelector("dl dt a").href
        .replace("https://masiro.moe/forum.php?mod=forumdisplay&fid=","").replace("&mobile=2","").replace("&mobile=1","");
        //.replace("https://masiro.moe/forum.php?mod=forumdisplay&amp;fid=","");
        if (image_pool[forumid]){
            isMatch = true;
            ele.classList.add("changeImagePath_HasImage");
            ele.querySelector(".fl_icn_g a").setAttribute("extraImagePath",image_pool[forumid]);
            ele.parentElement.classList.add("changeImagePath_LineHasImage");
            if (!document.querySelector('#nv>ul')){ele.parentElement.classList.add("changeImagePath_mobile");}
        }else{
            //console.log(ele.querySelector("dl dt a").innerText);
            //console.log(forumid);
            //console.log("===");
            ele.classList.add("changeImagePath_NoImage");
        }
    });
    if(isMatch){
        let changeimageElement = document.createElement("li");
        changeimageElement.style['cursor'] = "pointer";
        changeimageElement.innerHTML = "<a>图片式显示</a>";
        changeimageElement.addEventListener('click',function(){
            msr_bookcover_change();
            this.parentNode.removeChild(this);
        });
        if (document.querySelector('#nv>ul'))
            document.querySelector('#nv>ul').appendChild(changeimageElement);
        else
            document.querySelector('.footer>div').appendChild(changeimageElement);
    }
}
function msr_bookcover_change(){

    let style = document.createElement('style');
    style.innerHTML = `
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g{ width: calc(100% - 20px);margin: 3px 10px; padding: 0px; }
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g{ height:285px; }
    table.fl_tb .changeImagePath_LineHasImage.changeImagePath_mobile .fl_icn_g{ height:100px; }
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g div{ opacity:0.95;transition: opacity 0.1s; }
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g .forumNoUpdate{ opacity:0.75;transition: opacity 0.1s; }
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g div:hover{ opacity:1; }
    .boardnav table.fl_tb .changeImagePath_LineHasImage .changeImagePath_NoImage .fl_icn_g img{ width:210px; }
    table.fl_tb .changeImagePath_LineHasImage dl{ margin-left: 0px; }
    table.fl_tb .changeImagePath_LineHasImage .fl_icn_g div{width:100%; height:100%; }
    `;

    document.head.appendChild(style);
    document.querySelectorAll('table.fl_tb td.fl_g.changeImagePath_HasImage .fl_icn_g a').forEach(ele => {
        //console.log(ele.getAttribute("extraImagePath"));
        let imageElement = document.createElement("div");
        if (ele.querySelector("img").getAttribute("src") == "static/image/common/forum.gif") imageElement.classList.add("forumNoUpdate");
        imageElement.style['background'] = "url('"+ele.getAttribute("extraImagePath")+"') 50% 50% / cover";
        ele.replaceChild(imageElement,ele.querySelector("img")) ;
    });
    document.querySelectorAll('table.fl_tb .changeImagePath_LineHasImage td.fl_g.changeImagePath_NoImage .fl_icn_g a').forEach(ele => {
        let imageElement = document.createElement("div");
        if (ele.querySelector("img").getAttribute("src") == "static/image/common/forum.gif") imageElement.classList.add("forumNoUpdate");
        imageElement.style['background'] = "url('https://masiro.moe/data/attachment/forum/202007/03/122648maylkk94f39lrvqk.jpg') 50% 50% / cover";
        ele.replaceChild(imageElement,ele.querySelector("img")) ;
    });
}
(function() {
    'use strict';
    msr_bookcover_main();
})();