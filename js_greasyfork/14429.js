// ==UserScript==
// @name        Improved Hangar
// @namespace   RSI_ImprovedHangar
// @description Improved hangar layout and usability
// @include     https://robertsspaceindustries.com/account/pledges
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14429/Improved%20Hangar.user.js
// @updateURL https://update.greasyfork.org/scripts/14429/Improved%20Hangar.meta.js
// ==/UserScript==

(function (){
      var ships = 
      [
        {'name':'Aurora ES','thumbnail':'/media/9u8061zhf29fir/heap_infobox/Rsi_aurora_es_storefront_visual.jpg'},
        {'name':'P-52 Merlin','thumbnail':'/media/a9231ysz5cnvor/heap_infobox/Top.jpg'},
        {'name':'Aurora MR','thumbnail':'/media/ohbfgn1ebcsnar/heap_infobox/Rsi_aurora_mr_storefront_visual.jpg'},
        {'name':'Mustang Alpha','thumbnail':'/media/ssh2spko70pz6r/heap_infobox/Alpha-Front.jpg'},
        {'name':'P-72 Archimedes','thumbnail':'/media/xqgbgw3x6o54ir/heap_infobox/Archimedes_Front_01.jpg'},
        {'name':'Aurora LX','thumbnail':'/media/xfq27owiysn6ar/heap_infobox/Aurora-LX_Ortho.jpg'},
        {'name':'Aurora LN','thumbnail':'/media/ljgowkr9tdwetr/heap_infobox/Rsi_aurora_ln_storefront_visual.jpg'},
        {'name':'Mustang Beta','thumbnail':'/media/ltw03c5rli6uwr/heap_infobox/Beta-Front.jpg'},
        {'name':'Aurora CL','thumbnail':'/media/fh1gtu93mndsur/heap_infobox/Rsi_aurora_cl_storefront_visual.jpg'},
        {'name':'Titan Module','thumbnail':'/media/cg2gcecohj7s6r/heap_infobox/Avenger_cargo_right.jpg'},
        {'name':'Reliant','thumbnail':'/media/jjs1n85qx4u7br/heap_infobox/Reliant_LandingInsitu_Final_Hobbins.png',},
        {'name':'300i','thumbnail':'/media/ep375pda2jer7r/heap_infobox/300i_storefront_visual.jpg'},
        {'name':'Mustang Gamma','thumbnail':'/media/yu4cuzh90oz54r/heap_infobox/Gamma-Front.jpg'},
        {'name':'Mustang Omega','thumbnail':'/media/gmru9y7ynd1bbr/heap_infobox/Omega-Front.jpg'},
        {'name':'Avenger Stalker','thumbnail':'/media/3dx8jqsd79dmpr/heap_infobox/Avenger_storefront_visualjpg.jpg'},
        {'name':'Hull A','thumbnail':'/media/tpw5r365mowmar/heap_infobox/Hull_A_Final.jpg'},
        {'name':'315p','thumbnail':'/media/o34z1cyxt1um8r/heap_infobox/315p_storefront_visual.jpg'},
        {'name':'Mustang Delta','thumbnail':'/media/dtqy8jpl0f9cbr/heap_infobox/Delta-Front.jpg'},
        {'name':'325a','thumbnail':'/media/gdol1g9fswvjcr/heap_infobox/325a_storefront_visual.jpg'},
        {'name':'Warlock Module','thumbnail':'/media/qcv2n7ms9qwj8r/heap_infobox/Avenger_EMP_02.jpg'},
        {'name':'Herald','thumbnail':'/media/rq2gv7b4b3id0r/heap_infobox/Herald-1.jpg'},
        {'name':'Hull B','thumbnail':'/media/xg8d8kyo0bjsmr/heap_infobox/HullB_landedcompv3b.jpg'},
        {'name':'Gladius','thumbnail':'/media/b623f9bkn0c3ur/heap_infobox/Gladius_Front_Perspective.jpg'},
        {'name':'M50','thumbnail':'/media/xfs6elgejzxz9r/heap_infobox/M50_new_comp47.jpg'},
        {'name':'Cutlass Black','thumbnail':'/media/7tcxllnna6a9hr/heap_infobox/Drake_cutlass_storefront_visual.jpg'},
        {'name':'Freelancer','thumbnail':'/media/ts39qbhy6x38pr/heap_infobox/Freelancer_storefront_visual.jpg'},
        {'name':'F7C Hornet','thumbnail':'/media/m6e374a9zb7dlr/heap_infobox/F7c_hornet_storefront_visual.jpg'},
        {'name':'Cutlass Red','thumbnail':'/media/anznazc3gf5oar/heap_infobox/Slide_Cut-Red.jpg'},
        {'name':'F7C-S Hornet Ghost','thumbnail':'/media/d7l12zt956s62r/heap_infobox/F7cs_hornet_ghost_storefront_visual.jpg'},
        {'name':'Freelancer DUR','thumbnail':'/media/gui7c4ac9u4v3r/heap_infobox/Freelancer_dur_storefront_visual.jpg'},
        {'name':'350r','thumbnail':'/media/52nrmwl43g1cor/heap_infobox/350r_storefront_visual.jpg'},
        {'name':'Freelancer MAX','thumbnail':'/media/pd2zoaytunmrkr/heap_infobox/Freelancer_max_storefront_visual.jpg'},
        {'name':'F7C-R Hornet Tracker','thumbnail':'/media/5f5hxp2dp3b69r/heap_infobox/F7c-R_hornet-Tracker_storefront_visual.jpg'},
        {'name':'Retaliator Base','thumbnail':'/media/bp86xpkhi47etr/heap_infobox/Retaliator_engine_shot_a.jpg'},
        {'name':'Constellation Taurus','thumbnail':'/media/3vj4o4l5uggk7r/heap_infobox/Taurus-Storefront.jpg'},
        {'name':'Cutlass Blue','thumbnail':'/media/8d5ywktt23231r/heap_infobox/Blue-WR-Orth_000000.jpg'},
        {'name':'Khartu-Al','thumbnail':'/media/zzycyqkpn9vu8r/heap_infobox/Image_landed.jpg'},
        {'name':'Freelancer MIS','thumbnail':'/media/yie4k1qvzqqr0r/heap_infobox/Freelancer_mis_storefront_visual.jpg'},
        {'name':'Gladiator','thumbnail':'/media/ye6hvyo93oc2ar/heap_infobox/Gladiator-WB_FrontLeft.jpg'},
        {'name':'F7C-M Super Hornet','thumbnail':'/media/4otqgybm0y38ur/heap_infobox/F7c-M_super-Hornet_storefront_visual.jpg'},
        {'name':'Sabre','thumbnail':'/media/wnqvrpoomrpp6r/heap_infobox/Concept_citcon2015_5.jpg'},
        {'name':'Starfarer','thumbnail':'/media/k4f44vqnex0m1r/heap_infobox/SF-Chris-O-2.jpg'},
        {'name':'Hull C','thumbnail':'/media/w54u21vkhci5vr/heap_infobox/Hull_C_Final.jpg'},
        {'name':'Constellation Andromeda','thumbnail':'/media/vzyhde6cjgsn7r/heap_infobox/Andromeda_Storefront.jpg'},
        {'name':'Starfarer Gemini','thumbnail':'/media/4pgpl7n71hijzr/heap_infobox/Gemini2338.jpg'},
        {'name':'Caterpillar','thumbnail':'/media/wde7ozthdqjnxr/heap_infobox/Cat-Model-Render4.jpg'},
        {'name':'Merchantman','thumbnail':'/media/63lxivb7mi3vzr/heap_infobox/Banu_merchantman_side_Version_A.jpg'},
        {'name':'Vanguard Warden','thumbnail':'/media/4bnuwyj849f3hr/heap_infobox/Vanguard_34_final_Bachiller_02.png',},
        {'name':'Redeemer','thumbnail':'/media/t0opqw0tauo45r/heap_infobox/Red1.jpg'},
        {'name':'Vanguard Sentinel','thumbnail':'/media/qqmzhgb7ra29xr/heap_infobox/03.jpg'},
        {'name':'Retaliator Bomber','thumbnail':'/media/kz6mu0tt0u06er/heap_infobox/Retaliator-Ortho_v2.jpg'},
        {'name':'Constellation Aquila','thumbnail':'/media/u0pbc9k058nuhr/heap_infobox/Aquila_Storefront.jpg'},
        {'name':'Vanguard Harbinger','thumbnail':'/media/c5vioobscp9vkr/heap_infobox/02.jpg'},
        {'name':'Scythe','thumbnail':'/media/wdtdkzl0x31ver/heap_infobox/Vanduul-Scythe_storefront_visual.jpg'},
        {'name':'Orion','thumbnail':'/media/hfpnkupg7gr6er/heap_infobox/RSI_Orion_Situ1b_150219_GH.jpg'},
        {'name':'Endeavor','thumbnail':'/media/vh2jbjaom7ys4r/heap_infobox/CO_Beauty_BioDomes.jpg'},
        {'name':'Crucible','thumbnail':'/media/vxj1ppzl3xmhdr/heap_infobox/AnvilcrucibleREARMAINTENANCE.jpg'},
        {'name':'Glaive','thumbnail':'/media/ygnjk175atmcer/heap_infobox/Vanduul_glaive_viz3.jpg'},
        {'name':'Hull D','thumbnail':'/media/wox7k753a2pn6r/heap_infobox/Hull_D_Blueprint.jpg'},
        {'name':'Carrack','thumbnail':'/media/u248nf7opb5bhr/heap_infobox/Carrack_Landed_Final_Gurmukh.png',},
        {'name':'Reclaimer','thumbnail':'/media/627hob4lwqt3xr/heap_infobox/Image002-1.jpg'},
        {'name':'Constellation Phoenix','thumbnail':'/media/0o9gi8gbsm178r/heap_infobox/Phoenix_Storefront.jpg'},
        {'name':'Genesis','thumbnail':'/media/iqk7vt4xay0zfr/heap_infobox/Starliner_action1_runwaycompFlat.jpg'},
        {'name':'Hull E','thumbnail':'/media/xyt1qu08sjmy3r/heap_infobox/Hull_E_3_compflat.jpg'},
        {'name':'890 JUMP','thumbnail':'/media/aokcb6ay0i0jpr/heap_infobox/890_beautyShot-Concept_V01High_NF_140709.jpg'},
        {'name':'Idris-M','thumbnail':'/media/rfjjekm57en5jr/heap_infobox/IDRISdownfrontquarter_copy.jpg'},
        {'name':'Idris-P','thumbnail':'/media/rfjjekm57en5jr/heap_infobox/IDRISdownfrontquarter_copy.jpg'},
        {'name':'Javelin','thumbnail':'/media/nzqi87nkarvupr/heap_infobox/Javelin-Sale.jpg'}
      ];
      
      var items = $('.list-items li');
      items.each(function(e)
      {
        if(e==0)
          return;
        
        var $upgraded=$('.upgraded',this);
        var $header=$('h3',this);
        var $wrapper=$('.wrapper-col',this);
        var $pledgeName=$('.js-pledge-name',this);
        var shipName=$pledgeName.val().replace(/^Standalone Ship - (.*?)(?: - Anniversary| - LTI|)$/,'$1');
        var pledgeId=$('.js-pledge-id',this).val();
        var pledgeValue=$('.js-pledge-value',this).val();
        
        $wrapper.append($('<div class="date-col"><label>Melt Value</label>'+pledgeValue+'</div>'));
        
        if($pledgeName.val().indexOf('Ship Upgrades')==-1)
          $wrapper.append($('<div class="items-col"><label>Base Pledge</label>'+shipName+'</div>'));
        
        if($upgraded.length>0)
        {
          var $image=$('.basic-infos .image',this);
          var $label=$($('.items-col',this)[0]);
          
          for(var i=0,j=ships.length;i<j;i++)
          {
            if($label.text().toLowerCase().indexOf(ships[i].name.toLowerCase())>-1)
            {
              shipName=$label.text().replace(/Contains:\s+(.*?)and./,'$1');
              $image.css({'background-image':'url("'+ships[i].thumbnail+'")'});break;
            }
          }
        }
        
        if($pledgeName.val().indexOf('Standalone Ship')>-1)
          $header.text('Standalone Ship - '+shipName+' - LTI ('+pledgeId+')');
        else 
          $header.text($header.text()+' ('+pledgeId+')');
      });
                 
})();