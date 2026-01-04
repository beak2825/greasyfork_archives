// ==UserScript==
// @name         HWM_Resources_customupdate1505
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Библиотека HWM_Resources с апдейтом по артам
// @author       Tags
// @include      /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(pl_info.php*)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant         none
// @license      CC BY-NC-SA 4.0
// ==/UserScript==
 
this.MercenaryElements = {
    "абразив":{
        id: "EL_42",
        art_type: "abrasive"
    }, "змеиный яд":{
        id: "EL_43",
        art_type: "snake_poison"
    }, "клык тигра":{
        id: "EL_46",
        art_type: "tiger_tusk"
    }, "ледяной кристалл":{
        id: "EL_44",
        art_type: "ice_crystal"
    }, "лунный камень":{
        id: "EL_45",
        art_type: "moon_stone"
    }, "огненный кристалл":{
        id: "EL_40",
        art_type: "fire_crystal"
    }, "осколок метеорита":{
        id: "EL_37",
        art_type: "meteorit"
    }, "цветок ведьм":{
        id: "EL_41",
        art_type: "witch_flower"
    }, "цветок ветров":{
        id: "EL_39",
        art_type: "wind_flower"
    }, "цветок папоротника":{
        id: "EL_78",
        art_type: "fern_flower"
    }, "ядовитый гриб":{
        id: "EL_38",
        art_type: "badgrib"
    },};
 
 
this.ItemCollection ={
    "item_template": {
        stats: { //параметры
            attr_attack: 2, //значение атаки
            attr_defense: 2, //значение защиты
            attr_magicpower: 1, //значение силы магии
            attr_knowledge: 1, //значение знаний
            attr_initiative: 1, //значение инициативы
            attr_fortune: 0, //значение удачи
            attr_morale: 0, //значение морали
            attr_oa: 7, //значение очков аммуниции
            additional_stats:["параметр_1","параметр_2"] //дополнительные эффекты
        },
        required_level: 15, //требуемый уррвень
        base_durability: 0, //базовая прочность
        repair_price: 20000, //цена ремонта
        is_hunting_item: false, //добывается ли предмет на охоте
        is_event_item: true, //ивентовый предмет
        is_set_part: true, //часть сета
        is_shop_item: false, //предмет из магазина
        is_shop_status:false, //предмет со статусом "из магазина"
        shop_price: 0, //цена в магазине
    },
    "ocean_eye1": {
        repair_price: 20000,
        stats: {
            attr_attack: 2,
            attr_defense: 2,
            attr_magicpower: 1,
            attr_knowledge: 1,
            attr_initiative: 1,
            attr_fortune: 0,
            attr_morale: 0,
            attr_oa: 7
        },
        required_level: 15,
        base_durability: 0,
        is_hunting_item: false,
        is_event_item: true,
        is_set_part: true,
        is_shop_item: false,
        is_shop_status:false,
        shop_price: 0,
    },
};
 
