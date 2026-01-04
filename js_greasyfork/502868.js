// ==UserScript==
// @name         Filter Image TB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter TB head pictures
// @author       tanguy
// @license      MIT 
// @match        *://*.ea.com/games/ea-sports-college-football/team-builder/team-create/*
// @icon         https://i.imgur.com/9nq6Rpp.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502868/Filter%20Image%20TB.user.js
// @updateURL https://update.greasyfork.org/scripts/502868/Filter%20Image%20TB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let filterEnabled = 0; // Flag to toggle filtering on/off

    // List of image URLs you want to keep
    const skincolor1Blond = [
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0004_P_T0000_D_1_2/1720981074-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0001_P_T0000_D_1_1/1720981071-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0005_P_T0000_D_1_3/1720981075-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0006_P_T0000_D_1_3/1720981076-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0041_P_T0002_H_1_1/1720981106-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0044_P_T0002_H_1_2/1720981109-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0046_P_T0002_H_1_3/1720981110-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0048_P_T0002_H_1_4/1720981112-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0138_P_T0007_M_1_1/1720981188-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0139_P_T0007_M_1_2/1720981189-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0143_P_T0007_M_1_4/1720981192-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0203_P_T0010_H_1_2/1720981243-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0313_P_T0016_H_1_1/1720981336-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0320_P_T0016_H_1_4/1720981342-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0317_P_T0016_H_1_3/1720981340-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0319_P_T0016_H_1_4/1720981341-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0397_P_T0020_T_1_3/1720981407-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0395_P_T0020_T_1_2/1720981406-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0399_P_T0020_T_1_4/1720981409-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0400_P_T0020_T_1_4/1720981410-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0488_P_T0025_D_1_4/1720981484-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0487_P_T0025_D_1_4/1720981483-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0486_P_T0025_D_1_3/1720981483-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0554_P_T0028_H_1_1/1720981541-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0557_P_T0028_H_1_3/1720981543-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0555_P_T0028_H_1_2/1720981541-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0560_P_T0028_H_1_4/1720981546-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0577_P_T0029_D_1_1/1720981561-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0578_P_T0029_D_1_1/1720981561-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0581_P_T0029_D_1_3/1720981564-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0580_P_T0029_D_1_2/1720981563-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0602_P_T0030_T_1_1/1720981582-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0601_P_T0030_T_1_1/1720981581-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0583_P_T0029_D_1_4/1720981566-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0607_P_T0030_T_1_4/1720981586-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0681_P_T0034_D_1_1/1720981649-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0682_P_T0034_D_1_1/1720981649-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0686_P_T0034_D_1_3/1720981653-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0687_P_T0034_D_1_4/1720981654-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0684_P_T0034_D_1_2/1720981651-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0709_P_T0035_H_1_3/1720981672-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0711_P_T0035_H_1_4/1720981674-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0775_P_T0038_M_1_4/1720981728-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0773_P_T0038_M_1_3/1720981727-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0770_P_T0038_M_1_1/1720981724-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0836_P_T0041_D_1_2/1720981780-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0837_P_T0041_D_1_3/1720981781-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0838_P_T0041_D_1_3/1720981782-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0998_P_T0050_D_1_3/1720981918-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1058_P_T0053_T_1_1/1720981969-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1059_P_T0053_T_1_2/1720981970-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1060_P_T0053_T_1_2/1720981971-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1147_P_T0057_M_1_2/1720982046-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1145_P_T0057_M_1_1/1720982044-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1064_P_T0053_T_1_4/1720981975-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1149_P_T0057_M_1_3/1720982047-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1151_P_T0057_M_1_4/1720982049-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1174_P_T0058_H_1_3/1720982068-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1402_P_T0069_D_1_1/1720982262-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1401_P_T0069_D_1_1/1720982261-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1408_P_T0069_D_1_4/1720982267-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1406_P_T0069_D_1_3/1720982265-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1405_P_T0069_D_1_3/1720982264-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1403_P_T0069_D_1_2/1720982262-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1426_P_T0070_T_1_1/1720982282-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1427_P_T0070_T_1_2/1720982283-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1429_P_T0070_T_1_3/1720982284-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1430_P_T0070_T_1_3/1720982285-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1529_P_T0075_H_1_1/1720982369-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1536_P_T0075_H_1_4/1720982374-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1577_P_T0077_M_1_1/1720982409-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1579_P_T0077_M_1_2/1720982411-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1581_P_T0077_M_1_3/1720982412-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1582_P_T0077_M_1_3/1720982413-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1660_P_T0081_H_1_2/1720982478-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1659_P_T0081_H_1_2/1720982478-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1663_P_T0081_H_1_4/1720982481-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1818_P_T0089_D_1_1/1720982612-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1857_P_T0091_D_1_1/1720982646-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1824_P_T0089_D_1_4/1720982618-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1823_P_T0089_D_1_4/1720982617-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1821_P_T0089_D_1_3/1720982615-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1862_P_T0091_D_1_3/1720982650-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1863_P_T0091_D_1_4/1720982650-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1888_P_T0092_T_1_4/1720982671-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1884_P_T0092_T_1_2/1720982668-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1908_P_T0093_T_1_2/1720982687-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1909_P_T0093_T_1_3/1720982688-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1910_P_T0093_T_1_3/1720982689-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1912_P_T0093_T_1_4/1720982691-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1935_P_T0094_D_1_4/1720982710-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1931_P_T0094_D_1_2/1720982707-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1929_P_T0094_D_1_1/1720982705-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1936_P_T0094_D_1_4/1720982711-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1956_P_T0095_D_1_2/1720982728-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1981_P_T0096_M_1_3/1720982748-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1960_P_T0095_D_1_4/1720982731-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1983_P_T0096_M_1_4/1720982750-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1982_P_T0096_M_1_3/1720982749-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2017_P_T0098_M_1_1/1720982779-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2019_P_T0098_M_1_2/1720982780-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2022_P_T0098_M_1_3/1720982783-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2047_P_T0099_D_1_4/1720982803-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2190_P_T0105_M_1_3/1720982922-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2187_P_T0105_M_1_2/1720982920-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2212_P_T0106_T_1_2/1720982940-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2214_P_T0106_T_1_3/1720982942-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2261_P_T0108_D_1_3/1720982981-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2263_P_T0108_D_1_4/1720982983-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2259_P_T0108_D_1_2/1720982979-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2258_P_T0108_D_1_1/1720982978-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2331_P_T0111_H_1_2/1720983040-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2330_P_T0111_H_1_1/1720983039-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2355_P_T0112_H_1_2/1720983060-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2377_P_T0113_M_1_1/1720983078-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2358_P_T0112_H_1_3/1720983063-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2379_P_T0113_M_1_2/1720983080-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2380_P_T0113_M_1_2/1720983081-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2402_P_T0114_M_1_1/1720983099-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2384_P_T0113_M_1_4/1720983084-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2407_P_T0114_M_1_4/1720983103-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2406_P_T0114_M_1_3/1720983103-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2408_P_T0114_M_1_4/1720983104-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2554_P_T0121_T_1_1/1720983226-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2593_P_T0123_D_1_1/1720983259-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2560_P_T0121_T_1_4/1720983231-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2557_P_T0121_T_1_3/1720983229-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2555_P_T0121_T_1_2/1720983227-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2594_P_T0123_D_1_1/1720983259-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2597_P_T0123_D_1_3/1720983262-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2598_P_T0123_D_1_3/1720983263-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2695_P_T0127_H_1_4/1720983343-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2690_P_T0127_H_1_1/1720983339-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2696_P_T0127_H_1_4/1720983344-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2737_P_T0129_T_1_1/1720983378-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2738_P_T0129_T_1_1/1720983379-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2739_P_T0129_T_1_2/1720983379-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2744_P_T0129_T_1_4/1720983384-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2797_P_T0132_D_1_3/1720983428-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2800_P_T0132_D_1_4/1720983431-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3001_P_T0143_H_1_1/1720983596-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3008_P_T0143_H_1_4/1720983602-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3007_P_T0143_H_1_4/1720983601-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3143_P_T0150_D_1_4/1720983716-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3141_P_T0150_D_1_3/1720983714-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3178_P_T0152_D_1_1/1720983746-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3180_P_T0152_D_1_2/1720983747-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3184_P_T0152_D_1_4/1720983751-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3223_P_T0154_H_1_4/1720983783-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3222_P_T0154_H_1_3/1720983782-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3221_P_T0154_H_1_3/1720983782-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3218_P_T0154_H_1_1/1720983779-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3281_P_T0157_T_1_1/1720983832-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3282_P_T0157_T_1_1/1720983833-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3286_P_T0157_T_1_3/1720983836-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3371_P_T0161_M_1_2/1720983920-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3372_P_T0161_M_1_2/1720983921-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3373_P_T0161_M_1_3/1720983922-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3370_P_T0161_M_1_1/1720983918-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3376_P_T0161_M_1_4/1720983925-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3393_P_T0162_D_1_1/1720983944-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3434_P_T0164_H_1_1/1720983989-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3397_P_T0162_D_1_3/1720983948-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3436_P_T0164_H_1_2/1720983991-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3439_P_T0164_H_1_4/1720983994-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3440_P_T0164_H_1_4/1720983995-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3545_P_T0169_T_1_1/1720984107-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3550_P_T0169_T_1_3/1720984112-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3549_P_T0169_T_1_3/1720984111-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3589_P_T0171_M_1_3/1720984153-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3613_P_T0172_H_1_3/1720984178-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3614_P_T0172_H_1_3/1720984179-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3611_P_T0172_H_1_2/1720984176-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3612_P_T0172_H_1_2/1720984177-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3610_P_T0172_H_1_1/1720984175-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3609_P_T0172_H_1_1/1720984174-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3724_P_T0177_M_1_2/1720984294-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3725_P_T0177_M_1_3/1720984295-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3726_P_T0177_M_1_3/1720984296-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3723_P_T0177_M_1_2/1720984293-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3728_P_T0177_M_1_4/1720984298-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3727_P_T0177_M_1_4/1720984297-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3752_P_T0178_D_1_4/1720984323-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3842_P_T0182_H_1_1/1720984417-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3891_P_T0184_D_1_2/1720984467-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3890_P_T0184_D_1_1/1720984466-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3892_P_T0184_D_1_2/1720984468-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3920_P_T0185_T_1_4/1720984497-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3917_P_T0185_T_1_3/1720984494-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3916_P_T0185_T_1_2/1720984493-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3938_P_T0186_M_1_1/1720984515-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3940_P_T0186_M_1_2/1720984517-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3942_P_T0186_M_1_3/1720984520-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3981_P_T0188_H_1_3/1720984560-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3977_P_T0188_H_1_1/1720984556-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4019_P_T0190_T_1_2/1720984599-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4066_P_T0192_D_1_1/1720984647-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4092_P_T0193_H_1_2/1720984674-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4096_P_T0193_H_1_4/1720984678-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4174_P_T0197_H_1_3/1720984758-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4172_P_T0197_H_1_2/1720984756-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4176_P_T0197_H_1_4/1720984760-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4209_P_T0199_T_1_1/1720984794-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4213_P_T0199_T_1_3/1720984798-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4216_P_T0199_T_1_4/1720984802-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4239_P_T0200_T_1_4/1720984825-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4238_P_T0200_T_1_3/1720984824-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4240_P_T0200_T_1_4/1720984826-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4279_P_T0202_H_1_4/1720984866-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4275_P_T0202_H_1_2/1720984862-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4298_P_T0203_T_1_1/1720984886-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4299_P_T0203_T_1_2/1720984887-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4300_P_T0203_T_1_2/1720984888-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4302_P_T0203_T_1_3/1720984890-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4361_P_T0206_H_1_1/1720984950-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4362_P_T0206_H_1_1/1720984951-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4304_P_T0203_T_1_4/1720984892-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4303_P_T0203_T_1_4/1720984891-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4366_P_T0206_H_1_3/1720984955-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4457_P_T0211_H_1_1/1720985045-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4460_P_T0211_H_1_2/1720985048-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4522_P_T0214_M_1_1/1720985108-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4462_P_T0211_H_1_3/1720985050-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4521_P_T0214_M_1_1/1720985107-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4562_P_T0216_T_1_1/1720985147-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4525_P_T0214_M_1_3/1720985111-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4563_P_T0216_T_1_2/1720985148-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4564_P_T0216_T_1_2/1720985149-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4566_P_T0216_T_1_3/1720985151-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4703_P_T0223_H_1_4/1720985281-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4702_P_T0223_H_1_3/1720985280-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4700_P_T0223_H_1_2/1720985278-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4699_P_T0223_H_1_2/1720985277-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4763_P_T0226_H_1_2/1720985337-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4762_P_T0226_H_1_1/1720985336-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4862_P_T0231_T_1_3/1720985430-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4859_P_T0231_T_1_2/1720985427-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4858_P_T0231_T_1_1/1720985426-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4768_P_T0226_H_1_4/1720985342-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4969_P_T0236_T_1_1/1720985531-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4971_P_T0236_T_1_2/1720985532-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4974_P_T0236_T_1_3/1720985535-imagepng-head_image.png"
];

    const skincolor2Blond = [
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0011_P_T0000_D_2_2/1720981080-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0013_P_T0000_D_2_3/1720981082-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0014_P_T0000_D_2_3/1720981083-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0015_P_T0000_D_2_4/1720981084-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0050_P_T0002_H_2_1/1720981114-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0055_P_T0002_H_2_4/1720981118-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0146_P_T0007_M_2_1/1720981195-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0147_P_T0007_M_2_2/1720981196-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0148_P_T0007_M_2_2/1720981197-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0149_P_T0007_M_2_3/1720981197-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0211_P_T0010_H_2_2/1720981250-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0152_P_T0007_M_2_4/1720981200-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0151_P_T0007_M_2_4/1720981199-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0215_P_T0010_H_2_4/1720981253-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0402_P_T0020_T_2_1/1720981411-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0328_P_T0016_H_2_4/1720981349-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0327_P_T0016_H_2_4/1720981348-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0326_P_T0016_H_2_3/1720981347-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0325_P_T0016_H_2_3/1720981346-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0324_P_T0016_H_2_2/1720981345-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0403_P_T0020_T_2_2/1720981412-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0489_P_T0025_D_2_1/1720981485-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0496_P_T0025_D_2_4/1720981491-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0495_P_T0025_D_2_4/1720981490-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0492_P_T0025_D_2_2/1720981488-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0515_P_T0026_H_2_2/1720981507-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0517_P_T0026_H_2_3/1720981509-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0518_P_T0026_H_2_3/1720981510-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0514_P_T0026_H_2_1/1720981506-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0520_P_T0026_H_2_4/1720981511-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0566_P_T0028_H_2_3/1720981551-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0587_P_T0029_D_2_2/1720981569-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0589_P_T0029_D_2_3/1720981571-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0585_P_T0029_D_2_1/1720981567-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0567_P_T0028_H_2_4/1720981552-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0689_P_T0034_D_2_1/1720981655-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0695_P_T0034_D_2_4/1720981660-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0696_P_T0034_D_2_4/1720981661-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0719_P_T0035_H_2_4/1720981681-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_0841_P_T0041_D_2_1/1720981784-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1003_P_T0050_D_2_2/1720981923-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1001_P_T0050_D_2_1/1720981921-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1007_P_T0050_D_2_4/1720981926-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1066_P_T0053_T_2_1/1720981976-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1156_P_T0057_M_2_2/1720982053-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1155_P_T0057_M_2_2/1720982052-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1153_P_T0057_M_2_1/1720982051-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1157_P_T0057_M_2_3/1720982054-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1410_P_T0069_D_2_1/1720982268-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1409_P_T0069_D_2_1/1720982267-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1184_P_T0058_H_2_4/1720982077-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1180_P_T0058_H_2_2/1720982073-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1181_P_T0058_H_2_3/1720982074-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1411_P_T0069_D_2_2/1720982269-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1412_P_T0069_D_2_2/1720982270-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1413_P_T0069_D_2_3/1720982271-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1436_P_T0070_T_2_2/1720982290-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1434_P_T0070_T_2_1/1720982288-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1435_P_T0070_T_2_2/1720982289-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1542_P_T0075_H_2_3/1720982380-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1589_P_T0077_M_2_3/1720982419-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1587_P_T0077_M_2_2/1720982417-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1585_P_T0077_M_2_1/1720982416-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1586_P_T0077_M_2_1/1720982417-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1544_P_T0075_H_2_4/1720982381-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1592_P_T0077_M_2_4/1720982422-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1665_P_T0081_H_2_1/1720982483-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1591_P_T0077_M_2_4/1720982421-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1667_P_T0081_H_2_2/1720982484-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1668_P_T0081_H_2_2/1720982485-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1669_P_T0081_H_2_3/1720982486-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1827_P_T0089_D_2_2/1720982620-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1825_P_T0089_D_2_1/1720982618-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1672_P_T0081_H_2_4/1720982489-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1829_P_T0089_D_2_3/1720982622-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1830_P_T0089_D_2_3/1720982623-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1831_P_T0089_D_2_4/1720982624-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1868_P_T0091_D_2_2/1720982655-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1869_P_T0091_D_2_3/1720982656-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1870_P_T0091_D_2_3/1720982656-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1892_P_T0092_T_2_2/1720982674-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1893_P_T0092_T_2_3/1720982675-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1914_P_T0093_T_2_1/1720982692-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1916_P_T0093_T_2_2/1720982694-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1937_P_T0094_D_2_1/1720982711-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1940_P_T0094_D_2_2/1720982714-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1966_P_T0095_D_2_3/1720982736-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1964_P_T0095_D_2_2/1720982734-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1987_P_T0096_M_2_2/1720982753-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2028_P_T0098_M_2_2/1720982787-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2027_P_T0098_M_2_2/1720982787-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2026_P_T0098_M_2_1/1720982786-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_1990_P_T0096_M_2_3/1720982756-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2030_P_T0098_M_2_3/1720982789-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2050_P_T0099_D_2_1/1720982806-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2055_P_T0099_D_2_4/1720982809-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2053_P_T0099_D_2_3/1720982808-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2195_P_T0105_M_2_2/1720982926-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2199_P_T0105_M_2_4/1720982929-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2218_P_T0106_T_2_1/1720982945-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2220_P_T0106_T_2_2/1720982947-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2265_P_T0108_D_2_1/1720982984-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2267_P_T0108_D_2_2/1720982986-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2269_P_T0108_D_2_3/1720982987-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2340_P_T0111_H_2_2/1720983047-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2272_P_T0108_D_2_4/1720982990-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2344_P_T0111_H_2_4/1720983051-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2386_P_T0113_M_2_1/1720983086-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2387_P_T0113_M_2_2/1720983087-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2368_P_T0112_H_2_4/1720983071-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2390_P_T0113_M_2_3/1720983089-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2562_P_T0121_T_2_1/1720983233-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2561_P_T0121_T_2_1/1720983232-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2415_P_T0114_M_2_4/1720983110-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2414_P_T0114_M_2_3/1720983109-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2413_P_T0114_M_2_3/1720983108-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2412_P_T0114_M_2_2/1720983108-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2563_P_T0121_T_2_2/1720983234-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2564_P_T0121_T_2_2/1720983235-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2566_P_T0121_T_2_3/1720983236-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2567_P_T0121_T_2_4/1720983237-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2601_P_T0123_D_2_1/1720983265-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2698_P_T0127_H_2_1/1720983346-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2702_P_T0127_H_2_3/1720983349-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2750_P_T0129_T_2_3/1720983389-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2803_P_T0132_D_2_2/1720983433-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2752_P_T0129_T_2_4/1720983390-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2807_P_T0132_D_2_4/1720983436-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_2806_P_T0132_D_2_3/1720983436-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3010_P_T0143_H_2_1/1720983604-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3012_P_T0143_H_2_2/1720983605-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3016_P_T0143_H_2_4/1720983609-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3149_P_T0150_D_2_3/1720983721-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3152_P_T0150_D_2_4/1720983724-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3186_P_T0152_D_2_1/1720983752-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3225_P_T0154_H_2_1/1720983785-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3191_P_T0152_D_2_4/1720983756-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3187_P_T0152_D_2_2/1720983753-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3227_P_T0154_H_2_2/1720983787-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3228_P_T0154_H_2_2/1720983788-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3229_P_T0154_H_2_3/1720983789-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3295_P_T0157_T_2_4/1720983844-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3290_P_T0157_T_2_1/1720983840-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3296_P_T0157_T_2_4/1720983845-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3314_P_T0158_H_2_1/1720983861-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3379_P_T0161_M_2_2/1720983928-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3378_P_T0161_M_2_1/1720983927-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3382_P_T0161_M_2_3/1720983932-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3380_P_T0161_M_2_2/1720983929-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3401_P_T0162_D_2_1/1720983952-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3442_P_T0164_H_2_1/1720983998-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3443_P_T0164_H_2_2/1720983999-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3406_P_T0162_D_2_3/1720983958-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3445_P_T0164_H_2_3/1720984001-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3446_P_T0164_H_2_3/1720984002-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3447_P_T0164_H_2_4/1720984003-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3557_P_T0169_T_2_3/1720984120-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3597_P_T0171_M_2_3/1720984162-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3598_P_T0171_M_2_3/1720984163-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3600_P_T0171_M_2_4/1720984165-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3618_P_T0172_H_2_1/1720984184-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3620_P_T0172_H_2_2/1720984186-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3732_P_T0177_M_2_2/1720984303-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3757_P_T0178_D_2_3/1720984328-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3754_P_T0178_D_2_1/1720984325-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3759_P_T0178_D_2_4/1720984331-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3850_P_T0182_H_2_1/1720984425-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3852_P_T0182_H_2_2/1720984427-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3856_P_T0182_H_2_4/1720984431-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3897_P_T0184_D_2_1/1720984473-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3853_P_T0182_H_2_3/1720984428-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3901_P_T0184_D_2_3/1720984477-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3902_P_T0184_D_2_3/1720984478-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3921_P_T0185_T_2_1/1720984498-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3922_P_T0185_T_2_1/1720984499-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3928_P_T0185_T_2_4/1720984505-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3925_P_T0185_T_2_3/1720984502-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3926_P_T0185_T_2_3/1720984503-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3947_P_T0186_M_2_2/1720984525-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3948_P_T0186_M_2_2/1720984526-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3985_P_T0188_H_2_1/1720984564-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3989_P_T0188_H_2_3/1720984568-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_3991_P_T0188_H_2_4/1720984570-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4030_P_T0190_T_2_3/1720984610-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4026_P_T0190_T_2_1/1720984606-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4031_P_T0190_T_2_4/1720984611-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4073_P_T0192_D_2_1/1720984654-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4074_P_T0192_D_2_1/1720984655-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4099_P_T0193_H_2_2/1720984681-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4097_P_T0193_H_2_1/1720984679-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4078_P_T0192_D_2_3/1720984660-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4101_P_T0193_H_2_3/1720984683-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4178_P_T0197_H_2_1/1720984762-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4179_P_T0197_H_2_2/1720984763-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4218_P_T0199_T_2_1/1720984804-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4217_P_T0199_T_2_1/1720984803-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4184_P_T0197_H_2_4/1720984768-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4182_P_T0197_H_2_3/1720984766-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4181_P_T0197_H_2_3/1720984765-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4180_P_T0197_H_2_2/1720984764-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4224_P_T0199_T_2_4/1720984810-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4246_P_T0200_T_2_3/1720984832-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4247_P_T0200_T_2_4/1720984833-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4242_P_T0200_T_2_1/1720984828-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4281_P_T0202_H_2_1/1720984869-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4282_P_T0202_H_2_1/1720984870-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4306_P_T0203_T_2_1/1720984894-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4309_P_T0203_T_2_3/1720984897-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4372_P_T0206_H_2_2/1720984961-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4311_P_T0203_T_2_4/1720984899-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4374_P_T0206_H_2_3/1720984963-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4375_P_T0206_H_2_4/1720984964-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4530_P_T0214_M_2_1/1720985116-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4469_P_T0211_H_2_3/1720985057-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4534_P_T0214_M_2_3/1720985120-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4575_P_T0216_T_2_4/1720985159-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4707_P_T0223_H_2_2/1720985285-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4711_P_T0223_H_2_4/1720985288-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4772_P_T0226_H_2_2/1720985345-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4870_P_T0231_T_2_3/1720985437-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4979_P_T0236_T_2_2/1720985540-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4872_P_T0231_T_2_4/1720985439-imagepng-head_image.png",
  "https://cdn.mcr.ea.com/58/files/tu1_d7bcf014_Generic_4983_P_T0236_T_2_4/1720985544-imagepng-head_image.png"
];
    const desiredImages = skincolor2Blond + skincolor1Blond;

    // Function to hide buttons with undesired images
    function hideUndesiredImages() {
        const buttons = document.querySelectorAll('button.design-btn');

        buttons.forEach(button => {
            const img = button.querySelector('img.style-img');
            if (img) {
                const src = img.src;
                if (!desiredImages.includes(src)) {
                    button.style.display = 'none'; // You can also use button.remove();
                }
            }
        });
    }
    function hideOtherImages() {
                const buttons = document.querySelectorAll('button.design-btn');

        buttons.forEach(button => {
            const img = button.querySelector('img.style-img');
            if (img) {
                const src = img.src;
                if (desiredImages.includes(src)) {
                    button.style.display = 'none'; // You can also use button.remove();
                }
            }
        });
    }

    // Function to toggle image filtering on/off
    function toggleFilter() {
        filterEnabled +=1; // Toggle the flag
        if (filterEnabled >=3){
            filterEnabled =0;
            // Show all buttons if filter is disabled
            const buttons = document.querySelectorAll('button.design-btn');
            buttons.forEach(button => {
                button.style.display = ''; // Reset display property
            });

        }
        else if (filterEnabled == 2){
            const buttons = document.querySelectorAll('button.design-btn');
            buttons.forEach(button => {
                button.style.display = ''; // Reset display property
            })
            hideOtherImages();

        }
        else if (filterEnabled == 1) {
            hideUndesiredImages(); // Apply filter if enabled
        } else {
            // Show all buttons if filter is disabled
            const buttons = document.querySelectorAll('button.design-btn');
            buttons.forEach(button => {
                button.style.display = ''; // Reset display property
            });
        }
    }

    // Function to add toggle button
    function addToggleButton() {
        const skinToneSection = document.querySelector('.filterGroup--colors');
        if (skinToneSection) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.textAlign = 'center';

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Toggle Filter';
            toggleButton.style.padding = '10px';
            toggleButton.style.background = '#007bff';
            toggleButton.style.color = 'white';
            toggleButton.style.border = 'none';
            toggleButton.style.cursor = 'pointer';

            toggleButton.addEventListener('click', toggleFilter);

            buttonContainer.appendChild(toggleButton);
            skinToneSection.parentNode.insertBefore(buttonContainer, skinToneSection.nextSibling);
        }
    }

    // Ensure the function is called when the DOM is fully loaded
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    waitForElement('.filterGroup--colors', (element) => {
        addToggleButton();
        if (filterEnabled) {
            hideUndesiredImages();
        }
    });
})();
