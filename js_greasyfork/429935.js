// ==UserScript==
// @name         NGA 绽蓝档案表情包
// @version      0.0.0.3
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将绽蓝档案的表情包加入NGA表情选择列表
// @author       ikarosf
// @include      https://bbs.nga.cn/*
// @include      https://ngabbs.com/*
// @include      https://nga.178.com/*
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @downloadURL https://update.greasyfork.org/scripts/429935/NGA%20%E7%BB%BD%E8%93%9D%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/429935/NGA%20%E7%BB%BD%E8%93%9D%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==



(function(){

    if(unsafeWindow.postfunc === undefined){
        return;
    }

    var zlda_line_object ={_______name: "绽蓝档案LINE",
                           "zlda_line_1" : "./mon_202107/27/7nQ2o-6ll5K1jToS8s-98.png",
                           "zlda_line_2" : "./mon_202107/27/7nQ2o-296vZaT1kSam-9q.png",
                           "zlda_line_3" : "./mon_202107/27/7nQ2o-k2lbZgT3cSbi-9q.png",
                           "zlda_line_4" : "./mon_202107/27/7nQ2o-d2jhZgT3cSa6-9q.png",
                           "zlda_line_5" : "./mon_202107/27/7nQ2o-4jlmZeT1kSaw-9q.png",
                           "zlda_line_6" : "./mon_202107/27/7nQ2o-fvckZfT1kSb2-9q.png",
                           "zlda_line_7" : "./mon_202107/27/7nQ2o-6s9yZgT3cSai-9q.png",
                           "zlda_line_8" : "./mon_202107/27/7nQ2o-17uhZhT3cSas-9q.png",
                           "zlda_line_9" : "./mon_202107/27/7nQ2o-dikxZfT3cSbc-9q.png",
                           "zlda_line_10" : "./mon_202107/27/7nQ2o-4tr1ZhT3cSbo-9q.png",
                           "zlda_line_11" : "./mon_202107/27/7nQ2o-hfo4ZfT3cSas-9q.png",
                           "zlda_line_12" : "./mon_202107/27/7nQ2o-8cucZeT1kSae-9q.png",
                           "zlda_line_13" : "./mon_202107/27/7nQ2o-9shgZgT3cSbe-9q.png",
                           "zlda_line_14" : "./mon_202107/27/7nQ2o-ljgZdT1kSbe-9q.png",
                           "zlda_line_15" : "./mon_202107/27/7nQ2o-cwl7ZgT3cSbo-9q.png",
                           "zlda_line_16" : "./mon_202107/27/7nQ2o-bocpZiT3cSb0-9q.png",
                           "zlda_line_17" : "./mon_202107/27/7nQ2o-1o02ZaT1kS9g-9q.png",
                           "zlda_line_18" : "./mon_202107/27/7nQ2o-ddsnZdT1kSa4-9q.png",
                           "zlda_line_19" : "./mon_202107/27/7nQ2o-2bmrZaT1kSak-9q.png",
                           "zlda_line_20" : "./mon_202107/27/7nQ2o-dv2mZbT1kSay-9q.png",
                           "zlda_line_21" : "./mon_202107/27/7nQ2o-2cimZaT1kS98-9q.png",
                           "zlda_line_22" : "./mon_202107/27/7nQ2o-fbzpZdT1kSb8-9q.png",
                           "zlda_line_23" : "./mon_202107/27/7nQ2o-6dmlZeT1kS9y-9q.png",
                           "zlda_line_24" : "./mon_202107/27/7nQ2o-kyj2ZjT3cSbo-9q.png",
                           "zlda_line_25" : "./mon_202107/27/7nQ2o-e7gyK22T1kS8a-9q.png",
                           "zlda_line_26" : "./mon_202107/27/7nQ2o-4mkmZbT1kS9y-9q.png",
                           "zlda_line_27" : "./mon_202107/27/7nQ2o-hk36ZbT1kSag-9q.png",
                           "zlda_line_28" : "./mon_202107/27/7nQ2o-8qcpZeT1kSbm-9q.png",
                           "zlda_line_29" : "./mon_202107/27/7nQ2o-cthZcT1kS9w-9q.png",
                           "zlda_line_30" : "./mon_202107/27/7nQ2o-c4vuZjT3cSbo-9q.png",
                           "zlda_line_31" : "./mon_202107/27/7nQ2o-3epyZdT1kSau-9q.png",
                           "zlda_line_32" : "./mon_202107/27/7nQ2o-g0ogZgT3cSbo-9q.png",
                           "zlda_line_33" : "./mon_202107/27/7nQ2o-71idZeT1kSbk-9q.png",
                           "zlda_line_34" : "./mon_202107/27/7nQ2o-4fydZbT1kSao-9q.png",
                           "zlda_line_35" : "./mon_202107/27/7nQ2o-fz63ZbT1kS8q-9q.png",
                           "zlda_line_36" : "./mon_202107/27/7nQ2o-66qyZdT1kSae-9q.png",
                           "zlda_line_37" : "./mon_202107/27/7nQ2o-i0m1ZdT1kSb8-9q.png",
                           "zlda_line_38" : "./mon_202107/27/7nQ2o-89vqZcT1kS9g-9q.png",
                           "zlda_line_39" : "./mon_202107/27/7nQ2o-ktkkZfT1kSac-9q.png",
                           "zlda_line_40" : "./mon_202107/27/7nQ2o-cnzzZeT1kSb0-9q.png"
                          }

    var zlda_discord1_object ={_______name: "绽蓝档案DISCORD1",
                               "zlda_discord_1" : "./mon_202109/10/7nQ177-c5x3KuToS3k-3k.png",
                               "zlda_discord_2" : "./mon_202109/10/7nQ177-1cq2KvToS3k-3k.png",
                               "zlda_discord_3" : "./mon_202109/10/7nQ177-hgbKrToS3k-3k.png",
                               "zlda_discord_4" : "./mon_202109/10/7nQ177-au3pKyToS3k-3k.png",
                               "zlda_discord_5" : "./mon_202109/10/7nQ177-kiplKiToS3k-3k.png",
                               "zlda_discord_6" : "./mon_202109/10/7nQ177-erctKyToS3k-3k.png",
                               "zlda_discord_7" : "./mon_202109/10/7nQ177-1cg6KsToS3k-3k.png",
                               "zlda_discord_8" : "./mon_202109/10/7nQ177-blchKrToS3k-3k.png",
                               "zlda_discord_9" : "./mon_202109/10/7nQ177-16upKvToS3k-3k.png",
                               "zlda_discord_10" : "./mon_202109/10/7nQ177-e0q5KuToS3k-3k.png",
                               "zlda_discord_11" : "./mon_202109/10/7nQ177-2i4xKxToS3k-3k.png",
                               "zlda_discord_12" : "./mon_202109/10/7nQ177-apsuKuToS3k-3k.png",
                               "zlda_discord_13" : "./mon_202109/10/7nQ177-9h4lKxToS3k-3k.png",
                               "zlda_discord_14" : "./mon_202109/10/7nQ177-kyrzKzToS3k-3k.png",
                               "zlda_discord_15" : "./mon_202109/10/7nQ177-drigKrToS3k-3k.png",
                               "zlda_discord_16" : "./mon_202109/10/7nQ177-z55KrToS3k-3k.png",
                               "zlda_discord_17" : "./mon_202109/10/7nQ177-ao2lKtToS3k-3k.png",
                               "zlda_discord_18" : "./mon_202109/10/7nQ177-l4nrKfT8S3k-3j.png",
                               "zlda_discord_19" : "./mon_202109/10/7nQ177-9o4vKqToS3k-3k.png",
                               "zlda_discord_20" : "./mon_202109/10/7nQ177-hvpKyToS3k-3k.png",
                               "zlda_discord_21" : "./mon_202109/10/7nQ177-3sexKvToS3k-3k.png",
                               "zlda_discord_22" : "./mon_202109/10/7nQ177-dln3KvToS3k-3k.png",
                               "zlda_discord_23" : "./mon_202109/10/7nQ177-kisK10ToS3k-3k.png",
                               "zlda_discord_24" : "./mon_202109/10/7nQ177-ad7cKnToS3k-3k.png",
                               "zlda_discord_25" : "./mon_202109/10/7nQ177-e5w7KqToS3k-3k.png",
                               "zlda_discord_26" : "./mon_202109/10/7nQ177-2ulhKxToS3k-3k.png",
                               "zlda_discord_27" : "./mon_202109/10/7nQ177-bsb9KvToS3k-3k.png",
                               "zlda_discord_28" : "./mon_202109/10/7nQ177-27pgKtToS3k-3k.png",
                               "zlda_discord_29" : "./mon_202109/10/7nQ177-dkrsKlToS3h-3h.png",
                               "zlda_discord_30" : "./mon_202109/10/7nQ177-4fkoKeT8S2m-2m.png",
                               "zlda_discord_31" : "./mon_202109/10/7nQ177-f5vfKtToS3k-3k.png",
                               "zlda_discord_32" : "./mon_202109/10/7nQ177-66y5KrToS3k-3k.png",
                               "zlda_discord_33" : "./mon_202109/10/7nQ177-ijj4KeT8S2c-2c.png",
                               "zlda_discord_34" : "./mon_202109/10/7nQ177-dzk3KlToS3k-3k.png",
                               "zlda_discord_35" : "./mon_202109/10/7nQ177-4i45KxToS3k-3k.png",
                               "zlda_discord_36" : "./mon_202109/10/7nQ177-fytqK10ToS3k-3k.png",
                               "zlda_discord_37" : "./mon_202109/10/7nQ177-djbzKtToS3k-3k.png",
                               "zlda_discord_38" : "./mon_202109/10/7nQ177-4aawKsToS3k-3k.png",
                               "zlda_discord_39" : "./mon_202109/10/7nQ177-5pm6KtToS3k-3k.png",
                               "zlda_discord_40" : "./mon_202109/10/7nQ177-hs2xKjToS3k-3k.png",
                               "zlda_discord_41" : "./mon_202109/10/7nQ177-bc0bKvToS3k-3k.png",
                               "zlda_discord_42" : "./mon_202109/10/7nQ177-2gpcKuToS3k-3k.png",
                               "zlda_discord_43" : "./mon_202109/10/7nQ177-bd6uKuToS3k-3k.png",
                               "zlda_discord_44" : "./mon_202109/10/7nQ177-kcluKsToS3k-3k.png",
                               "zlda_discord_45" : "./mon_202109/10/7nQ177-8gymKuToS3k-3k.png",
                               "zlda_discord_46" : "./mon_202109/10/7nQ177-h529KtToS3k-3k.png",
                               "zlda_discord_47" : "./mon_202109/10/7nQ177-47ewKvToS3k-3j.png",
                               "zlda_discord_48" : "./mon_202109/10/7nQ177-dvm1KrToS3k-3k.png",
                               "zlda_discord_49" : "./mon_202109/10/7nQ177-chyaKvToS3k-3k.png",
                               "zlda_discord_50" : "./mon_202109/10/7nQ177-2bxqK10ToS3k-3k.png",
                               "zlda_discord_51" : "./mon_202109/10/7nQ177-cbn2KwToS3k-3k.png",
                               "zlda_discord_52" : "./mon_202109/10/7nQ177-zysKzToS3k-3k.png",
                               "zlda_discord_53" : "./mon_202109/10/7nQ177-bb15K10ToS3k-3k.png",
                               "zlda_discord_54" : "./mon_202109/10/7nQ177-127K10ToS3k-3k.png",
                               "zlda_discord_55" : "./mon_202109/10/7nQ177-95oiK8T8S2t-2t.png",
                               "zlda_discord_56" : "./mon_202109/10/7nQ177-itk2KrToS3k-3k.png",
                               "zlda_discord_57" : "./mon_202109/10/7nQ177-65oiKxToS3k-3k.png",
                               "zlda_discord_58" : "./mon_202109/10/7nQ177-fjerKrToS3k-3k.png",
                               "zlda_discord_59" : "./mon_202109/10/7nQ177-3547KfT8S2v-2w.png",
                               "zlda_discord_60" : "./mon_202109/10/7nQ177-661eKxToS3k-3k.png",
                              }

    var zlda_discord2_object ={_______name: "绽蓝档案DISCORD2",
                               "zlda_discord_61" : "./mon_202109/10/7nQ177-iuyiK10ToS3k-3k.png",
                               "zlda_discord_62" : "./mon_202109/10/7nQ177-984sKrToS3k-3k.png",
                               "zlda_discord_63" : "./mon_202109/10/7nQ177-1i3tKrToS3k-3k.png",
                               "zlda_discord_64" : "./mon_202109/10/7nQ177-di54KuToS3k-3k.png",
                               "zlda_discord_65" : "./mon_202109/10/7nQ177-80dlKxToS3k-3k.png",
                               "zlda_discord_66" : "./mon_202109/10/7nQ177-kl75K10ToS3k-3k.png",
                               "zlda_discord_67" : "./mon_202109/10/7nQ177-jrz8KtToS3k-3k.png",
                               "zlda_discord_68" : "./mon_202109/10/7nQ177-29umKrToS3k-3k.png",
                               "zlda_discord_69" : "./mon_202109/10/7nQ177-fzq4KwToS3k-3k.png",
                               "zlda_discord_70" : "./mon_202109/10/7nQ177-8aa6KrToS3h-3h.png",
                               "zlda_discord_71" : "./mon_202109/10/7nQ177-2hmeKuToS3k-3k.png",
                               "zlda_discord_72" : "./mon_202109/10/7nQ177-fysyKvToS3k-3k.png",
                               "zlda_discord_73" : "./mon_202109/10/7nQ177-5cx7KoToS3h-3h.png",
                               "zlda_discord_74" : "./mon_202109/10/7nQ177-8aktKyToS3k-3k.png",
                               "zlda_discord_75" : "./mon_202109/10/7nQ177-32j6KyToS3k-3k.png",
                               "zlda_discord_76" : "./mon_202109/10/7nQ177-ccvxKwToS3k-3k.png",
                               "zlda_discord_77" : "./mon_202109/10/7nQ177-24d4KqToS3k-3k.png",
                               "zlda_discord_78" : "./mon_202109/10/7nQ177-dttnKuToS3k-3k.png",
                               "zlda_discord_79" : "./mon_202109/10/7nQ177-43eyKxToS3k-3k.png",
                               "zlda_discord_80" : "./mon_202109/10/7nQ177-et7hKsToS3k-3k.png",
                               "zlda_discord_81" : "./mon_202109/10/7nQ177-4u8aKuToS3k-3k.png",
                               "zlda_discord_82" : "./mon_202109/10/7nQ177-1i2jKqToS3k-3k.png",
                               "zlda_discord_83" : "./mon_202109/10/7nQ177-bq28KrToS3k-3k.png",
                               "zlda_discord_84" : "./mon_202109/10/7nQ177-kottKqToS3k-3k.png",
                               "zlda_discord_85" : "./mon_202109/10/7nQ177-htqkKuToS3k-3k.png",
                               "zlda_discord_86" : "./mon_202109/10/7nQ177-5xs3KwToS3k-3k.png",
                               "zlda_discord_87" : "./mon_202109/10/7nQ177-etpxKwToS3k-3k.png",
                               "zlda_discord_88" : "./mon_202109/10/7nQ177-2hbyKnToS3c-3k.png",
                               "zlda_discord_89" : "./mon_202109/10/7nQ177-baj7KwToS3k-3k.png",
                               "zlda_discord_90" : "./mon_202109/10/7nQ177-jqtrKtToS3k-3k.png",
                               "zlda_discord_91" : "./mon_202109/10/7nQ177-8sx1KxToS3k-3k.png",
                               "zlda_discord_92" : "./mon_202109/10/7nQ177-ix8tKxToS3k-3k.png",
                               "zlda_discord_93" : "./mon_202109/10/7nQ177-fas3KsToS3k-3k.png",
                               "zlda_discord_94" : "./mon_202109/10/7nQ177-2rn9KyToS3k-3k.png",
                               "zlda_discord_95" : "./mon_202109/10/7nQ177-btvtKuToS3k-3k.png",
                               "zlda_discord_96" : "./mon_202109/10/7nQ177-k4dcKqToS3k-3k.png",
                               "zlda_discord_97" : "./mon_202109/10/7nQ177-delzKrToS3k-3k.png",
                               "zlda_discord_98" : "./mon_202109/10/7nQ177-8hmbKnToS3k-3k.png",
                               "zlda_discord_99" : "./mon_202109/10/7nQ177-k91tKvToS3k-3k.png",
                               "zlda_discord_100" : "./mon_202109/10/7nQ177-hgocKqToS3k-3k.png",
                               "zlda_discord_101" : "./mon_202109/10/7nQ177-auzzKvToS3k-3k.png",
                               "zlda_discord_102" : "./mon_202109/10/7nQ177-6w77KuToS3k-3k.png",
                               "zlda_discord_103" : "./mon_202109/10/7nQ177-7m21KvToS3k-3k.png",
                               "zlda_discord_104" : "./mon_202109/10/7nQ177-hlujKuToS3k-3k.png",
                               "zlda_discord_105" : "./mon_202109/10/7nQ177-76fkKnToS3k-3k.png",
                               "zlda_discord_106" : "./mon_202109/10/7nQ177-lc9yKvToS3k-3k.png",
                               "zlda_discord_107" : "./mon_202109/10/7nQ177-duvgKvToS3k-3k.png",
                               "zlda_discord_108" : "./mon_202109/10/7nQ177-55kiK11ToS3k-3k.png",
                               "zlda_discord_109" : "./mon_202109/10/7nQ177-h8l7KuToS3k-3k.png",
                               "zlda_discord_110" : "./mon_202109/10/7nQ177-907nKxToS3k-3k.png",
                               "zlda_discord_111" : "./mon_202109/10/7nQ177-2qkvKpToS3k-3k.png",
                               "zlda_discord_112" : "./mon_202109/10/7nQ177-jukhKyToS3k-3k.png",
                               "zlda_discord_113" : "./mon_202109/10/7nQ177-e9ecKjToS3k-3k.png",
                               "zlda_discord_114" : "./mon_202109/10/7nQ177-ay9fKvToS3k-3k.png",
                               "zlda_discord_115" : "./mon_202109/10/7nQ177-5ybwKkToS3k-3k.png",
                               "zlda_discord_116" : "./mon_202109/10/7nQ177-5ol2KuToS3k-3k.png",
                               "zlda_discord_117" : "./mon_202109/10/7nQ177-4aomKrToS3k-3k.png",
                               "zlda_discord_118" : "./mon_202109/10/7nQ177-hjdeKuToS3k-3k.png",
                               "zlda_discord_119" : "./mon_202109/10/7nQ177-a5n4KuToS3k-3k.png",
                               "zlda_discord_120" : "./mon_202109/10/7nQ177-l02lK13ToS3k-3k.png",
                              }

    var zlda_discord3_object ={_______name: "绽蓝档案DISCORD3",
                               "zlda_discord_121" : "./mon_202109/10/7nQ177-jtvnKnToS3k-3k.png",
                               "zlda_discord_122" : "./mon_202109/10/7nQ177-cu24K11ToS3k-3k.png",
                               "zlda_discord_123" : "./mon_202109/10/7nQ177-ea0wKvToS3k-3k.png",
                               "zlda_discord_124" : "./mon_202109/10/7nQ177-31q7KsToS3k-3k.png",
                               "zlda_discord_125" : "./mon_202109/10/7nQ177-9eblKyToS3k-3k.png",
                               "zlda_discord_126" : "./mon_202109/10/7nQ177-er7nKxToS3k-3k.png",
                               "zlda_discord_127" : "./mon_202109/10/7nQ177-i5zcKuToS3k-3k.png",
                               "zlda_discord_128" : "./mon_202109/10/7nQ177-g961KqToS3k-3k.png",
                               "zlda_discord_129" : "./mon_202109/10/7nQ177-d2x1KxToS3k-3k.png",
                               "zlda_discord_130" : "./mon_202109/10/7nQ177-9cu6KtToS3k-3k.png",
                               "zlda_discord_131" : "./mon_202109/10/7nQ177-by2aKsToS3k-3k.png",
                               "zlda_discord_132" : "./mon_202109/10/7nQ177-72pwKiToS2r-2r.png",
                               "zlda_discord_133" : "./mon_202109/10/7nQ177-hdumKjToS3k-3k.png",
                               "zlda_discord_134" : "./mon_202109/10/7nQ177-b47eKrToS3k-3k.png",
                               "zlda_discord_135" : "./mon_202109/10/7nQ177-920KuToS3k-3k.png",
                               "zlda_discord_136" : "./mon_202109/10/7nQ177-ah0pKsToS3k-3k.png",
                               "zlda_discord_137" : "./mon_202109/10/7nQ177-4mphKvToS3k-3k.png",
                               "zlda_discord_138" : "./mon_202109/10/7nQ177-fvdiKsToS3k-3k.png",
                               "zlda_discord_139" : "./mon_202109/10/7nQ177-40rfKtToS3k-3k.png",
                               "zlda_discord_140" : "./mon_202109/10/7nQ177-1l8lKoToS3k-3k.png",
                               "zlda_discord_141" : "./mon_202109/10/7nQ177-5fcuKwToS3k-3k.png",
                               "zlda_discord_142" : "./mon_202109/10/7nQ177-f70iKhToS3k-3k.png",
                               "zlda_discord_143" : "./mon_202109/10/7nQ177-68pzK1cToS3k-3k.png",
                               "zlda_discord_144" : "./mon_202109/10/7nQ177-q5bKuToS3k-3k.png",
                               "zlda_discord_145" : "./mon_202109/10/7nQ177-a4naKyToS3k-3k.png",
                               "zlda_discord_146" : "./mon_202109/10/7nQ177-3273KuToS3k-3k.png",
                               "zlda_discord_147" : "./mon_202109/10/7nQ177-dvhgKjToS3h-3h.png",
                               "zlda_discord_148" : "./mon_202109/10/7nQ177-3l7pKtToS3k-3k.png",
                               "zlda_discord_149" : "./mon_202109/10/7nQ177-dbfnKsToS3k-3k.png",
                               "zlda_discord_150" : "./mon_202109/10/7nQ177-2uqjKzToS3k-3k.png",
                               "zlda_discord_151" : "./mon_202109/10/7nQ177-gg99K10ToS3k-3k.png",
                               "zlda_discord_152" : "./mon_202109/10/7nQ177-kse6KrToS3k-3k.png",
                               "zlda_discord_153" : "./mon_202109/10/7nQ177-h3v2KmToS3k-3k.png",
                               "zlda_discord_154" : "./mon_202109/10/7nQ177-gevbKyToS3k-3k.png",
                               "zlda_discord_155" : "./mon_202109/10/7nQ177-5h6uKyToS3k-3k.png",
                               "zlda_discord_156" : "./mon_202109/10/7nQ177-fln8KuToS3k-3k.png",
                               "zlda_discord_157" : "./mon_202109/10/7nQ177-6lnsKoToS3k-3k.png",
                               "zlda_discord_158" : "./mon_202109/10/7nQ177-13qrKrToS3k-3k.png",
                               "zlda_discord_159" : "./mon_202109/10/7nQ177-bm4lKpToS3k-3k.png",
                               "zlda_discord_160" : "./mon_202109/10/7nQ177-8i7kKyToS3k-3k.png",
                               "zlda_discord_161" : "./mon_202109/10/7nQ177-j4o2KtToS3k-3k.png",
                               "zlda_discord_162" : "./mon_202109/10/7nQ177-b550KqToS3k-3k.png",
                               "zlda_discord_163" : "./mon_202109/10/7nQ177-1v12KxToS3k-3k.png",
                               "zlda_discord_164" : "./mon_202109/10/7nQ177-h5y1KrToS3k-3k.png",
                               "zlda_discord_165" : "./mon_202109/10/7nQ177-brskKyToS3k-3k.png",
                               "zlda_discord_166" : "./mon_202109/10/7nQ177-6wvgKsToS3k-3k.png",
                               "zlda_discord_167" : "./mon_202109/10/7nQ177-hzaiKwToS3k-3k.png",
                               "zlda_discord_168" : "./mon_202109/10/7nQ177-kqw1KlToS2q-2s.png",
                               "zlda_discord_169" : "./mon_202109/10/7nQ177-fxedKuToS3k-3k.png",
                               "zlda_discord_170" : "./mon_202109/10/7nQ177-4kqdKkToS3k-3k.png",
                               "zlda_discord_171" : "./mon_202109/10/7nQ177-h09jKxToS3k-3k.png",
                               "zlda_discord_172" : "./mon_202109/10/7nQ177-5sa3K13ToS3k-3k.png",
                               "zlda_discord_173" : "./mon_202109/10/7nQ177-w1lKuToS3k-3k.png",
                               "zlda_discord_174" : "./mon_202109/10/7nQ177-cd4mKtToS3k-3k.png",
                               "zlda_discord_175" : "./mon_202109/10/7nQ177-38f4KxToS3k-3k.png",
                               "zlda_discord_176" : "./mon_202109/10/7nQ177-en4wKsToS3k-3k.png",
                               "zlda_discord_177" : "./mon_202109/10/7nQ177-a1poKwToS3k-3k.png",
                               "zlda_discord_178" : "./mon_202109/10/7nQ177-cdawK10ToS3k-3k.png",
                               "zlda_discord_179" : "./mon_202109/10/7nQ177-2m3mKsToS3k-3k.png",
                               "zlda_discord_180" : "./mon_202109/10/7nQ177-eon9KwToS3k-3k.png",
                               "zlda_discord_181" : "./mon_202109/10/7nQ177-67n7KyToS3k-3k.png",

                              }
    unsafeWindow.postfunc.selectSmiles = function(e) {
        if (this.selectSmilesw){
            return this.selectSmilesw._.show(e, null, 2)
        }
        this.selectSmilesw = commonui.createCommmonWindow()
        this.selectSmilesw._.addContent(null)
        this.selectSmilesw._.addTitle('插入表情')
        this.selectSmilesw.style.maxWidth = '88em'
        ubbcode.smiles.zlda_line_object = zlda_line_object
        ubbcode.smiles.zlda_discord1_object = zlda_discord1_object
        ubbcode.smiles.zlda_discord2_object = zlda_discord2_object
        ubbcode.smiles.zlda_discord3_object = zlda_discord3_object
        var ydiv = _$('/div', 'style', 'margin-bottom:1em')
        , zdiv = _$('/span')
        , smilesobject = ubbcode.smiles
        ydiv._.add(_$('/span', 'style', 'float:right;color:' + __COLOR.border4))
        for (var thissmileindex in smilesobject) {
            if (smilesobject[thissmileindex]._______name) {
                zdiv._.add(_$('/div', '_name', thissmileindex))
                ydiv._.add(_$('/button', 'class', 'block_txt_big', 'innerHTML', smilesobject[thissmileindex]._______name, '_name', thissmileindex, 'onclick', function() {
                    var thissmile = ubbcode.smiles[this._name]
                    , g_imgpath = __IMGPATH
                    , tabnodes = this.parentNode.nextSibling.childNodes

                    for (var i = 0; i < tabnodes.length; i++) {
                        if (tabnodes[i]._name == this._name) {
                            tabnodes[i].style.display = ''
                            var x = tabnodes[i]
                            } else
                                tabnodes[i].style.display = 'none'
                    }

                    this.parentNode.firstChild.innerHTML = (this._name == 'ac' || this._name == 'a2') ? '&copy;AcFun 授权使用' : ''
                    console.log("ikarosf smiles debug")
                    if (!x.firstChild) // 判断分栏div是否已经生成
                        if(thissmile._______name.startsWith("绽蓝档案")){
                            for (var j in thissmile) {
                                if (j.charAt(0) != '_')
                                    x._.add(_$('/img', 'src', 'http://img.nga.178.com/attachments/' + thissmile[j], '_px', this._name == 0 ? '' : this._name, '_name', j,'style','max-height:100px;', 'onclick', function() {
                                        postfunc.selectSmilesw._.hide();
                                        postfunc.addText('[img]'+ this.src +'[/img]')
                                    }), ' ')
                            }
                        }
                        else if (thissmile.____display) {
                            var ydiv = thissmile.____display.split('\t')
                            for (var j = 0; j < ydiv.length; j += 2) {
                                x._.add(_$('/img', 'src', g_imgpath + '/post/smile/' + ubbcode.smiles[ydiv[j + 1]][ydiv[j]], 'name', ydiv[j], '_group', ydiv[j + 1], 'onclick', function() {
                                    postfunc.selectSmilesw._.hide();
                                    postfunc.addText("[s:" + this._group + ':' + this._name + "]")
                                }), ' ')
                            }
                        } else {
                            for (var j in thissmile) {
                                if (j.charAt(0) != '_')
                                    x._.add(_$('/img', 'src', g_imgpath + '/post/smile/' + thissmile[j], '_px', this._name == 0 ? '' : this._name, '_name', j, 'onclick', function() {
                                        postfunc.selectSmilesw._.hide();
                                        postfunc.addText("[s:" + this._px + ':' + this._name + "]")
                                    }), ' ')
                            }
                        }
                }))

            }
        }
        this.selectSmilesw._.addContent(ydiv, zdiv)
        this.selectSmilesw._.show(e, null, 2)
    }

})();