this.RepairPrices = {
    ocean_eye1:20000,ocean_eye3:12000,ocean_eye2:16000,surv_mhelmetcv:28000,arm_armor2:12800,arm_armor3:10000,arm_armor1:16000,magneticarmor:36000,tunnel_kirka:4000,orc_axe:28000,sun_staff:17600,blacksword1:10000,eddem_ring2:14000,eddem_ring3:12000,eddem_ring1:16000,bwar_takt:28000,gnomehammer:44000,merc_boots:40000,inq_weap:64000,inq_body:64000,mage_hat:60000,
    smamul14: 4370,chain_coif:1539,samul14:4370,dudka:6000,power_pendant:7381,mmzamulet13:9975,warrior_pendant:8046,wzzamulet13:9975,tj_magam1:24000,wzzamulet16:10972,mamulet19:11039,amulet19:11039,bafamulet15:10811,zub:40000,"8amul_inf":12000,adv_neck2:10000,eg_order3:16000,mir_am1:24000,m_amul3:12000,sharik:4000,"7ka":4000,
    samul8: 3391,adv_neck1:16000,p_amulet1:20000,castle_orden:16000,m_amul1:20000,tjam1:24000,mir_am2:20000,dun_amul1:20000,"9amu_let":18000,neut_amulet:10000,tj_magam2:20000,p_amulet3:12000,order_griffin:16000,ramul1:16000,tjam3:16000,eg_order2:20000,dun_amul2:16000,surv_mamulka:28000,clover_amul:11000,coldamul:11000,ord_dark:18000,eg_order1:22000,forest_crossbow:10000, wind_helm:7400,wind_boots:8700,
    smamul17: 4389,hunter_jacket1:400,leather_shiled:266,hunter_armor1:800,gm_arm:1200,student_armor:2000,sh_armor:2400,hauberk:2289,sarmor9:2479,forest_armor:10000,sarmor16:4351,sarmor13:4322,ciras:4455,mage_armor:4465,mif_light:6251,wiz_robe:9376,mir_armor1:24000,full_plate:9243,armor15:9310,miff_plate:9842,mir_armor3:16000,tjarmor3:16000,wiz_robe:9376,surv_armorsu:28000,armor17:9490,marmor17:9310,robewz15:9310,ed_armr1:16000,ed_armr3:12000,rarmor1:16000,ed_armr2:14000,pir_armor1:20000,tmarmor3:16000,dun_armor2:16000,m_armor1:20000,adv_armor2:10000,adv_armor1:16000,m_armor3:12000,mir_armor2:20000,polk_armor2:12000,dun_armor1:20000,m_armor2:16000,tmarmor1:24000,polk_armor1:16000,polk_armor3:8000,tjarmor1:24000,sun_armor:9500,tmarmor2:20000,
    trinitypendant: 6400,hunter_mask1:800,gm_protect:1200,scoutcloack:304,sh_cloak:2400,ocean_cl1:20000,scloack16:3192,wiz_cape:8711,antiair_cape:2926,mtcloak3:16000,cloackwz15:9614,dun_cloak1:18000,scloack8:2052,dun_cloak2:15000,adv_clk1:16000,antimagic_cape:4949,powercape:5339,adv_clk2:10000,p_cloak1:20000,vtjcloak1:24000,dun_cloak3:12000,cloack17:9975,mtcloak1:24000,les_cl:10000,vtjcloak2:20000,rcloak1:16000,ocean_cl2:16000,
    samul17: 4389,ocean_cl3:12000,mtcloak2:20000,stalkercl:8000,p_cloak2:16000,surv_cloacksrv:28000,finecl:10000,surv_mcloacksv:28000,ocean_m_shield2:16000,
    gm_amul: 1200,hunter_boots1:400,hunter_boots3:800,hunter_boots2:800,leatherboots:199,gm_spdb:1200,boots2:1026,sh_boots:2400,shoe_of_initiative:2384,sboots9:2137,sboots12:2992,sboots16:3239,mir_boots1:24000,steel_boots:5785,mif_lboots:7153,mif_hboots:7752,wiz_boots:8008,boots15:8559,boots13:8502,
    magic_amulet: 8379,boots17:8683,mir_boots2:20000,p_boots1:20000,mboots17:8683,tj_mtuf1:24000,mboots14:8825,adv_boot2:10000,torg_boots:20000,mir_boots3:16000,forest_boots:10000,tj_vboots2:20000,dun_boots1:20000,ocean_boots1:20000,adv_boot1:16000,tj_vboots1:24000,p_boots2:16000,rboots2:8000,ocean_boots3:12000,rboots1:16000,sun_boots:8700,sun_boots:8700,
    mmzamulet16: 10972,dun_boots2:16000,polkboots1:16000,piratehat3:12000,tj_helmet3:16000,polk__helm2:12000,mhelmv2:20000,tj_helmet2:20000,tjam2:20000,p_amulet2:16000,ramul2:8000,rog_demon:40000,order_manticore:16000,dun_amul3:12000,mir_am3:16000,"5years_star":5000,surv_wamuletik:28000,m_amul2:16000,ord_light:18000,leatherplate:1358,pir_armor3:12000,dun_armor3:12000,rarmor2:8000,tjarmor2:20000,
    sh_amulet2: 2400,p_cloak3:12000,p_pistol3:12000,molot_tan:40000,blacksword:20000,surv_sword_surv:36000,p_dag3:12000,p_dag3:12000,dun_sword3:12000,slayersword:40000,dem_dtopor:48000,ocean_boots2:16000,polkboots2:12000,surv_mbootsbb:28000,
    mhelmet17: 7239,anomal_ring2:18000,hunter_ring1:800,gm_rring:1200,sh_ring2:2400,sring4:579,ocean_ring1:20000,sh_ring1:2400,hunter_ring2:800,dring18:14820,darkring:8379,dring15:14534,adv_fring1:16000,i_ring:171,warriorring:6697,warriorring:6697,anomal_ring1:20000,dring12:13356,gm_sring:1200,"v-ring1":24000,doubt_ring:1064,sun_ring:6400,sring17:2907,blackring:8000,pn_ring1:20000,smring10:2859,mmmring16:11238,verve_ring:1577,smring10:2859,sring10:2859,powerring:5187,dring5:3496,smring17:2907,pn_ring3:12000,adv_fring2:10000,ring19:11305,vmring1:24000,vbolt3:16000,ocean_ring2:16000,circ_ring:6507,dring21:15104,warring13:10279,anomal_ring3:16000,ed_ring1:16000,magring13:10279,bring14:10374,gring:24000,piring3:12000,dring9:10032,dun_ring1:20000,ttring:10800,piring1:20000,mring19:11390,piring2:16000,gringd:24000,rogring2:8000,vmring2:20000,rogring1:16000,ed_ring3:12000,ocean_per3:12000,"6ring":15000,ed_ring2:14000,ocean_ring3:12000,pn_ring2:16000,ring2013:800,vbolt2:20000,vbolt2:20000,"v-ring3":16000,dun_ring2:16000,
    mechanic_glasses3: 6800,stalker_cl3:10000,stalker_cl2:12800,stalker_cl1:16000,
    mechanic_glasses1: 8000,icesphere3:12800,nefrit1:9600,skill_book11:40000,"10scroll":40000,totem2:9000,msphere:9600,adv_sumk1:16000,krest1:9600,dragonstone:12000,ankh1:12000,crystal:16000,p_compas2:16000,totem3:8400,bear_statue:8000,sph1:24000,znak8:10000,sumka:12000,pouch:12000,krest2:9000,obereg:20000,krest3:8400,kniga:9600,mgear:9600,flyaga:60000,sandglass:12000,nefrit2:9000,ankh2:10000,
    adv_hm2: 10000,"13coin":40000,znak6:10000,"12hron":40000,znak2:10000,nefrit3:8400,znak1:10000,znak4:10000,sph2:20000,bal_cube:4800,sph3:16000,necrohelm3: 24000,
    necrohelm3: 24000,gnomewar7:12000,bwar6:16000,ve_helm:48000,v_1armor:48000,verbboots:48000,verbboots:48000,vrb_shild:48000,verb11_sword:48000,tactwww_wring:40000,tactsm0_dagger:40000,tactspw_mring:40000,tactcv1_armor:40000,tactpow_cloack:40000,tactms1_mamulet:40000,tactmag_staff:40000,tactdff_shield:40000,tactzl4_boots:40000,mhelmv3: 16000,tact1w1_wamulet:40000,tacthapp_helmet:40000,tactaz_axe:40000,bludgeon:28000,
    piratehat2: 16000,gmage_boots:64000,r_zarmor:36000,druid_boots:64000,druid_armor:64000,elfdagger:36000,r_magy_staff:36000,druid_staff:64000,r_clck:36000,gnomeboots:44000,merc_armor:40000,nv_body:56000,amf_cl:64000,mage_boots:60000,mage_boots:60000,
    polk__helm3: 8000,gmage_crown:64000,gmage_cloack:64000,gmage_scroll:64000,gmage_armor:64000,amf_helm:64000,paladin_shield:64000,mage_robe:60000,inq_cl:64000,inq_boot:64000,mage_cape:60000,elfshirt:50000,mage_staff:60000,paladin_sword:64000,kn_helm:44000,knightsword:44000,sv_helm:64000,darkelfcloack:50000,knighthelmet:44000,welfsword:44000,sv_body:64000,gnomehelmet:44000,barb_helm:40000,darkelfstaff:50000,darkelfpendant:50000,gnomem_hammer:64000,kn_weap:44000,barb_boots:40000,nv_shield:56000,gmage_staff:64000,kn_weap:44000,nv_weap:56000,barb_club:40000,necr_helm:40000,welfbow:44000,knightboots:44000,barb_club:40000,
    ocean_hlm2: 16000,adv_hm1: 16000,commander_ring:20000,sv_arb:64000,testring:40000,mhelmv1: 24000,necrohelm1: 10000,piratehat1: 20000, tj_helmet1: 24000,hm2: 20000,polk__helm1: 16000,hm1: 14400,sun_helm: 7400,rhelm2: 8000,rhelm1: 16000,hunter_amulet1: 800,adv_longbow2: 10000,dung_axe2: 15000,firehammer: 32000,
    "vscroll-3": 16000,rsword1: 16000,p_sword2: 16000,polk_sword3: 8000,dung_axe3: 12000,polk_sword2: 12000,vtmsword2: 20000,forest_bow: 10000,dagger_dex: 3230,vtmaxe2: 20000,surv_halberdzg: 24000,dun_dagger3: 12000,gnomewar6:16000,bwar7:12000,kwar4:28000,demwar6:8000,magewar3:32000,
    staff_v3: 16000,stalker_hlm2:12800,stalker_hlm1:16000,stalker_hlm3:10000,tj_magam3:16000,vtjcloak3:16000,stalker_crsb2:12800,stalker_crsb3:10000,stalker_crsb1:16000,buben2:12800,buben1:16000,buben3:9600,surv_scrollcd:28000,rashness_ring:1928, dun_ring3:12000,r_helmb:36000,sniperbow:36000,welfarmor:44000,sv_shield:64000,nv_helm:56000,kn_body:44000,elfamulet:50000,elfboots:50000,nv_boot:56000,elfbow:50000,dering:24000,
    leatherhat: 171,mir_helmt2:20000,mir_helmt1:24000,mir_helmt3:16000,arm_cap3:10000,arm_cap2:12800,arm_cap1:16000,ocean_hlm3:12000,"3year_art":4000,surv_marmoroz:28000,sunart4:36000,"tj-shield3":16000,surv_shieldvv:28000,wind_boots:8700, surv_mring2fpg:20000,icecr1:16000,icecr2:14400,icecr3:12800,znak3:10000,cat_statue:8000,
    leather_helm: 627,
    mage_helm: 3277,
    mif_hhelmet: 6298,
    myhelmet15: 6583,
    helmet17: 7239,
    scroll18: 10307,
    sor_staff: 6118,
    mstaff10: 3781,
    bow14: 9946,
    composite_bow: 8246,
    ed_elfbow2: 14000,
    mm_staff: 16986,
    mif_staff: 16387,
    ffstaff15: 17679,
    ocean_sword1: 20000,
    vrdagger1: 24000,
    mif_sword: 16957,
    staff18: 17746,
    vbow2: 20000,
    raxe1: 16000,
    ocean_sword3: 12000,
    ed_bsword3: 12000,
    hunter_pendant1: 400,
    bravery_medal: 560,
    quest_pendant1: 600,
    amulet_of_luck: 959,
    hunter_bow1: 400,
    def_sword: 1292,
    requital_sword: 2527,
    gm_sword: 1200,
    ssword8: 3838,
    ssword10: 4854,
    steel_blade: 465,
    broad_sword: 4721,
    ed_elfbow3: 12000,
    mstaff8: 2888,
    mstaff13: 4797,
    ssword16: 6051,
    mh_sword2: 20000,
    ed_bsword2: 14000,
    topor_drov: 16000,
    p_pistol2: 16000,
    adv_saber2: 10000,
    energy_scroll: 9044,
    topor_skelet: 14000,
    p_pistol1: 20000,
    rdagger2: 8000,
    hopesh2: 7200,
    rbow2: 8000,
    dun_sword2: 16000,
    p_sword1: 20000,
    rsword2: 8000,
    rbow1: 16000,
    "vscroll-2": 20000,
    ocean_bw3: 12000,
    hunter_sword1: 400,
    tm_wring: 24000,
    tm_armor: 24000,
    surv_wring1my: 28000,
    vbolt1: 24000,
    wwwring16: 11238,
    coldring_n: 6400,
    lbow: 10100,
    cold_sword2014: 17600,
    power_sword: 9775,
    firsword15: 17670,
    adv_longbow1: 16000,
    surv_staffik: 36000,
    mm_sword: 17195,
    dagger_myf: 8626,
    adv_saber1: 16000,
    a_dagger2: 10000,
    staff_v2: 20000,
    sh_sword: 2400,
    stalker_dagger3: 10000,
    mm_sword: 17195,
    ocean_bw2: 16000,
    gm_abow: 1200,
    amf_body: 64000,
    thief_neckl: 8000,
    tm_amulet: 24000,
    thief_arb: 8000,
    tm_arb: 24000,
    thief_goodarmor: 8000,
    thief_fastboots: 8000,
    thief_cape: 8000,
    ring_of_thief: 8000,
    thief_ml_dagger: 8000,
    tm_cape: 24000,
    tm_boots: 24000,
    tm_msk: 24000,
    tm_mring: 24000,
    tm_knife: 24000,
    ocean_sword2: 16000,
    dun_bow2: 16000,
    surv_crossbowsurv: 32000,
    staff: 2527,
    ocean_dgr1: 20000,
    dun_dagger1: 20000,
    vbow1: 24000,
    ed_elfbow1: 16000,
    vtmsword1: 24000,
    mh_sword1: 24000,
    dun_sword1: 20000,
    polk_sword1: 16000,
    staff_v1: 24000,
    "vscroll-1": 24000,
    vtmaxe1: 24000,
    dung_axe1: 18000,
    shield19: 10469,
    shield16: 10298,
    e_shield1: 10000,
    ocean_per2: 16000,
    long_bow: 6317,
    hopesh1: 10000,
    surv_daggermd: 36000,
    windsword: 22000,
    pit_sword1: 16000,
    pit_sword2: 13200,
    p_sword3: 12000,
    surv_sword2sd: 20000,
    dagger16: 9120,
    trogloditkop: 5600,
    pika: 28000,
    pegaskop: 36000,
    shortbow: 342,
    dun_bow3: 12000,
    vrdagger3: 16000,
    ocean_dgr3: 12000,
    large_shield: 9576,
    shield13: 10174,
    ogre_helm: 24000,
    dubina: 40000,
    dagger20: 9291,
    dun_shield1: 20000,
    mir_shld2: 20000,
    huntershield2: 800,
    hunter_shield1: 400,
    round_shiled: 104,
    mir_shld1: 24000,
    defender_shield: 1130,
    gm_defence: 1200,
    s_shield: 266,
    sh_shield: 2400,
    sshield5: 2888,
    shieldofforest: 10000,
    sshield14: 3923,
    sshield11: 3876,
    dragon_shield: 8778,
    ocean_m_shield3: 12000,
    ocean_hlm1: 20000,
    stalker_dagger1: 16000,
    sword18: 17755,
    dun_bow1: 20000,
    ogre_bum: 36000,
    gm_kastet: 1200,
    vrdagger2: 20000,
    forest_dagger: 20000,
    stalker_dagger2: 12800,
    dagger: 428,
    ocean_dgr2: 16000,
    p_dag2: 16000,
    p_dag1: 20000,
    super_dagger: 10400,
    dun_dagger2: 16000,
    rdagger1: 16000,
    shield_14y: 14000,
    adv_shild1: 16000,
    ocean_m_shield1: 20000,
    ocean_bw1: 20000,
    gm_hat: 1200,
    sh_helmet: 2400,
    wizard_cap: 1596,
    shelm16: 2774,
    hunterdagger: 800,
    hunter_bow2: 800,
    wood_sword: 133,
    huntersword2: 800,
    gnome_hammer: 294,
    hunterdsword: 800,
    forest_blade: 20000,
    bow17: 10108,
    a_dagger1: 16000,
    sh_spear: 2400,
    sh_bow: 2400,
    ed_bsword1: 16000,
    ssword13: 5985,
    sshield17: 4018,
    rshield1: 16000,
    "tj-shield1": 24000,
    ocean_per1: 20000,
    thief_msk: 8000,
    hunter_helm: 800,
    hunter_hat1: 400,
    hunter_roga1: 800,
    knowledge_hat: 978,
    shelm8: 1197,
    xymhelmet15: 6612,
    dragon_crown: 6800,
    shelm12: 2660,
    steel_helmet: 3676,
    forest_helm: 10000,
    mechanic_glasses2: 7400,
    mif_lhelmet: 5244,
    zxhelmet13: 6384,
    mhelmetzh13: 6384,
    ru_statue: 2009,
    bshield1: 16000,
    adv_shild2: 10000,
    rshield2: 8000,
    e_shield2: 7200,
    "tj-shield2": 20000,
    mir_shld3: 16000,
    cold_shieldn: 10400,
    bshield2: 12000,
    dun_shield2: 16000,
    dun_shield3: 12000,
    hunter_gloves1: 400,
    mirror: 16000,
    runkam: 9600,
    p_compas1: 20000,
    cubes: 6400,
    cubeg: 9600,
    icesphere2: 14400,
    totem1: 9600,
    cubed: 4800,
    icesphere1: 16000,
    adv_sumk2: 10000,
    compass: 8000,
    gm_3arrows: 1200,dem_amulet:50000,
    sh_4arrows: 2400,mh_sword3:16000,dem_kosa:40000,znak9:10000,znak5:10000,bwar3:36000,bwar_stoj:28000,r_goodscroll:36000,amf_weap:64000,gnomeshield:44000,gnomeshield:44000,welfboots:44000,welfshield:44000,sv_boot:64000,gnomearmor:44000,
    hunter_arrows1: 800,drak_armor1:20000,drak_armor2:16000,drak_armor3:12000,
    bwar1: 60000,r_m_amulet:36000,gnomem_armor:64000,darkelfkaska:50000,darkelfboots:50000,barb_shield:40000,dem_helmet:50000,sv_weap:64000,merc_dagger:40000,merc_sword:40000,dem_axe:50000,
    bwar2: 48000,
    kwar2: 48000,inq_ring2:12000,znak7:10000,p_compas3:12000,tact765_bow:40000,tact765_bow:40000,druid_cloack:64000,kn_shield:44000,amf_scroll:64000,paladin_armor:64000,paladin_helmet:64000,paladin_boots:64000,gnomem_boots:64000,
    kwar6: 16000,
    gnomem_amulet: 64000,pir_armor2:16000,soul_cape:1197,rcloak2:8000,battlem_cape:28000,antifire_cape:16000,wshield:4000,gargoshield:16000,inq_ring1:16000,bshield3:8000,hunter_boots:912,tj_mtuf2:20000,polkboots3:8000,p_boots3:12000,tj_vboots3:16000,dun_boots3:12000,neut_ring:10000,"v-ring2":20000,
    druid_amulet: 64000,
    paladin_bow: 64000,
    necrohelm2:16000, taskaxe:10000,ed_mbook2:14000,ed_mbook3:12000,ed_mbook1:16000,kopie:28000,dem_dmech:14000,smstaff16:4883,vbow3:16000,raxe2:8000,goblin_bow:16000,vtmaxe3:16000,centaurbow:16000,"4year_klever":4000,"3year_amul":4000,
	arm_clk1:16000, arm_clk2:12800, arm_clk3:10000,
	stalker_armour1:16000, stalker_armour2:12800, stalker_armour3:160000,
};
 
 
(function() {
    'use strict';
 
    if(!window.location.href.includes('pl_info'))
        return;
    const tables = Array.from(document.getElementsByClassName('wb'));
    const resourceTable = tables[tables.indexOf(tables.filter(e=>e.innerText=="Ресурсы")[0])+3]
    if(resourceTable.hasAttribute("done")){
        console.log("already processed");
        return;}
    //Вытаскиваем все доступные элементы и превращаем в объекты.
    const items = resourceTable.innerHTML.split(/&nbsp;/).filter(e => e !== "").map(s => s.replaceAll("<b>", "").replaceAll("<br>", "").replaceAll("</b>", "")).map(e => ({
        name: e.split(':')[0],
        value: e.split(':')[1],
        isMercenary: window.MercenaryElements[e.split(':')[0]]!==undefined,
    }));
 
    const parts = items.filter(e=>!e.isMercenary);
    const mercenary = items.filter(e=>e.isMercenary);
    //Чистим табличку
    resourceTable.innerHTML = "";
 
    //Записываем новую разметку
    for (let item of parts) {
        const div = Object.assign(
            document.createElement('div'), {
                innerHTML: `<div>&nbsp;&nbsp;&nbsp;&nbsp;<b>${item.name}</b>:&nbsp;${item.value}</div>`,
 
            });;
        div.setAttribute('ismercenary', item.isMercenary);
        div.setAttribute('name', item.name);
        resourceTable.appendChild(div);
    }
    const splitter = Object.assign(
        document.createElement('div'), {
            innerHTML: `<div name="splitter"><br></div>`,
 
        });;
    if(parts.length>0){
        resourceTable.appendChild(splitter);
    }
    for (let item of mercenary) {
        const div = Object.assign(
            document.createElement('div'), {
                innerHTML: `<div">&nbsp;&nbsp;&nbsp;&nbsp;<b>${item.name}</b>:&nbsp;${item.value}</div>`,
 
            });;
        div.setAttribute('ismercenary', item.isMercenary);
        div.setAttribute('name', item.name);
        resourceTable.appendChild(div);
    }
    resourceTable.setAttribute("done","true")
})();
 