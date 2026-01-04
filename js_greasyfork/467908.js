// ==UserScript==
// @name         Pardus Sector Data
// @namespace    fear.math@gmail.com
// @version      1.0.2
// @description  Sector data from https://terpai.web.elte.hu/static_ext.txt
// @author       Tamás Terpai, with slight modifications by Dylan Day
// ==/UserScript==

var sectorData = `
sector Phiagre:21,13
bbbbbbbeeeeeebbeebbbb
bbbbbeeeffffeeeeeeebb
bbbbeeffffffffffffebb
bbbbefffffffffffffeeb
bbbbeffffffffffeeefee
eebeefgggfffffeebeeee
eeeeffgggfffffebbbbbb
eebeffgggfeeefeebbbbb
bbbefofffeebeefeeebbb
bbbeoooffebbbeeffebbb
bbbeeffeeebbbbeeeebee
bbbbeeeebbbbbbbbeeeee
bbbbbbbbbbbbbbbbeebee
wh Miphimi 19 4 0/0 226/19 167/14
wh Pass_FED-04 0 6 226/19 0/0 244/19
wh Olcanze 19 11 167/14 244/19 0/0
beacon Phiagre 10 3

sector Miphimi:22,18
bbbbbbbbbeeeeeeebbbbbb
bbbeeebeeefffffeeebbbb
bbeefeeefffffffffeeebb
bbefgggggggffffffffebb
eeefgggggggffffffffeeb
eeefgggggggfffffffffeb
bbeffggggffggfffffffeb
bbeegggffffggfffffffee
bbbeggggeeeffeeefffffe
bbeeggggebeeeebeeffffe
bbefggggebbeebbbefffee
bbeegggeebbeebbeefffeb
bbbeefeebbeeebbeooofeb
bbbbeeebbbeeebeefoooeb
bbbbbeebbbeebbeffooeeb
bbbbbbbbbbbbbeefffeebb
bbbbbbbbbbbbbeeeeeebbb
bbbbbbbbbbbbbbbeebbbbb
wh Phiagre 0 5 0/0 247/21 241/15
wh WO_3-290 21 9 247/21 0/0 193/13
wh Olcanze 10 14 241/15 193/13 0/0
beacon Miphimi 15 4

sector Olcanze:20,20
eeebbbbbbbbbeeebbbbb
efeebbbbbbbeefeeebbb
eeeeebbbbbeeffffeebb
bbefebbbbbeffffffebb
eeefebbbbbeooofffebb
efffebbbeeeffffffebb
efeeebbeeffffffffebb
eeebbbbegggggffffeeb
eebbbbeeggggggffffeb
eebbbbefgggggggfffee
eeebbbeegggggggfffee
eeebbbbegggggggfeeeb
beebbbbeeffgggfeebbb
beebbbbbeeefffeebbbb
beebbbbbbbeeeeebbbbb
eeebbbbbbbbeebbbbbbb
efeebbbbbbeeeebbbbbb
eefeeeeeeeefeebbbbbb
beeebbbbbbeeebbbbbbb
beebbbbbbbbbbbbbbbbb
wh Phiagre 0 0 0/0 579/39
wh Miphimi 13 0 579/39 0/0

sector WO_3-290:17,11
bbbbbbbbbeebbbbbb
bbbbbbbeeeeeeeebb
bbbbbeeeffffffeeb
bbbbeeeefffffffee
bbeeefeefffffffee
eeefffffeefoofeeb
efffffffeeooooebb
eefeeefffffoofeeb
beeebeeeffffffeeb
bbbbbbbeefeeeeebb
bbbbbbbbeeebbbbbb
wh Miphimi 0 5 0/0 168/15 109/10
wh Daaya 15 8 168/15 0/0 87/6
wh Hocancan 9 10 109/10 87/6 0/0

sector Hocancan:17,19
beeebbbbbbbbbbbbb
eefeebbbbbbbeeeeb
egggeebeeebeeffeb
eggggebeeebeoooee
eggggeeeebbefoffe
eggggfffeeeegggfe
eggggffffggggggfe
eefffffffggggggee
befffffffggggggeb
eefffffffggggggeb
efffggggfggggfeeb
eegggggggfffeeebb
begggggggffeebbbb
begggggggeeebbbbb
beeggggffebbbbbbb
bbeeffeeeebbbbbbb
bbbeeeebeebbbbbbb
bbbbbbbbeebbbbbbb
bbbbbbbbeebbbbbbb
wh WO_3-290 8 2 0/0 219/16
wh Laedgre 9 18 219/16 0/0
beacon Hocancan 4 8

sector Laedgre:19,20
bbbbeeeebbbbbbbbbbb
bbbeeffeeebbbbbbbbb
bbeefffffeebbbbbbbb
bbefofffffebeebbbbb
beefofffffeeeebbeeb
beooffoffffffeebeee
beooofeeeeffffeeefe
eeooffebbefffffffee
effoffeebefffffffeb
eefffffebefffffffeb
befffffeeefffffeeeb
befffffffffgggfebbb
befffffgggfgggeebbb
beefffggggfgggebbbb
bbefffggggfgggebbbb
bbeeffggggfgggeebbb
bbbeeffffffgggeebbb
bbbbeeeeeffffeebbbb
bbbbbeebefffeebbbbb
bbbbbbbbeeeeebbbbbb
wh Hocancan 6 0 0/0 98/8 199/19
wh Daaya 13 3 98/8 0/0 178/16
wh Electra 10 19 199/19 178/16 0/0
beacon Laedgre 4 11

sector Electra:23,16
bbbbbeeeeebbbbbeeebbbbb
bbbeeeeeeeeebbeefeebbbb
bbeefeebeeeeeeefffeebbb
bbeefebbbbeefeeefffebbb
bbbefeebbbbeeebeeffeebb
bbbeffeeeeeeebbbefffeeb
eebefffeeeefeebeefffeeb
eeeefeeebbeeeeeeeeefebb
eebeeebbbbbbefffebeeeee
bbbbeeebbbbeeffeebbeeee
bbbbefeebbeefffebbbbeeb
bbbbeefeeeeffffeebbbeeb
bbbbbefffffeeeffeebbbbb
bbbbbeefffeebeffeebbbbb
bbbbbbeeeeebbeeeebbbbbb
bbbbbbbbeebbbbbbbbbbbbb
wh Laedgre 16 0 0/0 249/15
wh Iozeio 1 7 249/15 0/0
beacon Hidden_Laboratory_North_Electra 9 0
beacon Dark_Harbour_Electra 10 1
beacon Hidden_Laboratory_South_Electra 17 13

sector Nex_0002:20,25
bbbbbbbbeeebbbbbbbbb
bbbbbbbeefeebbeeeebb
bbbbbbeefffeeeeffeeb
beeebbeeffeebbefffee
befeebbeeeebbeeffeee
beffeeeeeeeeeefggebb
beefffeeeeebbefggeeb
bbefeeebbeebbeefffeb
bbeeebbbeeeebbefffee
bbbebbeeeffeeeeffooe
eeeeebefffffffffoooe
eeffebeefffeeeeffofe
beffebbeffeebbefffee
eeffeebeffebbeefffeb
egggfeeeffeebeefffeb
egggfffffffebbeeffee
egggfeeefeeebbbeffee
egggeebefebbbbeeffeb
effeebbeeeebeeefffeb
eefebbbbeeebeeeeefeb
befeebbbbebbeebbefeb
beefeebbeeeeeebeefeb
bbeefeebeffffeeefeeb
bbbeefeeeeeeeeeeeebb
bbbbeeebeebbeebeebbb
wh Daaya 10 23 0/0 300/21
xh 9 2 291/21 0/0
beacon Nex_0002_Station 7 11

sector Daaya:26,25
bbbbbbbbbbbbbeeebbbbbbbbee
bbbbbbbbbbbbeefebbbbbeeeee
bbbbbbbeebbbeffeebbbeefffe
bbbbbbeeeebbefffebeeefffee
beebbbeffebeefffebeeeffeeb
beeebeefeebeefffeeeeeeeebb
befebeffebbbeffffffffebbbb
befeeeffeebeefggggggfeeebb
eefffffffeeefggggggggffebb
effffggggfffgggggggggffeeb
eefffggggfffggggfggggffeeb
beeefggggfffggggfgggffeebb
bbbeffffffffeeefeeeefeebbb
beeeffffffeeebeeebbeeebbbb
eefffffffeebbbbbbbbbebbbbb
eefffffffebbbbbbbbbbebbbbb
beefffffeebbbbbbbbbbebbbbb
bbeefffeebbeeebbeeeeebbbbb
bbbeggfebbeefeeeeffeeebbbb
bbbeggfebeefffffffffeebbbb
bbeefffeeefffffffoooebbbbb
bbefeeeebefffffffoooeebbbb
eeeeebeebeeffeeeefofeebbbb
efeebbbbbbeeeebbeeeeebbbbb
eeebbbbbbbbeebbbbbbbbbbbbb
wh Nex_0002 14 0 0/0 166/13 226/19 253/23
wh Ururur 25 1 166/13 0/0 285/24 312/26
wh WO_3-290 2 4 226/19 285/24 0/0 222/19
wh Laedgre 1 23 244/23 303/26 213/19 0/0

sector Ururur:20,17
bbbbbbbbeeebeeeebbbb
bbbbbbeeefeeeffeeebb
bbbbeeeffffffffffeeb
bbbeeffffoofffffffeb
bbbeeffoooffffffffee
bbbbefoofffffffffffe
bbbeefffffffffffffee
beeefffffffffffffeeb
befffooffffffffffebb
eeffoffffffffffeeebb
effooffeeeffffeebbbb
eeffoffebeeeefebbbbb
befffffebeebeeebbbbb
befeeeeebbbbbbbbbbbb
befebbbbbbbbbbbbbbbb
beeeebbbbbbbbbbbbbbb
bbeeebbbbbbbbbbbbbbb
wh BQ_3-927 19 5 0/0 108/9 89/8 167/14
wh Betiess 10 12 108/9 0/0 57/3 86/5
wh Enaness 13 12 89/8 57/3 0/0 116/8
wh Daaya 6 13 167/14 86/5 116/8 0/0
beacon Ururur 11 7

sector Betiess:13,16
bbbbbeeebbbbb
bbbbbeeebbbbb
bbbbbbebbbbbb
bbbbbeeebbbbb
bbbbbeeebbbbb
bbbbbeebbbbbb
bbbbeeeebeebb
bbeeeffeeeeeb
eeefffffgggeb
efffffffgggeb
eeffffffgggee
beffffffgggfe
beffffofgggee
beeffoooffeeb
bbeeefoffeebb
bbbbeeeeeebbb
wh Ururur 6 1 0/0

sector Canopus:12,22
bbbbbeeebbbb
bbbbbeeebbbb
bbeebbebbbbb
beeeeeeeebbb
beeffffeebbb
bbefeeeebbbb
eeefebbbbbbb
efffeeeeeebb
eefffffofeeb
beeeeeffofee
bbbbbefffofe
bbeeeefooffe
bbeffffffoee
beeffffeeeeb
befffffebbbb
befffffeeeeb
beeffffgggee
bbeefffgggfe
bbbefffgggee
bbbeefffeeeb
bbbbeffeebbb
bbbbeeeebbbb
wh Pass_FED-05 6 0 0/0 255/21
wh BQ_3-927 6 21 255/21 0/0
beacon Canopus 4 14

sector BQ_3-927:15,15
bbbbbbeebbbbbbb
bbbbbbeeebbbbbb
bbbbbbefeeeebbb
bbbeeeefgggeeee
beeegggfgggggee
begggggggggggeb
eeggggggfggggee
efggggggfggggee
eefffffffgggfeb
beggggggffgggee
begggggggggggee
begggggggggggeb
beegggggggggeeb
bbeeeffeeeeeebb
bbbbeeeebbeebbb
wh canopus 7 1 0/0 112/7 117/7
wh ururur 0 7 112/7 0/0 168/14
wh ross 14 7 117/7 168/14 0/0
beacon Missile_Hub 3 13

sector Enaness:21,12
eeebbbbbeebeeeebbbeee
eeebbbeeeeeeffeeeeefe
bebbbeeffffffeebbbeee
eeebeefffffffebbbbbbb
efebefgggffffeeebbbbb
eeeeefgggffffffeeebbb
beebeggggggffffffeebb
bbbbeggggggfeeefffeeb
bbbbeggggggfebeffffeb
bbbbeeffgggeebefffeeb
bbbbbeeeeeeebbeefeebb
bbbbbbbbbbeebbbeeebbb
wh Ururur 1 1 0/0 299/20
wh Ross 19 1 290/20 0/0

sector SD_3-562_East:23,19
bbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbeebbbbbbb
bbbbbbbbbbbbbbeeebbbbbb
bbbbbbbbbbbbbbefeebbbbb
bbbbbbbbbbbbbbeffeeeebb
bbbbbbbbbbbbbbefffffeeb
bbbbbbbbbbbbbbeefffffeb
bbbbbbbbbbbbbbbeffgggee
bbbbbbbbbbbbbbbeffgggfe
bbbbbbbbbbbbbbbeeeeefee
bbbbbbbbbbbbbbbbeebeeeb
bbbbbbbbbbbbbbbeeebbbbb
bbbbbbbbbbbbbbbefebbbbb
bbbbbbbbbbbbbbeefebbbbb
bbbbbbbbbbbbbbeeeebbbbb
bbbbbbbbbbbbbbbbebbbbbb
bbbbbbbbbbbbbbbeeebbbbb
bbbbbbbbbbbbbbbeeebbbbb
wh Ross 16 17 0/0

sector SD_3-562:23,19
bbbbbbbbbbeeebbbbbbbbbb
bbbbbbbbbbeeebbbbbbbbbb
bbbbbbbbbbbebbbbbbbbbbb
bbbbbbbbbeeeebbbbbbbbbb
bbbbbbbeeefeebbbbbbbbbb
bbbbbeeeffeebbbbbbbbbbb
bbbeeefffeebbbbbbbbbbbb
bbeefffffebbbbbbbbbbbbb
beefeeeeeebbbbbbbbbbbbb
befeebebebbbbbbbbbbbbbb
eefebbebebbbbbbbbbbbbbb
eefeebebebbbbbbbbbbbbbb
beffeeeeeebbbbbbbbbbbbb
beeffffffeebbbbbbbbbbbb
bbeeefffffebbbbbbbbbbbb
bbbbeeeeffeebbbbbbbbbbb
bbbbbbbeeffeebbbbbbbbbb
bbbbbbbbeeefebbbbbbbbbb
bbbbbbbbbbeeebbbbbbbbbb
wh Pass_FED-06 11 0 0/0 261/18
wh Ross 12 18 261/18 0/0

sector Ross:17,15
bbbbbbbeebbbbbbbb
bbbbbbbeeebeebbbb
bbbbeebefeeeebbbb
bbbeeeeeffffeebbb
bbeeffffffoffeebb
bbeffffffffoffeeb
beeffffeeeeooofee
eefffffebbeeoofee
eefffffeebbeoffeb
beffffffeeeeffeeb
eefffffeeefffeebb
eefeeefebeffeebbb
beeebeeebeefebbbb
bbeebbeebbeeebbbb
bbbbbbbbbbeebbbbb
wh SD_3-562 8 1 0/0 58/4 107/8 116/8 119/11 148/13
wh SD_3-562_East 12 2 58/4 0/0 76/4 138/12 128/11 119/11
wh Famiso 16 6 107/8 76/4 0/0 187/16 177/15 88/7
wh BQ_3-927 0 7 116/8 138/12 187/16 0/0 68/5 155/11
wh Enaness 2 12 119/11 128/11 177/15 68/5 0/0 135/9
wh Remo 11 13 148/13 119/11 88/7 155/11 135/9 0/0
beacon Ross 5 7

sector Remo:28,26
bbbbeeebbbbeeebbbbbbeeebbbbb
bbbeefeeebbefeebbbbeefeeeebb
bbeeffffeeeeffebeeeefffffeeb
beefffffeeeeffeeefffffffffee
beffeeeeeeeeffebeffffeeeeffe
befeebbebbbeffeeeffffebbeffe
eefebbbebbbeefeeeeeffebeeffe
eefebbbebbbbefeebbeefebeeffe
befeebeeeebbeefebbbeeebbeffe
beffebefeebbbeeebbbbeeebeffe
beffebeeebbbeeebbbbeeeebeffe
beffebbbbbbbeeebbbbefebbefee
beefeebbbeebbbbbeebefebeefeb
bbeffeeeeeeebbeeeebeeebeffee
bbeffebbbefeeeefeebbeebeeffe
beeffeeeeefffffeebbbbbbbeffe
befffeeeeffeeefebbbbeebbeffe
befeeebbeffebeeebbbbeeebeffe
befebbbeeffebbeebbbeefebefee
befebbbeffeebbbbbeeeffeeefeb
eefebbbeefebbeeeeeffeeebefee
effebbbbeeebeefffffeebbbeffe
effeebbbeebbeffffffebbeeeffe
eeffebbbeeeeefeeeefeeeefffee
beeeebbbeffffeebbeeefffffeeb
bbbbbbbbeeeeeebbbbbeeeeeeebb
wh Ross 13 1 0/0 408/30
wh Sargas 10 24 399/30 0/0
beacon EM_Weapon_Station_Remo 21 18

sector Famiso:22,15
bbbbbbbbbeebbbbbbbbbbb
bbbbbbbbbeebbbbbbbbbbb
bbbbbbbbbeeebbbbbbbbbb
bbbbbbbeeefeebbbbbbbbb
bbbbbbbeggggebbbbbbbbb
bbbbbbbeggggeebeeebbbb
eeebbbeeggggfebeeeebbb
efeebbeffffffebbefebee
eefeeeeffffffeebefeeee
beefffffffffffeeefebee
bbeffffffffffffffeebbb
bbeeffeeeffffeeeeebbbb
bbbeeeebefffeebeebbbbb
bbbbeebbeeeeebbbbbbbbb
bbbbbbbbbeebbbbbbbbbbb
wh Ross 0 6 0/0 227/20
wh Edenve 20 8 227/20 0/0
beacon Famiso 10 9

sector Pass_FED-07:27,15
bbbbbbbbbbbeebbeeebbbbbbbbb
bbbbbbbbbbeeebeefeeeebbbbbb
bbbbbbeebeefeeefffffeebbbbb
bbbbbbeeeeffeeeeeeeffeeeeeb
bbbbbbeebeefeeebbbeeefffeeb
bbbbbbbbbbeeefeebbbbeefeebb
bbbbbbbbbbbbeefeebbbbefebbb
eebeebbbbbbbbeefebbbbeeebee
eeeeebbbbbbbbbefeebbbbeeeee
eebeeebbbeeeebeefebbbbeebee
bbbefeeeeeeeeebefeebbbbbbbb
bbbeefffffeefeeeffebbbbbbbb
bbbbeefffeeeeffffeebbbbbbbb
bbbbbeeeeebbeeefeebbbbbbbbb
bbbbbeebbbbbbbeeebbbbbbbbbb
wh Essaa 0 8 0/0 418/31
wh UZ_8-466 25 8 418/31 0/0

sector Essaa:11,22
bbbbbeeeeeb
bbbeeeeeeeb
bbbeeeebeee
bbbeeeeeefe
bbeeeeefffe
beefebeeeee
beeeebbbeeb
bbebbbbbbbb
eeeebbbbbbb
eefeebbbbbb
beeeebbbbbb
bbeebbbbbbb
beeeeeeebee
eefffffeeee
effffffebee
eeffffeebbb
beeffeebbbb
bbeffebbbbb
bbeefeebbbb
bbbeeeebbbb
bbbbbeebbbb
bbbbbeebbbb
wh Tiacan 1 13 0/0 126/9 88/7
wh Pass_FED-07 10 13 126/9 0/0 145/10
wh YC_3-268 6 20 88/7 145/10 0/0

sector YC_3-268:14,15
bbbbbeeeebbbbb
bbbbeeffeeebbb
bbbbefffffeeeb
bbbeefffgggfeb
bbbefffgggggee
bbbefffgggggge
bbeeffggggggge
eeeffgggggggge
eefffgggggggge
beffffgggggfee
beeffffffffeeb
bbeffeeeeeeebb
bbeeeebbebbbbb
bbbeebbeeebbbb
bbbbbbbeeebbbb
wh Essaa 6 0 0/0 116/8 176/14
wh Ackexa 0 7 116/8 0/0 145/10
wh Pass_FED-06 8 14 176/14 145/10 0/0

sector Pass_FED-06:18,23
bbbbbbbeeebbbbbbbb
bbbbbbbeeebbbbbbbb
bbbbbbbbebbbeeeebb
beeeeeeeeeeeeffeeb
eeeeeeeeeeffffffee
eefebbbbbeeeeeeffe
eefeeeeebbeebbefee
beeeeeeeebbbbeefeb
bbeebbeeeebbbeefeb
bbbbbbbeeeebbbeeeb
bbbbbbbbefebbbeebb
bbbeeeeeeeebbbeebb
bbbefeeeeebbbbeebb
beefeebbbbbbbbeeeb
befeebbbbbbbbbeeeb
befebbeeeeebbbbeeb
eeeebeefffeeebeeeb
eeebbeffffffeeefeb
beebeeffffeeeffeeb
beeeeeeeeeebeeeebb
beffeebbbebbbbbbbb
beeeebbbeeebbbbbbb
beebbbbbeeebbbbbbb
wh YC_3-268 8 0 0/0 430/25
wh SD_3-562 9 22 430/25 0/0

sector Tiacan:15,18
bbbbbbbbbeebbbb
bbbbbbbeeeeebbb
bbbbbeeefffeebb
bbbbbeffffffebb
bbbbbefffffeebb
bbbbbefffffebbb
bbbbeefffffebbb
bbeeeffffffebbb
eeeffffffffeebb
eeeefffgggffeee
bbbefggggggfffe
bbbeegggggggfee
bbbbegggggggfeb
bbbbefggggggfeb
bbbbefgggggfeeb
bbbbeeffffffebb
bbbbbeeeffeeebb
bbbbbbbeeeebbbb
wh Betelgeuse_East 1 8 0/0 148/13
wh Essaa 14 10 148/13 0/0
beacon Tiacan 8 5

sector Ackexa:20,15
bbbbbbbbbbbeeebbbbbb
bbbbbbbbeeeefeeeebbb
bbbbbbbeefffffffeebb
bbbbbbeefffffffffeeb
bbbbbbefffffffffffee
bbeeeeeffggfffffffee
eeefffffggggffffffeb
eeefffffggggfffffeeb
bbeffggfeeeeeffffebb
bbeffggeebbbefooeebb
bbeefffebeebeeooebbb
bbbeeffeeeebbefoebbb
bbbbeeeebeeebeefeebb
bbbbbbbbbeeebbeeeebb
bbbbbbbbbbbbbbbeebbb
wh YC_3-268 19 4 0/0 226/19 223/15
wh Omicron_Eridani 0 6 226/19 0/0 154/10
wh Pass_FED-05 10 13 223/15 154/10 0/0
beacon Ackexa 14 4

sector Pass_FED-05:21,21
bbbbbbeeebbbbbbbbbbbb
bbbbbbeeebbbbbbbbbbbb
bbbbbbbebbbbbbbbbbbbb
bbbbeeeeebbbbbbbbbbbb
bbbbefffebbbbbbbbbbbb
bbeeeffeebbbbbbbbbbbb
beefffeebbbbeeebbbbbb
eefffeebbbeeefeeeeebb
effffebbbeefffffffeeb
eefffeeeeefffeeeeffeb
beeffeeeeeefeebbeffeb
bbefeebbbbeeebbbeffee
bbeeebbbbbbbbbbbeeffe
bbbbbbbbbbbbbbbbbeefe
bbbbbbbbbbbbbbbbbbefe
bbbbbbbbeeeeeeebbbeee
bbbbbbeeefffffeebeeeb
bbbbbbeeeeeefffeeefee
bbbbbbbebbbeefeeeffee
bbbbbbeeebbbeeebefeeb
bbbbbbeeebbbbbbbeeebb
wh Ackexa 7 0 0/0 532/37
wh Canopus 7 20 532/37 0/0

sector Sohoa:14,16
bbbbbeeeebbbbb
bbbeeeffeeebbb
bbbeegggggeebb
bbbbeggggggeeb
bbbeegggggggeb
beeefgggggggee
beefffffggggfe
bbefffffggggee
beeffggggggeeb
beeffggggggebb
bbeefgggggeebb
bbbeffggggebbb
bbeefeeeeeebbb
eeefeebbeebbbb
eeeeebbbbbbbbb
bbeebbbbbbbbbb
wh GV_4-652 1 5 0/0 126/9
wh Betelgeuse_East 1 14 126/9 0/0
beacon Sohoa 7 6

sector Omicron_Eridani:16,19
bbbbbbbbbbbeebbb
bbbbbbbbbeeeeebb
bbbbbbbbeegggeeb
bbbbbbbbeggggfeb
bbbbbbbbeggggeeb
bbbbbbbeeggggebb
bbbbbbbegggggebb
bbbbbbbeggggeebb
beebbbeegggfebbb
eeebbbefffffebee
efeebbefffffeeee
effebeeffffeebee
effebefffffebbbb
effebefffffeeeeb
eefeeeffffofoeeb
beeeffffeeeooebb
bbbefffeebeooeeb
bbbeefeebbeeefeb
bbbbeeebbbbbeeeb
wh Rashkan 1 9 0/0 195/15
wh Ackexa 14 10 195/15 0/0
beacon Omicron_Eridani_Base 6 12

sector GV_4-652:12,12
bbbbbeeebbbb
bbbbbeeebbbb
bbbbbbebbbbb
bbbbeeeeeebb
beeeeffffeee
eeffeeeffeee
eeffebeffebb
beffeeefeebb
beeeffeeebbb
bbbeffebbbbb
bbbeeeebbbbb
bbbbeebbbbbb
wh Pass_FED-13 6 0 0/0 124/7 134/8 164/11
wh Sohoa 11 4 124/7 0/0 155/11 125/8
wh Nionquat 0 5 134/8 155/11 0/0 96/6
wh Betelgeuse_West 5 11 164/11 125/8 96/6 0/0

sector Betelgeuse_East:32,22
bbbbbbbbbbbbbbbbbbbbbbbbbbbbeeee
bbbbbbbbbbbbbbbbbbbbbbeeeeeeeffe
bbbbbbbbbbbbbbbbbbbbbeefffffffee
bbbbbbbbbbbbbbbbbbbbeeffffeeeeeb
bbbbbbbbbbbbbbbbbbbbefffeeebbbbb
bbbbbbbbbbbbbbbbbbbbefffebbbbbbb
bbbbbbbbbbbbbbbbbbbbeeffeeebbbbb
bbbbbbbbbbbbbbbbbbbbbefoffebbbbb
bbbbbbbbbbbbbbbbbbbbeeooofeebbbb
bbbbbbbbbbbbbbbbbbbbeffooffeebbb
bbbbbbbbbbbbbbbbbbbeefffffffebee
bbbbbbbbbbbbbbbbbbeefeeeeeefeeee
bbbbbbbbbbbbbbbbeeeffebbeeeeebee
bbbbbbbbbbbbbbbeefeeeeeeeeeebbbb
bbbbbbbbbbbbbbbeefebeffffeeeebbb
bbbbbbbbbbbbbbbbeeeeeeeeeffeebbb
bbbbbbbbbbbbbbbbbeefeebbeeeebbbb
bbbbbbbbbbbbbbbbbbeeebbbbeebbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
wh Sohoa 30 1 0/0 196/16
wh Tiacan 31 11 205/16 0/0

sector Betelgeuse_West:32,22
bbbbbbbbbeeeebbbbbbbbbbbbbbbbbbb
bbbbbbeeeeffebbbbbbbbbbbbbbbbbbb
bbbbeeefffffeebbbbbbbbbbbbbbbbbb
bbbbeffffooffebbbbbbbbbbbbbbbbbb
bbbeefffoooofebbbbbbbbbbbbbbbbbb
beeegggfffofeebbbbbbbbbbbbbbbbbb
eeffgggffffeebbbbbbbbbbbbbbbbbbb
efffgggffeeebbbbbbbbbbbbbbbbbbbb
eeffffffeebbbbbbbbbbbbbbbbbbbbbb
beegggfeebbbbbbbbbbbbbbbbbbbbbbb
bbegggfebbbbbbbbbbbbbbbbbbbbbbbb
bbegggfebbbbbbbbbbbbbbbbbbbbbbbb
eeegggfeebbbbbbbbbbbbbbbbbbbbbbb
eegggfffeeeebbbbbbbbbbbbbbbbbbbb
beggggfffffeeebbbbbbbbbbbbbbbbbb
beggggfffffffebbbbbbbbbbbbbbbbbb
beegggfffffffeebbbbbbbbbbbbbbbbb
bbegggeeefffffebbbbbbbbbbbbbbbbb
bbeeffebeeeeffebbbbbbbbbbbbbbbbb
bbbeeeebeebeefebbbbbbbbbbbbbbbbb
bbbbeebbbbbbeeeeebbbbbbbbbbbbbbb
bbbbbbbbbbbbbeeeebbbbbbbbbbbbbbb
wh GV_4-652 11 0 0/0 228/21
wh Rashkan 15 21 228/21 0/0
beacon Betelgeuse_Station 7 17

sector Rashkan:25,29
bbbbbbbbbbbbeeeebbeebbbbb
bbbbbbbbeeebeeeebbeeebbbb
bbbbbbbeefebbbebbeefebbbb
bbbbbbbefoeebeeebeffeebbb
bbbbbeeeooeebefebeeffebbb
bbbbeeffooebbefeebeffeebb
beeeefgggoeebeffebefffebb
beffggggggfeeeffeeefggeeb
eefggggggggffffffffgggfeb
eefgggggggggffgggffgggeeb
befgggggggggfgggggfgggebb
beeeffggggggfgggggffffeee
bbbeeefffffffgggggffffffe
bbbbbeeeeffffgggffeeeeeee
bbbbbbbbefgggfffffebbbbee
bbbbeeeeefgggfffffeebbbbb
bbeeefooffgggffffffeeebbb
beefooooofgggffffffffeeeb
beeffooffffffffffffffffeb
bbeeefoffgggffffffffffeeb
bbbbeefffgggeeefffofofebb
bbbbbefffgggebeffffoofeeb
bbbbeeffffeeebeeffoooofeb
bbbeefffeeebbbbeeeefofeeb
bbbefffeebbbbbbbbbeefeebb
bbeeffeebbbbbbbbbbbeeebbb
bbeffeebbbbbbbbbbbbbbbbbb
bbeefebbbbbbbbbbbbbbbbbbb
bbbeeebbbbbbbbbbbbbbbbbbb
wh Betelgeuse_West 13 0 0/0 196/16 306/27
wh Omicron_Eridani 24 13 196/16 0/0 234/21
wh Epsilon_Indi 4 27 297/27 225/21 0/0
beacon Rashkan 15 17

sector Nionquat:15,20
bbbeeebbbbbbbbb
bbeefeeebbbbbbb
bbefgggeebbbbbb
beegggggeeebbbb
begggggggfeeebb
begggggggfffeeb
begggggggffffeb
eeggggggfffffee
eeggggggffffffe
beeggggffffffee
bbeeeffffffffeb
bbbbefffffffeeb
bbeeeffffffeebb
beeffffffffebbb
befffffoffeebbb
eefffooooeebbbb
eeffffoofebbbbb
beffeeefeebbbbb
beeeebeeebbbbbb
beebbbbbbbbbbbb
wh GV_4-652 14 8 0/0 139/13
wh Famiay 1 18 139/13 0/0
beacon Nionquat 10 8

sector Epsilon_Indi:20,13
bbbbbbbbbbeeeeebbeeb
bbbbbbbbbeegggeebeee
bbbbbbbeeegggggeeeee
bbbbbbbeeggggggffeeb
eebeebbbeggggggfeebb
eeeeeebeeggggggfebbb
eeeffeeefggggggfeebb
bbeeffffffffggfffebb
bbbefffffffffffffeeb
bbbeeeeffeeeefffffeb
bbbbbbeeeebbeefffeeb
bbbbbbeebbbbbeeeeebb
bbbbbbeebbbbbbbeebbb
wh Rashkan 18 0 0/0 240/18 170/11
wh Phekda 0 5 240/18 0/0 124/7
wh LO_2-014 7 11 170/11 124/7 0/0
beacon Epsilon_Indi 15 8

sector LO_2-014:10,3
eebeeeeebb
eeeeeeeeee
eebeebeeee
wh Epsilon_indi 4 0 0/0 76/4
wh Micanex 0 1 76/4 0/0

sector Famiay:15,13
bbbbbbbbbbbeebb
bbbbeeebbbeeeeb
bbbbefebbeeffee
bbbeeoeebeffffe
bbbeoooebeffffe
eebefofeeeffffe
eeeefffffffffee
eeeefffffffffeb
bbbeeffffffffeb
bbbbeeeeeeefeeb
bbbbbbeebbeeebb
bbbbbbeeebbeebb
bbbbbbeeebbbbbb
wh Nionquat 13 1 0/0 175/13 146/11
wh Nebul 0 6 175/13 0/0 152/8
wh Phekda 7 12 146/11 152/8 0/0
beacon Famiay_Station 9 5

sector Phekda:8,17
bbbeebbb
beeeeeeb
eegggfeb
eegggfeb
begggfee
beeeeffe
bbbbeffe
beebeffe
beeeefee
beebefeb
bbbbefee
bbeeeffe
beeffeee
beeffebb
bbeefebb
bbbeeebb
bbbeebbb
wh Famiay 3 0 0/0 145/10 138/12
wh Bedaho 1 8 145/10 0/0 96/6
wh Epsilon_Indi 7 12 138/12 96/6 0/0

sector Nebul:12,26
bbbeeeebbbbb
bbeeffeebbbb
beefgggeeebb
eegggggggeeb
efggggggggeb
efggggggggeb
eeggggggggeb
begggggggeeb
beggggffeebb
begggfeeebbb
eeffeeebbbbb
eeffebbbbbbb
beefeeeebbbb
bbeeeffeebbb
bbbbefffeeee
bbbeeffffffe
bbeeffffeeee
bbefffeeebbb
eeefffebbbbb
efeeeeeeeebb
eeebbegggeee
bbbbeeggggfe
bbbbefggggfe
bbbbefggggee
bbbbeegggeeb
bbbbbeeeeebb
wh Famiay 11 15 0/0 118/10
wh Capella 1 19 109/10 0/0

sector Pass_FED-04:25,22
bbbbbbbbbbbbbbbbbbeeeebbb
beeeeeeebbbbbbeeeeeffeebb
eefeeeeeeebbbeefeeeeeeeeb
eefebbeefeebeeeeebbbbefeb
beeeebbeefebefebbbbbeefeb
bbeeeebbefebefebbbbeeeeeb
bbbeeeebefebefebbbbeeeeeb
bbbbefebeeeeefeebbeeebbbb
eebeeeebbeffeeeebbeeeebbb
eeeefebbbeffebbbbbbefebee
eebefeebbeffeeebbbbefeeee
bbbefeebeeeeefeebbeefebee
bbeefebbeeebeefebbeefebbb
beeeeebbeebbbefebbbeeebbb
befebbbbeebbbefebbbbeeebb
eefebbbeeebbeeeebbbbefeeb
eefebbeeeebbeeebbbeeefeeb
befeeeefebbeeebbeeefffebb
bbeffffeebbefebeeeeefeebb
bbeefeeebbbeeeeeeebeeebbb
bbbeeebbbbbbefeeebbbbbbbb
bbbbbbbbbbbbeeebbbbbbbbbb
wh HC_4-962 0 9 0/0 629/35
wh Phiagre 24 10 629/35 0/0

sector Capella:20,17
bbbbbbeebbbbbbbbbbbb
bbbbbeeeebbbbbbbbbbb
bbbbbeffebbbbbbbbeee
bbbbbeffeebbbbeeeeee
bbbbeegggeeeeeefeeee
bbbbeggggffffffeebbb
bbbbeggggffffffebbbb
bbbbeggggfffffeebbbb
bbbeefgggfffffebbbbb
beeefffffffffeebbbbb
beffffffffffeebbbbbb
eeffooeeeefeebbbbbbb
eeffooebbeeebbbbbbbb
beffoeebbbbbbbbbbbbb
beeefebbbbbbbbbbbbbb
bbbeeebbbbbbbbbbbbbb
bbbbeebbbbbbbbbbbbbb
wh Nebul 17 3 0/0 197/17
wh Bedaho 0 11 197/17 0/0
beacon Capella 11 7

sector Bedaho:20,18
bbbbbbbeebbbbbbbbbbb
bbbbbbeeeeeebbbbbbbb
bbbbbeeffffeebbbbbbb
bbbbbeeeefffebbbbbbb
bbbbbbebeeeeeeebbbbb
bbbbbbebbbbeefeebbbb
bbbbbbebbbbbeefebbbb
bbbbbbebbbbbbeeeebbb
bbbbeeeebbbbbbefebee
bbbbeffeebbbbeefeeee
bbbeefffeeeeeeffebee
bbeemmfeebbbbeffebbb
bbefmmeebbbbbeffeebb
beefeeebbbbeeeffeebb
beffebbbbeeefffeebbb
eefeebbbeeffeeeebbbb
efeebbbbefeeebbbbbbb
eeebbbbbeeebbbbbbbbb
wh Capella 11 2 0/0 144/9 251/17 186/15
wh Phekda 19 9 144/9 0/0 304/18 145/10
wh Zeaex 1 16 242/17 295/18 0/0 277/18
wh Micanex 9 16 177/15 136/10 277/18 0/0
beacon Bedaho 6 10

sector Micanex:20,20
bbbbbbbbeeebbbbbbbbb
bbbbbeeeefeebbbbbbbb
bbbbeefffffebbbbbbbb
bbbeefffffoeebbbbbbb
bbeefffffffeebbbbbbb
bbeffffffooebbbbbbbb
bbeeffffoooeebbbbbbb
bbbeeeffooffeebeebbb
bbbbbefffofffeeeebbb
bbeeeefoffffffeeeeee
eeefffffoffeeeeeeeee
eeefffoofeeebeeeebbb
bbeeffoofebbbeebbbbb
bbbefooffeeebbbbbbbb
bbbeefofofeebbbbbbbb
bbbbefffooebbbbbbbbb
bbbbeeeeffeebbbbbbbb
bbbbbbbeeefebbbbbbbb
bbbbbbbbbeeebbbbbbbb
bbbbbbbbbbeebbbbbbbb
wh Bedaho 9 0 0/0 192/12 175/13 217/19
wh LO_2-014 18 9 192/12 0/0 243/18 242/17
wh Maia 0 10 175/13 243/18 0/0 164/11
wh HC_4-962 11 19 217/19 242/17 164/11 0/0
beacon Micanex 6 4

sector HC_4-962:12,13
bbbbbbeebbbb
bbbeeeeebbbb
bbeefffebbbb
bbeffffeebbb
bbefffffebbb
beefgggfebee
beffgggfeeee
eefggggfebee
eeeggggfebbb
bbeeggffebbb
eebefffeebbb
eeeefeeebbbb
eebeeebbbbbb
wh Micanex 6 0 0/0 125/8 106/7 151/11
wh Pass_FED-04 11 6 125/8 0/0 155/11 173/11
wh Wayaan 0 7 106/7 155/11 0/0 76/4
wh Wayaan_South 0 11 151/11 173/11 76/4 0/0

sector Zeaex:12,14
bbeeeebbbbbb
beeffeebbbbb
beffffeebbbb
befeeefeebbb
eeeebeefeeeb
efebbbeeffeb
efeebbbeefeb
eefeeebbeeee
beeeeeebbeee
bbbbefebbeeb
bbbeefebeeeb
beeeffeeeeeb
eefeeeeeeebb
eeeebbeebbbb
wh Bedaho 10 4 0/0 221/14
wh Maia 0 12 221/14 0/0

sector Wayaan:25,16
bbbbbbbeeeebbeeeeebbbbbbb
bbbbbeeeffebeegggeeebbbbb
bbbbeeffffeeegggggfeebbbb
bbbbeffffffgggggggffeeebb
bbbbeffffffgggggggffffeeb
bbbeeffffffggggffffofffeb
bbbefffffffffffeeeoooffeb
eeeefffffffffeeebeeooffee
eeeffffffffeeebbbbeooeeee
bbeeeeffffeebbbbbbefeebee
bbbbbeefeeebbbbbbbeeebbbb
bbbbbbeeebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
wh JS_2-090 0 7 0/0 276/24
wh HC_4-962 24 9 276/24 0/0
beacon Waayan 7 5

sector Wayaan_South:25,16
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbeeebbbbbbbbbb
bbbbbbbbbbbeefeeeeeebbbbb
bbbbbbbbbbbefeefeeeebeeee
bbbbbbbbbbbeeeeeebeeeeffe
bbbbbbbbbbbbeeeebbeeeeeee
wh HC_4-962 24 14 0/0

sector Maia:20,13
bbbbbbeeebbbbbbbeeee
bbbbeeefeeeebbbeeffe
bbbeeffffffeebeeffee
bbbefffgggffebefeeeb
bbeeeeegggffeeefebbb
eeefebeggggfffffebee
effeebeggggggggfeeee
eefebbeggggggggfffee
beeeeeegggffggffeeeb
bbeeffffffffggeeebbb
bbbeeefffffffeebbbbb
bbbbbeffffeeeebbbbbb
bbbbbeeeeeebbbbbbbbb
wh Zeaex 19 0 0/0 217/19 125/8
wh Inena 0 6 217/19 0/0 217/19
wh Micanex 19 6 125/8 217/19 0/0
beacon Maia 11 8

sector JS_2-090:13,10
eeebbbbbeebbb
eeeebeebeeebb
beeeeeeeefeeb
bbefeeeffffeb
beefebeefffee
beffebbefffee
beefeeeefffeb
bbeeeffeeeeeb
bbbbeeeebbeee
bbbbbbbbbbeee
wh Alioth 0 0 0/0 183/12
wh Wayaan 12 5 183/12 0/0

sector Inena:14,21
bbbbbbeebbbbbb
bbbbbeeebbbbbb
bbbbeefebbbbbb
bbeeeffeebbbbb
bbefgggfebbbbb
beefggggeebbbb
beggggggfebbbb
beggggggfeebbb
beggggggffeeee
eeffgggfffffee
eeeefffffffeeb
bbbeeefffffebb
bbbbbefffffeeb
bbeeeeffffffee
beeffeeeffffee
befffebeffffeb
eeffeebeefffeb
eeffebbbeefeeb
beefeebbbeeebb
bbeeeebbbbbbbb
bbbbeebbbbbbbb
wh Maia 13 8 0/0 166/13
wh Alioth 5 19 166/13 0/0
beacon Inena 8 11

sector Alioth:16,15
bbbbbeebbbbbbbbb
bbbbbeebbbbbbbbb
bbbbbeebbbbbbbbb
bbbbbeeebbbbbbbb
bbbbeefebbbeeebb
bbbbeffebeeefeeb
bbbbefoeeeffffee
bbbeeooebefffffe
eebeoofeeeggfffe
eeeefofebeggffee
eebeeffeeeggfeeb
bbbbeffebeggfebb
bbbbeefeeefffeee
bbbbbeeebeefffee
bbbbbbbbbbeeeeeb
wh Inena 5 0 0/0 182/11 221/13
wh Pass_FED-03 0 9 182/11 0/0 222/15
wh JS_2-090 15 13 221/13 222/15 0/0
beacon Alioth_Station 11 5

sector Pass_FED-03:17,15
bbbbbbbbbbeebbbbb
bbbbbbbbeeeeeeebb
bbbeebeeeffoofeeb
beeeeeeffffffofeb
befffffeeeeeeffeb
eeeeeeeebeebeeeee
eeebeebbbbbbeeeee
beebeebbbbbeeeeeb
beeeeeebbbbeeffee
beefffeeebbbeeeee
bbeefeefeebbbbeeb
bbbeeeeffeebbbbbb
bbbbeeeeeeebbbbbb
bbbbbbbbbeeebbbbb
bbbbbbbbbeeebbbbb
wh Alioth 15 10 0/0 326/20
wh PJ3373 10 14 326/20 0/0

sector PJ3373:10,6
bbbbbbeeeb
bbbbbbeeeb
beeebbbebb
eefeeeeeee
efeeeeeeee
eeebbbbbbb
wh Pass_FED-03 7 0 0/0 76/4 153/9
wh Quurze 9 4 76/4 0/0 153/9
wh Epsilon_Eridani 0 5 153/9 153/9 0/0

sector Epsilon_Eridani:18,32
bbbbbbbbeebbbbbbbb
bbbbbbbeeeeebbbeee
bbbbbbeefffeeeeefe
bbbbbbefgggfffffee
bbbbbeefggggfffeeb
bbbbeefgggggffeebb
bbbbefggggggffebbb
bbbeeggggggfffeebb
bbbegggggggffffebb
bbeeggggggfffeeebb
beefgggggfeeeebbbb
beefgggggfebbbbbbb
bbeeeggggfebbbbbbb
bbbbeeefffeebeebbb
bbbbbbeffffeeeeebb
bbbbbeeffffffffeeb
bbbeeeffffffffffeb
bbbeeefeeeffffffeb
bbbbbeeebefffffeeb
bbbbbbbbbefffeeebb
bbbbbbbbbefffebbbb
bbbbbbbbeefffeebbb
bbbbbbeeefffffeeee
bbeeeeeffffffeeeee
beeffooffffffebbbb
eeffoooffffofebbbb
eefffoffffoooeeebb
beeeffffffooeeeebb
bbbeffffffoeebeeeb
beeeffffffeebbeeee
eeeeeffeeeebbbbeee
eeebeeeebbbbbbbbee
wh PJ3373 16 2 0/0 256/22 327/30 316/28
wh Quurze 17 23 265/22 0/0 233/17 181/10
wh Faexze 0 30 336/30 233/17 0/0 242/17
wh Sol 17 30 325/28 181/10 242/17 0/0
beacon Eridani 13 16

sector Quurze:16,20
bbbeebbbbbbbbbbb
bbbeeebbbbbbbbbb
bbeefeebbbbbbbbb
bbeeffeeeebbbbbb
bbbefffffeeeebbb
bbbeefffffffeeeb
bbbbeeefffffffee
bbbbbbeefffffffe
bbbbbbbeffffffee
bbbbbbeeffffffeb
bbbbbeeggffffeeb
bbbbeefggfeeeebb
bbbeefggfeebbbbb
bbbeffggfebbbbbb
bbeefffffeeeebbb
eeefffffffffebbb
eeefffffffeeebbb
bbeeffffffebbbbb
bbbeeefeeeebbbbb
bbbbbeeebbbbbbbb
wh PJ3373 3 0 0/0 196/16 220/17
wh Hoanda 12 15 196/16 0/0 147/12
wh Epsilon_Eridani 0 16 220/17 147/12 0/0
beacon Quurze 11 8

sector Hoanda:16,18
bbbbbbbbeeebbbbb
bbbbbeeeefeeebbb
bbbeeeffgggfeebb
bbeefggggggffebb
bbeegggggggfeebb
bbbeggggggfeebbb
bbeeggggggfebbbb
eeefffgggffeebee
eeeeeeffffffeeee
bbbbbeeefffffeee
bbbbbbbefffffebb
bbbbbeeefffffebb
bbbbeeffffffeebb
bbbbeffffffeebbb
bbbbeeffffeebbbb
bbbbbeffeeebbbbb
bbbbbeeeebbbbbbb
bbbbbeebbbbbbbbb
wh Quurze 0 8 0/0 195/15
wh ZZ2986 15 8 195/15 0/0
beacon Hoanda_Base 7 9

sector Faexze:23,16
bbbbbbeeeebbbbbbbbbbeee
bbbbbeeffeeeebbbbbbbeee
bbbbbeffffffeeeeebbbbee
bbbbeefffgggffffeebbeee
bbbbeffffgggfffffeeeefe
bbbbeefffgggffffffffffe
bbbbbeeeffffggggffffffe
bbbbbbbefffgggggfffffee
bbbbbeeeffggggggeeeffeb
bbbbbeffffggggfeebefeeb
eebbbeffffggggeebbeeebb
eeeeeefeeeefffebbeeebbb
eebbbeeebbeefeebbefeebb
bbbbbbbbbbbeeebbbeefeee
bbbbbbbbbbbbbbbbbbeeeee
bbbbbbbbbbbbbbbbbbeebee
wh Epsilon_Eridani 21 0 0/0 320/23 212/14
wh Pass_FED-09 0 11 320/23 0/0 339/24
wh Alpha_Centauri 21 14 212/14 339/24 0/0
beacon Faexze_Station 8 7

sector Sol:24,29
bbbeeeeeeebbbbeeeeeeeeee
beeefffffeeeeeefffoofffe
eeffffffffffffffoooooffe
effffffffffffffoooooofee
eefffffffffffffoooffeeeb
befffffffffffffffffeebbb
beeffffffffffffoeefebbbb
bbefffffffffffffeefeeeee
bbeffffffffffffffeeeeefe
beefffffffffffoofebbbeee
befffggggggfffoooebbbbbb
eefffgggggggfffofeeeebbb
eefffgggggggggffffffeeeb
befffgggggggggffffffffee
befgggfgggggggfffffffffe
befggggggggggggfffffffee
befgggggfggggggggffffeeb
beggggggfggggggggffffebb
eeggggggggggggggfffffebb
efgggggfgggggggfggggfeeb
efgggggfgggggggggggggfeb
eeggggfggggggggggggggfee
beffoffggggggggggggggffe
beeooffggggggggggggggffe
bbeffffggggggggggggggffe
beefffffggggggggggggffee
eefffeeefgggggfggggfeeeb
efffeebeeffeeeffffeeebbb
eeeeebbbeeeebeeeeeebbbbb
wh Epsilon_Eridani 1 1 0/0 246/21 284/26 319/28
wh SA2779 22 8 237/21 0/0 314/23 319/24
wh Alpha_Centauri 1 27 275/26 314/23 0/0 149/13
wh Olexti 14 28 319/28 328/24 158/13 0/0
beacon Earth 7 4
beacon Sol_Base 17 19

sector SA2779:16,5
eeeebbbbbbeeeeeb
eefebbeeeeefffee
beeeeeefffeeeffe
bbeeefffeeebeeee
bbbbeeeeebbbbbbb
wh Sol 1 1 0/0 166/13
wh Beta_Proxima 14 2 157/13 0/0

sector ZZ2986:15,5
eeeebbeeeeeebbb
eeeeebeffooeeeb
bbefeeeooofofee
beeeeeefofeeeee
beeebbeeeeebbbb
wh Hoanda 0 0 0/0 76/4
wh Beta_Proxima 1 4 76/4 0/0

sector Alpha_Centauri:19,12
beeebeeeeeebbbbbeee
eefeeeffffeebbbeefe
eeffffggggfeeeeefee
beffggggggfffffffeb
beffggggggfffffeebb
eeffggggggfffffebbb
effffgggggfffffeeeb
efoooffffffffffffee
efooooffffffffffffe
eefoofffeeefffffffe
beeffffeebeffffffee
bbeeeeeebbeeeeeeeeb
wh Faexze 1 1 0/0 169/16 109/10
wh Sol 17 1 160/16 0/0 140/14
wh Ericon 3 11 109/10 149/14 0/0
beacon Alpha_Centauri_Station 15 6

sector Beta_Proxima:19,19
beeeeeeeeeeeeeeeeee
befffffgggggggggffe
beeffffgggggggggfee
bbeefffgggggggggeeb
bbbeeeffgggggggeebb
bbbbbeeefgggeeeebbb
bbbbbbbeffffebbbbbb
bbbbbbeeffffeeebbbb
bbeeeeefffffffeeeeb
beeffffffffffffffee
eefoffffffffffffffe
efooofffffffffffffe
eoooooffffffffffffe
efoooffffeeeffffffe
efffofeeeebeeefeeee
eeffffebbbbbbefebee
beefffeebbeeeeeebbb
bbeeeffeebeffeebbbb
bbbbeeeeebeeeebbbbb
wh SA2779 2 1 0/0 174/15 179/17 197/17
wh ZZ2986 17 1 174/15 0/0 188/16 206/16
wh Lalande 6 17 179/17 188/16 0/0 164/11
wh BL3961 11 17 197/17 206/16 164/11 0/0
beacon Beta_Proxima_Station 8 8

sector Ericon:15,26
bbbeeebbbbbbbbb
bbbefebbbbbbbbb
bbbeeebbbbeebbb
bbbbeebbbeeeebb
bbeeeeebeeffeeb
beefffeeeffffeb
befffffffffffee
eeffffffffffffe
effooffffffffee
efoooffffffffeb
effooffffffffeb
eeffffggggfffeb
beeeffggggfffeb
bbbefgggggfffeb
bbeeggggggfffee
beefgggggggfffe
eeffgggggggfffe
effffggggggfeee
effffffggggeebb
effffffggggebbb
effffffffffebbb
eeffffffffeeebb
beeffffffeeeeee
bbeffffffebbeee
bbeeefffeebbbee
bbbbeeeeebbbbbb
wh Alpha_Centauri 3 0 0/0 303/23
wh XH3819 14 23 303/23 0/0
beacon Ericon_I 10 7
beacon Ericon_II 5 22

sector Olexti:8,16
bbeeebbb
bbeeebbb
bbbebbbb
bbbebbbb
bbbebbbb
bbbebbbb
eeeeebbb
efmmebbb
efmmeeee
eeeeeeee
eebebeeb
bbbebbbb
bbbebbbb
bbbebbbb
bbeeeebb
bbeeeebb
wh Sol 2 0 0/0 267/15
wh Andexa 5 15 267/15 0/0

sector Lalande:7,10
bbbbeee
bbeeefe
beeeeee
eefebbb
eggeebb
eggfeeb
eeeeeeb
bebbeeb
eeebbbb
eeebbbb
wh Beta_Proxima 5 1 0/0

sector BL3961:20,10
beebbbbbbbbbbbbbbbbb
eeeebbbbbbbbbbbbbbbb
effeeeebbbbbbbbbbbbb
efffffeeeeeeeebbbbbb
eeffeeeffffffeeeeeeb
beefebefffffffffffee
bbefeeefffeeeeeeeffe
eeefffeeeeebbbbbeeee
eeeeeeebbbbbbbbbbbbb
eebbbbbbbbbbbbbbbbbb
wh Beta_Proxima 1 0 0/0 206/17 126/9
wh Tau_Ceti 18 6 197/17 0/0 207/18
wh Siberion 0 9 126/9 216/18 0/0

sector Tau_Ceti:25,15
bbbbbbbbeeeeeeeebbbbbbbbb
bbbbbeeeeffffffeeeeeebbbb
bbbeeeffffffffffggggeeeeb
bbeefffffffffffgggggoooeb
beefffffffffffggggggoooeb
eeffeeefffffffggggggfeeeb
effeebefffffffgggggeeebbb
eeeebbeefffgggfgggfebbbee
beebbbbefgggggggfffeeeeee
bbbbbbeeggggggggfffebbbee
bbbbbbefggggggggfffeeebbb
bbbbbeefgggggggfeeefeebbb
bbbbbeeeegggggfeebefeebbb
bbbbbbbbeeeeefeebbeffeebb
bbbbbbbbbbbbeeebbbeeeeebb
wh BL3961 1 7 0/0 289/23 223/20
wh Pass_FED-01 24 8 289/23 0/0 153/9
wh WP3155 21 13 223/20 153/9 0/0
beacon Tau_Ceti 11 4

sector Pass_FED-01:18,17
eebbeeebbbbbbbbbbb
eeeeefeeeeeeeeebbb
eebbeeeeffffffeeeb
bbbbbbbeeeeeeeefee
bbbbbbbbbbbbbbeffe
bbbbbbbbbbbbeeeffe
bbbbeeeeeeeeeffeee
beeeeeeeeeeeeeeebb
eefeeebeebbbbbbbbb
effebbbbbbbbbbbbbb
effeebbbbbbbbbbbbb
eeffeeebbbbbbbbbbb
befeeeeeeebbeebbbb
beeebefffeeeeeebbb
bbbbbeffffffffebee
bbbbbeeeefeeeeeeee
bbbbbbbbeeebbeebee
wh Tau_Ceti 0 1 0/0 624/39
wh Grefaho 17 15 624/39 0/0
beacon EM_Armor_Station_Pass_FED-01 1 10

sector XH3819:16,12
bbbbbbbbbbbbbbee
bbbbbbbbbbbbbbee
bbbbbbbbbbbbeeee
bbbbbeeeeeebeffe
bbeeeeffffeeeeee
beefoffeeefffebb
eefooofebeeffeeb
eefooffebbeeefeb
beeffofebbeeeeeb
bbeeefeebbeefebb
bbbbeeebbbbeeebb
bbbbbeebbbbeebbb
wh Ericon 14 0 0/0 202/13 164/11
wh Lave 5 11 202/13 0/0 192/12
wh Orerve 11 11 164/11 192/12 0/0

sector Siberion:25,15
eeeebbbbbbbbeeeeeeeebbbbb
effebbbeeeeeeffggggeeeebb
eefeebeefffffffgggggffeee
beefebeffffggffgggggggfee
bbefeeeffffggffgggggggfeb
bbeffffffffffffgggggggfeb
eeefffffffffffggggggggeeb
efffffffffffffgggggggfebb
eeffffffffffooggggggffebb
befffffffffooogggggfffeeb
beeffffggfffoffgggfffffee
bbeefffggfffeeefffffeeefe
bbbeeffffffeebeeeeeeebeee
bbbbeeefffeebbbeebeebbbee
bbbbbbeeeeebbbbeebbbbbbee
wh BL3961 1 1 0/0 195/15 275/23
wh Daceess 15 14 204/15 0/0 144/9
wh WP3155 24 14 284/23 144/9 0/0
beacon Siberion_Station 5 4

sector WP3155:17,7
bbbbbbbeebeeeeebb
bbbeeeeeeeeffeebb
bbeefffffffeeebbb
bbeffffffffebbbbb
beeeeeeeeffebbbee
eeeebbbbeefeeeeee
eeebbbbbbeeebbbee
wh Tau_Ceti 14 0 0/0 171/9 176/14
wh Pass_FED-02 16 5 171/9 0/0 232/16
wh Siberion 0 6 176/14 232/16 0/0

sector Pass_FED-02:13,19
bbbbbbbbeeebb
bbbeebeeefeeb
bbbeeeeffffeb
bbbeebeefffeb
bbbeebbeefeeb
bbeeebbbeeebb
eeeeebbbbeebb
effebbbbbeebb
efeebbbbeeebb
eeebbbbbeeebb
bbbbbbbbeebbb
bbbbbbbeeebbb
bbbbeeeeebbbb
bbbbefeebbbbb
bbeeefebbbeeb
beefffeeeeeeb
beffffebbbeee
beefffeeeeefe
bbeeeeebbbeee
wh WP3155 1 8 0/0 420/24
wh Ayargre 12 17 429/24 0/0

sector Lave:23,16
bbbbbbbbbbbbbbbbbbbeeeb
bbbbbbbbbbbbbbeeebbbeeb
bbbbbbbbbeeeeeefeebbebb
bbbbbbbeeefffffffeeeeeb
bbbbbbeefffffffffffffee
eebbbeeffggggfffffffffe
eeeeeefffgggggffffffffe
eebbbefffgggggggfffffee
bbbbbeeefgggggggffeeeeb
bbbbbbbeffggggggffebbbb
bbbbbbbefffgggffffeeebb
bbbbbbbefffeeeffffffebb
bbbbbbbeefeebeffffffebb
bbbbbbbbeeebbeeffffeebb
bbbbbbbbbeeebbeeeeeebbb
bbbbbbbbbeeebbbbbbbbbbb
wh XH3819 19 0 0/0 301/22 234/16
wh Pass_FED-10 0 6 301/22 0/0 220/13
wh Miarin 10 15 234/16 220/13 0/0
beacon Lave_Station 18 8

sector Orerve:18,15
bbbbbbbeeebbbbbbbb
bbbbbeeefebbeeeebb
bbeeeefffebbeffebb
beeffffffebeeffeeb
eefffffffeeeffffee
effffffffffffffffe
eefffffffffffffffe
befffeeeeeffffffee
beeffebbbeeeefffeb
bbeffebbbbbbeeffee
beeffeeeeeebbeefee
eefffgggggeebbefeb
eeffggggggfebbeeeb
beeeggggggfeebbeee
bbbeeeeeeeeeebbeee
wh XH3819 8 1 0/0 157/13
wh Andexa 16 14 166/13 0/0
beacon Oreve_II 3 5
beacon Oreve_I 14 5

sector Daceess:15,8
bbbbbbbeeeeeeee
bbbbeeeeffffeee
bbeeeffffeeeebb
beeeefeeeebbbbb
eefeeeebbbbbbbb
effeeebbbbbbbbb
eeeebbbbbbbbbbb
eebbbbbbbbbbbbb
wh Siberion 14 1 0/0 194/14
wh Andexa 0 7 194/14 0/0

sector Miarin:7,20
beebbbb
beeebbb
befeeeb
befooeb
beoooeb
befoeeb
beooebb
beooeeb
beoofeb
eefffeb
eeofoee
beeoofe
bbeoooe
bbeoofe
bbefoee
bbeooeb
bbeofeb
bbeefeb
bbbeeee
bbbbeee
wh Lave 2 0 0/0 285/19
wh Ook 5 19 285/19 0/0

sector Andexa:20,15
bbbeeeebbbbbbbeeebee
eeeeffeeeeeeebefeeee
eeefffgggfffeeefeeee
bbefffggggfffffeebbb
bbeeffggggfffffebbbb
bbbeffggggfffffeeeee
bbbeffgggffffffffffe
beeefggggfffffffffee
eeffgggggfffffffffeb
efffgggggffffffffeeb
eeeegggggffffffeeebb
bbbeggggffffffeeebbb
bbbeggggffffffeebbbb
eeeefgggfffffeebbbbb
eeeeeeeeeeeeeebbbbbb
wh Olexti 14 0 0/0 86/5 210/15 226/17
wh Daceess 19 0 86/5 0/0 259/19 273/19
wh Orerve 0 2 210/15 259/19 0/0 213/14
wh Ook 0 13 226/17 273/19 213/14 0/0
beacon Andexa 12 6

sector Ook:15,15
eebbbbbbbbeebee
eeebbbbbbeeeeee
efebbbbeeeffeee
efebeeeefffeebb
eeeeeggfffeebbb
beeffggfffebbbb
bbegggfggfebbbb
bbegggfggfebbbb
bbegggfggfebbbb
bbeefffggfebbbb
bbeeeeefffeebbb
bbbbebeeeeeeeeb
bbbbebbbbbeeeee
bbbeeebbbbbbeee
bbbeeebbbbbbbee
wh Miarin 0 0 0/0 209/15 237/15 213/14
wh Andexa 14 0 209/15 0/0 203/14 218/15
wh Cesoho 14 13 237/15 203/14 0/0 211/13
wh Pass_FED-08 4 14 213/14 218/15 211/13 0/0
beacon Ook_Ook 6 7

sector Cesoho:12,7
eeeeeeeeebbb
eefffeeeebbb
beefffffeeeb
bbefffeeefeb
bbeeeeebeeeb
bbbeebbbbeee
bbbbbbbbbeee
wh ook 1 0 0/0

sector Iozeio:19,13
bbbeebbbbeeeeebbbbb
bbeeeebbeeoooeebbbb
beeffeeeeffoffeebbb
befffffeeeeeeeeebbb
beeffffebbbebebbbbb
bbeffffebeeeeeeebee
bbeffffeeefffffeeee
bbefffeebeeeeefebee
beefffebbbebbeeebbb
beffffeebeeebbebbbb
eeeeeffeeefeeeeebbb
efebeeeeeeefffeebbb
eeebbeebbbeeeeebbbb
wh Electra 17 6 0/0 223/16
wh HO_2-296 1 11 214/16 0/0
beacon Iozeio 4 5

sector HO_2-296:15,11
bbbbeebbbbbeeee
bbeeeeebbbeeffe
beefffeebeeffee
eefffffeeefffeb
effgggfffffffeb
eefggggggggffee
befggggggggfffe
beefffgggggffee
bbeeeeffffffeeb
bbbbbeeeffeeebb
bbbbbbbeeeebbbb
wh Iozeio 13 1 0/0 90/9
wh Olphize 8 10 99/9 0/0
beacon Cybernetic_Station_HO_2-296 5 1

sector Beethti:15,20
bbbbbeeebbbbbbb
bbbeeefeeeebbbb
bbeeggggggeeebb
bbefggggggffebb
beegggggggffeeb
befgggggggfffeb
eegggggggffffeb
efgggggfffeeeeb
eegggggfeeebbbb
begggggfebbbbbb
beeggggfebeebbb
bbeeefffeeeeeeb
bbbbeeeffffffee
bbbbbbeeffffofe
bbbbbbbefffoooe
bbbbbbbeffffooe
beeeeeeefffffee
eeffeeeefffffeb
efeeebbeeefeeeb
eeebbbbbbeeebbb
wh Olphize 0 19 0/0

sector Grefaho:21,20
bbbbbbbbeebbbbbbbbeee
bbbbbbeeeeebbbbbbeeee
bbbbbeefooeebbbbeefeb
bbbbbefooofeeebbefeeb
bbbbbeffoofffeeeefebb
bbbbbeffgggfffgggfebb
eebeeefggggggggggfebb
eeeefffggggggggggfeeb
eebeeffgggggggggfffeb
bbbbefffggggggggffeeb
bbbeefffffggggggffebb
bbbeffffffgggggffeebb
bbeefffffffggggfeebbb
bbefffffffffgggfebbbb
bbeeefeeefffffffebbbb
bbbbefebeeeeffffebbbb
bbbbeeebbbbeeeffeebbb
bbbeeebbbbbbbeeefeeeb
bbbefebbbbbbbbbeeeeee
bbbeeebbbbbbbbbbbbeee
wh Olphize 20 0 0/0 274/20 274/19 244/19
wh Pass_FED-01 0 7 274/20 0/0 203/14 263/20
wh Ayargre 4 19 274/19 203/14 0/0 252/18
wh Zirr 20 19 244/19 263/20 252/18 0/0

sector Olphize:19,21
bbbbbbbbbbeeeebbeee
bbbbbbbbeeefeebbeee
bbbbeeebeoofebbbeeb
bbbeefeeeoofeebeeeb
bbbeeefffooffebeeeb
bbbbbefffffffeeeebb
beebeeggggffffffeeb
beeeegggggffffeeeeb
beeffgggggfffeebbbb
bbeffgggfgggeebbbbb
bbegggfffgggebbeeee
beegggfffgggeeeefee
eefggggfgggeeeefeeb
eefggggggggebbeeebb
beffgggggggeebbbbbb
beeffggggggfeebbbbb
bbefffggggfooeebbbb
bbeefeeefeeefoeeebb
bbbeeebefebeeffoeeb
bbbbbbbeeebbeeeoeeb
bbbbbbbbeebbbbeeebb
wh HO_2-296 13 0 0/0 128/11 97/7 219/16 252/20
wh Grefaho 4 2 128/11 0/0 119/11 200/14 233/18
wh Beethti 15 5 97/7 119/11 0/0 160/11 207/15
wh Edbeeth 18 10 219/16 200/14 160/11 0/0 217/14
wh Canexin 8 20 252/20 233/18 207/15 217/14 0/0
beacon Olphize 7 11

sector Edbeeth:18,15
bbbeeebeebbeebbbbb
bbeefeeeeeeeeeebbb
beefeebeffffffeebb
befeebbeeffffffebb
befebbbbeffffffebb
eefebbbeefffffeebb
effeeeeefgggfeebbb
eeeebbbegggggebbbb
bbbbbbeegggggebbbb
bbbbeeeggggggeeeeb
bbeeefgggggggfooee
beeffgggggggfoooee
beeffggggggeeeofeb
bbeeeggggeeebeeeeb
bbbbeeeeeebbbbbbbb
wh Olphize 0 6 0/0

sector Anaam:18,20
bbbbbbeeeebbbbbbbb
bbbeeeeffeeeebbbbb
bbeeffffffffeeebbb
beefffffgggggfeebb
befffffgggggggfebb
befffffggggggggeeb
befffffgggggggggeb
beeffffgggggggggee
bbefffffggggggggfe
bbeefffffggggggfee
bbbeeeffffgggfffeb
bbbbbeeefffffeeeeb
bbbbbbbeeffffebbbb
bbbbbbbbeffffeebbb
bbbbbbbbeffffeebbb
bbbbbbbeefoofebbbb
bbeeeeeefooofeebbb
eeeffeeeffoofeebbb
effeeebeeffeeebbbb
eeeebbbbeeeebbbbbb
wh Retho 0 19 0/0

sector Ayargre:18,18
bbbbbbbbeeebbbbbbb
bbbbbeebeeebbbbbbb
bbbbeeebbeebbeeebb
bbbbeeeebeebeefeeb
bbbbbefeeeeeefffee
bbbbbefffffffffffe
bbbbbeffffffffffee
bbbbeeffffffffffeb
bbbeefffffffffffeb
bbbefffffffffffeeb
eebefgggfffffeeebb
eeeefggggggffebbbb
eebefgggggggfeebbb
bbbeefggggggffeeeb
bbbbeffgggggffffee
bbbbeefffffeeeeefe
bbbbbeeefeeebbbeee
bbbbbbbeeebbbbbbee
wh Grefaho 9 0 0/0 202/13 233/17
wh Pass_FED-02 0 11 202/13 0/0 224/17
wh Begreze 17 17 233/17 224/17 0/0
beacon Ayargre 10 8

sector Zirr:25,18
eeebbbbbbbeeeeeebbbbbbbbb
eeeebbbeeeefgggeeebbbbbbb
befebbeeffgggggggeebbbbbb
beeeebeffggggggggfebbbbbb
bbefeeeggggggggggfebbbbbb
bbeffffggggggggfffeebeebb
bbeffffggggggggffffeeeeeb
beefffffggggggfeeeeeeeeee
befffffffgggfffebbbeebeee
eefooffffeeefffeeebbbbbbb
efooooffeebeffffeebbeebbb
eefoofffebbeffffebbeeeebb
befffffeebeeffffeeeeffeeb
beeeeefebbeeffffffffffeeb
bbbbbefebbbeefffffffffebb
bbbbbeeebbbbeeeefffffeebb
bbbbbbeeebbbbbbeeeffeebbb
bbbbbbeeebbbbbbbbeeeebbbb
wh Grefaho 0 0 0/0 336/24 215/17
wh Canexin 24 7 336/24 0/0 327/24
wh Begreze 7 17 215/17 327/24 0/0
beacon Dark_Harbour_Zirr 23 13
beacon Zirr 19 14

sector Canexin:25,25
bbbbbbbbbbeebbbbbbbbbbbbb
bbbbbbbbbeeebbbbbbbbbbbbb
bbbbbbbbbeeebbbbbbbbbbbbb
bbbbbbbbeeebbbbbbbbbbbbbb
bbbbbbbbefebbbbbbbbbbbbbb
bbbbbbbbefeebbbeebbbbbbbb
bbbbbbbbeffeeeeeebbbbbbbb
bbbbbbbeefggggggeebbbbbbb
beeeeeeeffggggggfeebbbbee
eefffffffgggmmggffebbbeee
eeeeeefffgggmmgggfeeeeeee
bbbbbeeefggggggggffffffeb
bbbbbbbeefggggggffffffeeb
bbbbbbbbeeffggggffeeeeebb
bbbbbbbbbeffggggfeebbbbbb
bbbbbbbbbeffggggfebbbbbbb
bbbbbbbbbeefgggfeebbbbbbb
bbbbbbbbbbeffffeebbbbbbbb
bbbbbbbbbbeefffebbbbbbbbb
bbbbbbbbbbbeffeebbbbbbbbb
bbbbbbbbbbbeffebbbbbbbbbb
bbbbbbbbbbbefeebbbbbbbbbb
bbbbbbbbbbbefebbbbbbbbbbb
bbbbbbbbbbbeeebbbbbbbbbbb
bbbbbbbbbbbbeebbbbbbbbbbb
wh Olphize 11 0 0/0 205/16 257/17 285/24
wh Zirr 0 9 205/16 0/0 277/23 237/21
wh Retho 23 9 257/17 277/23 0/0 197/17
wh Laolla 13 24 285/24 237/21 197/17 0/0

sector Retho:22,21
bbeeeebbbbbbbeeeeebbbb
beeffeebbbbbeefffebbbb
beffffebbeeeefeeeebbbb
eeffffebbefffeebbbbbbb
effffeebeeeeeebbbbbeeb
effffebbefebbbbeeeeeee
effffebbeeebeeeeffffee
eefffeeeeebeefeeeeeeeb
befffffffeeefeebbbbbbb
eefffggggffffebbeebbbb
effffggggggffeeeeeeebb
eeeffggggggggggffffeeb
bbeeeffggggggggfffffeb
bbbbeefggggggggffeeeeb
bbbbbeffggggggfffebbbb
bbbbbefffgggfeeefebbbb
bbbbbeeffooofebeeeeebb
bbbbbbefoooooeebeefeeb
bbbbbbeeefooffebbeefeb
bbbbbbbbeeeffeebbbeeeb
bbbbbbbbbbeeeebbbbbbbb
wh Anaam 16 1 0/0 146/11 187/16 224/17 255/20
wh Meram 14 8 155/11 0/0 149/14 107/8 146/11
wh Canexin 0 10 196/16 149/14 0/0 219/20 233/20
wh QW_2-014 20 13 233/17 107/8 219/20 0/0 116/8
wh Nex_Kataam 20 19 264/20 146/11 233/20 116/8 0/0
beacon Retho 3 4

sector Meram:20,25
bbbbbbbbbbbbbbbbeebb
bbbbbbbbbbbbbeeeeeeb
bbeeebbbbbbbeefeeeeb
bbefeeeeeeeeeffeeebb
bbeeebbbbbbbeffffeeb
bbbebbbbbbbbeffoofee
beeeebbbbbbbeefooofe
eeffeebbbbbbbeffoffe
effffeeeeebbbeeeefee
eefeeeeffebbbbbbefeb
befebbeefeeeeeeeefeb
befebbbefebbbbbbefee
beeeeeeefeebbeeeefee
bbeefffeefebbeffffeb
bbbeeffeefeebeefeeeb
bbbbeeeeeffebbefeeeb
bbbbbbbbeffeebefffeb
bbbbbbbbeeffebeffeeb
bbbbbbbbbeffeeeffebb
bbbbbbbbbefffeeefebb
bbbbbbbbbeeffebefebb
bbbbbbbbbbeefebefebb
bbbbbbbbbbbeeeeeeebb
bbbbbbbbbbbbeffeebbb
bbbbbbbbbbbbeeeebbbb
wh Retho 1 9 0/0 263/20
wh Mintaka 18 10 263/20 0/0

sector Begreze:17,14
eebbbbbbbeeebbbbb
eeebbbbbbeeebbbbb
eeeebbeebbeeebbbb
beeeeeeebeefeeebb
bbeffffeeeffffeeb
bbeffffffffffffeb
beeffffffffffffeb
eeffffffffffoffee
effffeeefffoooffe
efffeebeffooooofe
eeffebbefffffofee
beeeebbeeffffeeeb
bbbeebbbeeeeeebbb
bbbeebbbbbbbbbbbb
wh Ayargre 0 0 0/0 192/12 184/13
wh Zirr 10 0 192/12 0/0 193/13
wh Usube 4 13 184/13 193/13 0/0

sector Laolla:12,17
bbbbbbbbbeeb
bbbbbbbbbeee
bbbbbbbbeefe
bbbbbbbbeffe
bbbbbbbeefee
bbbbeeeeffeb
eeeeeffffeeb
effffffffebb
eeeoeeeefeeb
bbefebbeeeee
bbefeebbbefe
beeooebbbefe
befooebbbeee
eeoffebbeeeb
eoofeebbeeee
efofebbbbeee
eeeeebbbbbee
wh Canexin 10 0 0/0 148/13 223/16
wh Usube 0 7 148/13 0/0 214/16
wh Tiacken 11 16 223/16 214/16 0/0
beacon Bio_Armor_Station_Laolla 3 13

sector Nex_Kataam:25,25
bbbbbbbbbbbbbbeeeeebbbbbb
bbeeeeebbbbbeeefffeebbbbb
beefffeebbbeefeeeefebbbbb
eeeeeeeebbbefeebbefeebbbb
efeeebebbeeefebbeeffebbbb
eefeebebeegggeeeefffebbbb
beeebbebefgggfffffffeeebb
bbbbbbebefgggeeeefgggfebb
bbbbbeeeefgggebbefgggfebb
bbbbbefffeeeeeebefgggfeeb
bbbbeefeeebbefeeeeeeeffee
bbbbeffebbbeefffeebbeefee
bbbbeffeebeefffeebbbbefeb
bbbbefffeeeffffebbbbbefeb
bbbeefffeeefffeebbbbeeeeb
beeeeeefebeefeebbbeeefebb
beeeebeeebbefebbeeefffebb
bbeebbbbbeeefebeefffffeeb
beeeebbbeefffeeefffffffee
eeffeebeeffffffeeeefffffe
eefffeeefffffffebbeefffee
beeffffffffffffeebbeefeeb
bbeffggffffeeeffeebbefebb
bbeeeggfffeebeeffeeeeeebb
bbbbeeeeeeebbbeeeeeeeebbb
wh Retho 16 0 0/0 282/20 148/13
wh Tiacken 1 20 282/20 0/0 158/14
xh 13 13 139/13 149/14 0/0
beacon Kataam 11 19

sector QW_2-014:15,9
bbeeebbbbbeebbb
bbeeebbbbeeeeeb
bbbebbeeeefofee
beeeeeefooooofe
beeeeeeffooooee
bbbeebeeeffffeb
bbeeebbbeeeeeeb
eeefebbbbbbeebb
eeeeebbbbbbbbbb
wh Retho 4 0 0/0 152/8
wh Zamith 0 8 152/8 0/0

sector Usube:14,30
bbeebbbbbbbbbb
bbeeebbbbbbbbb
bbeeebbbbbbbbb
beeebbbbbbbeee
befeeeebbbeefe
beffffebbeefee
eeooofebbefeeb
efoooeebeeeebb
eooooebbefebbb
eefofeeeeeebbb
beeffffffebbbb
bbeefgggfebbbb
bbbefgggfeebbb
bbeegggggfeeeb
beegggggggffeb
befggggggggfee
befgggggggggfe
eefgggffggggfe
effffffffgggfe
eeffffffffffee
beffffffffffeb
beefffffffffeb
bbeefffffffeeb
bbbeffffffeebb
bbbefeeeefebbb
bbbeeebbefebbb
bbbbebbbeeeebb
bbbeeebbbeeebb
bbbeeebbbbeeeb
bbbbbbbbbbeeeb
wh Begreze 3 0 0/0 249/15 376/28 386/29
wh Laolla 12 4 240/15 0/0 294/24 295/25
wh Urhoho 3 28 376/28 303/24 0/0 190/10
wh Edmize 11 29 386/29 304/25 190/10 0/0
beacon Usube 6 20

sector Tiacken:19,28
bbbbbbbbbbbbbbbeebb
bbbbbbbbbbbbbbbeebb
bbbbbbbbbbbbbbeeeeb
bbbeeeeebbbeeeeffeb
bbeefffeeeeefffffee
beefffffffffffffffe
eefffffffffffffffee
efffffffffffffffeeb
eeffffffffffffffebb
beffffffgggfffeeebb
beeffffgggggffebbbb
bbeffgggggggffebeee
bbeffgggggggffeeeeb
bbefggggggggeeeeeeb
beeggggggggfebbbbbb
eegggggggggfeebbbbb
efgggggggggffeeeebb
efgggggggggfffffeeb
eegggggffffffooffeb
befgggfeeeffoooofeb
beeffffebeeffooofee
bbeffffebbeffffooee
beeffffeebeefffffeb
befffffeebbeeeeeeeb
befffffebbeeebbeebb
beffffeebbeeebbbbbb
beefeeebbbbeebbbbbb
bbeeebbbbbbbbbbbbbb
wh Laolla 16 0 0/0 107/8 213/15 300/25
wh Nex_Kataam 16 8 107/8 0/0 133/7 220/17
wh Soessze 18 11 213/15 133/7 0/0 251/17
wh Edmize 11 25 300/25 220/17 251/17 0/0
beacon Tiacken_I 5 7
beacon Tiacken_II 4 24

sector Soessze:20,20
bbbbbbbeeeeeebbbbbbb
bbbeeeeefgggeeeebbbb
bbeeffffgggggffebbbb
beefoofgggggggfeebbb
beeffffggggggggfeeeb
bbeeeefgggggggggfeeb
bbbbbeegggggggggfebb
bbbbbbefgggggggggeeb
eeeeeeefffgggggggfeb
efeeeffffffgggggggee
eeebeeeffgggggggggge
bbbbbbeefgggggggggge
bbbbbbbefgggggggggge
bbbbbbbeffggggggggee
bbbbbbbefffffgggggeb
bbbbbbeeffffffgggfeb
bbbbbbeefffffffffeeb
bbbbbbbeeffffffffebb
bbbbbbbbeeffffeeeebb
bbbbbbbbbeeeeeebbbbb
wh Tiacken 0 9 0/0

sector Zamith:18,18
bbbbbeeebbbbbbbbbb
bbbbbefebbbeebeebb
bbbbbefeeeeeeeeeeb
bbbbbeeebbbefgggeb
bbbbbbebbbeeggggeb
bbbeeeeebeegggggee
beeefffebeegggggfe
eeffffeebbegggggfe
eeefeeebbeegggggee
bbeeebbbeeggggggeb
bbbeeeeeeggggggfeb
bbbeeeeffggggggfeb
bbbeebeffggggggeeb
bbeeebeefffffffebb
beeeebbefffffffebb
eeeebbbeefffffeebb
efebbbbbeeeeeeebbb
eeebbbbbbeebbbbbbb
wh QW_2-014 6 0 0/0 259/16
wh Faphida 1 16 250/16 0/0
beacon Bio_Weapon_Station_Zamith 2 7

sector Urhoho:18,18
bbbbbbbbbbbbbbbeee
bbbbbbbbbbbbbbeefe
bbbbbbbbbbbbbeefee
bbbbbbbbbbbbbefeeb
bbbbbbbbbbbbbeeebb
bbbbbbbbbbbbbeebbb
bbbbbbbbbbbbbeebbb
bbeebbbbbbbeeeeebb
beeeebbbbeeefffeeb
befoebbeeeffffffeb
eeooeeeefffffgggee
eoooffffffffggggfe
efoffffffffgggggfe
eeffffggggfgggggfe
beffffggggfgggggee
beeeffggggffgggfeb
bbbeeefgggfffeeeeb
bbbbbeeeeeeeeebbbb
wh Usube 17 0 0/0

sector Edmize:16,16
eeeeeebbbbbeeebb
effffeebbbeeeebb
efooofeebeeeebbb
eeffoffeeefebbee
beeffoffeeeeeeee
bbeeffffebeffeee
bbbeefffebeeeebb
bbbbeffeebbbbbbb
bbbbeffebbbbbbbb
bbbbeffeebbeeebb
bbbeefffeeeefeeb
bbeefffffffgggeb
beeffffffffgggeb
beeffeeeeeeeefeb
bbeeeebbeebbeebb
bbbbbbbbeebbbbbb
wh Usube 0 0 0/0 165/12 204/15 177/15
wh Tiacken 12 0 165/12 0/0 133/7 213/15
wh Faphida 15 4 204/15 133/7 0/0 242/17
wh TG_2-143 9 15 177/15 213/15 242/17 0/0

sector Faphida:22,14
bbbbbbbbbbbbbbbbeeebbb
bbbbbbeeeeeebbbeeeebbb
bbbbeeeffffeebbeeebbbb
bbeeefffffffebeeebbbbb
beefffffffffebefebbbbb
eeffffffffffeeefebbbbb
efffffffffffffffeeebbb
eeffffffffffffffffebbb
beefffffffffffffffeeeb
bbeffoofofffffffooffeb
bbefooooofffffffooofee
bbeeffooeeeefeeefoffee
bbbeeefeebbeeebeefeeeb
bbbbbbebbbbeebbbeeebbb
wh Zamith 17 0 0/0 234/18 165/12 175/13
wh Edmize 0 6 234/18 0/0 228/21 157/13
wh Mizar 21 10 165/12 228/21 0/0 126/9
wh Datiack 12 13 175/13 157/13 126/9 0/0
beacon Faphida 8 6

sector Mizar:16,23
bbbbbeeebbbbbbbb
bbbbeefeeebbbbbb
bbbeefoffebbbbbb
bbbefoooeebbbbbb
bbbeffofebbbbbbb
bbbefffeebbbbbbb
bbbefffebbbbbbbb
bbeefggebbbbbbbb
bbeefggeeeeebbbb
bbbeefffffeebbbb
bbbbeeeeefebbbbb
bbbbbeebeeebbbbb
bbbbbeebbbbbbbbb
bbbeeeeebbbbeeee
bbeefffeeebeeeee
eeeffffffeeefeee
effffffffffffebb
efffffffffeeeeeb
efggfeeeefebefee
efggfebbefeeeffe
eefffebbefeeefee
beeefeeeeeebeeeb
bbbeeeeeeebbbeeb
wh Quince 15 14 0/0 177/15
wh Faphida 0 16 177/15 0/0

sector TG_2-143:11,12
bbbbbbbbeee
bbbbbeeeeee
bbbeeefeeeb
beeeeeeebbb
beefebbbbbb
bbeeeeeeeeb
bbbeeeeefeb
bbbbbbbeeee
bbbbbbbbefe
bbbeeeeeeee
eeeefffeeeb
eeeeeeeebbb
wh Edmize 9 0 0/0 287/17
wh Pass_EMP-01 0 11 287/17 0/0

sector Datiack:19,15
bbbbbbbbbbeeebbbbbb
bbbbbbbeebefebbbbbb
bbeeeeeeeeeeebbbbbb
beeffffffffebbeeebb
befffffffffeeeefeeb
befffffffgggggggfeb
befffffffggggggggeb
beeffffffggggggggeb
bbeefffffffggggggee
bbbeeeeeeefffggggfe
bbbbbbeebefeeegggfe
bbbbbbbbbeeebeeffee
bbbbbbbbbbebbbeeeeb
bbbbbbbbbeeebbbbbbb
bbbbbbbbbeeebbbbbbb
wh Faphida 11 0 0/0 185/14
wh Pass_EMP-02 10 14 185/14 0/0
beacon Datiack 5 5

sector Pass_EMP-01:20,25
bbbbeeebbbbbbbbbbbbb
bbbbeeebbbbbeebbbbbb
bbbbbebbbbbeeeeebbbb
bbbeeeebbbbeoofeeebb
beeefeebbbeefofffeeb
beffeebbbbefffffffeb
eeffebbbbbeffeeeeeeb
efffeebbbeefeebbeebb
eefffeebbeffebbbeebb
beffffeeeeffeebbeeeb
beefffeeeefffebbeeeb
bbeeffebbeffeebbbeeb
bbbefeebbeefebbbbeeb
bbbeeebbbbeeebbbbeeb
bbbbbbbbbbbbbbbbbeeb
bbbbbbbbbbbbbbbbbeeb
bbbbbbbbbbbbbbbbeeee
bbbbbbbbbbbbbbeeefee
bbbbbbbbbbbbbeefeeeb
bbbeebbbbbbbbefeebbb
eeeeeebbbbbbeefebbbb
eeeeeeeeeeeeeeeebbbb
bebbeefffffeeebbbbbb
eeebbeeeeeeebbbbbbbb
eeebbbbbbbbbbbbbbbbb
wh TG_2-143 5 0 0/0 728/44
wh Iceo 1 24 728/44 0/0

sector Pass_EMP-02:18,20
bbbbbbbeeebbbbbbbb
bbbbbbbeeebbbbbbbb
bbbbbbbbebbbbbbbbb
bbbeeeeeeebbbbbbbb
bbeeffffeebbeeeebb
beefffeeebbbeffeeb
eefeeeebbbbeefffee
effebbbbbbbefffffe
eefeebbbbeeefeeefe
beffebbbeeffeebeee
beefeeeeeffeebbeeb
bbeeeeeeeeeebbbeeb
bbbbbbbbbeebbbeeeb
bbbbbbbbbbbbbbefeb
bbbbbbbbbbbbbeefeb
bbbbbbbbbbbeeeffeb
bbbbbbbbbbbeeeeeeb
bbbbbbbbbbbbebbeeb
bbbbbbbbbbbeeebbbb
bbbbbbbbbbbeeebbbb
wh Datiack 8 0 0/0 480/30
wh IP_3-251 12 19 480/30 0/0

sector Iceo:20,14
bbbbbeeebbbbbbbbbbbb
bbbbbeeebbbbbbbbbbbb
bbbbbbebbbbbbbbbbbbb
bbeeebebbbbbbbbbbbbb
beefeeeeeebbbbbbbbbb
befffffffeeeebbbbbbb
eeffffffffffeeeeeeee
effffffffgggfeeeeeee
efffffffggggfebbeebb
eeeffffgggggfebbbbbb
bbeffffggggffebbbbbb
beeffffggggffeebbbbb
eeeeefffffeeeeebbbbb
eeebeeeeeeebbbbbbbbb
wh Pass_EMP-01 6 0 0/0 259/16 193/13
wh IP_3-251 19 6 259/16 0/0 271/19
wh Quana 0 13 193/13 271/19 0/0
beacon Iceo 4 8

sector IP_3-251:16,9
bbbbbbeeebbbbbbb
bbbbbbeeebbbbbbb
beebbbbebbbbbbbb
eeeebbbebeeebbbb
eooebbeeeefebbbb
eofeeeeffffeeebb
efoffeeeeeeeeeee
eeeeeebbbbbbeeee
eebeebbbbbbbbbee
wh Pass_EMP-02 7 0 0/0 191/11 172/10
wh Olbea 15 7 191/11 0/0 231/15
wh Iceo 0 8 172/10 231/15 0/0

sector Pass_EMP-07:25,23
bbeeeeeeeebbbbbbbbbbbbbbb
beefeeeefeebbeeeeebbbbbbb
beefebbeefeeeefeeeeebbbbb
bbeeeeeeefeeeefebefebbbbb
bbbeebbbeeebbeeebefebbbbb
bbbeebbbbbbbbbeeeeffbbbbb
bbbeebbbeebbbbeeeeefebbbb
eebeeeebeebbbbbeebefebbbb
eeeeffeeeebbbbeeebefeebee
eebeffebeeebbbeeeeeffeeee
bbbeefebeeebbbbeeeeeeebee
bbbbefebbebbbbbbbbbbeebbb
bbbbefeebebbbbbbbbeeeebbb
bbbeeffeeeebbeebeeeffebbb
bbbeeeeeeeebbeeeeeeeeeebb
bbbbebebebbbbefffebbefebb
bbbeeeeeeebbeeeeeeeeeeebb
bbeeeeeffebbefebeeeeeebbb
bbeeebeeeebbefeeeebeebbbb
bbbeeeeebbbeeffeeebbbbbbb
bbbeeefeeeeeffeebbbbbbbbb
bbbbbeeeeffeeeebbbbbbbbbb
bbbbbbbbeeeebbbbbbbbbbbbb
wh PP_5-713_East 0 8 0/0 449/26
wh Quana 24 9 449/26 0/0

sector Quana:16,26
bbbbeeebbbbbbbbb
bbbbefeeebbbbbbb
bbbbeeeeeebbbbbb
bbbeeefefeebbbbb
bbeefefefeebbbbb
bbeffeeefebbbbbb
beeffgggfeebbbbb
befgggggggeebeeb
eefgggggggfebeeb
eeeeggggggfeeeeb
bbbegggggffoofeb
eebegggggfooooee
eeeeggggfooooofe
eebeggggfffooffe
bbbegggffffffffe
beeeffffeeeefeee
eeffffffebbeeebb
efffffffebbbbbbb
efffffffeeebbbbb
eeffffffffeebbbb
beeefeeeeffeebbb
bbbefebbefffeebb
bbbefebbeeeefeee
bbbeeebbbbbeeeee
bbbbeeebbbbbbbee
bbbbeeebbbbbbbbb
wh Iceo 14 7 0/0 218/14 253/19 244/19
wh Pass_EMP-07 0 12 218/14 0/0 218/15 209/15
wh Tiexen 15 23 253/19 218/15 0/0 203/14
wh Phicanho 5 25 244/19 209/15 203/14 0/0
beacon Quana_Station 8 16

sector Zeolen:15,12
bbbbeebbbbbbbbb
bbeeeeebbbbeeeb
beefffeeeeeefee
befffeebbbbeeee
eefffebbbbbbebb
effffeebbbbbebb
eeffeeebbbbbebb
beeeebbbbbbbebb
bbeebbbbbbbeeeb
bbeeebbbbbeeeeb
beeeebbbbbeeebb
beeebbbbbbbbbbb
wh Adaa 2 11 0/0

sector Olbea:21,22
bbbbbbbbbbbeeeebbbbbb
bbbeebbbeeeefoeeebbbb
bbbeeebbefffooofebbbb
bbbeeeeeefgggoffeebbb
bbbbbeffffggggggfebbb
bbeeeefffggggggggeebb
beefffffgggggggggfeeb
befffffggggggggggffeb
eefffffggggggggggffeb
effgggfggggggggggggee
efggggfggggggggggggfe
efggggffffffffgggggee
efgggffffffffffgggfeb
efffffeeeffffffffffeb
eefffeeeeffffffeeeeeb
beffeebefffffffebeebb
beffebbefffffffeebbbb
beefebeeffffffffebbbb
bbefebeeffffffffeeebb
bbeeebeefffffeeeeeeee
bbeebbbeeefeeebbbeeee
bbeebbbbeeeebbbbbbbee
wh IP_3-251 3 1 0/0 283/21 245/20
wh RV_2-578 20 20 283/21 0/0 293/23
wh Adaa 2 21 245/20 293/23 0/0
beacon Olbea 11 16

sector Tiexen:19,20
bbbbbbbbbbeeebbbbbb
bbbbbbbeeeefeeebbbb
bbbbbeeeffffffeebbb
eebbeefffgggfffeebb
eeeeefffggggggffebb
eeffffffgggggggfeeb
beefffffggggggggfeb
bbegggffggggggggfee
bbegggggfgggggggffe
beeggggggggggggfffe
eeffggggggfggggffee
efffggggggfgggfffeb
effffffgggfgggffeeb
effffoffffffffffebb
effoooooffffffffebb
eeffooofffffffffeeb
befffoffffffeeeeeee
beeffffffeeeebbbeee
bbeeefffeebbbbbbbee
bbbbeeeeebbbbbbbbbb
wh Quana 0 3 0/0 231/18
wh Ska 18 17 231/18 0/0
beacon Tiexen_Station 11 9

sector Adaa:22,24
bbbbbbbeebbbbbeeebbbeb
bbbeebbeebbbbeefeebeee
bbbeeeeeeeebbefffeeeee
bbeeffffffeebefoofeeee
bbeffggggffeeeoofeeeeb
beefgggggfggggfffeebbb
befggggggggggggffebbbb
beggggggggggggggfeeeeb
beggggggggggggggffffee
eegggggggggggggggfoofe
efgggggggggggggggfoofe
eefggggggggggggggffoee
beffggggggggggggffffeb
beffffgggggggggffffeeb
beeffffgggfffffffffebb
bbefffffffffffffffeebb
bbefffffffffffeeeeebbb
bbeefffffeeeffebbbbbbb
bbbefffffebeffeebbbbbb
bbbeeffffebeffeebbbbbb
bbbbeefeeebeeeebbbbbbb
bbbbbeeebbbbeebbbbbbbb
bbbbbbbbbbbeeebbbbbbbb
bbbbbbbbbbbeeebbbbbbbb
wh Zeolen 7 0 0/0 219/15 295/22
wh Olbea 21 1 219/15 0/0 273/21
wh Ska 12 22 295/22 273/21 0/0
beacon Adaa_Station 14 16

sector RV_2-578:14,12
eebbbbbbbeeebb
eeeebbbbeefeeb
eeeeebbeefofeb
bbeeeebeeoooeb
bbbefeebeoooeb
bbbeffeeefofeb
bbeefffeeeffee
bbeefffebeefee
bbbeeefebbeeeb
bbbbbeeebbbeeb
bbbbbbeeebbbbb
bbbbbbeeebbbbb
wh Olbea 0 0 0/0 164/11
wh Urandack 7 11 164/11 0/0

sector Phicanho:13,25
bbbbbbeebbbbb
bbbbbbeebbbbb
bbbbeeeebbbbb
bbeeeffeeeebb
beeggggfffeeb
beggggggfffeb
eeggggggfffee
efgggggggggge
eefggggggggge
beeeeggggggge
bbbbefffgggge
bbbbeeffgggge
bbbbbeffgggfe
bbbbeeffffffe
bbbeeffffffee
bbeefffffffbb
bbeeffffffebb
beeefffffeebb
befffffeeebbb
eeffeeeebbbbb
eeeeebbbbbbbb
eebeebbbbbbbb
bbbeeeeeeeebb
bbeeffffffeeb
bbeeeeeeeeeeb
wh Quana 6 0 0/0 339/27
wh Inliaa 10 23 339/27 0/0
beacon Phicanho 7 15

sector Ska:40,25
bbbbbbbbbbbbbbbbbbbbbbbeeebbbbbbbbbbbbbb
bbbbbbbbbeeeeeeeeebbbbeefebbbbbbbbbbbbbb
bbbbbbbeeefffffffeebbbeffebbbbbbbbbbbbbb
bbeeebeefffffoofffeebbeeeebbbbbbbbbbbbbb
bbefeeefffffoooooffebbbeebbbeeeebbbbbbbb
bbeeffgggfoooooffffeebeeebbbeffeebbbbbbb
bbbeffgggffoooffffffebefeebeefffeebbbbbb
bbbeffffffffffffffffeeeffeeefffffeeeebbb
beeefggggffffffffffffffffffffgggffffeebb
beffgggggfffffffffffffffffffggggggfffeeb
eeffgggggffffffffffffffffffgggggggggffeb
efffggggffffffffffffffffgggggggggggggfee
eeefffffffffeeeeffffffffgggggggggggggffe
bbefooooffffebbeefffffffgggggggggggggffe
beeffoooffffeebbefffffffffgggggggggggfee
eeffffoooffffeeeeffffffffgggfgggggggffeb
efffffffffffffffffffffffgggggffffffffeeb
eeffffffffffeeeeeefffffggggggggffffffebb
befeeeefffggebbbbeeffffggggggggfffffeebb
beeebbefffggebbbbbeffffggggggggfeeeeebbb
beebbeefffffebbbbbeffffgggggfffeebeebbbb
bbbbeefeeeeeebbbbeeffooooffeeefebbbbbbbb
bbbbeeeebbbbbbbbbefffffoofeebeeebbbbbbbb
bbbbbbbbbbbbbbbbbeeeeeffeeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbeeeebbbbbbbbbbbbbbb
wh Adaa 24 1 0/0 285/24 251/19
wh Tiexen 3 4 285/24 0/0 329/31
wh PO_4-991 34 20 260/19 338/31 0/0
beacon Skara 21 12

sector Urandack:20,15
bbbeeeeebbbeeebbbbbb
beeefffeebbefeebbbbb
eegggggfeebeffeebbbb
efgggggffeeeeeeebbbb
efggggfffffeebbbbbbb
eefgggffffeebbbbbbbb
befgggfffeebbbeebbbb
befgggfffebbbbeeeeee
beeffffffeeeeeeffeee
bbeefeeeeebbbbefeebb
bbbefebeebbbbeefebbb
bbeeeebbbbbbbeefeeee
beeeebbbbbbbbbeefmme
eeeebbbbbbbbbbbefmme
eeebbbbbbbbbbbbeeeee
wh RV_2-578 12 0 0/0 260/17 194/14
wh An_Dzeve 19 7 260/17 0/0 307/19
wh PO_4-991 0 14 194/14 307/19 0/0
beacon Urandack_Station 9 5

sector An_Dzeve:23,18
bbbbbbbbbbbbeeebbbbbbbb
bbbbbbbbbbeeefeeeebbbbb
bbbbbbbbbeefgggffeeebbb
bbbbbbbbbeggggggggfeebb
bbbbbbbbeegggggggggfeeb
bbbbbbbbegggggggggggfeb
bbbbbbbbegggggggggggeeb
bbbbbbbbegggggggggggebb
bbbbbbbbegggggggggggebb
eebbbbbeefggggfffgggebb
eeeeeeeeffgggfffffffeeb
eebbbbbefffffffffffffeb
bbbbbbeefffffffffffffeb
bbbbbbefeeeefffffffffee
bbbbbbefebbeeeffffffffe
bbbbbbeeeebbbeeffffffee
bbbbbbbeeebbbbeeeeffeeb
bbbbbbbbeebbbbbbbeeeebb
wh Urandack 0 10 0/0 220/13
wh Canaab 9 17 220/13 0/0
beacon An_Dzeve 17 12

sector Inliaa:12,10
eeeebbbbbbbb
eeeeeeeebbbb
bbeffffeeebb
bbeeffeeeebb
bbbeefeeeeeb
bbbbefeeefee
bbbbeeeffffe
bbbbbbeefffe
bbbbbbbeeeee
bbbbbbbbbbee
wh Phicanho 0 0 0/0 155/11
wh Kenlada 11 9 155/11 0/0

sector PO_4-991:20,14
bbbbbbbbbbbbbbbbbeee
bbbbbbeeebbbbbbeeefe
bbeebeefeeebbbeeffee
bbeeeeffffeeeeefeeeb
bbeeeffffffoffffebbb
bbbbeefofoooffffeebb
bbbbbeffooooofffeebb
bbbeeefffofofffeebbb
beeeffeeefffoffebbbb
eefeeeebeefffffeebbb
eeeebbbbbeeffeeeeebb
eebbbbbbbbeeeebefeeb
bbbbbbbbbbbbbbbeffee
bbbbbbbbbbbbbbbeeeee
wh Urandack 18 1 0/0 187/16 188/17 138/12
wh Ska 2 2 196/16 0/0 143/8 196/16
wh Kenlada 1 10 197/17 143/8 0/0 197/17
wh Sigma_Draconis 18 13 147/12 196/16 197/17 0/0

sector Canaab:18,13
bbbbeebbbbbbeebbbb
bbeeeeeebbbeeebbbb
beefoooeebbefeebbb
beffffooeeeeffeeeb
eefeeeefffffggggee
efeebbeeffffggggfe
eeebbbbeefffffggee
eebbbbbbefffffffeb
bbbbbbbeefffffffeb
bbbbbbbefffffffeeb
bbbbbbeeeeeffffebb
bbbbeeefebeeefeebb
bbbbeeeeebbbeeebbb
wh An_Dzeve 12 0 0/0 194/14 174/12
wh Lamice 0 7 194/14 0/0 223/16
wh Grecein 4 12 174/12 223/16 0/0
beacon Canaab 13 8

sector Kenlada:25,20
bbbbbbbbbbbbbbbbbbbbbbeeb
bbbbbbbbbbbbeebbbbbbbeeeb
beeeebbbbeeeeeeeeebbeeeeb
bbeeeebbeefffffffeebeeebb
bbefeeeeegggffgfffeeeebbb
bbeeeffffggggggggffffebbb
bbbbefgggggggggggffffebbb
bbbeefgggggggggggffffeebb
eeeeffggggggggggffffffebb
effffffgggggggggffffffeeb
eefffffgggggggggfffffffeb
beeffffgggggggggfggggffeb
bbeefffggggffgggfggggffeb
bbbeeefffffeeefffggggffee
bbbbbefffffebeeffffffffee
bbbbbeffffeebbeeeeeeeffeb
bbbbbeefeeebbeeebbbbeefeb
bbbbbbeeebbbbeeebbbbbeeeb
bbbbbbbbbbbbbbeeebbbbeebb
bbbbbbbbbbbbbbeeebbbbbbbb
wh PO_4-991 22 0 0/0 288/22 271/19
wh Inliaa 1 2 288/22 0/0 276/17
wh Lianla 15 19 271/19 276/17 0/0
beacon Kenlada_Station 21 7

sector Sigma_Draconis:25,20
bbbbbbbbbbbbbbbbbbeebbbbb
bbbbbbbbbbbbbbbeeeeeeebbb
eebbbbbbbbbbbeeeffoooeebb
eeeebeebbbbeeefffooofeebb
eefeeeeebbbeffffffeeeebbb
beeffffeebeegggfoeebbbbbb
bbeeffffebefgggggebbbbbbb
bbbeffffeeefgggggeebeeeee
bbbefffffeeefggggfeeeffee
bbeefffffebefgggfffffeeeb
beeffffffebefffggffeeebbb
beggggfffeeeffgggeeebbbbb
eeggggffffffffgggebbbbbbb
efggggfffffeeefffebbbbbbb
eeegggfffffebeeffebbbbbbb
bbefffggffeebeeffeebbbbbb
bbefffggfeebbeffeeebbbbbb
bbeeefffeebbbeffebbbbbbbb
bbbbeeeeebbbbefeebbbbbbbb
bbbbbbbbbbbbbeeebbbbbbbbb
wh PO_4-991 0 2 0/0 281/24 227/20
wh Miayack 24 7 281/24 0/0 182/15
wh VH_3-344 14 19 227/20 182/15 0/0
beacon Sigma_Draconis_Base 8 11

sector Miayack:24,14
bbbbbbbbbbeeeeebbbbbbbbb
bbbbbbbbeeefffeeeebbbbbb
bbbbbbbeeggggggggeeebbbb
bbbbbbbefgggggggggfebbbb
bbbbbeeefgggggggggeebbbb
bbbbeefffffffgggggebbbbb
eeeeeffffeeeffgggeebbbbb
eefffffffebeefgggebbbbbb
beeefffffebbeffffeebbeee
bbbeeffffebbeeffffeeeeee
bbbbeeefeebbbefffffffeeb
bbbbbbeeebbbeefofffeeebb
bbbbbbbbbbbbeeooeeeebbbb
bbbbbbbbbbbbbeeeebbbbbbb
wh Sigma_Draconis 0 6 0/0 266/23
wh Exinfa 23 8 266/23 0/0
beacon Miayack_Station 11 6

sector Exinfa:10,20
bbbeeebbbb
bbeefeebbb
beegggebbb
beggggeeee
beggggfeee
eegggfeebb
efffffebbb
eeeeffebbb
bbbeffebbb
bbeeffeebb
eeeffffeeb
efffffffeb
eeffffffee
befffffffe
befffffffe
beffffffee
beefffffeb
bbeeefffeb
bbbbeeeeeb
bbbbbbeebb
wh Lamice 9 3 0/0 117/9
wh Miayack 0 6 117/9 0/0
beacon Exinfa 5 14

sector Lamice:25,22
bbbbbbbbeeeeebbbeeeeebbee
bbbbbeeeefffeeeeefffeebee
bbbbeegggggggggfffeeeeeee
bbbeeggggggggggffeebeeeee
bbbefggggggggggffebbbbeeb
bbeegggggggggggggeeebbbbb
bbefgggggggggfgggffeebbbb
bbefggggffffffgggfffeeebb
bbeeffffffffffffffffffeeb
bbbeffffffffeeeeefffoofee
eeeeffffffffebbbeefffooee
eeeefffffffeebbbbeffeeeeb
bbbeeefffffebbbbeeffebeeb
bbbbbeeffffebbbbefffebebb
bbbbbbeffffebbbeefffeeebb
bbbbbbeffffeebeegggfeeebb
bbbbbeefffffeeegggggebbbb
bbbeeefooffffffgggggeeebb
bbeefooooofeeeegggggffeeb
bbeefooooffebbeeeeeeffeeb
bbbeeeeeffeebbbbeebefeebb
bbbbbbbeeeebbbbbbbbeeebbb
wh Canaab 24 0 0/0 317/24 267/19
wh Exinfa 0 10 317/24 0/0 284/23
wh Grecein 22 14 267/19 284/22 0/0
beacon Lamice 8 9

sector Grecein:13,16
bbbbbbbbeebbb
bbbbbeebeeebb
bbbbeeeeefeeb
bbbbegggggfeb
bbbbegggggfee
bbbbegggggffe
bbbbeggggfffe
bbbbegggfffee
bbbeefffffeeb
bbbefffffeebb
beeefffffebbb
beeffffffebee
bbeefffffeeee
bbbeefffeebee
bbbbeeefebbbb
bbbbbbeeebbbb
wh Canaab 8 0 0/0 167/14 185/14
wh Lamice 1 11 167/14 0/0 155/11
wh Pass_EMP-03 12 12 185/14 155/11 0/0
beacon Grecein 7 9

sector Lianla:20,20
bbbbbbbbbeebbbbbbbbb
bbbbbbbbbeeebbbbbbbb
bbbbbbbbeeeebbbeebbb
bbbbeeeeefebbbeeeebb
bbbeefooffebeeeffeeb
bbbefoooffeeefffffeb
bbeeffofofffggggfeeb
bbeeeefffffgggggfebb
bbbbbeeffffgggggfeeb
bbbbbbeffffgggggffeb
eebbeeeffffggggfffee
eeeeefffffffggggggfe
eebbeffffffgggggggfe
bbbbefffffggggggggee
bbbeefffffggggggfeeb
bbeefeeeefggggfeeebb
bbeeeebbeeeeeeeebbbb
bbbeebbbeebbebbbbbbb
bbbbbbbbeeebbbbbbbbb
bbbbbbbbeeebbbbbbbbb
wh Kenlada 10 0 0/0 231/15 244/19
wh Pass_EMP-08 0 11 231/15 0/0 191/11
wh XC_3-261 9 19 244/19 191/11 0/0
beacon Lianla 9 10

sector VH_3-344:8,16
bbbeebbb
bbeeebbb
beefeebb
eefffeeb
effffeeb
eeffeebb
beffebbb
beffeeee
beeffeee
bbeefebb
bbbefeeb
bbeeffeb
beeffeeb
eeffeebb
eeeeebbb
eebbbbbb
wh Sigma_Draconis 4 0 0/0 135/9 177/15
wh Edeneth 7 7 135/9 0/0 116/8
wh Waiophi 0 14 177/15 116/8 0/0

sector Edeneth:12,7
bbeeeebbbbbb
beeffeeeebbb
eeffeeeeebbb
eeffebeebbbb
beeeebeeebee
bbeebbeeeeee
bbbbbbbeebee
wh VH_3-344 0 3 0/0

sector XC_3-261:16,13
bbbbbbbeeebbbbbb
bbbbbbbeeebbbbbb
bbbbbbeeebbbbbbb
bbeeeeeeebbbbbbb
beefffeebbbbbbbb
eeffffebbbbeeeee
eeffffeebbeeeeee
befffffeeeefebbb
eeeeeofofffeebbb
eeebefofffeebbbb
bebbeefoofebbbbb
eeebbeeeeeebbbbb
eeebbbeebbbbbbbb
wh Lianla 8 0 0/0 230/14 192/12
wh Waiophi 15 5 230/14 0/0 232/16
wh Pass_EMP-09 1 12 192/12 232/16 0/0

sector Waiophi:17,15
bbbbbbbbbbeeebbee
bbbbbbbeeeefebeee
bbbbbbeeffffeeeee
bbbbbeefffffffeeb
bbbbeeffffffffebb
beeeefffffffffeee
eeffffffffffffffe
eeefffffffffgggfe
bbeeeffffffggggee
bbbbeefeeegggggeb
bbbbbefebegggggeb
bbbbbefeeegggggeb
bbbbbeefffgggeeeb
bbbbbbeeeffeeebbb
bbbbbbbbeeeebbbbb
wh VH_3-344 16 0 0/0 196/16
wh XC_3-261 0 7 196/16 0/0
beacon Waiophi 8 5
beacon EM_Weapon_Station_Waiophi 7 12

sector Pass_EMP-06:25,13
bbbbbbbeeeeebbeebeebbbbbb
bbbbbbeefffeeeeeeeeeeeebb
bbbbbbeeeefeeffffffeeeeeb
bbeebbbbbeeeeffffeeebefee
beeeeebbbbeeefeeeeeeeeeee
eefffeeeebbbeeebeeeeffebb
eeffffeeeeebbbbbbbbeffeeb
beffffeeeeeeebbbeeeeffeeb
beeeeeefeeggeeeeefffffebb
bbeebbeeeeggffeeffeeffebb
beeeebbbbeeeffeeffeeeeebb
beeeebbbbbbeefffeeeeebbbb
bbbbbbbbbbbbeeeeebbbbbbbb
wh Zuben_Elakrab 7 1 0/0 417/29
wh LN_3-141 4 10 417/29 0/0

sector Pass_EMP-04:25,25
bbbbbbbeebbbbbbbbbbbbbbbb
beebbbeeebeebbeebeeeebbbb
beeeeeefeeeeeeeeeeffeeebb
eeebbbeeebeefeefffffffebb
eeebbbbebbbeeeeffeeeffebb
bebbbbeeebbbeeeeeebeefeeb
bebbbeefeebbbeebbbbbeffee
bebbbeeeeeebbbbbbbbbefffe
bebbbbeeefebbbbbbbbbeffee
bebbbbeeeeeebbeeeebbeeeeb
eeeebbbbbeeeeeeffeebeeeeb
eefeebbbbbeeeeeeefebeefeb
beffeeebbbbbeebbefebbefee
beeeefeebbbbbbbeeeebbeffe
bbeeeffebbbeeeeeeebbbeffe
bbeefffeeeeeffffebbeeefee
bbbeefffffffffffebeefffeb
bbbbefffffffeeefeeeffffeb
bbbeefffffffebeeffffffeeb
bbbefffeeeffeebeffeeffebb
bbbeeffebeeffebeefeeeeebb
bbbbeeeebbeeeebbeefeebbbb
bbbbbbbbbbbbebbbbeeebbbbb
bbbbbbbbbbbeeebbbbbbbbbbb
bbbbbbbbbbbeeebbbbbbbbbbb
wh AN_2-956 7 2 0/0 393/24
wh Daurlia 12 24 402/24 0/0

sector Pass_EMP-05:13,20
bbbbbeeebbbbb
bbbbbeeebbbbb
bbbbbbebbbbbb
bbbbbeeeebbbb
bbbbbeeeebbbb
bbbbbeeeeeebb
bbbbbeeeffeeb
bbbbbbbeeefee
bbeeeebbbefee
bbeeeeeeeeeeb
bbeeeffeefebb
beeeeeeeefebb
eefebbeeeeebb
eefeebbbeebbb
beffeeebbbbbb
beefffeebbbbb
bbeeeeeebbbbb
bbbbbbebbbbbb
bbbbbeeebbbbb
bbbbbeeebbbbb
wh Waarze 6 1 0/0 317/20
wh PI_4-669 6 19 317/20 0/0

sector LN_3-141:6,6
bbbeee
bbbeee
bbbbeb
beeeee
eeeeee
eeebee
wh Pass_EMP-06 3 0 0/0 114/6 95/5
wh Urlafa 0 5 114/6 0/0 95/5
wh WG_3-288 5 5 95/5 95/5 0/0

sector Daurlia:14,15
bbbbbbeeebbbbb
bbbbbbeeebbbbb
bbeebbbebbbbbb
beeeeeeeeebbbb
befffffffeebbb
befffffffeebbb
eeffffggfebbbb
eeffffggfeeeee
beefffffffffee
bbefffffgggeeb
bbeffeeegggebb
beefeebeffeebb
eeeeebbeeeebbb
eeebbbbbeebbbb
eebbbbbbbbbbbb
wh Pass_EMP-04 7 0 0/0 163/10 184/13
wh PI_4-669 13 7 163/10 0/0 166/13
wh Quator 0 13 184/13 166/13 0/0
beacon Daurlia 4 6

sector PI_4-669:9,10
bbbeeebbb
bbbefebbb
bbbeeebbb
bbbbebbee
bbeeeeeee
beeffffee
eeffeeeeb
eefeebeee
beeebbeee
bbeebbbee
wh Pass_EMP-05 4 1 0/0 105/6 116/8 134/8
wh Daurlia 0 6 114/6 0/0 57/3 125/8
wh Delta_Pavonis 2 9 125/8 57/3 0/0 114/6
wh Eta_Cassiopeia 8 9 143/8 125/8 114/6 0/0

sector Urlafa:17,16
bbbbeeeebbbbeeeee
bbeeeffeebbeeeeee
beegggggeebeeebbb
eegggggggeeeebbbb
efgggggggggfeebbb
eegggggggggffeebb
beeggggggggfffebb
bbegggggffffffeeb
bbeefffffffffffee
bbbeeffgggggeeeee
bbbbefggggggebbee
bbeeefggggggeebbb
bbeeffgggggggeebb
bbbeeegggggggfebb
bbbbbeeffeeeeeebb
bbbbbbeeeebbbbbbb
wh LN_3-141 16 0 0/0 163/10 213/14
wh WG_3-288 16 9 163/10 0/0 176/14
wh SZ_4-419 2 12 213/14 176/14 0/0
beacon Urlafa 11 7

sector WG_3-288:9,13
bbeeeebbb
bbeeeebbb
bbbbeeebb
bbbbefeeb
bbbbeffeb
bbbeeffee
eeeefffee
eeefffeeb
bbeeffebb
bbbeefeee
bbbbeeefe
bbbbbbeee
bbbbbbbee
wh LN_3-141 2 0 0/0 143/8 146/11
wh Urlafa 0 6 143/8 0/0 116/8
wh Iniolol 8 11 146/11 116/8 0/0

sector Quator:18,18
bbbbbbbeeebbbbbbbb
bbbbbbeefeebbeebbb
bbbbbeefooeebeeebb
bbbbbeeooooeeefebb
beebbbefoofofffebb
eeeeebeffffffffeeb
eeffeeegggfffffeeb
befggggggggfeeeebb
befggggggggfebbbbb
befggggggggfeebbbb
beefgggggffffeeeee
bbeegggggfffffeeee
bbbeffffffffffebbb
bbeefffffffffeebbb
bbefeeefffffeebbbb
beeeebeffffeebbbbb
eeeebbeeeeeebbbbbb
eeebbbbbbbbbbbbbbb
wh Daurlia 13 1 0/0 164/11 202/15
wh Delta_Pavonis 16 10 164/11 0/0 186/15
wh Zezela 1 16 202/15 186/15 0/0
beacon Quator 10 12

sector Delta_Pavonis:14,27
bbbeebbbbbbbbb
bbbeeebbbbbbbb
bbbeeeeebbeeee
bbbbeffeeeeeee
bbbeefffffeebb
bbbefofffeebbb
bbeeoooffebbbb
beeofofffebbbb
beeofgggfeebbb
bbeegggggfeebb
bbbegggggfeebb
eeeegggggfebbb
eeefgggggfebbb
bbefgggggfeeee
beefffgggffeee
eefffffeeeeeeb
eefffeeeebbbeb
beeeeeebebbbeb
bbebebebebbbeb
bbebebebebbbeb
beeeeeeeebbbeb
beeffffeeebeee
bbeefffffeeefe
bbbeeeffeebeee
bbbbbeeeebbbbb
bbbbbeebbbbbbb
bbbbbeebbbbbbb
wh PI_4-669 4 0 0/0 153/9 194/13 356/26
wh Eta_Cassiopeia 13 2 153/9 0/0 203/13 354/24
wh Quator 0 11 194/13 203/13 0/0 231/15
wh Keldon 5 26 356/26 354/24 231/15 0/0
beacon Delta_Pavonis_Base 5 21

sector Eta_Cassiopeia:15,35
bbbbbeebbbbbbbb
eeebeeebbeebbbb
eeeeefebeeeebee
beefffeeeffeeee
bbeeeffffffeeee
bbbbeffffffebbb
bbbbefffoooeeeb
bbeeeffoooofeeb
beefffffeeeeebb
eegggffeebeebbb
efgggffebbbbbbb
eegggffeeeebbbb
begggfgggfeeebb
beeeffgggffeebb
bbbeefgggeeebbb
bbbbefffeebbbbb
bbbbeffeebbbbbb
bbeeefeebbbbbbb
bbefofebbbbbbbb
bbeofoebbbbbbbb
bbeeofebbbbbbbb
bbbeefeebbbbbbb
bbbbeffebbbbbbb
bbbbeffeeebbbbb
bbbeeffffeeebbb
bbbeefggggfebbb
bbbbefggggfebbb
bbbbeeggggfeebb
bbbbbefgggffeeb
bbbbeefffeeefee
bbbbefeeeebeeee
bbbeefebbbbbbee
bbbeefeebbbbbbb
bbbeeeeebbbbbbb
bbbbeebbbbbbbbb
wh PI_4-669 5 0 0/0 76/4 163/10 347/31 343/32
wh Delta_Pavonis 1 1 76/4 0/0 175/13 346/30 342/31
wh SZ_4-419#North 14 3 163/10 175/13 0/0 375/32 371/33
wh SZ_4-419#South 14 30 347/31 346/30 375/32 0/0 131/9
wh Keldon 5 32 334/32 333/31 362/33 122/9 0/0
beacon Eta_Cassiopeia_Base 8 3

sector SZ_4-419:12,7
eeebbbbbbeee
eeeebeeeeefe
beeeeefffeee
bbeffofofebb
eeeoofeeeeeb
eeeefeebeeee
bbbeeebbbeee
wh Eta_Cassiopeia#North 0 0 0/0 146/11 95/5 136/10
wh Urlafa 11 0 146/11 0/0 146/11 77/5
wh Eta_Cassiopeia#South 0 4 95/5 146/11 0/0 136/10
wh Regulus 10 5 136/10 77/5 136/10 0/0

sector Iniolol:17,14
bbbbbbbbeeebbbbbb
bbbbbeeeefeeeebbb
bbeebeggggggfebee
bbeeeegggggggeeee
beefffggggggfebee
eefffffffffffebbb
eefffffeeefffeebb
befffffebeeffoebb
beeffffebbeeooeeb
bbeffffeebbeoooee
bbeeefffebbeefofe
bbbbeeefebbbeefee
bbbbbbeeebbbbeeeb
bbbbbbbeebbbbbbbb
wh WG_3-288 2 2 0/0 137/11
wh Greandin 7 13 137/11 0/0
beacon Iniolol_Station 7 5

sector Zezela:14,10
bbbbeeeeebeeee
bbbeefffeeefee
bbeeeeeeefeeeb
beefebbbeeebbb
beffeeebbebbbb
beeeeeebbebbbb
bbebbeeeeeebbb
eeeebeefffeebb
effebbeffffeee
eeeebbeeeeeeee
wh Quator 13 0 0/0 171/9
wh Tianbe 13 8 171/9 0/0

sector Keldon:26,34
bbbbbbbbbbbbbeeebbbbbbeeee
bbbbbbbbbbbbeefebbbbbeeffe
bbbbbbbbbbbbefeebbbbbeffee
bbbbbbbbbbbeefebbbbbeeeeeb
bbbbbbbbbbbeeeebbbbeefeeeb
bbbbbbbbbbeeeeeebbeefffeeb
bbbbbbbbbbeffffeeeefffeebb
bbbbbbbbbbefffffffffffebbb
bbbbbbbbbbeeffffffffffeebb
bbbbbbbbbbbeeffffffffffebb
bbbbbbbbbbbbeefffffffffeeb
bbbbbbbbbbbbbeffffffffffeb
bbbbbbbbbbbbeeffffggggofee
bbbbbbbbbbbeeffffggggggooe
bbbbbbbbbeeefffggggggggooe
bbbbeeeeeefooffggggggggfoe
bbbeefgggggfofgggggggggoee
bbeefggggggggfggggggggfoeb
beefgggggggggfggggfffffeeb
befggggggggggfffeeeefeeebb
befggggggggffffeebbeeebbbb
befgggggggfffffebbbbbbbbbb
eeoggggggffffffebbbbbbbbbb
eoooggggfffffffebbbbbbbbbb
efofggggfffffffeebbbbbbbbb
eefgggggffffffffeebbbbbbbb
befggggggffffffffeeeeeebbb
befgggggggfffffoffffofeeeb
beegggggggffffooofffffffee
bbefggggggffffoofeeeeefffe
bbeffgggggfffffoeebbbeeffe
bbeeffgggfeeeffoebbbbbeeee
bbbeeefffeebeeeeebbbbbbeeb
bbbbbeeeeebbbeebbbbbbbbbbb
wh Delta_Pavonis 14 1 0/0 166/13 347/32
wh Eta_Cassiopeia 24 1 166/13 0/0 338/32
wh KU_3-616 13 33 356/32 347/32 0/0
beacon Keldana_II 18 9
beacon Keldana_I 9 24
beacon Bio_Armor_Station_Keldon 22 29

sector Regulus:16,16
eebbbbeeebbbbbbb
eeeeeeefebbbbbbb
eebbbbefeebbbbbb
bbbbbbeffebbbbbb
bbbbbbefeebbbbbb
bbbbeeefebbbbbbb
bbbeemmfeebbbbbb
bbbefmmffebbbbee
bbbeeffffeeeeeee
bbbbeeeeeebbbbee
bbbbbbbebbbbbbbb
bbbbbbbebbbbbbbb
bbbbbbbebbbbbbbb
bbbbbbbebbbbbbbb
bbbbbbeeebbbbbbb
bbbbbbeeebbbbbbb
wh SZ_4-419 0 1 0/0 296/17 307/19
wh greandin 15 8 296/17 0/0 247/13
wh Cassand 7 15 307/19 247/13 0/0

sector Regulus_South:16,16
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbee
bbbbbbbbbbbbeeee
bbbbbbbbbbbbeffe
bbbbbbbbbbbbeeee
wh Aeg 15 15 0/0

sector Greandin:14,23
bbbbbbeeebbbbb
bbbbeeefeeebbb
bbbeefffffeebb
bbbefffffffebb
bbeefffffffeeb
bbegggffffffee
beegggffggggge
befgggfgggggge
beeeeffgggggge
bbbbeffgggggee
beebeffgggggeb
eeeeefffgggeeb
eeeeffffffeebb
bbbeefffffebbb
bbbbeefoffeebb
bbbbbefffofeeb
bbbbbeffooooeb
bbbbeefeeeofeb
bbbbeffebefeeb
bbbeefeebeeebb
bbeefeebbbbbbb
eeeeeebbbbbbbb
eeeebbbbbbbbbb
wh Iniolol 7 0 0/0 185/14 274/22
wh Regulus 0 11 185/14 0/0 219/12
wh Aeg 0 22 274/22 219/12 0/0
beacon Greandin 8 4

sector Tianbe:19,15
bbeebbbbeeebbbbbbbb
bbeeebeeefeeeebbbbb
bbeeeeeffffggeebbbb
bbbeeffgggfggfeeebb
bbbbeffggggffgggebb
bbbbeeeggggffgggeeb
bbbbbbefgggffgggfee
bbbbeeefggggggggfee
bbbbefffggggggggeeb
bbbeeggffgggggggebb
beeefggeeeffffffeeb
beeeefeebeefeeeefeb
eeebeeebbbeeebbeeee
eeebbeebbbbbbbbbeee
bbbbbbbbbbbbbbbbbee
wh Zezela 3 1 0/0 166/12 201/14
wh Fomalhaut 1 13 166/12 0/0 215/16
wh Laanex 17 13 201/14 215/16 0/0
beacon Tianbe 12 5

sector KU_3-616:12,8
bbbbbbeebbbb
bbbbbbeebbbb
bbbbbbeeebbb
bbbbbeefeebb
bbeeeefffebb
bbefffeeeeeb
beeeeeebeeee
beeebbbbbeee
wh Keldon 6 0 0/0 116/8 115/7
wh Laanex 2 7 116/8 0/0 126/9
wh Pollux 11 7 115/7 126/9 0/0

sector Cassand:13,19
bbbbbbeebbbbb
bbbbeeeebbbbb
bbbeeffeeebbb
bbeegggffeebb
bbegggggffeeb
beeggggggffeb
eegggggggffee
efgggggggfffe
eeggggggfeeee
beggggfffebee
begggffffebbb
beeffffffeeeb
bbeeffgggfeeb
bbbeffgggfebb
bbbeefffeeebb
bbbbeeeeebbbb
bbbbeebeebbbb
bbbeeebbbbbbb
bbbeeebbbbbbb
wh Regulus 6 0 0/0 117/9 206/17
wh Aeg 12 9 117/9 0/0 165/12
wh Besoex 4 17 206/17 165/12 0/0
beacon Cassand 7 10

sector Aeg:21,13
bbbbbbbbeeeeebbbbbbee
beeebbbeegggeeebbeeee
beeeeeeeggggffeebefee
bbeeeeegggggfffeeeeeb
bbbbbbeggggfffffeeebb
bbbbbeeggggfffeeebbbb
bbeeeefgggffffebbbbbb
eeefffoffeeeffeebeebb
eeeeeeoooebefffeeeeeb
bbbbbeefeebeeffffffeb
bbbbbbeeebbbeeeffffeb
bbbbbbbbbbbbbbeeefeeb
bbbbbbbbbbbbbbbbeeebb
wh Greandin 20 0 0/0 286/19 259/20
wh Regulus_South 1 1 286/19 0/0 200/11
wh Cassand 0 7 259/20 200/11 0/0
beacon Aeg 17 10

sector Fomalhaut:20,20
bbeebbbbbbbbbbbbbbbb
beeeebbeebbbbbbbbbbb
befoeeeeeeeebbbbeebb
beoooffffffeebbeeeeb
beeooffffgggeebeffeb
bbeffffffgggfeeeffee
bbeeeffffgggffffffee
bbbbeffffgggeeefffeb
bbeeefffffeeebeeffee
eeefggggfeebbbbeeffe
eeefggggeebbbbbbeffe
bbeeggggebbbbbbbeffe
bbbeeggfeebbbbbbeffe
bbbbefgggeebbbbbeffe
bbbeefgggfebbbbeefee
bbbeffgggeebbbbeffeb
bbbeeffeeebbbbbeefee
bbbbeeeebbbbbbbbefee
bbbbbbeeebbbbbbbeeeb
bbbbbbeeebbbbbbbbeeb
wh Tianbe 17 2 0/0 269/19 197/17
wh Ackandso#West 7 19 269/19 0/0 351/29
wh Ackandso#East 17 19 197/17 351/29 0/0
beacon Fomalhaut 7 6
beacon Bio_Weapon_Station_Fomalhaut 5 13

sector Laanex:15,16
eeebbbbbbbbbbbb
efebbbeebbbbbbb
eeeebeeeeebeebb
beeeeegggeeeeeb
bbefffgggffeeeb
bbeeffgggffebbb
bbbeeffffffeebb
bbbbefffffffeeb
bbbbeffffffffeb
bbbeeffffffffee
bbbefffffffffee
bbbeeffeeeeeeeb
bbbbeeeebeebbbb
bbbbbeebbbbbbbb
bbbbbeeebbbbbbb
bbbbbeeebbbbbbb
wh Tianbe 1 1 0/0 156/12 185/14
wh KU_3-616 13 3 165/12 0/0 174/12
wh Vewaa 5 15 194/14 174/12 0/0
beacon Laanex 8 8

sector Pollux:20,10
eeebbbbbbbbbbbeebbbb
eeeeebbbbeeebeeeebbb
beffeebbeefeeeffeebb
beeffeebeffgggggfeeb
bbeeffeeeffgggggffeb
bbbeffffffffffffffee
bbbeefffffffffggfeee
bbbbeeffffeeefggeebb
bbbbbeeeeeebeeeeebbb
bbbbbbbbeebbbeebbbbb
wh KU_3-616 0 0 0/0 217/19
wh Besoex 19 6 217/19 0/0
beacon Pollux_Station 8 4

sector Besoex:13,16
bbbbbbbbeeeee
bbbbbbeeeffee
bbbbbeeoffeeb
bbbbbeoffeebb
bbbbbeoofebbb
bbbbeefffebbb
bbbeeffffeeeb
eeeefffffffeb
eeeefffffffee
eebefffeeeeee
bbbeeeeebeebb
bbbeebbbbeeeb
bbbbbbbbbeeeb
bbbbbbbbbbeeb
bbbbbbbeeeeee
bbbbbbbeeeeee
wh Cassand 11 0 0/0 156/12 232/16
wh Pollux 0 8 156/12 0/0 249/15
wh Wolf 7 15 232/16 249/15 0/0
beacon Besoex 7 7

sector Pass_EMP-03:25,20
bbbbeeeeeebbbeeeeeeeeebbb
beeeeffffeebbeeeeffffeebb
eeffffffffebeeebefffffebb
eeeefeeeeeebeeeeeeeeffeee
bbbeeebeeeebbeeeeebeeeffe
bbbbbbbefeebbbeeeebbbeeee
bbbbeeeeeebbbeefeebbbbbbb
bbbeeffeebbbbefeebbbbbbbb
beeeffeebbbbeefebeeeebbbb
befeeeebbbbbeefeeeffeebbb
eefebbbbbbbbbeeffffffeebb
effebbbbbbbbbbeeeeeeefebb
effeebbbbbbbbbbbbbbbeeeeb
eeffebbbbbbbbbbbbeebbefee
beffeebbbbbbeeeeeeeebeffe
beeffebeeeeeeeeeeeeeeeffe
bbeffeeefffeeebbbbeffffee
bbeefffffffebbbeeeefffeeb
bbbeeeeeeefeeeeeeeeeeeebb
bbbbbbeebeeeeeeeebbeebbbb
wh Grecein 1 2 0/0 716/50
wh Ackandso 23 4 707/50 0/0

sector Ackandso:26,20
bbbbbeeebeeebbbbbbeeebbbbb
bbbbeefeeeeebbbbbbefeebbbb
bbbbeoooebbbbbbbbeeffeebbb
bbbbeeofebbbbbbbeeffffebbb
bbbbbeoeebbbbbbeefgggfeebb
bbbbbefebbbbbeeefggggffeeb
bbbbbeeebbbbeefggggggfffeb
bbbbbbebbeeeeffggggggfeeeb
beebbeeeeefffffgggggeeebbb
eeeeeeffffeeeeffggggebbbbb
eeebbeeeeeebbeeefffeebbbbb
bbbbbeebbbbbbbbefffebbbbbb
bbbbbbbbbbbbbbbefffeebbbbb
bbbbbbbbbbbbbbeeooffeebbbb
bbbbbbbbbbbbbbefoofffeebbb
bbbbbbbbbbbbbeeffoffffeebb
bbbbbbbbbbbbbeeeeeeeeefeeb
bbbbbbbbbbbbbbeebbbbbeefeb
bbbbbbbbbbbbbbbbbbbbbbeeee
bbbbbbbbbbbbbbbbbbbbbbbeee
wh Fomalhaut#West 11 0 0/0 307/23 229/13 332/26
wh Fomalhaut#East 18 0 307/23 0/0 250/20 194/18
wh Pass_EMP-03 1 9 229/13 250/20 0/0 275/23
wh Exackcan 24 18 332/26 194/18 275/23 0/0
beacon Ackandso_Station 15 10

sector Vewaa:22,15
bbbbbeebbbeeeebbbbbbbb
bbbeeeebbeeffeeeebbbbb
bbeeffebeeffffffeebbbb
beefffeeeffffffffeebbb
befgggffgggffffffeebbb
begggggfgggffffffebbbb
eegggggfggggfffffebbbb
eegggggfggggfffffeebee
beefgggffgggeeefeeeeee
bbeeefffffffebeeeeebee
bbbbefffeeeeebbeeeebbb
bbeeeffeebeebbbbbbbbbb
beeeeefebbbbbbbbbbbbbb
eeeebeeebbbbbbbbbbbbbb
eeebbbbbbbbbbbbbbbbbbb
wh Laanex 6 0 0/0 247/17 180/13
wh Wolf 21 8 247/17 0/0 277/20
wh Exackcan 1 13 180/13 277/20 0/0
beacon Vewaa 13 4

sector Wolf:18,20
bbbbbbbbbeebbbbbbb
bbbbbbeebeeebbeebb
bbbbbeeeeefebeeeeb
bbbbbeeffffeeeffeb
bbbbbbeffffffooeeb
bbbbbbefffffoooebb
bbbbbeeffffffooeeb
bbbbeeffffeeeeffeb
bbbbeffffeebbeeeeb
eebeegggfebbbbbebb
eeeeggggfeebbbbebb
eebegggggfebbbbebb
bbbegggggeebbbeeeb
bbbeeggggebbbbeeeb
bbbbeefffebbbeeebb
bbbbbeeffeebbeeebb
bbbbbbeeeeebbbeeeb
bbbbbbbbbebbbbbeee
bbbbbbbbeeebbbbbee
bbbbbbbbeeebbbbbbb
wh Besoex 9 0 0/0 184/13
wh Vewaa 0 10 184/13 0/0
beacon Wolf_Station 7 9

sector Exackcan:15,10
beebbbbbeebbbbb
beeebbbeeeebbbb
beeeebeefeebeeb
bbefeeeffebbeeb
bbeffffffeeeeee
bbeeeeefooffffe
bbbebbeooooofee
eeeeebeffoofeeb
eeeeebeefeeeebb
beebbbbbbbbbbbb
wh Ackandso 1 0 0/0 183/12
wh Vewaa 13 2 183/12 0/0

sector Quince:14,16
bbbbbbeeeebbbb
bbbbeeefeebbbb
bbbeefffebbbbb
bbeeffffeeeebb
bbeefffffffebb
bbbefffffffeeb
eebeffffffffee
eeeeffffoofffe
eebefffffooffe
bbeeffffffoffe
beefffeeefffee
beffffebeefeeb
beefffebbeeebb
bbeeffeebbeebb
bbbeeeeebbbbbb
bbbbbeebbbbbbb
wh Mizar 1 7 0/0 137/11
wh Sodaack 12 10 137/11 0/0
beacon Quince 6 4

sector Sodaack:15,16
bbbbbbbeeebbbbb
bbbbbeeeeebbeeb
bbbbeeffebbeeeb
bbbeefffeeeefeb
bbeeffffffgggeb
bbefffffffgggeb
beefffffffffeeb
eeffffffffffebb
eeffffffgggfeeb
beffgggfggggfee
beefggggggggffe
bbefggggfgggffe
bbefggggffffffe
bbeefgggfeeeffe
bbbeefffeebeefe
bbbbeeeeebbbeee
wh Quince 2 4 0/0 119/11 129/11 124/11
wh Facece 13 8 119/11 0/0 69/6 89/7
wh Ophiuchi 13 14 120/11 60/6 0/0 70/7
wh ZP_2-989 7 15 124/11 89/7 79/7 0/0
beacon Sodaack 7 6

sector ZP_2-989:13,14
bbbbbeeebbbbb
bbbbbefeeebbb
bbbbbeeffeebb
bbbbbbefffebb
bbbbbbefffeeb
bbbbbbeffffeb
bbbbbbeffffeb
bbbbbeeffffee
bbeeeeffffffe
beeffoffofffe
eefoooooffffe
effooooeeeffe
eeeeeefebeefe
beebbeeebbeee
wh Sodaack 6 0 0/0 139/13
wh Cabard 12 13 139/13 0/0

sector Facece:16,23
bbbbbbbbeeebbeeb
bbbbbbbeefeeeeee
beeebbbefffeeefe
befeebeefffebefe
eeooebeefffebefe
eeooebbeeffebeee
beeoeebbeefebbee
bbeefeebbeeeebee
bbbeefebbbefebee
eebbefeeeeefebbb
eeebefebbbeeeebb
efebefeebbbefeeb
eeebeffebbeeffee
eebbefeebbeggffe
eeeeefebbeeggfee
efffffebeeggfeeb
eefffeebeeggeebb
beffeebbbeeeebbb
beffebbbbbbbbbbb
beefebbbbbbbbbbb
bbeeebbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
wh Lahola 15 7 0/0 412/25
wh Sodaack 0 9 412/25 0/0

sector Facece_South:16,23
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbbbbbbbeebbbbb
bbbbbbbbeeeebbbb
bbbbbbbeeffeeebb
bbbbbbbeeeeeeebb
wh Ophiuchi 9 22 0/0

sector Ophiuchi:22,20
bbbbbbbbbbeebbbbbbbbbb
bbbeeeebbbeeebbbbbbbbb
beeeffeebbefebbbbeeebb
eefffffebbefeebbeefeeb
eegggfeebeeffebbefffee
begggfebbeeeeebeefffee
begggfebbbeebbbefeefeb
begggfebbeeeebeefeefeb
begggfeebeffeeeffffeeb
eegggffebefffffggggebb
efgggffeeefffggggggeeb
eeffffffffffgggggggfeb
beefeeefffffgggggggfeb
bbeeebeeffffggggggfeeb
bbeebbbefffffgggffeebb
bbeebbbefmmfffffeeebbb
bbbbbbeefmmfffeeebbbbb
bbbbbbeffffffeebbbbbbb
bbbbbbeeffeeeebbbbbbbb
bbbbbbbeeeebbbbbbbbbbb
wh Facece_South 11 1 0/0 247/16 194/14
wh Sodaack 1 3 247/16 0/0 242/20
wh Lahola 20 3 194/14 242/20 0/0

sector Cabard:9,22
eeebbbbbb
efebeebbb
eeeeeeebb
beffooeeb
befooofee
beefffffe
bbeeeeffe
bbbbbefee
bbbbbefeb
bbbbeefee
bbbbeffee
bbbbeffeb
bbbeeffeb
bbeefggee
beeffggfe
befffffee
eefffffeb
effffffeb
eefffggee
befffggee
beeeffeeb
bbbeeeebb
wh ZP_2-989 1 1 0/0 122/9
wh Paan 8 10 131/9 0/0
beacon Cabard 4 16

sector Nunki:19,27
bbbbbbbbbbbeeebbbbb
bbbeeebbbbeefeeebbb
bbeefeeebbeffffeebb
beeffffeebefffffeeb
beffffffeeeffffggeb
beffeeeeeeeffffggeb
beffebeeeeeeffeeeee
eefeebeeeebeffeeeee
effebbbeebbeeeeefeb
eefebbbbbbbbeebefeb
beeeeebbbbbbbbbefeb
bbeefeeeebbbbbbefeb
bbbeffggeebbbbbefee
bbbeffggeebbbbeeffe
bbeefffeebbbbbeeeee
beeeeeeebbbbbbeebee
eeeebeebbbbbbbeebee
eeebbeebbeeebbeebee
beebbeebeefeebeeeee
beeeeeeeefffeeeffee
eeffffeeffeeefffeeb
eefeeeeefeebeeefebb
beeebeeffebbbbefebb
bbbbbbeffeebeeeeebb
bbbbbeefffeeefeebbb
bbbbbeefffffeeebbbb
bbbbbbeeeeeeebbbbbb
wh Heze_South 11 1 0/0 369/27
wh Lahola 8 26 369/27 0/0

sector Lahola:25,21
beebeeebbbbbeeebbbbbbbeee
eeeeefeeebbbeeebbbbbbbefe
eeeeeefeebbbbebbbbbbbbeee
bbbbbeeebbbeeeeebbbbbbbeb
bbbbbeebbbeefffeebbbbbbeb
bbbbbeeebeefeeffebbbbbbeb
bbbeeefeeeffeeffeeeeebbeb
beeeffffffffeeefffffeebeb
eeffffffffeeebeeefgggeeee
eefffffffeebbbbbefgggeeee
befffffffebbbbbbefgggebbb
beefffffoeeeeeeeefgggeebb
bbeefffffoooooooofffffeeb
bbbefffooeeeeeeeeofffffee
bbeeffffoebbbbbbefffffffe
beefffffeebbbbbbeefffffee
beffggfeebbbbbbbbeeeeeeeb
eeffggeebbbbbbbbbbbbeebbb
efffeeebbbbbbbbbbbbbbbbbb
effeebbbbbbbbbbbbbbbbbbbb
eeeebbbbbbbbbbbbbbbbbbbbb
wh Nunki 13 1 0/0 186/15 182/14 217/19
wh Facece 0 9 186/15 0/0 273/24 138/12
wh GM_4-572 24 13 182/14 273/24 0/0 303/27
wh Ophiuchi 0 20 217/19 138/12 303/27 0/0
beacon Lahola_I 6 9
beacon Lahola_II 19 14

sector Nex_0003:25,20
bbeebbbbbbbbbbbeeebbbbbbb
beeeeeeebbbbbeeefeeebbbbb
befffffeeeebeefffffeeebbb
eefeeeefffeeefeeeeeffeebb
efeebbeeeefffeebbbeeefeeb
efebbbbbbeefeebbbbbbeefeb
efebbbbeeeefebbeeebbbefee
efebbbeeeeefeeeefebbbeefe
efebbeeffffffeeeeeebbbefe
efeebefeeefffebbeeeebbefe
eefebeeebeeffeebbefebeefe
befebbeebbefffebbefebefee
befebbeebbeefeebbeeeeefeb
befebeeebbbeeebbbbeffffee
befebefebbbbbbbbeeeffffee
eefeeeeebbeebbbeeffffffeb
eeffffebbeeeebeefffeeefeb
beefffeeeeffeeeffeeebeeeb
bbeeeffffffeeeeefebbbbeeb
bbbbeeeeeeeebbbeeebbbbbbb
wh Paan 13 18 0/0 231/15
xh 12 11 222/15 0/0

sector Paan:25,23
bbbbeeeeeebbbbbbeeeebbeeb
bbeeegggfeebeeebeffeeeeee
beeggggggfeeefeeefffgggfe
eefggggggfffffffffffgggee
eefggggggffeeeeeefffgggeb
beeggggffeeebeebeeeffffee
bbegggffeebbbbbbbbeeffffe
beeffffeebbbbbbbbbbeefffe
beggffeebbbbbbbbbbbbeeffe
eeggfeebbbbbbbbbbbbbbeffe
effffebbbbbbbbbbbbbbbefee
efffeebbbbbbbbbbbbbbeefeb
efffebbbbbbbbbbbbbbbeefeb
effeebbbbbbbbbbbbbbbbefee
effebbbbbbbbbbbbbbbbbeefe
efeebbbbbbbbbbbbbbbbbbefe
efebbbbbbbbbbbbbbbbbbeefe
efebbbbbbbbbbbbbbbbbbeffe
eeebbbbbbbbbbbbbbbbbbeeee
bbebbbbbbbbbbbbbbbbbbbbee
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
wh Nex_0003 13 1 0/0 148/13 148/13 168/15 197/17
wh Cemiess 23 12 148/13 0/0 269/26 289/28 58/4
wh Cabard 0 13 148/13 269/26 0/0 39/3 318/30
wh Paan_Inner#West 3 15 168/15 289/28 39/3 0/0 338/32
wh Paan_Inner#East 21 16 197/17 58/4 318/30 338/32 0/0

sector Paan_Inner:25,23
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbeeeebbbbbbbbb
bbbbbbbbbbeeeffeebbbbbbbb
bbbbbbbbbbefooooeebbbbbbb
bbbbbbbbbbeeooofeebbbbbbb
bbbbbbbbbbbefoeeebbbbbbbb
bbbbbbbbbbeeofebbbbbbbbbb
bbbbbbbbbbefffebeeeebbbbb
bbbbbeeeebefffeeefeebbbbb
bbbbbeffeeefffebeeebbbbbb
bbbbbeeeebeeffebbbbbbbbbb
bbbbbbbbbbbeefeeebbbbbbbb
bbbbbbbbbbbbefffeeebbbbbb
bbbbbbbbbbbeefffffebbbbbb
bbbbbbbbbbbeeffeeeebbbbbb
bbbbbbbbbbbbeeeebbbbbbbbb
wh Paan#East 19 15 0/0 212/14
wh Paan#West 5 16 212/14 0/0

sector GM_4-572:15,13
bbbbbbeeeebbbbb
bbbbeeeffeeebbb
bbbeeffffffeeee
bbbefffffffffee
bbeefffeeeffeeb
beeffeeebeeeebb
eeffeebbbeeeebb
efffebbeeeffeee
eeffeeeefffffee
beefffffffffeeb
bbeefffffffeebb
bbbeeeffffeebbb
bbbbbeeeeeebbbb
wh Becanin 13 3 0/0 139/13 95/5 126/9
wh Lahola 0 7 139/13 0/0 158/14 79/7
wh Urioed 14 7 95/5 158/14 0/0 88/7
wh Encea 7 12 126/9 79/7 88/7 0/0

sector Encea:14,15
eebbbbbbbbbbbb
eeebbbbbbbbbbb
eeeebeebbbbbbb
beeeeeeebbbbbb
bbeffffeebbeeb
eeefffffeeeeeb
efffffffffffeb
eeffffffffffee
befeeeefffffee
beeebbefffffeb
beebbbefffffeb
bbbbbbefffffeb
bbbbbbeeffffeb
bbbbbbbeeefeeb
bbbbbbbbbeeebb
wh GM_4-572 11 4 0/0 78/6
wh Cemiess 5 8 78/6 0/0
beacon Encea 9 9

sector Cemiess:18,15
bbbbbbbbeebbbbbbbb
bbbbbbbbeeeebbbbbb
bbbbbbbbeffeeeebbb
bbbbbbbbefffffeeeb
bbbbbbbeefffffffee
bbeeebeeffffffffee
beefeeeffffffffeeb
eeffffgggffffffebb
eefgggggggggggfebb
befgggggggggggfebb
beegggggggggggfebb
bbeefgggggggggeebb
bbbeeegggggggeebbb
bbbbbeeeffeeeebbbb
bbbbbbbeeeebbbbbbb
wh Encea 9 0 0/0 162/13
wh Paan 0 7 162/13 0/0
beacon Cemiess 12 5

sector Becanin:17,14
bbbbbbbeeebbbbbbb
bbbbbeeefeeebbbbb
bbbbbefffffeebbbb
bbbbeeffffffeebbb
bbbeeffffffffebbb
bbbefffffffffebbb
bbeefffffffffeebb
bbefffffffffffeeb
beeffffffofffffeb
befffffooooffffee
eefffffofoofffffe
effffffeeeefffffe
effffeeebbeeffffe
eeeeeebbbbbeeeeee
wh GM_4-572 1 13 0/0 159/15
wh Tiliala 16 13 159/15 0/0
beacon Becanin 8 4

sector Urioed:21,9
bbbbbbbeeeeebbbbbbbbb
bbbbbbeefffeeeebbbbbb
bbbbbeefffffffeebbbbb
beeebefffffffffebeeee
eefeeeeeeefffffeeeffe
eeeebeebbefffffebeeee
bbbbbbbbbefgggeebbbbb
bbbbbbbbbeegggebbbbbb
bbbbbbbbbbeeeeebbbbbb
wh GM_4-572 0 4 0/0 272/20
wh Tiliala 20 4 272/20 0/0

sector Tiliala:25,17
eeeeebbbbeeeeeeebbbbbbbbb
efffeebbeefffffeebbeeeeeb
eefffeeeefffffffeeeefffee
beffgggggffffffffffffffee
beefgggggffffffgggggggeeb
bbefgggggffffffgggggggebb
eeefggggfffffffgggggggebb
efffffffeeefffffggggggeeb
eeeffffeebefffffgggggffeb
bbeefffebbeeeffgggfffffee
bbbefffebbbbeefgggggggffe
bbeefffeeebbbeegggggggffe
bbeffffffeebbbeeggggggfee
bbeeffffffebbbbeeeegggeeb
bbbeeffffeebbbbbbbeeeeebb
bbbbeeffeebbbbbbbbbbbbbbb
bbbbbeeeebbbbbbbbbbbbbbbb
wh Becanin 1 1 0/0 235/22 78/6 255/23
wh Exbeur 23 2 244/22 0/0 239/23 118/8
wh Urioed 0 7 87/6 239/23 0/0 259/24
wh AN_2-956 24 10 264/23 118/8 259/24 0/0
beacon Tiliala 12 4

sector Exbeur:25,25
bbbbbbbbbbbbbbbbbbbbbbeee
bbbbbbbbbbbbbbbbbbbbbeefe
bbbbbbbbbbbbbbbbbbbeeeffe
bbbbbbbbbbbbbbbbbbbefffee
bbbbbbbbbbbbbbbbbbeeffeeb
bbbbbbbbbbbbbbbbbeeffeebb
bbbbbbbbbbbbbbbbbeffeebbb
bbbbbbbbbbbbbbbbeefeebbbb
bbbbbbbbbbbbbbeeeggebbbbb
bbbbbbbbbeeeeeeffggebbbbb
bbeeebbeeeffffffffeebbbbb
beefeeeeffffffffffebbbbbb
begggggffffffffffeebbbbbb
eeggggggffffffffeebbbbbbb
efggggggffffffffebbbbbbbb
efggggggfffeeeefeeebbbbbb
efggggggfffebbefffeebbbbb
eefggggffffebbefffeebbbbb
beeggggfgggeeeefeeebbbbbb
bbeggggggggffoofebbbbbbbb
beeffggggggfooofeebbbbbbb
befffggggggfofffeebbbbbbb
beeefggggggeeeeeebbbbbbbb
bbbeeeffffeebbbbbbbbbbbbb
bbbbbeeeeeebbbbbbbbbbbbbb
wh DH_3-625 24 0 0/0 192/16 254/23
wh Veareth 18 16 192/16 0/0 179/16
wh Tiliala 2 22 254/23 179/16 0/0
beacon Exbeur 11 12

sector AN_2-956:19,20
bbbbbbbbbbbbbbeebbb
bbbbbbbbbbbbbeeeebb
bbbbbeebbbbbeeffeeb
bbbeeeeeebbeeffofee
beeeffffebeeffoffee
eeffooffeeeffffffeb
efffooofeeeeefffeeb
eefffoffebbbeeffebb
beefffeeeebbbeeeebb
bbeeffeefeebbbeebbb
bbbeeeffffeebbbbbbb
bbbbbefeeffeebbbbbb
bbbbbeeeefeeeeebbbb
bbbbbbefffeeffeebbb
bbbbbbeefffffeeebbb
bbbbbbbeeeeeeeeebbb
bbbbbbbbbeebeeeebbb
bbbbbbbbbbbbbebbbbb
bbbbbbbbbbbbeeebbbb
bbbbbbbbbbbbeeebbbb
wh Tiliala 0 6 0/0 213/15
wh Pass_EMP-04 13 19 213/15 0/0

sector DH_3-625:16,13
bbbbeebeebeebbbb
bbbeeeeeeeeeeebb
bbeefffffffffeeb
bbeeffeeeeeeeeeb
bbbeefebeebbbebb
bbbbefebbeebeeeb
eeebefebeeeeefee
efeeefebefebeeee
eeffffeeefebbbbb
beeeffffeeebbbbb
bbbeeeefeeebbbbb
bbbbbbefeeebbbbb
bbbbbbeeebbbbbbb
wh Rotanev 13 6 0/0 166/13 116/8
wh Exbeur 0 8 175/13 0/0 97/7
wh Veareth 7 12 125/8 97/7 0/0

sector Veareth:19,25
bbbbbbbbeeebbbbbbbb
bbbbbbbeefeebbbbbbb
bbbbbbbefffeebbbbbb
bbbbbbeeffffebbbbbb
bbbbbeeffgggeeeebbb
bbbbbeeffgggeeeebbb
bbbbbbeeeeeeebebbbb
bbbbbbbebebbbbebbbb
bbbeebeeeeebbeeeeeb
beeeeeeoooeebefffeb
beffebeooffeeefffeb
eeffeeefeeeebefffee
effeebefebbbbefffee
effebbefeeeebeffeeb
effebbeeeeeeeeffebb
effeebbebbefffeeebb
eeeeebeeeeefffebbbb
beeeeeefffffffeebbb
beefeeeffffffffebbb
bbeeeeeffffffffebbb
bbbeebefffffeeeebbb
bbbbbbeffffeebbbbbb
bbbbbeefffeebbbbbbb
bbbbbeeffeebbbbbbbb
bbbbbbeeeebbbbbbbbb
wh DH_3-625 8 1 0/0 184/13 293/23
wh Exbeur 0 13 184/13 0/0 155/11
wh Waarze 8 24 293/23 155/11 0/0
beacon Dark_Harbour_Veareth 10 8

sector Waarze:20,14
bbbeebbbbbbbbbbbbbbb
bbeeeebbbbbbbbbbbbbb
beeffeebbbbbbbbbbbbb
eegggfebbbbbbbbbbbbb
efggggeebeeeebbeeebb
eegggggeeeffebeefeeb
begggggfffffebefffee
begggggfffffeeeffffe
begggggfffffffffffee
beeggggfffffffffffeb
bbeggggfeeeffffffeeb
bbeffffeebeeefffeebb
bbeefeeebbbbeeeeebbb
bbbeeebbbbbbbbbbbbbb
wh Veareth 12 4 0/0 79/7
wh Pass_EMP-05 10 11 79/7 0/0
beacon Waarze 9 7

sector Pass_UNI-04:25,25
bbeeeebbeebbbbeebeeeeeebb
beeffeeeeeebbeeeeeffffeeb
eefeeeefffeeeeeeeeeeeefee
effebbeeeeeffeebebebbeeee
effeebbeebeeeebbebebbbbeb
eeffeebbbbbbbbbbebebeeeee
befffeebbbbbbbbeeeeeeffee
beefffeeebbbeeeeeefffeeeb
bbeeefffeeeeefffeeeeeebbb
bbbbefeeefffeeefeeebeebee
bbbbefebeeeeebeeebbbeeeee
bbbeefebbbbbbbbbbbeeeebee
bbbeffeebbbbbbbbbeeffebbb
eebefffeebbbbbbbbefffebbb
eeeefffeebeeebbbbeeeeeebb
eebeffeebeefeeeebbeeeeebb
bbbefeebeefffffebbeefebbb
bbeeeebeeffeeefeeebefeebb
bbefebbeffeebeffeebeffebb
bbefeebefeebeeffebeefeebb
bbeffebefebbeeffebeffebbb
bbeefeeefebbbeefeeeffebbb
bbbefffffebbbbeffffeeebbb
bbbeeefeeebbbbeeefebbbbbb
bbbbbeeebbbbbbbbeeebbbbbb
wh Dsiban 24 10 0/0 366/24
wh YV_3-386 0 14 366/24 0/0

sector Dsiban:17,17
bbbbbbeeeebbeebbb
bbbbeeeffebeeeeeb
bbbbeffffeeefooee
bbbeegggffoooofoe
bbbefgggfffoofofe
eebefffffffeeeeee
eeeefffffffebbeeb
eebeeffffffeebbbb
bbbbeeefffffeeebb
bbbbbbefffffffeeb
bbbbbeeffffffffeb
bbbbeegggggffeeeb
bbbbeegggggfeebbb
bbbbbeefffffebbbb
bbbbbbeefffeebbbb
bbbbbbbefeeebbbbb
bbbbbbbeeebbbbbbb
wh Pass_UNI-04 0 6 0/0 191/15
wh Nashira 9 16 191/15 0/0
beacon Dsiban_Station 12 8

sector Izar:16,18
bbbbbbbeebbbbbbb
bbbbbbeeeeebbbbb
bbbbeeegggeebbbb
bbeeegggggfebbbb
bbeggggggggeebbb
beeggggggggfebbb
begggggggggfebee
eegggggggggfeeee
efgggggggggfebee
efgggffgggffebbb
eeffffffffffebbb
eeffffffffeeebbb
beeffffffeebbbbb
bbeffffffebbbbbb
bbeefffffebbbbbb
bbbeeeeeeebbbbbb
bbbbbbeebbbbbbbb
bbbbbbeebbbbbbbb
wh Wezen 6 17 0/0
beacon Izar 6 11

sector Nashira:24,21
bbbbbbbbbeeeebbbbbbeebbb
bbbbbbbeeeffeebbeeeeeeeb
bbbbbbbefeeffebbefffffee
bbbbbbbeeeeffebeeffeeefe
bbbbbbbbeefffeeefggebeee
bbbbbbbbbefffffffggebbbb
beeeebbbbeeggggggffeeebb
eeofeebbbbeggggggffffeeb
effofebbbeeggggggfffffeb
eeoooeeeeefgggggffffffeb
befooofffffgggggffffffeb
beefoofffffgggggffffffeb
bbeffofeeeeffggfffffffee
bbeefffeeeefggggffffffee
bbbefffeeeefgggggfffeeeb
beeefffeeeefgggggfffebbb
beffffffggffgggggeeeeebb
eeffffffggffggggeebefeee
effffeeefffffeeeebeeffee
eefeeebeeeeeeebbbbeeeeeb
beeebbbbbbbbbbbbbbbbbbbb
wh Dsiban 11 0 0/0 147/12 222/18 223/19
wh Wezen 22 3 138/12 0/0 211/17 244/22
wh Turais 22 18 222/18 220/17 0/0 243/21
wh Lazebe 1 19 223/19 253/22 243/21 0/0
beacon Nashira 19 10

sector Wezen:20,20
bbbbbeeebbeebbbbbbbb
bbbeeefeeeeeebeebbbb
bbeeffffffffeeeebeeb
beefffffeeefffoeeeee
eefffffeebeffffooofe
eeffeeeebeefofooooee
beeeebbbeeffffffeeeb
bbbbbbbbeeeffeeeebbb
bbbbbbbbbbeefebeebbb
bbbbbbbbbbbefeeeeebb
bbbbbbbbbeeefffffeeb
bbbbbbbbeeffffffffeb
bbbbbbbbefffffffffee
bbbbbbbeeffffffffffe
bbbbbbbeeeeffffffffe
bbbbeeeeeeeeeeffffee
bbeeeeefeeeeeeffeeeb
beeffeeeeeeebeeeebbb
beefffeebeebbbbbbbbb
bbeeeeebbbbbbbbbbbbb
wh Izar 12 1 0/0 119/11 234/18
wh Nashira 1 4 119/11 0/0 292/22
wh Turais 2 19 234/18 292/22 0/0
beacon Wezen 16 13

sector Lazebe:28,19
bbbbbbbeebbbbbeeeeeebbbbbbbb
bbbbeeeeeebbbeeffffeeebbeeeb
bbeeeffffebbeeeeeefffeebefee
beeffffffebbefebbeffffebeffe
befffffffeeeefeebeffffeeeffe
befffffffeeeeeeeeefffffffffe
eefffffffebbbbeeffffffggggfe
effffffffeebbbbeffffffggggee
eeffffffffebbbbeffffffgggfeb
beefffffffeebbbeeffffffggeeb
bbeeeffffffeebbbeeeeeeeffebb
bbbbeeeeffofeebbbebeebeffeee
bbbbbbbeeefooeeeeeebbeeffffe
bbbbbbbbbeffoofeefeeeeffffee
bbbbbbbbbefoooooffeeeeffffeb
bbbbeeebeeofooooffeeeeeeffeb
bbbeefeeeofffoofffeeeeeefeeb
bbbeefebeeofffffeeebbeeeeeeb
bbbbeeebbeeeeeeeebbbbbbbbbbb
wh Nashira 26 2 0/0 138/11 196/15
wh Bellatrix 27 13 138/11 0/0 126/9
wh Olaeth 18 17 196/15 126/9 0/0
beacon Lazebe_I 5 6
beacon Lazebe_II 19 6

sector Turais:20,23
bbbbbbbbbbbbbeebbbbb
beeebbbbbbbeeeeeeeee
eefeeebbbbeeeefeeeee
eefffeebbbeeeefeeebb
beffffebbbbeeffeeeeb
beefffeebbbbeeeeefee
bbeefffebbbbbbefeefe
eebeeeeeebbeeeefeefe
eeeeebefebeeeeeeffee
eeffeeefeeefebeefeeb
beffebefebeeeeeefebb
beefebefebbeeeeefeeb
bbefeeeeebbbbbbeffeb
eeeffffebbbbbbeeffeb
effffffeebbbbeefeeeb
efeeefffeebbbeffeeee
eeebeeeefebbbefffeee
beeeeebefeeebeggfebb
eefffebeeffeeeggfebb
eeeefebbefffffffeebb
beeeeebbeefffeeeebbb
beeeebbbbeeeeebbbbbb
bbeebbbbbbbbbbbbbbbb
wh Wezen 19 0 0/0 288/18 355/22
wh Nashira 1 1 288/18 0/0 244/19
wh Bellatrix 3 20 355/22 244/19 0/0

sector Olaeth:18,14
bbbbbbbeebeeeebbbb
bbeeebeeeeeffeeebb
bbefeeeffffffffeeb
bbeeebeefffeeeffeb
bbbebbbeeeeebeffee
bbbebbbbebbbeeffee
beeeebbeeebbefffeb
beeeebeefeeeefffee
beeeeeeffebbeffffe
bbeeeeeeeeeeefffee
bebeebeeeebbeeefeb
bbeeeeeffeeeeeeeeb
beeeeefeeebbeeeebb
bbeebeeebbbbbbbbbb
wh Lazebe 8 1 0/0 127/10
wh WW_2-934 15 11 127/10 0/0

sector Bellatrix:25,18
bbbbbbbbbeeebbbbbbbbbbbbb
bbeeebbbeefeebbeeeeebbbbb
beefebbeefffebeefffeeebbb
beffebbeffffebefffffoeebb
beffeebeffffebeffffoooeeb
befffeeeffffeeefffffoofeb
eefffebefffffffffffffofeb
eeeffeeeffffeeeffeeffffeb
bbefffffggggebeeeeefffoeb
eeeeeefgggggeebbeeeefffeb
eefebefgggggfeebeebeffeeb
befebegggggggfeebbeeffebb
beeeeegggggggffebbefggeeb
bbeffogggggggfeebbefggfee
bbefoffgggggfeebbbeefffee
bbeeffofgggfeebbbbbefffeb
bbbeeeeeefeeebbbbbbeefeeb
bbbbbbbbeeebbbbbbbbbeeebb
wh Turais 16 1 0/0 205/16 144/13
wh Lazebe 2 2 205/16 0/0 279/22
wh Sirius 23 14 144/13 279/22 0/0
beacon Bellatrix_Station 13 6

sector WW_2-934:16,11
bbbbbbbbbeebbbbb
bbbeebbbeeeeebbb
bbbeebbeefffeeeb
eeeeeeeeffffffee
eeeeeffffffffeee
eebbeffffooooebb
eebbefffoooooeeb
eeeeefffooofofeb
eefffffffeeefeeb
beeeeeefeebeeebb
bbbbbbeeebbbbbbb
wh Olaeth 12 1 0/0 89/8
wh Homam 4 9 89/8 0/0

sector Sirius:30,25
beebbbbbeeebbbbbeeebbbbbbbbbbb
eeeebbbeefeebbbeefeebbbbbbbbbb
effeeeeefffeeebeeffeebbbbbbbbb
eefeeffffooofeebefffeeeeebbbbb
beeeefffffooofeeeffgggggeeebbb
bbeeeeffffffffffffgggggggfebbb
bbbbbeeeeeeeeefoofggggggggebbb
bbbbbbeebeeeeeffofggggggggebbb
bbbbbbbbbeeeeeffffggggggggeebb
bbbeeebbeefffffeeeefgggggggeeb
bbeefeeeefggggfebbefgggggggeeb
beefooffffggggfebbeefggggggebb
beooooffffggggfeebbeefggggfeeb
befoooooffffffffeebbefffffffeb
befofofofffffffffeeeefffggffee
beoffofffffffffffffffffggggffe
beefofffffffffffffeeeefggggffe
bbeeefgggfffffffffebbefggeeeee
bbbbefggggffffffffeeeefggebeeb
bbbbeeggggfffffffffffffffebbbb
bbbbbefgggffffffffffffeeeeeebb
bbbbbeefffffffeeeffffeebeffeeb
bbbbbbeeeefffeebeefeeebbeefeeb
bbbbbbbbbeeefebbbeeebbbbbeeebb
bbbbbbbbbbbeeebbbbbbbbbbbbbbbb
wh Bellatrix 1 2 0/0 307/28 357/27
wh Gienah_cygni 29 16 316/28 0/0 134/8
wh UG_5-093 28 22 366/27 134/8 0/0
beacon Sirion 14 16

sector Gienah_Cygni:15,26
bbbbbbbbbbbbeeb
bbbbbbbbbbbbeee
bbbbbbbbbbbeefe
bbbeeebbbbbefee
beeeeebbbbeeeeb
beffeeebeeeebbb
beeeeeeeeffebbb
bbbbefffffeebbb
beeeefffffebbbb
eeffffffffeebbb
eefffffffffebbb
befffffffffeebb
befffffggggfebb
eeffffggggggebb
eeffffggggggebb
beeeffggggggebb
bbbeffggggggebb
bbbeefggggggebb
bbbbeffggggeebb
bbbeeffffeeebbb
bbbeeefffebbbbb
bbbbbefffeebbbb
bbbbbeefooeebbb
bbbbbbeooofebbb
bbbbbbeeofeebbb
bbbbbbbeeeebbbb
wh Sirius 2 4 0/0 187/16
wh UG_5-093 3 20 187/16 0/0
beacon Gienah_Cygni 4 11

sector Homam:17,22
bbbbbbbbbbeeeebbb
bbbbbbbeeeeffeebb
bbbbbbbeeffgggebb
bbbbbbbeefggggebb
bbbbbbbeefggggebb
bbeebbeeffggggeeb
beeeeeeffffffffeb
eegggggffffffffee
eggggggffffffffee
eggggggfffffeeeeb
eggggggfffffebeeb
eggggggfffffeebbb
eggggggffffffeeeb
eggggggffffffffee
eegggfffffffffeee
beffeeeeefffeeebb
befeeeebefooebbbb
beeeeeebeoofeebbb
bbefffebeefofeebb
bbeeefebbeeeeeebb
bbbbefebbbbeebbbb
bbbbeeebbbbbbbbbb
wh WW_2-934 13 0 0/0 188/16 243/20
wh Matar 16 13 188/16 0/0 185/14
wh Pass_UNI-05 6 20 243/20 185/14 0/0
beacon Homam 9 9

sector Matar:16,16
bbbbbbeeebbbbbbb
bbbbbeefeebbbbbb
bbbbeefffeebbbbb
bbbbefffffebbbbb
bbbeeffffeebbeeb
bbbefffffebbeeee
bbbefffffeebeffe
bbbefffffeeeeffe
eebefffffebefffe
eeeefffffeeeffee
eebeeffffffffeeb
bbbeeffffgggfebb
bbbbeefffgggfebb
bbbbbeeefgggeebb
bbbbbbbeeffffebb
bbbbbbbbeeeeeebb
wh UG_5-093 14 5 0/0 176/14
wh Homam 1 9 176/14 0/0
beacon Matar 6 5

sector UG_5-093:22,23
bbbeebbbbbbbbbbbbbbbbb
bbeeeebbbbbbbbeeebbbbb
beeffeeebbbbbeefebbbbb
beeffffeebbbbeffeebbbb
bbeefeefeebbbefffeebbb
bbbeeeeffebbbeeefeebbb
bbbbeefffeebeeeefebbbb
bbbbbeefffeeefffeebbbb
bbbbbbeeefffffffebbbbb
beebbbbbefgggggfebbbbb
eeeeebeeefgggggfeebbbb
efffeeefffgggggffeeebb
eefffffffffffffffffeeb
beeffeeeeefffeeefeefeb
bbeeeeeebeeefebeeeefeb
bbbbeeeebeeefeebefffee
bbbbbbbbeeffeeebeffofe
bbbeebbeefffebbbefoooe
bbbeeeeefffeebbeeffoee
bbeefeeffeeebbbeffffeb
bbeefeeffebbbbeeffffeb
bbbeefeeeebbbbeeffeeeb
bbbbeeeeebbbbbbeeeebbb
wh Sirius 3 1 0/0 175/13 187/16 256/22 261/21
wh Gienah_Cygni 16 3 175/13 0/0 191/15 232/20 208/19
wh Matar 1 11 178/16 182/15 0/0 183/12 247/22
wh Nekkar 3 20 256/22 232/20 192/12 0/0 254/20
wh Achird 17 22 261/21 208/19 256/22 254/20 0/0

sector Nekkar:14,24
bbbbbbbbbbeebb
bbbbbbbbbeeeeb
bbbbbbbbbeffee
bbbbbbbeeefffe
bbbbbbeeffffee
bbbbbeefffeeeb
bbbbbefffeebbb
bbbbbeeeeebbbb
bbbbbbbebbbbbb
bbbbbbbebbbbbb
bbbbbbbebbbbbb
beeebbbebbbbbb
befebeeeeebbbb
befeeefffeebbb
beeebefmmfebbb
bbebbeemmeebbb
bbebbbeeeebbbb
beeebbbbbbbbbb
beeebbbbbbbbbb
bbebbbbbbbbbbb
bbeeebbbbbbbbb
eeeeebbbbbbbbb
effeebbbbbbbbb
eeeebbbbbbbbbb
wh UG_5-093 12 1 0/0 373/22
wh BE_3-702 0 21 373/22 0/0

sector Achird:22,22
bbbbbbbbbbbbeeebbbbbbb
bbbeeebbbbbbefeeebbbbb
beeefeebbbbeefffebbbbb
beggggebbbeefeefebbbbb
eeggggebbbeffeefeeebee
efggggeebbeeefffffeeee
eeggggfebeeeefffffebee
beggggfeeeffffffffebbb
beefffffffffffffffeebb
bbbeffoofffffffooffebb
bbbefoooffffffoooofebb
bbbeffoffffffffoooeebb
bbbeeffffffoofffooebbb
bbbbefffffooffofofebbb
bbbbefffoooofeeefeebbb
bbbbeffffooofebeeebbbb
bbbbeeffffoffeebbbbbbb
bbbbbefffffofeebbbbbbb
bbbbbeeeeeoooebbbbbbbb
bbbbbbeebefofeebbbbbbb
bbbbbbeebeeffeebbbbbeb
bbbbbbbbbbeeeebbbbbbbb
wh UG_5-093 13 0 0/0 208/19
wh Phaet 6 19 208/19 0/0
beacon Achird_Station 9 7

sector Pass_UNI-05:25,26
bbbbbbeeebbbbbbbbbbbbbbbb
bbbbeeefeeebbbbbeeeebbbbb
bbeeeffeefeebbbeeffeebbbb
beefeeeeeeeeebbeffffeebbb
eefeebeeeeefeeeeeefoeebbb
efeebbbbeeeeefffeefffebbb
efebbbbbbeebeeeeeeeeeebbb
eeeebbbbbbbbbbbbbebbebbbb
befeeebbbbbbbbbbbebbebbbb
beeeeeebbbbbbbbbbebeeeebb
bbbbefeebbbbbbeeeeeeffeeb
bbbbeffebbbbbbefffffeeeee
bbbeefeebbbbbeefeeefebeee
bbbefeebbbbbbeeeebeeeeeeb
bbbeeebbbbbbbeeeebbeeefee
eebeebbbbbbbbeffebbbbeeee
eeeeeeebbbbbeefeebbbbbeeb
eebeffeebbbbeffebbbbbbbbb
bbbeeffeebbbeefebbbbbbbbb
bbbbeeeeebbbbefeebbbbbbbb
bbbbeebeeebbeefeebbbbbbbb
bbbbeeeefeeeefeebbbbbbbbb
bbbbeefffffeefebbbbbbbbbb
bbbbbeefeeeeefeebbbbbbbbb
bbbbbbeeebeeeeeebbbbbbbbb
bbbbbbbbbbbbbeebbbbbbbbbb
wh Homam 18 1 0/0 203/14 417/30
wh BE_3-702 23 15 203/14 0/0 386/26
wh Nusakan 0 16 417/30 386/26 0/0

sector BE_3-702:20,20
bbbbbbbbbbbbbbbeebbb
bbbbbbbbbbbbbbeeeebb
bbbbbbbeeeeebbeffebb
bbbeeeeegggeeeeffebb
bbeeggggggggfgggeebb
beegggggggggfgggebbb
beegggggggggfgggebbb
bbeggggggggfggggeebb
eeefgggggggfgggggeee
eeeefggggggfggggggfe
bbbefggggggfggggggfe
bbbeffgggggfggggggee
bbbeefgggggfggggggeb
bbbbefffgggfggggggeb
bbbeegggggfggggggeeb
bbbeegggggfgggggeebb
bbbbegggggfgggeeebbb
bbbbeeeefffffeebbbbb
bbbbbbbeeeffeebbbbbb
bbbbbbbbbeeeebbbbbbb
wh Nekkar 16 1 0/0 217/15 199/18
wh Pass_UNI-05 1 9 217/15 0/0 152/11
wh Cebalrai 10 19 199/18 152/11 0/0

sector Phaet:17,16
bbbbbbbbbbbbbbeee
bbbeebbeeebeeeefe
bbeeeeeefeeefffee
bbeffffffffggfeeb
beeffffffffggfebb
beffffffffffffeeb
befffffffffffffee
eeffffffffeeefeee
eeffffffffebeeebb
beeffffeeeeebbbbb
bbeffffebeeeeebbb
bbeefffeebeeeeeeb
bbbeffeeebeeeffee
bbbeeeeeebeefeefe
bbbbeebbbbbeeeeee
bbbbbbbbbbbbeeeeb
wh Achird 15 0 0/0 152/12
wh Subra 8 12 152/12 0/0
beacon Phaet 5 5

sector Keid:20,20
bbeebbbbbbbbbbbbbbbb
bbeebbeeebbbbbbbbbbb
beeebeefeeebbbbbbbbb
eefebeffffeeebbbbbbb
eeeeeeeeeeeeebbbbbbb
eeeeeeebeebeeeebbbbb
eefebbbbeebbefebeebb
beeeeeeeeeeeefeeeeeb
bbeeeeeeeeeeefeeefee
bbbbebeebbbbeeebeeee
bbbbebbbbbbbbeebeebb
bbbbebbbbbbbbbbbeeeb
bbbbebbbbeeebeeeefee
bbbeeeeeeefeeefeeeee
bbeefeeefeeeeeeebbbb
bbeeeebeeebeebeeebbb
bbeeeeeeebeeeeeeebbb
bbeeefeeebeeffeebbbb
bbbbeeebbbbeeeebbbbb
bbbbbbbbbbbbeebbbbbb
wh Cebalrai 17 10 0/0

sector Cebalrai:21,24
bbbbbbbbbeeebbbbbbbbb
bbbbbbbbbefebbbbbbbbb
bbbbbbbbbefeeebbbbbbb
bbbbbbeeeeffeebbbbbbb
bbbbbeefffffebbbeeebb
bbeeeeffffffeeeeefeeb
beeofffffffffffffooee
beooooffffffffffffoee
befofffffffffffeeefeb
eeffffffffffffeebefee
eeffeefffffeeeebeeffe
beeeeeefggeebbbbeffee
eeeebbefggebbbbeeffeb
efeebbeefeebbbeefffeb
efebbbbeeebbbbeefooeb
efebbbbbbbbbbbbefoeeb
efebeebbbbbbeeeeeeebb
efeeeeebeeeeeeeeebbbb
eeebefeeeffffebbbbbbb
beebeffffffofeebbbbbb
bbbbeeeeffffeeebbbbbb
bbbbbbbeeeefebbbbbbbb
bbbbbbbeebefebbbbbbbb
bbbbbbbeebeeebbbbbbbb
wh BE_3-702 10 0 0/0 155/11 157/13
wh Subra 19 11 155/11 0/0 234/18
wh Keid 1 13 148/13 225/18 0/0
beacon Cebalrai 9 7

sector Subra:20,20
bbbbeeebbeeebbbbbbbb
bbbbefeebefebeeeebbb
bbbeeffeeefeeeffeebb
bbbegggffgggfffffebb
bbeeggggggggggggfeeb
bbefgggggggggggggfeb
bbeefggggggggggggfee
bbbefgggggggggggggfe
bbbefgggggggggggggfe
eeeefgggggfgggggggfe
eeefffggggggggggggfe
bbeffgggggggggggggee
bbefgggggggggggggeeb
bbeegggggggggggggebb
bbbegggggggggggggeeb
beeeggggeeeegggggfeb
beffgggfebbegggggeeb
beeffffeebbeegggeebb
bbeefeeebbbbeeeeebbb
bbbeeebbbbbbbbbbbbbb
wh Phaet 10 0 0/0 151/10 168/12
wh Cebalrai 1 9 151/10 0/0 243/17
wh Furud 18 12 168/12 243/17 0/0

sector Furud:15,20
bbbbbbeeeeeebbb
bbbeeeeffffeeeb
bbeeofoffffffeb
beeooooofffffee
befoooffffffffe
befoooofffffffe
eeffofffffffffe
eefffffeeeffffe
beefffeebefffee
bbeeeeebeefeeeb
bbbbbebbeefebbb
bbbbeeebbefeebb
bbbbeeebbeeeeeb
bbbbbbbbeeeefeb
bbbbbbbeeeeeeeb
bbbbbbbeeebeebb
bbbbbbbeebeeeeb
bbbbbbbbbbeffee
bbbbbbbbbbeeffe
bbbbbbbbbbbeeee
wh Subra 1 7 0/0
beacon Furud 11 5

sector Kitalpha:17,16
bbbbbbbbeeebbbbbb
bbbbbbbbeeebbbbbb
bbbbeebbbebbbbbbb
bbbeeeebeeeebeebb
bbbeffeeeffeeeebb
eebeffffffffffeeb
eeeeffooffffffeeb
eebeffofffffffebb
bbbefoooffffffeeb
bbbeoooofffffffeb
bbeeffoffffeeefee
beeffffoooeebefee
eeffeeeoofebeeeeb
effeebefoeebeeebb
eeeebbeeeebbeebbb
beebbbbeebbbbbbbb
wh Etamin 1 6 0/0 176/14 126/9 198/13
wh EH_5-382 15 6 176/14 0/0 158/14 116/8
wh Wasat#West 1 14 126/9 158/14 0/0 166/13
wh Wasat#East 12 14 198/13 116/8 166/13 0/0
beacon Kitalpha 11 7

sector EH_5-382:14,15
bbbbbeeebbbbbb
bbbbbeeebbbbbb
bbbbbbebbbbbbb
beeeeeeeeebbbb
eefffffffeeeeb
efffeeeeefffee
efffebbbeffffe
efffeeeeefeeee
eeffeeeeefebee
beefebbbefebbb
bbeeeebeefebbb
bbbeeeeefeebbb
bbbbeebefebbbb
beeeeeeeeebbbb
beeeeeeeebbbbb
wh Pass_UNI-02 6 1 0/0 97/7 97/7 193/13 147/12
wh Kitalpha 0 6 97/7 0/0 129/12 125/8 125/8
wh Diphda 12 7 97/7 129/12 0/0 172/10 97/7
wh Alfirk#West 2 13 193/13 125/8 172/10 0/0 114/6
wh Alfirk#East 8 13 147/12 125/8 97/7 114/6 0/0

sector Diphda:20,20
bbeeebbbbbbeeebbbbbb
beefebbeebbeeebbbbbb
eeffeeeeeebbebbbbbbb
efffebbefeeeeeebbbbb
eoffebbeefffffeebbbb
eefeebbbeffffffebbbb
beeebbeeeffffffeeeee
bbbbbeeffffffffffeee
bbbbbeefffffffffeebb
beeebbefggggggfeebbb
eefeeeefggggggfebbbb
eefoofffggggggfebeee
befoooofggggggfeeefe
beeffoffggggggfebeee
bbeeffffggggggfebbbb
bbbeeffffgggggfeebbb
bbbbeeeeefgggfffebbb
bbbbbbbbeeffffeeebbb
bbbbbbbbbeefeeebbbbb
bbbbbbbbbbeeebbbbbbb
wh Pass_UNI-03 12 1 0/0 125/8 125/8 207/18
wh Thabit 18 6 125/8 0/0 157/13 158/14
wh EH_5-382 5 7 125/8 157/13 0/0 138/12
wh Phao 11 19 207/18 158/14 138/12 0/0
beacon Diphda 11 7

sector Thabit:25,25
bbbbbeebbeeeeebbbbbbbbbbb
bbbeeeebeefffeebbbbbeeebb
beeeffeeefffffeebbbeefeeb
beeeeeebeeffffoebbeefffeb
beebeebbbeeeeeoebbeffffeb
eeebbbbbbbebbeeebbeeeeeeb
efeebbbbeeeebbbbbbeebeebb
effeebbeeffebbbbbbbbbeeeb
eeffeebeffeebbeebbbbeefee
beeffeeeffebbbeeebbeeffee
bbefffoffeebbeefeeeefeeeb
eeeffffffebbeefffffffebbb
eeeefffffeeeefggggggfeebb
eebeeeeffffffgggggggeeebb
bbbbbbeffffffgggggggebbbb
bbbbeeeffffffgggggggebeee
bbeeeffffffffgggggggeeefe
bbefffffffffffgggfffebeee
beefffffeeefffffeeeeebbbb
beeffffeebeeffffebeebbbbb
eeffeeeebbbefffeebeeeeebb
eeffebbbbbbefffebbefffeeb
beeeebbbbbbeeffebbeefffeb
bbeebbbbbbbbeeeebbbeeeeeb
bbbbbbbbbbbbbbeebbbeebbbb
wh Diphda 1 12 0/0 156/12 196/16
wh Phao 1 21 156/12 0/0 178/16
wh Adara 14 24 196/16 178/16 0/0
beacon Thabit 9 15

sector Wasat:25,19
bbbbbbbbbbeebbbbbbbbbeebb
bbbeeebbbeeeebbbbbbbeeeeb
bbeeeebbeeffeeebbbbeeffee
bbefebbbefffffebbeeeeefee
beefebbeeffffeebbeefeefeb
eeffebeefffffebbbbefeeeeb
eeffeeeffffffebbbeefebbbb
beeefffffffffeebbeeeebbbb
bbbeeeffffffffebeeeeeebbb
bbbbbefgggggffebeeeefeeeb
bbbbbefggggggfeeeebeeeeeb
bbbbbefggggggggffeeeebeeb
bbbbeefggggggggfffeeebeeb
bbbeefffgggggggeeeeeeeeeb
bbbefffffggggggebeeffeeeb
bbbeefeeefffffeebbeeeebbb
bbbbeeebeffffeebbbbbbbbbb
bbbbbbbbeefeeebbbbbbbbbbb
bbbbbbbbbeeebbbbbbbbbbbbb
wh Kitalpha#East 22 0 0/0 345/25 253/18
wh Kitalpha#West 4 1 345/25 0/0 197/17
wh HW_3-863 10 18 253/18 197/17 0/0
beacon Wasat 10 6
beacon Hidden_Laboratory_Wasat 23 14

sector Alfirk:20,15
bbeebbbbbbeeebbbbbbb
beeeeeebbbefebbbbbbb
beffeeebbbeeebbbbbbb
befeebbbbbbebbbbbbbb
eefebbbbbeeeebbeeebb
effeebbbeeffeeeeoeeb
eeeeebbbefffffffooeb
eebeebbbeeffffooofee
eebeeebbbeeffffgggee
eebeeebbbbeefffgggeb
eebbeebbbbbeeeeeeeeb
eeebeebbbbbbeebbebbb
eeeeeeebeebbbbbeeebb
beeeeeeeeeeeeeeefeeb
bbeebeeeeebbbbbeeeeb
wh EH_5-382#East 11 0 0/0 536/32
wh EH_5-382#West 5 1 536/32 0/0

sector Phao:21,20
bbbbbbbeeebbbbbbbbbbb
bbbbbbeefeebbbbbbbbbb
bbbbbeefffeebbbbbbbbb
bbbbbeeffffeeebeebbbb
bbbbbbefgggffeeeeebbb
bbbbbeegggggffffeebbb
beeebefgggggggffebbbb
eefeeefgggggggffeebbb
eefeeefgggggggfffeebb
beeebeffggggffgggfebb
bbbbbeefffffffggggeeb
bbbbbbeeffffffgggggeb
bbbbbbbeffffffgggggee
bbbbbeeeofffffgggggee
bbbbbeoffffffffggggeb
bbbbbeeoooffffffffeeb
bbbbbbefofoffeeeeeebb
bbbbbbeeofffeebeebbbb
bbbbbbbeefeeebbbbbbbb
bbbbbbbbeeebbbbbbbbbb
wh Diphda 8 0 0/0 118/10 193/17 194/18
wh Thabit 17 4 118/10 0/0 157/13 158/14
wh Seginus 16 17 193/17 157/13 0/0 76/4
wh Mebsuta 12 18 194/18 158/14 76/4 0/0
beacon Phao 11 11

sector Adara:15,21
bbbbbbeebbbbbbb
bbbbbeeebbbbbbb
bbbbbefeebbbbbb
bbbbeeffebbbbbb
bbeeefffeebbbbb
beeeeefffeebbbb
befebeffeeeeebb
eefebeffeeffeeb
eeeeeeffffeeeeb
bbeeeeeeeeebbbb
bbbbbeebbeeeebb
bbeeeeeeeeffeee
beeffeeeeffffee
beeffebbemmeeeb
bbeefeeeemmebbb
bbbeeffffffeebb
bbbbeeffeeeeeeb
bbbbbeefebbefeb
bbbbbbefeeeeeeb
bbbbbbefeeeeebb
bbbbbbeeebbbbbb
wh Thabit 7 1 0/0 226/19
wh Seginus 7 20 226/19 0/0

sector HW_3-863:16,20
bbbbbbeeebbbbbbb
bbbbbbefebbbbbbb
bbbbbbefebbbbbbb
bbeeeeefeeebbbbb
beefffffffeeeeeb
eeffffeeeeeoffee
eefeeeebbbeeeffe
eefebbbbbbbbeffe
beeeeeebbeeeefee
bbefffeeeeffeeeb
bbefgggggggfebbb
bbefgggggggfeebb
beefggggggggfeeb
beffggggggggffeb
beeeggggggggfeeb
bbbeoffeeefffebb
beeeoffebeeffeeb
beeffffeebeefeeb
bbeeeeffebbeeeeb
bbbbbeeeebbbbbbb
wh Wasat 7 0 0/0 135/9 221/18
wh Nex_0004 15 6 135/9 0/0 158/12
wh Rotanev 7 18 212/18 149/12 0/0

sector Nex_0004:25,25
bbbbbbbbbeeebbbbbbbbbbbbb
bbbbbeeeeefeeeebeebbbbbbb
bbbbeeffffofofeeeeeebbbbb
bbbbeffffffooofffffeebbbb
bbbbeeffffofofffffffebbbb
bbbbbeefffooffffffeeebbbb
beebbbefeeeefeeeeeebbbbbb
eeeebbefebbefebbbbbbbbbbb
eefeeeefebbefebeebbbbeeeb
beefffffeeeefeeeeeeeeefee
bbeeeeeeeeffffffeeeeeeeee
bbbbbeebbeeeeeeeebbbbeebb
bbbbbbbbbeebbbeebbbbeeeeb
bbbbbbbbbbbbbbbbbbbbefeeb
bbbbbbbbbbbbbbbbbbbbeeebb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
wh HW_3-863 4 3 0/0 169/16 146/11 289/19
wh Mebsuta 20 4 169/16 0/0 236/20 288/18
wh Nex_0004_South#West 0 7 146/11 236/20 0/0 329/23
wh Nex_0004_South#East 22 13 289/19 288/18 329/23 0/0

sector Nex_0004_South:25,25
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbb
beeebbbbbbbbbbbbbbbbbbbbb
eefeebbeeebbeeebbbbbbbbbb
eeffebeefeeeefeeebbbbbbee
beefeeefffffffffeeebeeeee
bbeeeeefffeeeeeeffeeeffee
bbbeebefffebbbbeeefffeeeb
beebbbefeeebbbbbbeeefebbb
beeeeeefeeeeeeeebbbefeebb
beefeeeeeefffffeeeeeffeeb
bbeeeeebbefeeeffffffeeeeb
bbbeeeebbeeebeeeeeeeebbbb
wh Nex_0004#West 0 15 0/0 275/23 183/12
wh Nex_0004#East 23 17 275/23 0/0 146/11
xh 12 22 174/12 137/11 0/0

sector Mebsuta:17,19
bbbbeeebbbbbbbbbb
bbeeefeebbeebbbbb
bbeffffebbeebbbbb
bbeefffeeeeebbbbb
bbbeeffggggeeebbb
bbbbefggggggfeebb
eebeefggggggffebb
eeeeffggggggffeeb
efffffgggggffffeb
efffffgggggfffeeb
effofofggggfeeebb
efffofffffeeebbbb
eeoooofoffebbbbbb
beffofofffeeeeeee
beeffoffffeeefffe
bbeffffffeebefffe
bbeeffffeebbefffe
bbbeeeeeebbbeeffe
bbbbbbbbbbbbbeeee
wh Phao 5 0 0/0 128/11 179/17
wh Nex_0004 0 6 128/11 0/0 128/11
wh Zaniah 5 17 179/17 128/11 0/0

sector Seginus:17,18
eeebbbbbbeeebbbbb
efeebbbbbefebbbbb
eefeebeeeefebbbbb
beefeeeffffeebbbb
bbeeffgggggfebbbb
bbbeffggggggeebbb
bbbeffggggggfeebb
bbbeeffggggggfebb
bbbbeeefgggggfeeb
bbbbbbefgggggffeb
bbbbbbefggggfffeb
bbbbbeeffffffffee
bbbbeefffffffffee
bbbbefffffffffeeb
bbbbeffffffeeeebb
bbbbeefffeeebbbbb
bbbbbefffebbbbbbb
bbbbbeeeeebbbbbbb
wh Adara 10 0 0/0 122/9 184/17
wh Phao 1 1 113/9 0/0 160/16
wh Nusakan 9 17 184/17 169/16 0/0
beacon Seginus 8 12

sector Rotanev:16,19
bbbbbbbeebbbbbbb
bbbbeeeeebbbbbbb
bbbeefffebbbbbbb
bbeefffeebbbbbbb
bbeffffebbeeebbb
bbeffffeebefeeee
bbefffffeeeffffe
beefffffeeeffffe
befffffeebeffooe
eefffffebbeeoeee
effffofebbbeeebb
eefooooeebbbbbbb
beeefoffebbbbbbb
bbbeefofeebbbbbb
beebefoooebbbbbb
eeeeeffoeebbbbbb
efebeffeebbbbbbb
eeebeeeebbbbbbbb
beebbbbbbbbbbbbb
wh HW_3-863 7 1 0/0 176/14
wh DH_3-625 1 15 176/14 0/0
beacon Rotanev 5 6

sector Zaniah:16,16
bbbbeebbbbbbeebb
bbeeeeebbbeeeeeb
beefffebbeeeeeeb
eefffeebbeeebbbb
eeeffebbbbeeebbb
bbeffeebbeefebbb
bbefffeebeeeebbb
eeeffffeebeebbbb
efffffffeeeeeebb
eefffffffffffeeb
befffffeeeeeeeeb
beffffeebbeebbbb
befffeebbbeeeebb
beeffebbbeeggeeb
bbeeeebbbefggfee
bbbeebbbbeeeeeee
wh Mebsuta 4 1 0/0 158/14
wh Zuben_Elakrab 4 15 158/14 0/0
beacon Zaniah 5 8

sector Nusakan:25,19
bbbbbbbeebbbbbbbeeeebbbbb
bbbbbeeeeebbbbeeeffeeebbb
bbbbbefffebbbeefffoooebbb
bbeeeeffeebbbeffffffeebbb
beeggggfebbbbefffeeeebbbb
begggggfeebbbeeeeebbbbbbb
eeggggggfeebbbeebbbbbbbbb
efggggggffeeeeeeeeeeeebbb
efggggggfffffffffeeeeebbb
eeggggggffffffffffffoebee
beefffffffeeeeeefffffeeee
bbeeffooffeeeebeeeeeeebee
bbbeeefoffeebbbbbebbbbbbb
bbbbbeeefffeeebeeeeeeebbb
bbbbbbbeeefffeeefffggeebb
bbbbbbbbbeffeebefffggeebb
bbbbbbbbbeffebbeefeeeebbb
bbbbbbbbbeeeebbbeeebbbbbb
bbbbbbbbbbeebbbbeebbbbbbb
wh Seginus 8 0 0/0 246/21 207/18
wh Pass_UNI-05 23 10 246/21 0/0 229/13
wh Yildun 10 18 207/18 229/13 0/0
beacon Bio_Weapon_Station_Nusakan 1 7

sector Zuben_Elakrab:25,17
bbbbbbbeebbbbbbbbeeeeeebb
bbbbbbbeebbbbbbbeeffffeeb
bbbbbbbeeebbbbbbeffffffee
bbbbbeeefebbbbbeefffffgge
bbbbeefffebbeebeeeeeeegge
bbbeeffffeeeeebeebbbbefee
bbbeeffffggggeeeeebbbeeeb
bbbbeefffggggggffeebbbbbb
bbbbbeeffggggggfffeebbbbb
beeebbeeffggggggggfeeebbb
eefeebbeeeeffffggggffeeee
eggfeeeeebeffffgggggffffe
eggfffffebeefffgggggfffee
eggfffffebbeeeegggggffeeb
efffffooebbbebeggggeeeebb
eeeffooeebbeeeeeeeeebbbbb
bbeeeeeebbbeeebbeebbbbbbb
wh Zaniah 8 1 0/0 236/18 185/14
wh Yildun 24 11 236/18 0/0 167/12
wh Pass_EMP-06 12 15 185/14 167/12 0/0

sector Yildun:14,17
bbbbbbbbeebbbb
bbeebbbbeebbbb
beeeebbeeeebbb
beffeeeeffeebb
beggggfffffeeb
beggggffffffeb
beegggffffffee
bbegggffffffee
bbeeffffffeeeb
bbbeeefffeebbb
bbbbbeffoebbbb
bbeeeefooeebbb
eeeffffoofeebb
eeeeffofooeebb
bbbeffeeeeebbb
bbbeeeebbbbbbb
bbbbeebbbbbbbb
wh Nusakan 8 0 0/0 213/15
wh Zuben_Elakrab 0 12 213/15 0/0
beacon Yildun 8 5

sector Dainfa:18,19
bbbbbbbbbbbbbbeebb
bbeeeeeeeeebbeeeeb
bbefeeeeefebbeffeb
beefeeeeeeebbefeeb
befffeebbebbbefebb
beeeeebbbebbeefebb
bbeebbbbbebbeefeee
bbeebbbbbebbbeeeee
beeeebbbeeebeeebbb
beeeebbeefeeefeebb
eeeeebbefeeeeefeee
eefeebeefebbbefeee
beeebbeffeeeeeeebb
bbebbeeeeefffeebbb
eeeeeefebefeeebbbb
eeeeeeeebeeebbbbbb
eeeeeebbbbbbbbbbbb
eeeeebbbbbbbbbbbbb
eeeeebbbbbbbbbbbbb
wh Aveed 15 1 0/0 260/17
wh Ioliaa 2 16 260/17 0/0

sector Aveed:17,15
beebbbbbbbbeebbbb
eeeeebbeeeeeeeebb
efffeeeegggggeebb
eeeeefffgggggebbb
beebeeefgggggebee
bbbbbbeegggggeeee
bbbbbbbegggffebee
bbbbbbbefffffebbb
bbbbbbeefffffeebb
bbbbbeefffffffebb
bbbbbeffffffffebb
bbbeeeffffffffeeb
bbeefffeeeefffeeb
bbeffeeebbeeeeebb
bbeeeebbbbbbeebbb
wh Dainfa 1 2 0/0 177/14 176/14
wh Exiool 15 5 186/14 0/0 147/12
wh Ioliaa 3 14 185/14 147/12 0/0
beacon Aveed 10 9

sector Exiool:22,19
beeeeeebeeeebbbbbbbbbb
beggggeeeffeebbbbeeebb
begggggfffffeeebeefeeb
beggggggffffffeeefofee
beggggggffffffofoooffe
beegggggffffffffooooee
eeeegggfffffeeeeeoffeb
eeeegggffffeebbbeeeeeb
eebefffffffebbbbbbeebb
bbbeeeeffffeebbbbbbbbb
bbeeebeeeeffeebbbbbbbb
beefeebbbefffeeebbbbbb
beeffeebbeeffffebbbbbb
bbeeffeebbeeffeebbbbbb
bbbeeeeebbbeeeebbbbbbb
bbbbeebbbbbbbbbbbbbbbb
bbbbeebbbbbbbbbbbbbbbb
bbbbeebbbbbbbbbbbbbbbb
bbbbeebbbbbbbbbbbbbbbb
wh Aveed 1 7 0/0 157/13 182/11
wh Beta_Hydri 14 13 157/13 0/0 204/15
wh Edethex 5 17 182/11 204/15 0/0
beacon Exiool 10 4

sector Ioliaa:18,16
bbeebbbbbbbeeebbbb
beeebbbbbeeefeebbb
befebbbbbeffffeeeb
befeebbbeeffffffeb
befeebbbeffffffeeb
eefebbeeeffffffebb
effebeeffffffffeeb
eefeeeffffffffffee
beeefffffffffffooe
bbeefeefeeefffofoe
bbeefeeeebeefffoee
beeffffebbbeeeeeeb
beeefffeeebbbbeebb
bbbeeeeffeeebbbbbb
bbbbbbeeeefebbbbbb
bbbbbbbbbeeebbbbbb
wh Dainfa 2 1 0/0 187/16 177/15
wh Aveed 14 1 187/16 0/0 175/13
wh Gretiay 10 14 168/15 166/13 0/0
beacon Ioliaa 11 6

sector Edethex:25,25
bbbbbbbeeeebeebbbbbeebbbb
bbeeeeeeffeeeeebeeeeeebbb
beeffffeeeffffeeeffofeebb
eefoeeeebeeefffeefffffeeb
efffebbbbbbeeeeeefoffffeb
efooeeebbbbbbbeeeeeeeffeb
eefoffeeebbbbbbeebbbeffee
beefeeeffebbbbbbbbbbefffe
bbeeebeeeeeeebbbbbbbeffee
bbbeebbbeeffebbbbbbeeffeb
bbbeebbbbeffeebbbbeeggfeb
bbeeeebbbeeffeebbbeeggfeb
beeffebbbbefffebbbbeffeeb
befffeebbbeeeeebbbeeffebb
eeffggebbbbbeebbbbeffeebb
eeffggebbbbbbbbbbeeffebbb
beefggebbbbbbbbbbeeffebbb
bbefggeeebbbbbbbbbeffeeee
bbefggffeebbbbeeeeefffffe
beeffffffebeeeeffffffffee
eefffffffeeefeeeeeefffeeb
eeffffffffffeebbbbeeeeebb
bbeffffffffeebbbbbbbeebbb
bbeeffffeeeebbbbbbbbbbbbb
bbbeeeeeebbbbbbbbbbbbbbbb
wh Exiool 15 2 0/0 226/19
wh Beta_Hydri 23 19 226/19 0/0
beacon Edethex 5 20

sector Beta_Hydri:24,20
beebbbbbbbbbbbbbbbbbbbbb
eeeebbbbbbbbbbbbbbbbbbbb
effeebbbbbeeebbbbbbbbbbb
efffeebbbbefeebbbbbbbbee
efggfeeeeeeffeebbbbbbbee
efggeebbbbefmmeebbbbbeee
eeffebbbbbefmmfeeeeeeefe
beffeebbbbeefeeebbbbbeee
eefffeeebbbeeebbbbbbbbee
eefffggebbbbbbbbbbbbbbbb
befffggeeebbbbbbbbbbbbbb
beeffffffebeeeebbbbbbbbb
bbeeeffffeeeffeeebbbbbbb
bbbbefffffffffffeebbbbbb
bbbbefffeeeeffooeebbbbbb
bbbeeeeeebbefofoebbbbbbb
bbeefebbbbbeeffeebbbbbbb
bbeffeebbbbbeeeebbbbbbbb
bbeefeebbbbbbbbbbbbbbbbb
bbbeeebbbbbbbbbbbbbbbbbb
wh Exiool 1 0 0/0 364/22 117/9 217/19
wh Naos 22 6 355/22 0/0 364/22 454/31
wh Edethex 0 9 117/9 373/22 0/0 146/11
wh Vega 3 19 217/19 463/31 146/11 0/0
beacon Beta_Hydri_Station 4 12

sector Naos:17,18
bbbbbbeeebbbbbbbb
bbbbbbeeebbbbbbbb
bbbbbbbebbbeeebbb
bbbbeebebbeeeebbb
bbeeeeeeebefebbbb
beefffffeeefeebbb
eeffffffeeeffeeeb
eeefffffebeffffee
bbeeffffeeefggfee
bbbeeeeffffgggeeb
bbbbbbeffffgggebb
bbbbbeeffoogggebb
bbbbeeffooffeeebb
bbbeeffooooeebbbb
bbbeeeefoofebbbbb
bbbbbbeeffeebbbbb
bbbbbbbeeeebbbbbb
bbbbbbbeebbbbbbbb
wh Pass_UNI-08 7 0 0/0 135/9 192/12
wh Beta_Hydri 1 6 135/9 0/0 168/15
wh CP_2-197 16 8 192/12 168/15 0/0
beacon Naos_Station 8 6

sector CP_2-197:16,13
bbbbbbeeeebbbbbb
bbbeeeeffeeeebbb
bbbeggggffffeeeb
bbeegggggggfffee
bbeegggggggfffee
bbbeggggggggffeb
beeeggggggggfeeb
eefffgggggggeebb
eeeeeeeeeeefebbb
bbbbbeebeeefebbb
bbbbbbbbeefeebbb
bbbbbbbbbeeebbbb
bbbbbbbbbeebbbbb
wh Naos 2 6 0/0 48/3
wh Zaurak 5 9 48/3 0/0

sector Pass_UNI-01:25,16
bbbbbbeebbbeeeeeebbbbbbbb
bbbbeeeeebbefeeeebbbbbbbb
bbbeefffeeeefebeebbbbbbbb
bbbeefffffffeebeeebbbbbbb
bbbbefeeeeeeebbefebbbbbbb
eebeeeebeeeeebbefebeeebbb
eeeefebbbbbbbbbefeeefebee
eebefeebbbbbbbbeeeeefeeee
bbbeffebbeeeebbbeebefebee
bbbefeebeeffeebbbbbefebbb
bbbefebbeeeefebbbbbefeebb
bbeefebeeebefeebbbbeffeeb
bbeffebefebeffeeeeeeeeeee
bbeefeeeeebeefebbbbeebeee
bbbeefeeebbbeeeeeeeeeeeeb
bbbbeeebbbbbbeeeeeeeeeeeb
wh Anphiex 1 6 0/0 366/24
wh Gretiay 24 7 366/24 0/0

sector Gretiay:20,20
bbbbbbbbbeeebeeebbbb
bbbbbbbbbeeeeefeeebb
bbbbbbbbbbeefffffeeb
bbbbbbbbbbbeefeeefee
bbbbbbbbbbbbeeebeffe
bbbbbbbeebbbbbbbefee
bbbbbbeeeeebbbeeeeeb
eebbbeefffeebeeffebb
eeeeeefffffeeefeeeeb
eebbbefgggfffffeefee
bbbbbefgggggfffffffe
bbbbbefggggggffffffe
bbbbbeeggggggfffoffe
bbbbbbeggggggffffeee
bbbbbeeggggggfeeeebb
bbbbbeegggggfeebbbbb
bbbbbbegggggfebbbbbb
bbbbbbeggggfeebbbbbb
bbbbbbeeffeeebbbbbbb
bbbbbbbeeeebbbbbbbbb
wh Ioliaa 10 1 0/0 330/24 183/12 264/21
wh Pass_UNI-01 0 8 330/24 0/0 244/19 234/15
wh Sophilia 19 10 183/12 244/19 0/0 128/11
wh Liaququ 10 19 264/21 234/15 128/11 0/0
beacon Gretiay_Station 12 8

sector Sophilia:24,17
bbbbbbbbbbbbeeeeebbbbbbb
bbbbbbbbbbeeefffeeeebbbb
bbbbbbbbeeeffffffffeeeeb
bbbbbbeeefffffffffffooeb
bbbbbeefffffffffffooooee
bbbbbefffffffffffffooofe
bbbeeefgggfeeeeffffofeee
beeeffggggfebbeeefffoebb
beeffggggfeebbbbeeeffeee
bbeggggggeebbbbbbbeeeeee
beegggggeebbbbbbbbbbeebb
begggggeebbbbbbbbbbbbbbb
eegggeeebbbbbbbbbbbbbbbb
efgggebbbbbbbbbbbbbbbbbb
efffeebbbbbbbbbbbbbbbbbb
efeeebbbbbbbbbbbbbbbbbbb
eeebbbbbbbbbbbbbbbbbbbbb
wh Gretiay 1 8 0/0 237/21
wh DI_9-486 22 8 237/21 0/0
beacon Sophilia 13 3

sector DI_9-486:25,16
bbbbeeebbbbbbbbbbbbbbbbbb
bbeeefeebbeebbbbbbbbbbbbb
beeffffeeeeeebbbbbbbbbbbb
befgggffffffeeebbbbbbbbbb
eefgggggfoffffeebbbbbbbbb
effgggggffffeeeeeeebbbbbb
eeffeeefffffebeeffeeebeee
beeeebeeeeeeeebefoooeeefe
bbbbbbbbeebeeeeeffofffffe
bbbbbbbbbbbbeeffffffeeeee
bbbbbbbbbbbbbefoffffebeeb
bbbbbbbbbbbbbeffooffeebbb
bbbbbbbbbbeeeeffffeeeeeee
bbbbbbbbbbeefffeeeebeffee
bbbbbbbbbbbeefeebbbbeeeeb
bbbbbbbbbbbbeeebbbbbbeebb
wh Sophilia 0 5 0/0 262/23 271/23 231/19
wh Vega 23 7 253/23 0/0 106/7 117/9
wh Daured 23 14 271/23 115/7 0/0 126/9
wh Spica 14 15 231/19 126/9 126/9 0/0

sector Vega:30,25
bbbbbbbbbbbeebbbbbbbbbbbbbbbbb
bbbbbbbbeeeeeeebbbbbbbbbbbbbbb
bbbbbbbeefffffeebbbbbbbbbbbbbb
bbbbbbeegggggffebbbbbbbbbbbbbb
bbbbeeegggggggfeebbbbbbbbbbbbb
bbeeeffgggggggffebbbbbbbbbbbbb
bbeffffgggggggfeebbbbeeeebbbbb
beefffffggggfeeebbbbeeffeeeebb
beffffffffffeebbbbbeeggggffeeb
beffffffffffebbbbbbeggggggffee
beffffffffffeeeeebeeggggggfffe
beffffffffffffffeeefggggggffee
eeffffffffffeeeeeefggggggfffeb
effffffffffeebbeeefggggggfffeb
eefffffffffebbbefffggggffffeeb
befffffoffeebbeeffffffffffeebb
beefffooffebbbeffffoofffeeebbb
bbeeeffofeebbeeffooofeeeebbbbb
bbbbeeffeebbbeefoofofebbbbbbbb
bbbbbefeebbbbbeefofffeebbbbbbb
bbbbbefebbbbbbbefoooffeebbbbbb
bbbbbeeebbbbbbbeefoffeeeebbbbb
bbbbbbeebbbbbbbbeeeofeefebbbbb
bbbbbbbbbbbbbbbbbbeeeffeebbbbb
bbbbbbbbbbbbbbbbbbbbeeeebbbbbb
wh Beta_Hydri 27 7 0/0 317/27 183/16
wh DI_9-486 0 13 317/27 0/0 300/25
wh Ackwada 23 23 183/16 300/25 0/0
beacon Vega 6 10

sector Zaurak:17,27
bbbbbbbbeeeebbbbb
bbbbbbbeeffeebbbb
bbbbbbeeffffeebbb
bbbbbbeffffffebbb
bbbbbbeefffffeebb
bbbbbbbeffffffebb
bbeeebeeffffffebb
beefeeeffffffeebb
beffffeeeffoeebbb
eeffffebeoofebbbb
eeofggeeeoofebbee
beeeggeeeffoeeeee
bbbeeeebeefeebbee
bbbbbebbbeeebbbbb
bbbbbebbeeebbbbbb
bbbbbebeefebeebbb
bbbbeeeeffeeeeebb
bbbeefffgggggfebb
bbeeffffgggggeebb
bbeeffffggggeebbb
bbbefffffeeeebbbb
bbbefffffebbbbbbb
bbeefffffebbbbbee
beefeeeffeeebbeee
beeeebeefffeeeeff
bbeebbbeffeebbeee
bbbbbbbeeeebbbbbb
wh CP_2-197 3 6 0/0 253/19
wh Menkent 2 25 253/19 0/0
beacon Zaurak_I 10 4
beacon Zaurak_II 6 20

sector Liaququ:17,24
bbbbbeeeebbbbbbbb
bbbbeeffeebbbbbbb
bbeeeffffebbbbbbb
beeffffffebbbbbbb
beffffffeebbbbbbb
eeffffffebbeeebbb
efffffffeeeefeebb
efffffffffffofebb
effffffffooofoeeb
effffffffoooofeeb
efffffffooofeeebb
eefffffffofeebbbb
beffffffffeebbeee
beeeeeffffebbbefe
bbbbbeeeffeebbefe
bbbbbbbeeefebeefe
bbbbbbbeeefeeeeee
bbbbbbbeefffffeee
bbbbbbbbeeeeeffee
bbbbbbbeeebbefeeb
bbbbbbbefeeeeeebb
bbbbbbbeefeeeebbb
bbbbbbbbeeebbbbbb
bbbbbbbbeebbbbbbb
wh Gretiay 8 0 0/0 254/20
wh Spica 16 12 254/20 0/0
beacon Liaququ 4 6

sector Spica:20,23
bbbbbbeeebbbbbbeebbb
bbbeeeefebeeebeeeeeb
bbeegggfeeefeeegggeb
bbefggggfffffffgggee
bbeegggggffffffffffe
bbbeggggggggggggffee
bbbeggggggggggggfeeb
bbbeggggggggggggfebb
bbbeggggggggggfffebb
eebefgggggggffgggeeb
eeeefgggffffggggggee
eebeegggfgggggggggfe
bbbbeeeffgggggggggfe
bbbbbbeeegggggggggee
bbbbbbbbefffggggggeb
bbeebbbeeeeegggeeeeb
beeeeeeeeebeffeebbbb
eeffffeeebeefeebbbbb
eeeeeeebbbeffebbbbbb
beeeebbbbeefeebbbbbb
beeeebbbbeeeebbbbbbb
bbeebbbbbbeebbbbbbbb
bbbbbbbbbbeebbbbbbbb
wh DI_9-486 11 1 0/0 157/11 257/20
wh Liaququ 1 10 157/11 0/0 220/16
wh Wainze 11 21 257/20 220/16 0/0

sector Daured:18,17
bbeebbeeebbbbbbbbb
beeeebefeeebbbbbbb
eeffebefffebeebbbb
eeffeeefffebeeebbb
beefffffffebefebbb
bbefffffffebefebbb
bbeeefffffeeefebbb
bbbbeggggffeeeebbb
bbbeeggggffebeeebb
bbbefgggggeebefebb
bbbeeeggggebbefebb
bbbbbeegggeebefeee
bbbbbbeefffeeefeee
bbbbbbbeeffffffebb
bbbbbbbbeeffffeebb
bbbbbbbbbeeeefebbb
bbbbbbbbbbbbeeebbb
wh DI_9-486 1 2 0/0 214/16 154/12
wh Ackwada 17 11 214/16 0/0 117/9
wh Wainze 8 14 154/12 117/9 0/0
beacon Daured 8 4

sector Ackwada:22,15
eeeebbbbbbbbeebbbbbbbb
eefeebbbbeeeeebbbbbbbb
beffeebbeefffeeeebbbbb
beeffeebefffffffeeebbb
bbefffeeefggggffffebbb
bbeffffffggggggggfeebb
beeffffffggggggggffebb
beeffffffggggggggffeeb
bbeeeeefffeeeeeeeeffee
bbbeebeeeeebbeebbeeeee
eebeeebbbbbbbeebbbbbee
eeeeeebbbbbbeeeebbbbbb
eebeebbbbbeeeffebbbbbb
bbbbbbbbbbeeffeebbbbbb
bbbbbbbbbbbeeeebbbbbbb
wh Vega 0 0 0/0 242/21 174/12
wh Menkent 21 9 242/21 0/0 259/20
wh Daured 1 11 174/12 259/20 0/0
beacon Ackwada_Station 5 4

sector Menkent:20,17
bbbbbbbbeeebbbeeebbb
bbbbbbeeefeebeefeeeb
bbbbbeeffffeeeffffee
bbbbeeffffffffgggfee
bbbbeefffffggggggeeb
bbbbbefffffggggggebb
bbbbbefffffggggggebb
bbbbeeffffffggggeebb
bbbbefffffgggeeeebbb
bbbbeffffggggebbbbbb
bbbeeffffggggeeebbbb
bbbeffeeeggggggeeebb
beeeffebefggggggfebb
eeffffeeefggggggfebb
eeeefeeeeeeggggeeebb
bbbeeebeebeefeeebbbb
bbbbbbbbbbbeeebbbbbb
wh Zaurak 19 2 0/0 227/19
wh Ackwada 0 13 227/19 0/0
beacon Menkent 8 5

sector Wainze:17,16
bbbbbbbeebbbbbbbb
bbbbbbeeeebbeebbb
bbbbbeeffeebeeeeb
bbbbeeffffebeffee
bbbeefffffebeffee
bbeeffffffeeeffeb
bbefffffffffffeeb
beeffffffffffeebb
befeeefffffffebbb
eefebeefffffoeebb
eeeebbefffoffoeeb
eeeebeeofooofofeb
beebbefffoofffeeb
bbbbbeefffffeeebb
bbbbbbeffffeebbbb
bbbbbbeeeeeebbbbb
wh Spica 8 1 0/0 106/7 149/14
wh Daured 14 3 97/7 0/0 120/12
wh YV_3-386 8 15 149/14 129/12 0/0
beacon Wainze 8 7

sector Urfaa:23,20
bbbbbbbbbbeeeebbbbbbbbb
bbbbbbbbbeeffeeeeebbbbb
bbbbbbbbeeeeeefffeebbbb
bbbbbbbbefebbeffffeeebb
bbbbbbbbefeeeeffffffebb
bbbbbbbbeefffeeeeeffebb
bbbbbbbbbefffebbbeefebb
eebbbbbbbeeeeebbbbefeee
eeeebbeeeeebeebbbbeefee
effeeeefffeeeeebbbbeeeb
eefeefffeeeeefeebbbbbbb
beeeeeeeebeeeffeebbbbbb
bbeeeebeebeeefffeeeeebb
bbbbbbbbbbbbeeefffffeeb
bbbbbbbbbbbbbbeeeefeeeb
bbbbbbbbbbbbbbbbbefeeee
bbbbbbbbbbbeeeeeeefffee
bbbbbbbbbbeeeeeffffeeeb
bbbbbbbbbbeeebeffeeebbb
bbbbbbbbbbbeebeeeebbbbb
wh Quexce 22 7 0/0 366/24
wh Pass_UNI-02 12 19 366/24 0/0

sector Quexce:19,24
bbbbbbbbeeeebbbbbbb
bbbbbbbeeofeebbbbbb
bbbbbbeeffooebbbbbb
bbbbbbefoofeebbbbbb
bbbbbbeffoeebbbbbbb
bbbbbbefffebbbbbbbb
bbbbeeefffeebbbbbbb
bbbbefffffeebbbbbbb
bbbbeefgggebbbbbbbb
bbbbbefgggebbbbbbbb
bbbbeefgggeeebbbbbb
bbbeeffgggggeeeebbb
bbeefffggggggggeeeb
beefffffgggggggggee
beffffffffgggggggfe
beffffffffgggggggee
eeffffffffgggggffeb
eefffffffffeeeefeeb
beeeefffeeeebbeeebb
bbbbeefeebbbbbbbbbb
bbbbbeeebbbbbbbbbbb
bbbbbbebbbbbbbbbbbb
bbbbbeeebbbbbbbbbbb
bbbbbeeebbbbbbbbbbb
wh YV_3-386 11 6 0/0 88/7 230/17
wh Urfaa 4 7 88/7 0/0 205/16
wh Pass_UNI-03 6 23 230/17 205/16 0/0
beacon Quexce 5 14

sector YV_3-386:12,18
bbbbeeebbbbb
bbbbefeebbbb
bbbbeffebbbb
bbbbeffebbbb
bbbeefeebbbb
beeeffebbbbb
eeffffeeebbb
eeeeffffebbb
bbbeffffebbb
eeeeffffebee
eefffoffeeee
befoooooebee
beooooffebbb
befoofffebbb
beeofoofeebb
bbeoffffeebb
bbeefeeeebbb
bbbeeebbbbbb
wh Wainze 6 0 0/0 108/9 156/12
wh Quexce 0 6 108/9 0/0 155/11
wh Pass_UNI-04 11 10 156/12 155/11 0/0

sector Pass_UNI-02:10,10
bbeeeeeebb
beeffffeeb
eefeeeefee
eefebbeffe
befebeefee
eeeebeeeeb
efebbbbbbb
efeeebbbbb
eeffeebbbb
beeeeebbbb
wh Urfaa 5 4 0/0 162/9
wh EH_5-382 4 7 162/9 0/0

sector Pass_UNI-03:18,21
bbbbbeebbbbbbeeebb
bbeeeeeebbbeeefeeb
bbeffffeebeeeeefee
beefeeeeebefebefee
eefeebbbbbefebefeb
eefebbbbbbefebefee
beeeeeeeeeefebeefe
bbeeffffffffebbefe
bbbeeeeeeeeeebbefe
bbbbbeebeebbbbbefe
bbbbbbbbbbbbbbbefe
bbbbbbbbbbbbbbeeee
bbbeeeeebbbbeeefeb
bbeefffeeeeeeffeeb
beeeeeeeeffffeeebb
eeeeeeeeeeeeeebbbb
eeeeeeeeeeeeebbbbb
beefffeeeebbbbbbbb
beeeeeeefeeebbbbbb
beeeeeeeeeeebbbbbb
bbeebbeeeeebbbbbbb
wh Quexce 8 2 0/0 454/31
wh Diphda 10 18 454/31 0/0

sector Baar:16,12
bbeeebbbbbbbbbbb
beefeebbbbbbbbbb
eefffebbbbbbbbbb
efffoeebbbbbbbbb
efffffebbbbbbbbb
efffffebbbeeebbb
efgggfebeeefeeee
efgggfeeefeeeefe
eegggeebefebbeee
befffebbefeebbee
beefeebbeefebbbb
bbeeebbbbeeebbbb
wh Aandti 15 8 0/0 125/8
wh UZ_8-466 10 11 125/8 0/0

sector Aandti:22,13
bbbbbbeeebeeebbbbbbbbb
bbbeebeeebefeebbbbbbbb
bbeeebbebbeffeebbbbbbb
beefeeeeeeeofeebbbbbbb
beffffffffoofebbeebbbb
beffffffffoffeeeeeeeeb
eefffffffofoofffffffee
eeffffffffooffffeeefee
beefffffoofoffeeebeeeb
bbeeffffffofffebbbbbbb
bbbeeefffffffeebbbbbbb
bbbbbeeffffeeebbbbbbbb
bbbbbbeeeeeebbbbbbbbbb
wh Vecelia 7 1 0/0 97/7 196/16 127/10
wh Baar 1 6 97/7 0/0 218/20 68/5
wh Hooth 21 6 196/16 218/20 0/0 168/15
wh Waolex 6 11 127/10 68/5 168/15 0/0
beacon Aandti 5 6

sector Hooth:25,13
bbbbbbeebbbbbeeeebeeeeebb
bbbbbbeeebbeeeffeeefffeeb
bbbbeeefeeeefffffffffffee
bbbeeffffffffffeeeffffffe
bbeegggffffeeeeebeefffffe
eeefgggfffeebbebbbeeffffe
eeeffffeeeebbeeebbbeeffee
bbeefeeebebbbefeeebbeffeb
bbbeeebbbebbeefffeeeefeeb
bbbbbbbbeeeeefffeebbeeebb
bbbbbbbbeeffffffebbbbbbbb
bbbbbbbbbeeeeeeeebbbbbbbb
bbbbbbbbbbbeebeebbbbbbbbb
wh Aandti 1 5 0/0 248/23
wh Atlas 24 6 248/23 0/0

sector Atlas:21,15
bbbbbbbbbbbbeebbbbbbb
bbbbbbbbbbbeeeeebbbbb
bbbbbbbbeeeeffeebbbbb
bbbbbbeeefffofebbbbbb
bbeebbefffoofeebbeeeb
eeeebbeffooofebbeefee
effeeeefffoofebeefffe
eeeoffggfffffeeefffee
bbeeeegggfffffffffeeb
bbbbbegggffffffffeebb
bbbbbegggffffffffebbb
bbbbbeeeffffffffeebbb
bbbbbbbeeffffffeebbbb
bbbbbbbbeeeeffeebbbbb
bbbbbbbbbbbeeeebbbbbb
wh Qumia 20 5 0/0 223/20
wh Hooth 0 6 223/20 0/0
beacon Atlas 13 10

sector Qumia:20,15
bbbeeebbbbbeeeeebbbb
bbbeeebbbbeeffoeeebb
bbbeebbbbbeffooofeeb
beeeeeebbbeeffffeeeb
beggggeebbbeeffeebbb
begggggeebbbeeeebbbb
eeggggggeebbbebbbbbb
efggggggfeebeeebeeee
eeggggggffeeefeeefee
befgggggffffffebeeeb
befgggffffffffebbbbb
eefffeeeeffffeebbbbb
efffeebbeeffeebbbbbb
efeeebbbbeeeebbbbbbb
eeebbbbbbbeebbbbbbbb
wh Pass_UNI-06 4 1 0/0 106/6 229/16 162/12
wh Atlas 0 7 106/6 0/0 235/18 138/11
wh Polaris 18 8 229/16 235/18 0/0 116/8
wh Solaqu 11 13 162/12 138/11 116/8 0/0
beacon Dark_Harbour_Qumia 0 14

sector Polaris:10,14
bbbbbeeebb
beeeeefeeb
eeffffmmeb
eeffffmmee
beeeefffee
bbbbeefeeb
bbbbbefebb
bbbbeefeeb
bbbeeffeeb
bbeefeeebb
bbeffebbbb
bbeffeebbb
bbeefeebbb
bbbeeebbbb
wh Qumia 1 2 0/0 129/12
wh Ioquex 4 12 120/12 0/0

sector UZ_8-466:20,13
bbbbbbbbeeebbbeeebbb
bbbbbbbeefebbeefeeeb
bbbbeeeefeebbeeeffeb
eebeeffffebbbbbeffee
eeeeoofffeebbeeefffe
eebeffofffebbeffffee
bbbeffffffeeeeffeeeb
bbbeeeeeefffffffebbb
bbbbbbbbefffffffebbb
bbbbbbbbeeffffffebbb
bbbbbbbbbeffffffeebb
bbbbbbbbbeeffeeeeebb
bbbbbbbbbbeeeebbbbbb
wh Pass_FED-07 1 4 0/0 175/13 207/18 146/11
wh Baar 13 4 175/13 0/0 69/6 79/7
wh Waolex 19 4 207/18 69/6 0/0 99/9
wh Gilo 10 11 146/11 79/7 99/9 0/0

sector Waolex:25,25
bbeeebbbbbbbbbbbbbbbbbbbb
bbefebbbbbbbeebbbbbbbbbbb
eeefeeebbeeeeeeebbbbbbbbb
efffffeeeefffffeebbbbbbbb
eefffffffgggffffeebbbbbbb
beeffffffggggfffeebbbbbbb
bbeffffffggggffeebbbbbbbb
bbeffffffgggggfebbbbeebee
bbefgggggfggggfeeeeeeeeee
beegggggggfgggffffffffffe
eefggggggggfggfeeeeeeeeee
effggggggggffffebeebbbbbb
eefggggggggfeeeeebbbbbbbb
beeffffgggffebeeeebeeebbb
bbeffeeefffeebbefeeefeebb
beefeebeeffebbbeeffffeebb
beeeebbbeffebbbbeeefeebbb
bbeebbbbeefeebbbbbeeebbbb
bbbbbbbbbeefebbbbbbebbbbb
bbbbbbbbbbefebbbbbeeebeee
bbbbbbbbbbeeeebbbbefeeefe
bbbbbbbbbbbefebbbbeeebeee
bbbbbbbbbbbeeeebbbbbbbbbb
bbbbbbbbbbbbefebbbbbbbbbb
bbbbbbbbbbbbeeebbbbbbbbbb
wh Aandti 2 0 0/0 57/3 239/23 267/24
wh UZ_8-466 0 3 57/3 0/0 249/24 272/22
wh Solaqu 24 9 239/23 249/24 0/0 276/24
wh Anphiex 13 24 267/24 272/22 276/24 0/0
beacon Waolex 6 6

sector Solaqu:25,25
bbbbbbbbbbbbbbbbbeeeeeeeb
bbbbbbbbbbbbbbbbeefffffeb
bbbbbbbbbbbbbbbeefffffeeb
bbbbbbbbbbbbbbeeffffffebb
bbbbbbeeebbbbeefggfffoeeb
bbbbbeefebbbbeefggffoofeb
bbbbeeffeebbbbeeggffffeeb
bbbeeffffebbbbbeeffffeebb
bbbefffffeebbbbbeeeeeebbb
bbbeffffffebbbbbbbeebbbbb
bbbeefffffeebbbbbeeeeeebb
bbbbeeeffffeeebbeeffffeeb
bbbbbbeffffffeeeeffffffee
eeebeeeffffoffffffffffffe
efeeefffffoooffffffffffee
eeffffffooooofoffffffeeeb
beffffffffoooofffffeeebbb
beeeeffffffofffeeeeebbbbb
bbbbeeefffffffeebebbbbbbb
bbbbbbeffffffeebbebbbbbbb
bbbbbeeffffggebbbebbbbbbb
bbbbeefffffggebbeeebbbbbb
bbbbeefffffeeebbefebbbbbb
bbbbbeeeefeebbbbeeebbbbbb
bbbbbbbbeeebbbbbbbbbbbbbb
wh Qumia 7 5 0/0 200/20 139/13
wh Ioquex 24 13 209/20 0/0 239/23
wh Waolex 1 14 139/13 230/23 0/0
beacon Solaqu 8 21

sector Ioquex:16,15
bbbbbbbbbbbbbeeb
bbbbbbeebbbeeeeb
bbbbbeeebbbeeeee
bbeeeefeebbeeeee
beefffffeebefeeb
eefffffffeeeeebb
effffffgggffebbb
eeffffgggggfebee
beeggggggggfeeee
bbeggggggggeebee
bbeggggggggebbbb
bbeegggggggebbbb
bbbeeeggggeebbbb
bbbbbeeeeeebbbbb
bbbbbbbbeebbbbbb
wh Polaris 7 1 0/0 97/7 141/10
wh Solaqu 0 6 97/7 0/0 172/14
wh Pass_UNI-07 14 8 141/10 172/14 0/0
beacon Ioquex 5 6

sector Gilo:18,21
bbbbbbeeebbbbbbbbb
bbbbbbeeeebbbbbbbb
bbbbbbbefebbbbbbbb
bbeebbbefebbbbbbbb
beeeebeefebbbeeebb
beffeeefeeeeeefeee
eeffffffebeeeffoee
efggggggeeeefoofee
efgggggggeeeooooee
efgggggggfffoofeee
effggggggfffffoeee
eeffggggfffffffeee
eeeffgggfffffffeee
eeeefffffffffffebb
bbbbeffffffffffeeb
bbbbefffggeeeeffeb
bbbeefffggeeeeffeb
bbeeffeeeeeeeeefee
bbeffeeeeeeeebeffe
bbeeeebbbbbbbbeefe
bbbeebbbbbbbbbbeee
wh UZ_8-466 7 1 0/0 199/18 199/18
wh Nex_0001#West 3 19 199/18 0/0 158/14
wh Nex_0001#East 16 19 190/18 149/14 0/0
beacon Gilo 9 12

sector Nex_0001:23,25
bbbbeebbbbbbbbbbbbbbeeb
bbbbeeebbbbeeebbbbbeeeb
bbbeefeebbeefeebbbeefeb
beeefeeebbefffeebbeffeb
beffeebbbbeffffebbeefeb
eeffebbbeeeeeefebbbefee
efffebbeeeeebefeebeeffe
eeeeebbefeeebeefebeffee
beeeeeeefffebbefebeffeb
beeffffeeefebbeeeeefeeb
bbeeeffebefebbbefffeebb
bbbbefeebefeebbeffeebbb
bbbeeeebbeffebeeeeebbbb
beeefebbeefeebefebbbbbb
beeefeeeeffebbeeeeeebbb
eeeefffeeeeebbbefffeebb
eefffeeebbeebbeeffffeeb
beffeebbbbeebbeeeeeefeb
beefebbbbeeeebeeeebefeb
bbefeebbbeffeeefeebefeb
beeffeebbeefffffebbefeb
befffeebbbeeefeeebbefeb
eefeeebbbbbbeeebbbbeeee
efeebbbbbbbbbbbbbbbbefe
eeebbbbbbbbbbbbbbbbbeee
wh Gilo#West 5 0 0/0 398/29 457/34 285/24 203/14
wh Gilo#East 20 0 398/29 0/0 284/23 439/34 291/21
wh BL_6-511#East 21 23 448/34 275/23 0/0 388/28 270/18
wh BL_6-511#West 0 24 285/24 439/34 397/28 0/0 177/15
xh 11 12 194/14 282/21 270/18 168/15 0/0

sector BL_6-511:24,31
bbbeebbbbbbbbbbbbbbbbbbb
bbeeebbbbbbbbbbbbbbbbbbb
bbefebbbbbbbbbbeeebbbbbb
bbefeeeeeeeeeeeefebbbbbb
bbefebbbbbbbbbbefebbbbbb
beeeebbbeeebbbeeeebbbbbb
beeebbbbefeebbeeebbbbbbb
beebbbbeeffeebeebbbbbbbb
beeeebbeffffeeeeebbbbbbb
beffeeeefgggffffeebbbbbb
eefggggfggggfgggfeebbbbb
effgggggggggfgggeeebbbbb
eefgggggggggfgggebbbbbbb
befgggggggggfgggeebbbbbb
beegggggggggfggggeebbbbb
bbeggggggggggggggeebbbbb
bbeeegggggffgggggebbbbbb
bbbbeffffffggggggebbbbbb
bbbeeffffgggggggeebbbbbb
bbbeefffggggggeeebbbbbbb
bbbbeffgggggggebbbbbbbbb
bbbbeffgggggggeeebbbbbbb
bbbbeffggggggggfeebbbeeb
bbbbefffgggggggffebbeeeb
bbbeeffffgggggggfeeeefee
bbbefffffgggggggeeeefffe
bbeeffffffggggggebbeefee
bbeffffffffgggggebbbeeeb
bbefffeeeefeeeeeebbbbeeb
bbeefeebbeeebbeebbbbbbbb
bbbeeebbbbbbbbbbbbbbbbbb
wh Nex_0001#West 3 1 0/0 247/13 330/27
wh Nex_0001#East 16 2 247/13 0/0 310/26
wh Becanol 9 28 330/27 310/26 0/0

sector Becanol:20,25
bbbbbbbeeeeebbbbbbbb
bbbbbbbefffebbbbbbbb
bbbbbbbeefeebbbbbbbb
bbbbbbbbefebbbbbbbbb
bbbbbbbbefebbbbbbbbb
bbbbbbbbefebbbbbbbbb
bbbbbbbbefebbbbbbbbb
bbbbbbbeefeebbbbbbbb
bbbbbeeefffeeebbbbbb
bbeebefffffffeeebbbb
beeeeefffffffffeebbb
eeffffffffffffffeebb
eeffffoffffffffffeeb
beeeoooofeeeeeefffeb
bbbeefffoebeebefffeb
bbbbefoooebbbbeeffee
bbbbeofffeebbbbeeefe
beeeeooofeebbbbbbeee
eefffffffebbbbbbbbbb
effffffggeebeebbbbbb
effffffggfeeeebbbbbb
eeffffffffffeebbbbbb
beefffffffffebbbbbbb
bbeeeeeffffeebbbbbbb
bbbbbbeeeeeebbbbbbbb
wh BL_6-511 9 1 0/0 150/15 244/23
wh Anphiex 18 16 150/15 0/0 217/19
wh Zelada 10 24 253/23 226/19 0/0
beacon Becanol 3 20

sector Anphiex:18,30
bbbbbbbbeebbbbbbbb
beeeebbeeebbbbbbbb
beffeebefeebbbbbbb
befffebeffebbbbbbb
beeffebefeebbbbbbb
bbeefebefebbbeeebb
bbbeeeeeeebbbeeebb
bbbbeffeebbbbbebbb
bbbeeeeebbbbbbebbb
bbbefebbbbbeeeeebb
bbbeeebbbbeefffebb
bbbeebbbbeefeefeeb
bbbeeebbbeffeeeeee
bbeefeebeeffffeeee
beefffeeeeeeeffeeb
eefggggggebbeeeebb
effggggggeebbbbbbb
effgggggggebbbbbbb
effgggggggebbbbbbb
eeeefgggggeebbbbbb
eebefgggggfebbbbbb
bbeeffggggfeebbbbb
bbefffffffffebeebb
bbeeffffffffeeeebb
bbbeffffffffebeebb
bbbeeeffffffebbbbb
bbbbbefffffeebbbbb
bbbbbeffeeeebbbbbb
bbbbeefeebbbbbbbbb
bbbbeeeebbbbbbbbbb
wh Waolex 8 1 0/0 234/18 336/23 339/28
wh Becanol 0 19 234/18 0/0 176/14 127/10
wh Pass_UNI-01 14 23 336/23 176/14 0/0 115/7
wh Lasolia 7 29 339/28 127/10 115/7 0/0
beacon Anphiex 8 23

sector Zelada:14,20
bbbbbbeeebbbbb
bbbbeeefeebbbb
bbbeeffffeeebb
bbeefffffofeeb
beeffffffoofeb
befffffffofeeb
beefffffffeebb
bbefffffffebbb
beeffffffeebbb
eefffffeeebbbb
eeffffeebbbbbb
beffffebbbbbee
eeffffeebbeeee
effggggebeeffe
eefggggeeeffee
befggggebeffeb
beeffffebeefee
bbeeeefebbeffe
bbbbbeeebbeeoe
bbbbbeebbbbeee
wh Becanol 5 1 0/0 189/17
wh Edenve 6 18 189/17 0/0
beacon Zelada 5 7

sector Lasolia:19,16
bbbbbbbbbeeeebbbbbb
bbbbbbbbbeffeeeeebb
bbbbbbbbbeefffffeee
bbbbbbbbbbefffgggfe
bbbbbbbbbeeffggggfe
bbbbbbbeeefggggggee
bbbbbeeeffggggggfeb
bbbbbeffffggggggfeb
bbbbeeffffggggggeeb
bbbbeffffffgggffebb
bbbbeffffffffeeeebb
bbbeefffffffeebebbb
beeeffffffeeebbebbb
eefffffffeebbbeeebb
effffeeeeebbbbeeebb
eeeeeebbbbbbbbbbbbb
wh Anphiex 11 1 0/0 140/14 181/13
wh Edenve 1 14 140/14 0/0 211/17
wh Faarfa 15 14 190/13 220/17 0/0
beacon Lasolia 8 9

sector Edenve:25,25
bbbbbbbbbbeeebbbbbbbbbbbb
bbbbbbbbbbefeebbbbbbbbbbb
bbbbbbbeeeeffeeebeeebbbbb
bbbbbeeefffffffeeefeebbbb
bbeeeeffffffffffffffeebbb
beeffffffeeeeeeffffeeebbb
beefffffeebeebeeefeebbbbb
bbeeeeffebbbbbbbefebbbbbb
bbbbbeffeeebbeeeefeeeeeeb
bbbbbeeeffeeeefffffffffee
bbbbbbbefffffffooffffoooe
bbbeebeeffffffooofffooffe
bbbeeeeffoooeeeeeeefoffee
bbbeebefffooebbbbbeofeeeb
bbbbbbefffffebeeebeffebbb
bbbbbbeeffffeeeoeeeffeebb
bbbbbbbeeeffffoofoooffeeb
bbbbbbbbbeeeffffffoofffeb
bbbbbbbbbeeefffeeeffffeeb
bbbbbbbbeeffffeebefeeeebb
bbbbbbbbeffmmfebbefebbbbb
bbbbbbbbeefmmfeebeeeeeeeb
bbbbbbbbbeffffeebbeefffee
bbbbbbbbbeeffeebbbbeeeeee
bbbbbbbbbbeeeebbbbbbbbbbb
wh Zelada 11 1 0/0 80/8 147/12 257/23
wh Lasolia 19 4 80/8 0/0 186/15 218/20
wh Famiso 4 12 156/12 195/15 0/0 244/19
wh Faarfa 23 22 266/23 227/20 244/19 0/0

sector Faarfa:14,12
bbbbbbbbeeebbb
bbbbbbeeefeebb
bbbbbeeffffeeb
bbbbbeffffffeb
bbbbbeffgggfeb
bbbbeeffgggfee
bbbbefffgggffe
bbbeefffffffee
eeeeffeefffeeb
efffffeefeeebb
eeeffeeeeebbbb
bbeeeebbbbbbbb
wh Lasolia 9 0 0/0 119/11
wh Edenve 1 9 110/11 0/0

sector Mintaka:40,25
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeeb
bbbbbbbbbbbbbbbbbbbbbbbbbbeebbbbbbbeffee
bbbbbbbbbbbbbbbbbbbbbbbbbeeeebbbbbeefffe
bbbbbbbbbbbbbbbbbbbbbbbeeeffeebbbeeffffe
bbbbbeeeeebbbbbbbbbeeeeefffffeeeeeffffee
bbbbeefffeeeeebeebeeffffgggffeeeefffffeb
bbbeeffffffffeeeeeefffggggggfebbegggffeb
eeeeffggeeeefffeefffgggggggggeeeegggffeb
eeffffggebbefeeeefgggggggggggffffgggfeeb
beefffffeeeefeeffggggggggggggfffffffeebb
bbeeeffffffffeeffggggggggggggffooffeebbb
bbbbeeffeeeffeeefggggggggggffffooffebbbb
bbbbbefeebeefebeffffggggfffffffffeeebbbb
bbbbbeeebbbeeeeeffffffffeeeeffffeebbbbbb
bbbbbbbbbbbbefffgggoofooebbeeeeeebbbbbbb
bbbbbbbbbbbeefffgggffoooebbbbbbebbbeeeeb
bbbbbbbeebeeffffgggffofoebbeeebebeeeggee
bbbbbbeeeeefffffgggfofooeeeefeeeeeffggee
bbbbbbefffffffffgggffffoooffffffffffffeb
bbbbbbeefffffffeeeffffoffffffffffffeeeee
bbbbbbbefffffffebeeffffffffffffffffebefe
bbbbbbbeffffffeebbeeeeeeffeeeeffffeebeee
bbbbbbbeeefffeebbbbbbbbeeeebbeeeeeebbbbb
bbbbbbbbbeeeeebbbbbbbbbbbbbbbbbeebbbbbbb
wh Dubhe 38 1 0/0 411/37 274/22
wh Meram 1 9 411/37 0/0 392/36
wh Aya 37 21 274/22 392/36 0/0
beacon Mintaka 11 21

sector Dubhe:20,25
beeeebbbbbbbbbbbbbbb
eemmeebeebbbbbbbbbbb
eemmfeeeeeebbbbbbbbb
beeffffeeeebbbbeeeeb
bbeefffeeebbeebeeeee
bbbefffffeeeeeeeeefe
bbbeeeefffffggeefffe
bbbbbbefeeefggffffee
bbbbeeefebeffffffeeb
bbbbefffebefffeeeebb
bbbbeeffeeeffeebbbbb
bbbbbeeeeeeefebbbbbb
bbbbbbbebbbefeebeeeb
bbbbeeeeeebeffeeefee
beeeeffffeeefffffffe
beffggggeebeeeeeeeee
eeffggggebbbebbbbebb
eeefggggebeeeebbeeeb
bbefggggeeeffeebeeeb
bbefggggebeeffeeeebb
eeefggggebbeeeebeeeb
effffeeeeebbebbbefeb
eeffeebeeeeeeeeeeeeb
beeeebbbeeeefeeeeebb
bbbbbbbbbbbeeebeebbb
wh Enif 18 4 0/0 264/19
wh Mintaka 1 22 264/19 0/0

sector Aya:40,35
bbbbbbbbbbbbbbbbbbbeeebbbbbbbbbbbbbbbbbb
bbbbbbeeeebbbbbbbbeefeebbbbbbbbbbbbbbbbb
bbbbbbeeeeeeeeebbbefffebbbbbbeeebeeebbbb
bbbbbbbbegggggeeeeeffeebbbbbeefeeefeebbb
bbbbbbeeegggggfffffffebbbeeeefofffffeebb
bbbbbeefggggggfffffffeeeeeeefffffffffeeb
bbeebeefggggggffffeeefeeffeeeeeeffeeefeb
beeebbefggggggfffeebeeeefgggebbefeebeeeb
beeeeeeffggggfeeeebbbefffgggebeefebbbebb
bbeefooffgggffebbbbbbeffffffeeeffeebeeeb
bbbeooooffffggeebeeeeeeeefffffffffeeefeb
bbbeefofofffggfeeeffffebeeeeeeeeeeefffeb
bbbbeeeefgggffffffffffebbbeebbebbbeeefeb
bbbbbbbefgggggffffffffeebbbbbeeeebbbefee
bbbbbbbeeggggggffffffffeebbbeeffeebbeffe
bbbbbbbbefgggggfffffffffebbeeffffeeeefee
bbeeeeeeefgggggffffffffeebbeffeeeebbefeb
beefffeeefgggggffffffffebbbeffebbbbeeeeb
eeeeefebefggggfffffffffeebbeffebbbeeeebb
efebeeebeefffggggggfffffebbeeeebbeefebbb
eeebeebbbefggggggggfffffeebbeebbeeffebbb
beebeebbbefggggggggfffffeebbeebbefffeebb
beebeebbeefggggggggfffffebeeeebeeffffeeb
eeebeeebeffggggggggfffffeeeffeeeffffffee
eeeeeeeeefffgggggfeeeffffffffffffffffffe
beeffebbeffffffffeebeefffggfoeeeffofffee
bbeeeeeeefffeeeffebbbeefoggffebeeoooffeb
beeeeebbeffeebeffebbbbeeefofeebbefofffeb
befffeebeeeebbeffebbbbbbeefoebbbeefoffeb
befeeeebbbbbbbeffeeeebbbbeeeebbbbeeffeeb
befebeeebbbbbeefffffeebbbbeebbbbbbefeebb
befeeefebbbbbefffffffebbbbbbbbbbbbeeebbb
beeeeeeebbbbeeffffffeebbbbbbbbbbbbbbbbbb
bbeeeeebbbbbeeefffeeebbbbbbbbbbbbbbbbbbb
bbbbeebbbbbbbbeeeeebbbbbbbbbbbbbbbbbbbbb
wh Mintaka 5 6 0/0 326/29
wh Nari 34 6 326/29 0/0
beacon Aya_I 17 16
beacon Aya_II 17 31

sector Fornacis:25,30
bbbbbbeeeeebbbbbbbbbbbbbb
bbbbbeefffeeebbbbbbbbbbbb
bbbbbeefffffeeeebbbbbbbbb
bbbbbbeeeeeffffeebbbbbbbb
bbeeebbbbbefffffeebbbbbbb
bbefeeeeebefggggfeebbbbbb
bbeoffffeeefgggggfeebbbbb
bbeffffeeeeeggggggfebbbbb
beefggeebbbefgggggfebbbbb
beffggebbbeefgggggfebbbbb
befffeebbbefgggggggeebbbb
beffeebbbeefgggggggfeeebb
eeffebbbbeffgggggggfffeeb
eeffeebbbeeffffffffffffeb
befffebbbbeffgggfeeeeffeb
beeeeebbbbeefgggeebbeffeb
bbbebbbbbbbeegggebbeeffee
bbeeeeeebbbbefffebeeffffe
bbeeffeebbbeefffeeefffffe
bbbeffebbbeeggggffffffffe
bbeeffebbeefggggffffffffe
eeefffebbeffggggfeeefffee
eeffffeeeeffffffeebeffeeb
befffeebbeffeeefebbeeeebb
befffebbbeefebefeebbbbbbb
eefeeebbbbeeeeeffeebbbbbb
efeebbbbbbbeffffffeebbbbb
efebbbbbbbbeeffffffeebbbb
efebbbbbbbbbeeeffffeebbbb
eeebbbbbbbbbbbeeeeeebbbbb
wh Sargas 20 10 0/0 189/18 295/23
wh Ras_Elased#East 19 28 189/18 0/0 264/21
wh Ras_Elased#West 1 29 295/23 264/21 0/0
beacon Fornacis 21 19

sector Ras_Elased:41,38
bbbbeebbbbbbbbbbbbbbbeeeebbbbbbbbbbbeeebb
bbbeeebbbbbbbbbbbbbeeeffeeeebbbbbbbeefeeb
bbeefeebbbbbbbbbbbbefffffggeebbbbbeefffee
beeffeebbbbbbbbbbbbefffffggfeebbbeefgggfe
beffeebbbbbbbbbbbbbeeeeeffffeebbbeffgggfe
eeffebbbbbbeeeeebbbeebbeeeeeebbbeeffgggee
eeffeebbbbeeoffeeeeeeebbbbeebbbeefffggeeb
befffeebeeeffoofoffffebbbbbbbbbegggfggebb
beefffebefffffoofffffeebbbbbbbbegggfggebb
bbeeefeeeffffoooooffffebbbbbbbbegggfggeeb
bbbbeeeeefffffooffffffeebbbbbeeegggfggfee
bbbbbbbbefffoofffeeefffeeeebeeffgggffffee
bbbbbbbbeefffoeeeebefgggffeeefffffffffeeb
bbbbbbbbbeffffebbbeefgggfffffffffffeeeebb
bbbbbbbbbeffffebeeeffgggfffffeeeeeeebbbbb
bbbbbbbbeeffffeeefffffffffeeeeeebeebbbbbb
bbbbbeeeefffgggfffffffffffebeffeebbbbbbbb
bbeeeeffffffgggggggfffffffeeefffebbbbbbbb
beeeeeeeffffgggggggffffffffeeeeeebbbbbbbb
befebbbeefffgggggggffffffffebbeebeeebbbbb
befeeebbeeefggggggfffffffffeeeeeeefeebbbb
befffeebbbeeggggggffffffffffffffffffebbbb
beffffebbbbeegggffffffffffffffffffffeeebb
eeffofebbbbbeefffffffffffffffeeeffffffeeb
effoofeebbbbbefffffffeeefeeeeebeeeeeeefee
effofffebbbbeeffffffeebeebbbbbbbebebbeffe
efffffeebbbbeffeeefeebbbbbbbbbbeeeeeeefee
eefeeeebbbbbefeebeeebbbbbbeeeeeefffffffeb
beeebbbbbbbeefebbbbbbbeeeeefffffffofffeeb
bbbbbbbbbbeeffeeeeebeeeggggfffffooooofebb
bbbbbbbbbeefffffffeeeffggggffffffooofeebb
bbbbeeebeeffffffffffffffffffeeeffofofebbb
bbbeefeeeffgggeeeffffeeeeeeeebefffffoeebb
bbeefffffffgggebeeefeebbbbbebbeeeeffffebb
bbeffffffffgggebbbeeebbbbeeeebbbbeefffebb
bbeeeeefffffffebbbbbbbbbbeffebbbbbeffeebb
bbbeebeeefeeeeebbbbbbbbbbbbbbbbbbbeefebbb
bbbbbbbbeeebeebbbbbbbbbbbbbbbbbbbbbeeebbb
wh Fornacis#West 5 0 0/0 509/43 443/37
wh Fornacis#East 38 1 509/43 0/0 417/37
wh Enif 12 37 443/37 417/37 0/0
beacon Elased 21 20

sector Enif:35,25
bbbbbbbbeeebbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbeeefeebbbbbbbbbbbbbbbbbbbbbbb
bbbbeeeffffebeebbbbbbbbbbbbbbbbbbbb
bbbbeefffffeeeebbbbbbbbbbbeeeeebbbb
bbbbbeefffffffebbbbbbbbbbeefffeeebb
bbbeebeefffffeebbbeebbbbbeffffffebb
bbbeeebefffffebeebeeebbbeeeeefffeeb
bbeefeeefffffeeeeeefeebbefebeffeeee
eeeffffffggggffffffffebeefeeeeeeeee
eeffffggggggggggfffffeeefffffeeeeeb
beeeffggggggggggfffffeeefffooffebbb
bbbeefggggggggggfffffebeffoofffeebb
bbbbeffgggggggggfffffeeeeeeeffffebb
bbbbeefggggggggffeeeffffebbeefffebb
bbbbbefggggggggffebeffffebbbeefeebb
bbbbbefggggggggffebefoofebbbbefebbb
bbbbeefffggggggffeeeffooeebbbefeebb
bbbeefffffffgggfffeeeooofeebeeeeeeb
bbbefffffffffffffeebeeofffebefeeeeb
bbbeefffeeeffffffebbbefoffeeeffeebb
bbbbeeeeebeffeeefeebbeefffeeeeeebbb
bbbbbbebbbeefebefeebbbeeeeebbbbbbbb
bbeeeeeeebbefeeeeebbbbbbbbbbbbbbbbb
bbeeefffebbeeefeebbbbbbbbbbbbbbbbbb
bbbbeeeeebbbbeeebbbbbbbbbbbbbbbbbbb
wh Ras_Elased 9 0 0/0 127/10 295/25 249/23
wh Dubhe 1 9 127/10 0/0 337/31 174/16
wh Pardus_West 32 9 295/25 337/31 0/0 272/20
wh Nari 13 23 249/23 174/16 272/20 0/0

sector Nari:34,37
bbbbbbbbbbbbbbbbbbbbbbbeeebbbbbbbb
bbbbbbbbbbbbbbbbbbeeebeefeebbbbbbb
bbbbbbbbbbbbbbbbbeefeeefffeeebbbbb
bbbbbbbbeeebbbbbbefffffffffeebbbbb
bbbbbbbeefeebbbbeeffffeeeffebbbbbb
bbbbbbeefffebbbbegggfeebeefeebbbbb
bbbbbbeeeffebbbbegggfebbbeffeeeebb
bbbeeeeeefebbbbbegggfebbbefffffeee
bbeeeeeeeeebbbbeeggggeebeefgggfffe
bbefeeebbeebbeeefggggfeeeffgggfeee
bbeeefeeeeebeefffggggfebeffffeeebb
bbbbeeeeefeeefffffffffeeefffeebbbb
bbbbbbbbefffffffffffffebefffeebbbb
bbbbbbbeefffffffffffffeeeffffebbbb
bbbbbbbeeeefffffffffeeebeefffeebbb
bbbbbbbeebeeeeffffffeeeebeefffeebb
bbbbbbbeeeeebeeffffeeeeebbeeoffeeb
bbbbbbeefffebbeeeeeebbeebbbeffffeb
beebbbeffffeebbbebbbbeeebbeefoffee
eeeeebefffffeeeeeebbeefebeeoooofee
efffeeeffggggggffebeeffeeefoooofeb
eeffebeefgggggggfeeefffebeefoofoeb
beeeebbefgggggggfgggggfebbeeeeeeeb
beebbbbeefggggggfgggggfeebbeebbeeb
bbbbbbbbeefgggggfgggggffebbbbbbbbb
bbbbbbbbbeffgggfffggggffeebbbbbbbb
bbbbbbbbeeffffffffggggfffeeeeeebbb
bbbbbbbeeggggffffffffggggggfffeebb
bbbbbbbeeggggffffffffgggggggfffeeb
bbbbbbbbegggggfffffffggggggggeeeeb
bbbbbbbbeegggggffffffffggggggebbbb
bbbbbbbbbegggggfffffeeefgggggeebbb
bbbbbbbbbeeggggffffeebeffggggfeeeb
bbbbbbbbbbeeeeffffoebbeeffffffffee
bbbbbbbbbbbbbeeffooeebbeeeeeffffee
bbbbbbbbbbbbbbeeeeofebbbbbbeeefeeb
bbbbbbbbbbbbbbbbbeeeebbbbbbbbeeebb
wh Enif 10 4 0/0 330/27 115/7 432/35
wh Heze_North 31 7 330/27 0/0 340/28 364/28
wh Aya 3 10 115/7 340/28 0/0 422/32
wh Heze_South 31 35 432/35 364/28 422/32 0/0
beacon Nari_I 16 13
beacon Nari_II 16 28

sector Sargas:30,25
bbbbbbbbbbbbeeeebbbbbbbbbbbbbb
bbbbbbbbbbbeeffebbbbeebeeeeebb
bbbbbbbbbbeefffeebbeeeeeeefeeb
bbbbbbbbbbefffffebeeffffeeffee
bbbbbbbbbbeeffffeeeffffffffeee
bbbbbbbbbbbeeefffffffffffeeebb
bbbbbbbbbbbbbeefeeeeffffeebbbb
bbbbbbbbbbbbbbefebbeffeeebbbbb
bbbbeeeebbbeeeefebbeffebbbbbbb
bbeeeffeebeeffffeeeeffeeeebbbb
beefffffeeefffffffffffeeeebeeb
eeffffffffeeeefeeeefffebeeeeee
eeefffffffebbefebbefffeeefffee
bbeeeeffffeeeefeebeeeeeeeeeeee
bbbbbefffffffgggeeeebbeeeebeee
bbeeeefgggggfgggfffeeeeffeebbb
beeffffgggggffffffffffffffebbb
befffffgggggffeeefffffffffeebb
befffffgggggffebeefffffffffeeb
befffffgggggffebbeeeffffffffee
beeffffeeefffoeebbbefffffffffe
bbeffffebeffoofebbbeefffffffee
bbeefeeebeffofeebbbbeefeeeeeeb
bbbeeebbbeefeeebbbbbbeeebbbbbb
bbbbbbbbbbeeebbbbbbbbbbbbbbbbb
wh Remo 13 1 0/0 149/14 207/18
wh Quaack 27 2 158/14 0/0 277/25
wh Fornacis 2 10 216/18 277/25 0/0
beacon Sargas 24 19

sector Heze_North:35,27
bbbbbbbbeeeebbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbeeffeeeeeeebbbbbbbbbbbbbbbbb
bbbbbbbefffffffffeebbbbbbbbbbbbbbbb
bbbbbbbeeeffffffffebbbbbbbbbbbbbbbb
bbbbbbbbeeeffeeeefeeeeebbbbbbeeeebb
bbbbbbbbbeeeeebbeeffffebbbbbeeffeeb
bbbeeeebbbbeebbbbeeefeebbbbbeffffee
beeeffebbbbeebbbbbbeeebbbbbeefffffe
eefeeeeeeeeeeebbbbbbbbbbbbbeffffffe
effebeeffffffeebbbbbbbbbbeeefggffee
eefeebeeeeefffeeebbbbbbbeeffgggffeb
beffeebeebefffffeebbbbeeefffgggfeeb
beeffeeeeeegggggfeeeeeefggffffeeebb
bbeeeffffffgggggfffffffgggffeeebbbb
bbbbeeeeeefffffffffffffgggfeebbbbbb
bbbbbbeebeeffffofofffofgggfebbbbbbb
bbbbbbbbbbeefffooooooffffffebbeeeeb
bbbbbbbbbbbeooooffffoooffffebeeffee
bbbbbbbbbbbeeoffffffffoofffeeeffffe
bbbbbbbbbbbbeffffffffffooofeeeffffe
bbbbbbbbbbbbeeffffffffoooeeebefffee
bbbbbbbbbbbbbeffffffffoofebbbeeeeeb
bbbbbbbbbbbbbefffffffffooebbbbebbbb
bbbbbbbbbbbbbefffffffffofebbbbbbbbb
bbbbbbbbbbbbbeeffeeeeffoeebbbbbbbbb
bbbbbbbbbbbbbbeeeeebeeeeebbbbbbbbbb
bbbbbbbbbbbbbbbeebbbbbbbbbbbbbbbbbb
wh Procyon 33 6 0/0 344/33
wh Nari 0 9 344/33 0/0
beacon Heze 17 21

sector Heze_South:35,40
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbeebbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbeeeeebbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbeeffeebbbbbbbbbbbbbbbbbbbbbbbbbbb
bbeefffeebbbbbbbbbbbbbbbbbbbbbbbbbb
bbefffffeebbbbbbbbbbbbbbbbbbbbbbbbb
bbeofffffebbbbbbbbbbbbbbbbbbbbbbbbb
bbeeofffeebbbbbbbbbbbbbbbbbbbbbbbbb
bbbeeeeeebbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbeebbbbbbbeebbbbbbbbbbbbbbbbbb
bbbbbeeeeeeebbbbbbbbbbbbbbbbbbbbbbb
bbbbeefffffeeeebbbbbbbbbbbbbbbbbbbb
bbbbeffffffffeebeebbbeeebbbbbbbbbbb
bbbbeefffeeefebbeeebeefeeebbbbbbbbb
bbbbbefffebefebbefeeeffffebbbbbbbbb
bbbbeeeeeeeefeeeeffffooffeebbbbbbbb
bbbbeeebeffffeeefffffoooofeebbbbbbb
bbbbbeeeeffggebefffffffofffebbbbbbb
bbbbbefffffggeeefffffffffffeebbbbbb
bbbbbeeeffffeeeefffffffeeefeebbbbbb
bbbbbbbeefeeebbeeffffffebeeebbbbbbb
bbbbbbbbeeebbbbbeeefffeebbbbbbbbbbb
bbbbbbbbbbbbbbbbbbeeeeebbbbbbbbbbbb
wh Nari 4 30 0/0 216/18
wh Nunki 22 38 216/18 0/0

sector Quaack:28,25
bbbeebbbeeeebbbbbbbbbbbbbbbb
beeeeeeeeffeebbbbbeeeeebbbbb
eeffffffffffebbbeeefffeebbbb
efffffffffffeebbeffgggfeebbb
eefffffffffffebeeffgggffeeeb
beeffffffffffeeefffggggfffeb
bbeeeeffeeeffffofffggggfffee
bbeebeeeebeeffofoffgggfffffe
bbbbbbbebbbeeffoffoeeeffffee
bbbbbeeeeebbeeoooofebefffeeb
bbbbbeffeebbbeoooeeebefeeebb
bbbbbeffebbbbeeeeebbbeeebbbb
bbbbbeeeebbbbbbbbbbbbbebbbbb
bbbbbbbbbbbbbbbbbbbbbbebbbbb
bbbbbbbbbbbbbbbbbbbbbeeeebbb
bbbbbbbbbbbbbbbbbbbeeeffebbb
bbbbbbbbbbbeebbbeeeeffffeebb
bbbbbbbbbbeeeebeeffffffggeee
bbbbbbbbbeeffebefffooofggeee
bbbbbbbbeefffeeeffoooffffeee
bbbbbbbbeffffggffffffffffeee
bbbbbbbbeffeeggffffeeeeeeebb
bbbbbbbbeefeeeeefeeebeeeebbb
bbbbbbbbbeeffebeeebbbeeeebbb
bbbbbbbbbbeeeebbbbbbbbeebbbb
wh Sargas 1 2 0/0 264/25 385/29 460/36
wh Labela#North 26 4 264/25 0/0 212/14 287/21
wh Labela#South 27 18 385/29 212/14 0/0 211/17
wh Pardus 10 23 460/36 287/21 211/17 0/0

sector Pardus:100,93
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeebbbbbbbbbbbbbbbbbbbeeefeeeebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeebbbbeeeebbbbbbbbbbbbbbbbeeeffffffeeebbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeefeebbeeffeeebbbbbbbbbbbbbeefffvvvffffeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffeebbeefgggeebbbbbbbbbbeeefvvvvvvfffffeebbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffeeebbbbegggggeebbbbbbbeeefvvvvvvvvfffffeebbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffeeebeebegggggfeebbbbbeefffvvvvvvvfffffeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvfffeeeeeegggggffebbbeeefvvvvvvvvvvffffeebbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvfffffffffggggggfebeeefffvvvvvvvvvffeeeebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffffggggggggfebeefvvvfevvefvvffeebbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffgggggggggfebevvvvveebbefvvfeebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffggggggggggfeeevvvvfebbeefvvfebbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbefffggggggggggffeeefffeebbefffffeebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbevvvvvebefffgggggggfffffebeeeeebbeeffffffebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeevvvvveeeffffgggggfeeefeebbeebbbbeeffffffebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbefvvvvvvffffffffffeeebeeebbbbbbbbbbeffffffeeebbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefvvvvvfeeeffffeeebbbbbbbbbbeebbbeeffffffffeebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeevvvveeebeffeeebbbbbbbbbbbbeeeeeeffffffffvvebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbevvvvebbeeffebbbbbbbbbbbbbbeebbeeffffffffvvebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeffeebbbbbbbbbbbbbbbbbbvvvffffffvvfeebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeevvvbbbbbbbbbbbbbbbbbbbvvvvffffvvvvfebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvvvbbbbbbbbbbbbbbbbbbbvvvvffvvvvvvfebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvvvbbbbbeeeebbbbbbbbbbeffffvvvvvfffeebbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvvvbbbeeeffeebbbbbbbbeefffvvvvvvvfffeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvveebbbeffoofebbbbbbbbvvvfvvvvfvvvfoofeebbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeevvvbbbbeooofeebbbbbbbbvvvfvvvvfvvvfooofebbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefvvvbbbeefoooebbbbbbbbbvvvfvvvvfvvvffofeebbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvveebbeefvvveebbbbbbbbbvvvffvvvvvvvvvofebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvveeebvvvvvvvbbbbbbbbbbvvffvvvvvvvvvveeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeevvfffebvvvfvvvbbbbbbbbbbefffvvvvfevvveebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeeefffffvvveeefffvveebbbbbbbeeeffvvvvvoebbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffffvvvvvvffffvvvffebbbbbbbeffffvvvvfoebbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffffvvvvvvvfffvvvvvveebbbbbeeffffvvvfoeebbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffffvvvvvvvvvvfffffvvfeeebbbeffffvvvvofebbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffffffffvvvvvvvvvvfvvvvvvfffeevvefffvvvvvooeebbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffffffffvvvvvvvvvvfvvvvvvfffffvvffffvvvvffofeeebbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbefffffffffvvvvvvvvfffvvvvffffvvfffffvvvvvfoooffebbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffffffffvvvvvfffffffffffvvvvvvvvvvvvvffffoffeebbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffffffeevvffvvvvvvvffvvvvvvvvvvvvvfffffffffeebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffeefffvvvvvvvvvvvvvvvvvvvvvvvvfffffffffebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffvvvffvvvvvvvvvvvvvvvvvvvvvvvvvfffffffffebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbeeeeebbbbbbbbbbvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvffffffffeebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbeeeeeeeeeeeebbbbbbvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvfffffffffeeebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbeefffebeeeffeeeeebbvvvvvvvvvvvvffvvvvvvvvvvvvvvvvvvvvvffffvvvvvvvbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbefffeebbbeeeeeefeebvvfvvvvvvvvffmmvvvvvvvvvfffvvvvvvvvvvfvvvvvvvvbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbefffebbbbbbbbbeeeeeefffvvvvvvvffmmvvvvvvvffffffvvvvvvvvvvvvvvvvvvbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbefffeebbbbbbbbbbeeffffffvvvvvfffffvvvvvfffffffffvvvvvvvvvvvvvvffeeebbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbeeeffeebeeeebbbbbefffeeefvvvvvfffvvvvvvvfffffffvvvvvvvvvvvvvvffeeeeebbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbefffeeeeeeebbbbeffeebefvvvvvvvvvvvvvvvvvffffvvvvvvvvvvvvvvfffeeeeebbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbefffffeeeeebbbeeffebeefvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvfffvvveebbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbeeffffeeeebbbbefffeeefffvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvffvvvvbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbeeeeeebbbbbbeefvvebeefffvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvfvvvvbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffvvebbeffvvvvvvfovvvvvvvvvvvvvvvvvvffvvvvvvvffvvvbbbbeeeeebbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefeeeeebeeffvvvvvfffovvvvvvvvvvvvvvvvvfffvvvvvvffffevvvvefffeeeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeeeebvvbbefvvvvvvvfoofvvvvvvvfffvvvvvvvvffvvvvvvfvvffvvvvffffffeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffebbbvvbbefvvvvvvffooovvvvvvvfffffvvvvvvvfvvvvvfvvvfeevvvefffffee
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffffebbeeeebeeffvvvvfoofvvvvvvvffffffvvvvvvvvvvvvffvvvfebbbbeffffffe
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefvvvfebbefeebbefffvvvvffovvvvvvvfffffffvvvvvvvvvvvffvvfeebbbbeeffffee
bbbbbbbbbbbbbbbbbbbbbbbbbbbbeefvvvvfeebeeebbeefffvvvvfofvvvvvvfffffffffvvvvvvvvvvfffeeebbbbbbeffffeb
bbbbbbbbbbbbbbbbeeebbbbbbbbeeofvvvvvfebbvvbbefeeefvvvvvvfvvvvvvvvvvvvvvvvvvvvvvvvfeeebbbbbbbbeeffeeb
bbbbbbbbbbbbbbbeefeeebbbbbbefoofvvvvfebbvvbeeeebeefvvvvvfvvvvvvvvvvvvvvvvvvvvvfffeebbbbbbbbbbbeeeebb
bbbbbbbbbbbbbbeeffffeeebbbbeefofvvvvfeeeeeeefebbbeffvvfffvvvvvvvvvvvvvvvvvvvvfffeebbbbbbbbbbbbbbbbbb
bbbbbbbbbbbeeeefffffffeebbbbeeeevvvefffffffffeeeeeffffffffvvvvvvvvvvvvvvvvvvfffeebbbbbbbbbbbbbbbbbbb
bbbbbbbbbbeeffffffeeeffeebbbbbeebbbeffeeeffeeeeeeeefffffffffvvvvvvvvffvvvvfffffebbbbbbbbbbbbbbbbbbbb
bbbbbbbbeeefeeeffeebeeefeebbbbbbbbbeeeebefeebebeebeffeeefffffvvveeeeeffffvvvvffebbbbbbbbbbbbbbbbbbbb
bbbbbbeeefffebefeebbbbeffeebbbbbbbbbvvbbefebbebeebefeebeefffffeeebbbvvvvvvvvvvveeebbbbbbbbbbbbbbbbbb
bbbbbeefggggeeefebbbbbeeffeeebbbbbbbvvbbeeebbebbbbefebbbefffeeebbbbbvvvvvvvvvvvvfeeebbeebbbbbbbbbbbb
bbbbeeffggggffffebbbbbbeefffeebbbeebeebbeebbeeebbeeeebbeefeeebbbbeebvvvvvvvvvvvvvffeeeeeebbbbbbbbbbb
bbbbefffggggfggfeebbbbbbeefffeebeeeeeebbeebbeeebbeeebbbefeebbbeeeeeeevvvvvvvvvvvveeeffffeeeebbbbbbbb
bbbbeffffffffggffeebbbbbbeffffeeeffffebeeebeeebbeeebbbeeeebbbeefffffvvvvvvvvvvvvvvbeeffffffeebbbbbbb
bbbbeeffffffffgggfebbbbbbefeeeeffffffeeefeeefebbeeebbbeeebbbbeeffffvvvvvvvffvvvvvvbbefffffffeebbbbbb
bbbbbefffffffgggggeeebbbeefebbeeeeefffffvvfffebeeebbbeeebbbbbbeeeffvvvvvvveeevvvveebeeefvvfffeebbbbb
bbbbbefffffffgggggggeebeefeebbbbbbeeeefevveeeeeefeebeeeebbbbbbbbeefevvvvveebevvvveebbbvvvvvvvfebbbbb
bbbbbeeffffffgggggggfeeefeebbbbbbbbbbefebbbbeeeeeeeeefebbbbbbbbbbeeebbbbbbbbbbbbbeebbbvvvvvvvfeebbbb
bbbbbbeeffffffggggggfffffebbbeebbbbeeefeeebbbbeebeefffevvvvvvebbbbbbbbbbbbbbbbbbbbbbbeevvvvvffeebbbb
bbbbbbbeeefffffgggggffffeebeeeeebbeefffffeeebbbbbbeeeffvvvvvveeebbbbbbbbbbbbbbbbbbbbeeffvvfffeebbbbb
bbbbbbbbbeeeeeffffffffffebbeeeeebeefeeeeeefeeebbbbbbefvvvvvvvvveebbbbbbeebbeeeebbeeeefffvveeeebbbbbb
bbbbbbbbbbbbbeeeeefffffeebbeeeebbefeebbebeeffeeebbbbefvvvvvvvvvveebbbeeeevveffeeeeffffeevvebbbbbbbbb
bbbbbbbbbbbbbbbbbeeefffebbbeeeebeeeebbbebbeeeeeeeebeevvvvvvvvvvvfevvvefffvvfvvffffffffebbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbeeeeeeebbebbbefebbbbebbbbbbeefeeefvvvvvvvvvvvffvvvffffffevvefffffffeeebbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbeffeeeeebeefebbbeeebbbbbbeeefeevvvvefvvvvvffffffvvfffebbeefffffeeeeebbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbeefffffeeeffebbbeeebbbbbbbbeeebbbbbeefvvvfvvffvvvvvffebbbefffffebeeeeebbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbeeeeefffffeebbbbbbbbbbbbbbbbbbbeebbefffffvvfvvvvvvveebbbeeeeffeebeeeeebbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbeefffeebbbbbbbbbbbbbbbbbbbbeeeeefvvvvfvvvvvvvvvvbbbeeebeefeebeeeeebbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeeebbbbbbbbbbbbeeebbbbbeeffffvvvvvfvvvvvvvvvvbbeefebbeeebbeeeeebbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbebbbbbbbbbbbeebbefeebbbbefffffvvvvofvvvvvvvvvvbbeefeebbbbbeeeeeebbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbebbbbbbbbbeeeeeeeffeeevveffffvvvvoofovvvvvffeebbbeeeebbbbbeefeebbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbeevvebbbbbeeffffffeeefevveefffvvvvfofovvvveeeebbbbeeeeeeebbbeeebbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbeevveeeeeeefffffffebefebbbeeffvvvvvffoevvvebbbbbbbeeeeefeebbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbevvebbbbbefffffffeeeeebbbbeeeevvvvfeeebbbbbbbbbbbbbeeeeeebbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffeeeffeebbbbbbbbevvvveebbbbbbbbbbbbbbbeeeebbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeebeeeebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
wh Pardus_NE 87 6 0/0 429/35 580/49 1074/93 942/85
wh Quaack 52 7 429/35 0/0 231/16 971/81 1043/80
wh Pardus_West#North 38 15 580/49 231/16 0/0 995/79 1067/78
wh Pardus_West#South 16 60 1074/93 971/81 995/79 0/0 788/69
wh Procyon 85 85 942/85 1043/80 1067/78 788/69 0/0
beacon Pardus_Station_North 67 19
beacon Pardus_Station_Center 41 58
beacon Lucidi_Armor_Station_Pardus 96 58
beacon Pardus_Station_South 39 82
beacon Lucidi_Weapon_Station_Pardus 42 89

sector Pardus_NE:100,24
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeebbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeefeebbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeeffffeebb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffggggfeeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffggggggfeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffgggggggee
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffgggggggfe
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffgggggggfe
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeffggggggfee
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeffgggggfeeb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbefffffffffebb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeegggfffffeebb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeegggfffeeebbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbegggfffebbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeefffffebbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeffffeebbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeefeebbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbeeebbbbbbb
wh Nhandu 92 23 0/0

sector Pardus_West:37,62
bbbbbbbbbbbbbeebbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbeeeeeebbbbbbbbbeeeebbbbbbbb
bbbbbbeeeeeffffeebbbbbbeeeffeeebbbbbb
bbbbbeefffffffffeebbbbbeffffffebbbbbb
bbbbbeeffffffffffeeeeeeeffffffeebbbbb
bbbbbbeefffffffeeeeeeeffvvfffffebbbbb
bbbbbbbeeeeeefeebbbbbvvvvvvffffebbbbb
bbbbbbbbeebbeeebbbbbbvvvvvvffffebbbbb
bbbbbbbbbbbbbbbbbbbeeefvvffffffebbbbb
bbbbbbbbbbbbbbbbbbbeeffvvffvvfeebbbbb
bbbbbbbbbbbbbbbbbbbbefffffvvvfebbbbbb
bbbbbbbbbbbbbbbbbeeeevvvvfvvveebbbbbb
bbbbbbbbbbbbbbbbeevvfvvvvvvfeebbbbbbb
bbbbbbbbbbbbbbbeefvvfvvvvvveebbbbbbbb
bbbbbbbbbbbbbbbvvvffffffffeebbbbbbbbb
bbbbbbbbbbbbbbbvvvvvvffvvvebeevvvvveb
bbbbbbbbbbbbbbbvvvvvvvvvvveeevvvvvvee
bbbbbbbbbbbbbbbvvvvvvvvvvffvvvvvvvvve
bbbbbbbbbbbbbbbvvvvvvvvfffevvvvvvvvve
bbbbbbbbbbbbbbeefvvvvvvvfeebbbbbbbbbb
bbbbbbbbbbbevvefffvvvvvvfebbbbbbbbbbb
bbbbbbbbbbeevvffvvfvvvvvvvbbbbbbbbbbb
bbbbbbbbeeevvvffvvfffvvvvvbbbbbbbbbbb
bbbbbbeeevvvvvvvffeeefvveebbbbbbbbbbb
bbbbbeeffvvvvvvvveebeeebbbbbbbbbbbbbb
bbbbeefffvvvvvvvvvbbbeebbbbbbbbbbbbbb
bbbeefffffvvvvvvvvbbbeeebbbbbbbbbbbbb
bbeeffvvvfffffvvvvbbbeeebbbbbbbbbbbbb
bbefffvvvvvffeeeeebbbbbbbbbbbbbbbbbbb
beefffvvevvefebeebbbbbbbbbbbbbbbbbbbb
bvvffffeebbeeeebbbbbbbbbbbbbbbbbbbbbb
bvvvvfeebbbbefebbbbbbbbbbbbbbbbbbbbbb
befvvfebbbeeefeebbbbbbbbbbbbbbbbbbbbb
eefffeebbeeggggebbbbbbbbbbbbbbbbbbbbb
effvvebbbefggggebbbbbbbbbbbbbbbbbbbbb
effvvebbbeegggeebbbbbbbbbbbbbbbbbbbbb
effvveebbbeeeeebbbbbbbbbbbbbbbbbbbbbb
eeffffeebbbbeebbbbbbbbbbbbbbbbbbbbbbb
befffffebbbbbbbbbbbbbbbbbbbbbbbbbbbbb
befffffeeebbbbbbbbbbbbbbbbbbbbbbbbbbb
beeffffffeeebbbbbbbbbbbbbbbbbbbbbbbbb
bbeeeffffffeebbbbbbbbbbbbbbbbbbbbbbbb
bbbbeffgggggebbbbbbbbbbbbbbbbbbbbbbbb
bbbeeffgggggebbbbbbbbbbbbbbbbbbbbbbbb
bbeefffgggggebbbbbbbbbbbbbbbbbbbbbbbb
beeffffgggggebbbbbbbbbbbbbbbbbbbbbbbb
befffffgggggeebbbbbbbbbbbbbbbbbbbbbbb
eefffffgggggfeebbbbbbbbbbbbbbbbbbbbbb
efffffffgggfffeeebbbbbbbbbbbbbbbbbbbb
eeffffffffffffffeebbbbbbbbbbbbbbbbbbb
beffeeeffffffffffebbbbbbbbbbbbbbbbbbb
beeeebeeeeeffffffeebbbbbbbbbbbbbbbbbb
bbeebbbeebeeeeeffeebbbbbbbbbbbbbbbbbb
bbbbbbbbbeeebbeffebbbbbbbbbbbbbbbbbbb
bbbbbbbbbeeeeeeeeebbbbbbbbbbbbbbbbbbb
bbbbbeeeebefffeebbbbbbbbbbbbbbbbbbbbb
bbbeeeeeeeeffeebbbbbbbbbbbbbbbbbbbbbb
bbeeeeeeeeeeeebbbbbbbbbbbbbbbbbbbbbbb
bbefeeeeebeebbbbbbbbbbbbbbbbbbbbbbbbb
bbeeeeeeeebbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbeefeebbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbeeebbbbbbbbbbbbbbbbbbbbbbbbbbbb
wh Pardus#North 36 16 0/0 565/43 695/54
wh Enif 4 43 565/43 0/0 154/13
wh Pardus#South 17 54 695/54 154/13 0/0
beacon Lucidi_Weapon_Station_West_Pardus 9 4
beacon Pardus_Station_West 23 27

sector Procyon:37,31
bbbbbbbbbbbbbbbbbbeebbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbeeebbbbbbeeebbbbbbbb
bbbbbbbbbbbbbbbbeefeebeeeeefeebbbbbbb
bbbbbbbbbbbbbbbbefffeeeeeeeffeebbbbbb
bbbbbbbbbbbbbbbeeffffffebbefffeeebbbb
bbbbbbbbbbbbbbbefffffggeeeefggggeebbb
bbbbbbbbeeeebbbeeeeefggfffffggggfeebb
bbbbbbeeeeeebbbbeebeeffeeeffggggfeebb
bbbbbeeeeeeeebbbbbbbeeeebeefggggeebbb
bbbbbefeefffebbbbbbbbeebbbeefgggebbbb
bbbbbeefeeffeebbbbbbbbbbbbbeffffeebbb
bbbbbbeeeefffebbbbbbbbbbbbeefffffeeeb
bbbbbbbeeffffeebbbbbbbbbeeeffggffffee
beebbbbbefffffeeeebbbeeeeffffggfffffe
beeeeebbefffoffeeeeeeefffffgggeeeeeee
eeffeeeeeffooofeefffffffffggggebbbeeb
efffeeefffffofeeeeeeefeeefggggebbbbbb
eefeeeeeooffooebeebbeeebefggggeebbbbb
beeeebbefoofooeeeeebbbbbefggggfeebbbb
bbbbbbbefoffofffffeeeeebefggggffeeebb
bbbbbbeefffffffeeeffeeeeefffffffffebb
bbbbeeefffffffeebeefeeffffeeeffffeebb
bbeeeffffeeefeebbbeffffffeebeeeeeebbb
beeffffffebeeebbbbefffeeeebbbbeebbbbb
befffffffeebbbbbbbeeeeebbbbbbeeeebbbb
beefffffffeebbbbbbbbeebbbbbbeeffeebbb
bbeffffffggebbbbbbbeeeeebbbbeffffeebb
bbeefffffggeebbbbeeefffeebbbeeffooebb
bbbeeefffggeebbbbefffggfebbbbeeffeebb
bbbbbeeeeeeebbbbbeeefggeebbbbbeeeebbb
bbbbbbbbeebbbbbbbbbeeeeebbbbbbbbbbbbb
wh Pardus 18 1 0/0 400/35 269/24
wh Heze_North 6 7 400/35 0/0 340/28
wh Menkar 34 19 269/24 340/28 0/0
beacon Procyon 5 25

sector Labela:34,38
bbbbbbbbbbeeeebbbbbbbbbbbbbbbbbbbb
bbbbbbbeeeeffeeebbbbbbbbbbbbbeeeeb
bbbbbeeefffffffeeebbbbbeeebbeeffee
bbbbeefffffffffffeebbbbefebbeffeee
bbeeefffffffffffffeebbbeeebeeffeee
beeffffffffffgggfffeeebbebbefffffe
beeffffffffffgggfffffeebebeefffffe
bbeffffffeeefgggffffffeeeeefffffee
bbeefggfeebeeeefffffffofffffffeeeb
bbbeeggfebbbbbeeeeffffoffggfffebbb
bbbbeeeeebbbbbbbbeeeeffofggfffeebb
bbbbbbbebbbbbbbbbbbbeeffffffffeebb
bbbbbbbebbbbbbbbbbbbbeefffffffebbb
bbbbbbbebbbbbbbeeebbbbeeeeefffeebb
bbbbbeeeebbbbbeefeebbbbebbeefffeeb
bbbbeeffeebbbbeeeeebbeeeebbeffffee
bbeeeffffebbbbbeeeeeeeefeeeefffffe
bbegggggfebbbbbeeffffeeeebbeffffee
beegggggfeebbbbbeeeeefeebbeeffffeb
beggggggffebbbbbbeebeeeebbeffffeeb
beggggggfeebbbbbbbbbbebbbeeffffebb
eegggggfeebbbbbbbbbbbebbeeofffoebb
effggggfebbbeeebeebbbebbeeffoofeee
eefggggfeebeefeeeeebbebbeefofooofe
befffffffeeeffffffeebebeefoooooffe
beeffffffffffeeffffeeeeeffffofooee
bbefffffffffeeeefffffffffffofoffeb
bbeeffffffffeeeefffffffffffeeeeeeb
bbbefffffffffeeeeeffffffffeebeebbb
bbbeeffffffffeeebeeefffeeeebbbbbbb
bbbbeeeeeefeeebbbbbeeeeebbbbbbbbbb
bbbbbeebbeeebbbbeebbeebbbeebbbbbbb
bbbbbbbbbbbbbbbeeeeeeeeeeeeeebbbbb
bbbbbbbbbbbbbbeefffffffffggfebbbbb
bbbbbbbbbbbbbbeffooeeeeeeggeebbbbb
bbbbbbbbbbbbbbeeffeebbbbeeeebbbbbb
bbbbbbbbbbbbbbbefeebbbbbbeebbbbbbb
bbbbbbbbbbbbbbbeeebbbbbbbbbbbbbbbb
wh Cor_Caroli 33 2 0/0 356/32 497/47
wh Quaack#North 1 5 356/32 0/0 267/17
wh Quaack#South 0 22 497/47 267/17 0/0
beacon Labela 7 26

sector Menkar:27,34
bbbbbbbbbbbbbbeeebbbbbbbbbb
bbeeebbbbbbbbeefeebbbbeeebb
beefeeebeeebeemmfeebbeefeeb
eeffofebefeeefmmffebbefffeb
effffeebeeebeefeeeeeeefffee
efofeebbbbbbbeeebeebbeffffe
eeofebbbbbeebeebbeebbeeefee
beffeebbbeeeeeebbeeebbbeeeb
beffeebbbbefffeebefebbbbebb
eeffebbbbbeeeeeeeefeebbbebb
efffeebbeebeebeeffffebbeeeb
eefffebbeeeeebbeffeeebeefee
beeffebeefffeeeeeeebbeeffoe
bbeefeeeffffffffebbbbeffofe
bbbeeeeeffggggffeebbeefoooe
bbbbbbbefggggggffeebeffoofe
bbbbbbeefgggggggffeeefoofee
bbbbeeeffggggggggfffffffeeb
bbeeeffffggggggggfgggggfebb
beefffffffgggggggggggggfeeb
eefffeeefffffgggfggggggffee
efffeebeefeeeffffgggggffffe
eeffebbbeeebefeeefggggffeee
beefeebbeebbeeebefgggfeeebb
bbeffeeeeeeeeebbefgggfebbbb
eeeeeffeeeeeeebeefffffebbbb
effeeffebeebeeeefffffeebbbb
eeeffeeeeeeeefeeefffeebbbbb
bbeefeeeeefeeeebeeefebbbbbb
bbbeeeeebeeeeebbbbeeebbbbbb
bbbbbbbbbbeffeebbbbebbbbbbb
bbbbbbbbbeemmfebbbeeebbbbbb
bbbbbbbbbeemmeebbbefebbbbbb
bbbbbbbbbbeeeebbbbeeebbbbbb
wh Rigel 26 22 0/0 303/27
wh Procyon 1 25 303/27 0/0

sector Cor_Caroli:40,42
bbbbbbbbbbbbbbbbbbbbbbbbeeeeeebbbbbbbbbb
bbbbbbbbbbbbeebbbeeebbbeeofffeebbbbbbbbb
bbbbbbbbbeeeeeebeefeebbeffofffebbbbbbbbb
bbbbbbbbeeffffeeeffeebbeeeeeeeebbbbbbbbb
bbbbbbbbeeffeeefffeebbbbeebbbeebbbbbbbbb
beeebbbbbeefebefffebbbbbbbbeeeeebbbbbbbb
befebeeebbeeeeefffebeeeebbeefffeebbbbbbb
eefeeefeeebeffeeefeeeffeeeefeeefeebbbbbb
efeebefffeeeffebeffffgggfffeebeeeeebbbbb
eeebbeeffffeeeeeefffggggffeebbbbefebbbbb
bbbbbbeffffebeffffgggggggfebbbeeefebbbbb
bbbbbeeffffeeefffgggggggggeebeefofeebbbb
bbbbeefffffffffffggggggggggeeeeeoffeebbb
bbbeefffffffffffgggggggggggggfeeffffebbb
bbbeffffeeefffffgggggggggggggfffeefeebbb
bbbefffeebeefffgggggggggggggggffeeeebbbb
bbbeeffeebbeeefgggggggffggggggffeeebbbbb
bbbbeeeebbbbbefgggggfffffgggggffebbbbbbb
bbbbbbeeeeebbefgggggfffffffgggffeebbbeee
bbbbbbeeefeebeffgggffffffffffffffeeeeeee
bbbbbeeffffeeeffffffffffffffgggffeeefffe
bbbbeeeeffeebeefffffffffffffggggfebeeefe
bbbeefeeeeebbbefgggffffffffgggggfebbbbfe
beeefeebeebbbeefggggfffffgggggggfebbeefe
eefffebbbbbbeefggggggfgggggggggfeebeefee
effffeeebbeeeffggggggggggggggggfebbeefeb
eefffffeeeeffffgggggggggggggggffebbbefeb
befffofffeeeeeffggggggggggggggfeebbeefeb
beeffooofebbbefffggggggggggggfeebbbeffee
bbefoooofeebeefffffgggggggggffebbbeeffee
bbeeffofffeeefffffffgggggggfffebbbeffoeb
bbbeeeeeeeffffooooffeeeeeeefffebbbeeoeeb
bbbbbeebbeeeeffoofeeebbbbbeeefebbbbeeebb
bbbbbbbbbbbbeeffffebbbbbbbbbefebbbbbbbbb
bbbbbbbbbbbbbeffffebbbbbbeeeefeebbbbbbbb
bbbbbbbbbbbbbeefffeeebbeeefffffeebbbbbbb
bbbbbbbbbbbbbbeeffffeeeeffofofffeeebbbbb
bbbbbbbbbbbbbbbeefffffffooooofffffeeeebb
bbbbbbbbbbbbbbbbeeeefffooooffeeefffffeeb
bbbbbbbbbbbbbbbbbbbeefffoofoeebeefffffeb
bbbbbbbbbbbbbbbbbbbbeeeefoeeebbbeeefeeeb
bbbbbbbbbbbbbbbbbbbbbbbeeeebbbbbbbeeebbb
wh Labela 10 2 0/0 291/25
wh Gomeisa 35 11 291/25 0/0
beacon Caroli 22 20

sector Nhandu:28,40
bbbbbbbbbbbbeeebbbbbbbbbbbbb
bbbbbbbbbbbeefeeeebbbbbbbbbb
bbbbbbbbbbbefooffeebbbbbbbbb
bbbbbbbbbbeeooofffeebbbbbbbb
bbbbbbbbbeefooooffeebbbbbbbb
bbbbbbbbeefffffffeebbbbeeebb
bbbbbbbeefeeeeeffebbbbbefeeb
bbbbbbbefeebbbeefeebbbeeffeb
bbbbbbeefebbbbbeefeebbefofee
bbbbbeeffebeeebbeffebbefoffe
bbbbbeffeebebeebeefeebefffee
bbbbeeffebbebbebbeffeeeffeeb
bbbbeoofebbeeeebbeffeeeeeebb
bbbbeoffeebbebbbeeffebbbbbbb
bbbbeffffeeeeeeeefffeeebbbbb
bbbeefffffffeeeffeeeggeebbbb
bbbeeeeeeeeeebeeeebeggeebbbb
beeeebeebbeebbbebbbeeeebbbbb
beefeeeebbbbbbbebbbbeebbbbbb
bbeffffeebbbbeeeeebbbbbbbbbb
bbeffffeebbbeefffeeebbbbbbbb
eeefffeebbbbeffffffebbbbbbbb
efffeeebbbbeefffffeebbbbbbbb
eeffebbbbbbeeeeefeebbbbbbbbb
beffeeeebbbbebbeeebbbeebbbbb
beefeeeeebbbebbbbbbbbeobbbbb
bbefebefeebeeebbbbbbbeofobbb
bbefeeeffeeefeebbbbbbeeeebbb
bbeeffffffffffeebbbbbbbbbbbb
bbbefffgggggfffeebbbeebbbbbb
bbbeefggggggggffeeeeeebbbbbb
bbbbefgggggggggffffffeebbbbb
bbbbefgggggggggfffffffeebbbb
bbeeefgggggggggffffffffebbbb
bbeffeeegggggggffffffffebbbb
bbeeeebeggggggfffffffffebbbb
bbbbbbeeggggffffffffffeebbbb
bbbbbbeeeefffffffeeeeebbbbbb
bbbbbbbbbeeefffeeebbbbbbbbbb
bbbbbbbbbbbeeeeebbbbbbbbbbbb
wh Cebece 18 2 0/0 295/25 451/37
wh Pardus_NE 0 21 295/25 0/0 214/18
wh Baham 11 39 451/37 214/18 0/0
beacon Nhandu 18 33

sector Baham:29,36
bbbbbbbbeeebbbbbbbbbbbbbbbbbb
bbbbbbeeefeebbbbeeebbbbbbbbbb
bbbbeeefffeebbbeefeebbbbbbbbb
bbbeeffffeebbbeefofebbbbbbbbb
bbeeeeeffebbbbeeooeebbbbbbbbb
beefebeefebbbbbeffebbbbbbbbbb
beffebbefeebbbeefeebbbbbbbbbb
beffeeeeffeebbeefebbbbbbbbbbb
eefffffffffeebbeeebbbbbeeebbb
efffffffffffeebeebbbbbeefeebb
effffffffgggfeeeeebeeeefffeeb
efffffffgggggffffeeefffffffee
eeffffffggggggfffgggfffoffffe
beffffffggggggggggggffooofffe
bbefffffggggggggggggfoooffffe
bbeeeeffggggggggggggfooffffee
bbbbbeeefgggggggggggffoooffeb
bbbbbbbeefggggggggfffofffeeeb
bbbbbbbbeffgggggggfffffeeebbb
bbeebbbbefffgggggffffffebbbbb
bbeeebbbeefffgggffffffeebbbbb
beefeeebbefffgggffffeeebbbbbb
beffffeeeeffffgggffeebbbbbbbb
befffeebbeffffgggffebbbbbbbbb
beeeeebbeeffgggggffeebbbbbbbb
bbbbbbbbefggggggggffeeeebbbbb
bbbbbbbbefggggggggggfffeebbbb
bbbbbbbeefgggggggggggfffeeebb
bbbbbbbeffgggggggggggffffeebb
bbbbbbeeeeeggggggggggffffebbb
bbbbbbefebeeffgggfffffeefebbb
bbbbbbeeeebeeeeffffeeeeefeebb
bbbbbbbeeeeeebeeefeebeefffeeb
bbbbbbbbeeeeebbbeeebbbeefffeb
bbbbbbbbbbeebbbbbbbbbbbeffeeb
bbbbbbbbbbbbbbbbbbbbbbbeeeebb
wh Nhandu 10 1 0/0 369/34
wh Rigel 23 35 369/34 0/0
beacon Baham 4 10

sector Rigel:49,34
bbbbbbbbbbbbbbbbbbbbbbbeeeebbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbeeffeebbeeeebbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbeeffffebbeeeeebbbeeebbeebbbb
bbbbbbbbbbbbbbbbbbbbeeffffeebeeeeeebbeefebeeeeebb
bbbbbbbbbbbbbbbbbbbbeeeffeebeeeeeebbeeggeeefffeeb
bbbbbbbbeeeeebbbbbbbeeeffebeefebeebbeeggeeeffffeb
bbbbbbbbeeeeebbbeebbeeeffebeefeeeeebbeefebeefffeb
bbbbbbbbbbbebbeeeebbeffffeebeeeeefeebbefebbeefeeb
bbbbbbeeebeeeeeffeebefgggfeeeebbeffebeefebbbeeebb
bbbbbbefeeefeeefffeeefggggfffebbeefeeeffeebbbbbbb
bbbbbeeggggfebefffffffgggggffebbbefffffffeebbbbbb
bbbbeegggggfebeffeeeffggggggfeebeeffffffffebbbbbb
bbbbefgggggfeeeffebefggggggggfebefffffeeefeebbbbb
bbbbefggggfffffffeeefggggggggfeeefffffebeeeebbbbb
bbbbeefffffffffffeeefggggggggfffffooffeebbeeebbbb
bbbbbeeffffffffffeeefggggggggfffffoooffeeeefeeebb
bbbbbbeffffffffffeeeffggggggfffffoooooffeeeeefeeb
bbbbbeefffffffeeeebeefffgggfeeeffffoffofebeeeffee
bbbbbeffffffffebebbbeeeeefffebefffffooffeeefffffe
bbbbeeffffffffeeeeebbeebeeeeebeeeeeffffeeeeffffee
bbbbefffffffffffffebbbbbbeebbbbeebeffffebbeeffeeb
bbbbeeffffffffggggeebbbbeeeebbbbbeefffeebbbeeeebb
bbbbbefffffffgggggfebbbeeffeebbbeeggffebbbbbebbbb
beeeeeeeeffffgggggfebbbeefffeebbeeggfeebbbbbebbbb
eeffffebeffffofffffeebbbeefffebbbeffeebbbbbeeebbb
effeeeeeeeeooooofoooeebbbeeofebbeefeebbbbeeefeebb
eefebefffeeoooofffoffebbbbeoeebbefeebbbbeeffffebb
befeeefeeeffoooffeeefeebbbeeebbeefebeebbefffffebb
beeffeeebefffofffebeeeebbbbbbbbeffeeeeeeeffffeebb
bbeeeebbbeeefffffebbeebbbbbbbbbeeffffffffffffebbb
bbbbbbbbbbbeffffeebbbbbbbbbbbbbbeeeeefffffeeeebbb
bbbbbbbbbbbefffeebbbbbbbbbbbbbbbbbbbeefeeeebbbbbb
bbbbbbbbbbbeefeebbbbbbbbbbbbbbbbbbbbbeeebbbbbbbbb
bbbbbbbbbbbbeeebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
wh Baham 26 1 0/0 325/28
wh Menkar 2 28 325/28 0/0
beacon Rigel 10 17

sector Gomeisa:31,23
bbbbbbbbeebeebbeeebbbbbbbbbbbbb
bbbbbbbeeeeeeeeefeeebbbbbeeeebb
bbbbbbbeeefeefffmmfeebbbeeffeeb
bbbbbbbbbeeeefffmmffeeeeeeeeeee
bbbbbbbbbbeeeefffffeebbbeeeeeee
bbbbeebbbbbbbeeffffebbbbbbeefee
beeeeeebbbbbbeeffeeebbbbbbbefeb
befgggeebbbbbefffeeebbbbbbeeeeb
eefgggeebbbeeeggggeebbbbbbefeeb
effgggebbbbeffggggebbbbbbbeeeeb
effgggebbbbeefggggebbbbbbbbeeeb
eeffffebeebbefggggebbbbeeeeeeeb
beefffeeeeebeefgggeebbbeeeebeeb
bbeefffffeebbeeefffeebeeffeeeeb
bbbefffffebbbbbefeefeeefeeefeeb
bbbefffffeeebeeefeefffffebeeebb
bbbeeffffffeeefffffffeeeeeeebbb
bbbbeefffffgggffffeeeebeffeebbb
bbbbbeeefffgggffeeebbbbeeeebbbb
bbbbbbbefffffffeebbbbbbbeebbbbb
bbbbbbbeefeeeffebbeeeebbbbbbbbb
bbbbbbbbeeebeffeeeeffebbbbbbbbb
bbbbbbbbbbbbeeeebbeeeebbbbbbbbb
wh Cor_Caroli 0 8 0/0 219/21
wh Cebece 21 17 219/21 0/0

sector Cebece:27,18
bbbbbbbbbeeeebbbbbbbbbbbbbb
bbbbbbbbeeffeebbbbbbbbbbbbb
bbbbbbeeeffffeebbbbbbbbbbbb
bbbbbeeffffffeebbbbbeebbbbb
bbbbeeffgggfeebbbbeeeeeeebb
bbbeeffggggfebbbeeefffffebb
bbeefgggggggeebeefffffffeeb
bbeffggggggggeeefffffffffeb
bbeffgggggggggfffffffffffeb
beeffgggggggggfffffffffffee
befffffffffffffffffffffffee
eeggffeeefffffffeeefffffeeb
efggfeebeffoffeeebeeffeeebb
efeeeebbeeoooeebbbbeeeeeeeb
eeebbbbbbeoooebbbbbeeefeeeb
beebbbbbbefofeebbbbeeffeeeb
bbbbbbbbbbeofeebbbbbeeefeeb
bbbbbbbbbbeeeebbbbbbbbeeebb
wh Gomeisa 12 0 0/0 169/15 224/17
wh Nhandu 2 14 169/15 0/0 256/22
wh Etamin 24 16 224/17 256/22 0/0
beacon Cebece 20 8

sector Etamin:31,24
bbbbbeeeebbbbbbbbbbbbbbbbbbbbbb
beeeeeffeebbeeebbbbbeeebbbbbbbb
beeffffggebeefeebbbeefeebbbbbbb
eefffffggeeegggeeeeeeeeeebbbbbb
eeefffeeeeeegggggggfebefebbeebb
bbeffeebbeeeeeeggggeebefeeeeeeb
bbeefebbeefeebeeeeeebeefffffeeb
bbbefeeeefeebbbbbeebbeeeeefeebb
bbbeeeeeeeebbbbbbbbbbeebbefebbb
bbbbbefffebbbbbbbbbbbbbbbefeebb
bbbbeefffeebbbbbbbbbbbbbeefeebb
bbbeefeeeeebbbbbbbbbbbbbeefebbb
bbbeeeebbeeebbbbbbbbbbbbbefeeeb
bbbbbeebbefebbbbbbbbbbbbbefffeb
bbbbbeeeeeeebbbbeebbbbbbbeeeeee
bbbbbeeffeebbbbeeeeebbbbeeeeefe
bbbbbbeeeebbbbeeeeeeeeeeefeeeee
bbbbbbeeeeebbeefebeeeeeeefffeeb
bbbbbbeffeebeeffeeeebbbbefffebb
bbbbbbeffebbefeeeffeeeeeeffeebb
bbbbbbeffeeeefebeeeebbbbeeeebbb
bbbbbbeefffffeebbbbbbbbbbbbbbbb
bbbbbbbeeffeeebbbbbbbbbbbbbbbbb
bbbbbbbbeeeebbbbbbbbbbbbbbbbbbb
wh Cebece 2 1 0/0 433/29
wh Kitalpha 30 14 433/29 0/0

sector Arexack:17,17
bbbbbbbbbbbeebbbb
bbbbbeeebeeeeeeeb
bbbeeefeeefggggee
bbeefooebeeggggge
beeoooeebbeggggge
beooffebbeeggggge
eeooeeebeefggggge
effoebbeeffggggee
eoofebeefffffffeb
efooeeeffffffffeb
eeoffffffffffffee
beffffffffffffffe
beeffffeeeffffffe
bbeefeeebeeeeffee
bbbeeebbbbbbefeeb
bbbeebbbbbbbeeebb
bbbeebbbbbbbbbbbb
wh GT_3-328 16 11 0/0 157/13
wh Dadaex 3 15 157/13 0/0
beacon Arexack 10 9

sector GT_3-328:14,16
bbbbbeeebbbbbb
bbbbbeeebbbbbb
bbbbbbebbbbbbb
bbbbeeeeeebbbb
eeeeeffffeeeee
efeefeeeffffee
eeeefeeefffeeb
beeeeeeeffeebb
bbebeeeeeeebbb
bbebbebbebbbbb
bbebbebeeeebbb
beeeeeeeffeebb
beeeeeeeeeeebb
bbeeeebeebeeeb
bbeeeeeeeeeeeb
bbbbbbbeeeeebb
wh Arexack 1 5 0/0 128/11
wh Famida 12 5 137/11 0/0

sector Famida:25,19
bbbbbbbbbbbbbbeeebbbbbbbb
bbbbbbbbbbbbbbefeeebbbbbb
bbbbbbbbbbbbbeefffebbbbbb
bbbbbbbbbbbbeeffffeeebbbb
bbbbbeeebbebefgggfffeebbb
bbeeeefeeeefffgggggffeebb
beefffffofffggggggggffeeb
beffffffofggggggggggfffeb
eeffffffoogggggggggfeeeeb
eeffgggooogggggggggfebeeb
beffgggfofgggggggggfeeeeb
beeegggfofggggggfffffffeb
bbbeefffffggggfffffeeeeeb
bbbbefffoffffggfffeebbebb
bbeeeffffffffggffeebeeeeb
beefeeeeeeeeeeefeebeeffee
beeeebbeebbbbbeeebbeeffee
bbeebbbbbbbbbbbbbbbbefeeb
bbbbbbbbbbbbbbbbbbbbeeebb
wh GT_3-328 1 9 0/0 257/22
wh Let 23 17 257/22 0/0
beacon Famida 18 10

sector Uv_Seti:22,15
bbbbbbbbbbbbbbeeebbbbb
bbbbbbbbbeeeeeefeebbbb
bbbbbbbeeefffggggeebbb
bbbbbbeefffffggggfeebb
bbbbbeeffggggggggffebb
bbbeeefggggggfgggffeeb
eeeefggggggggfffeeefee
eeeffggggggggfffebeeee
eeeefgggggggffffebbbbb
bbbefggggggffeeeebbbbb
beeefgggggffeebeeeeebb
eeffffffffffebeefffebb
eeffeeeefffeebeeeeeeeb
beeeebbeeeeebbbeebeeeb
bbbbbbbbbbbbbbbbbbbeeb
wh Gresoin 20 6 0/0 194/18 173/11
wh Let 2 13 194/18 0/0 225/18
wh Zeaay 20 14 173/11 225/18 0/0
beacon Uv_Seti 12 7

sector Gresoin:25,21
eeeeebbbbbbbbbbbeeebbbbbb
efffebbbeeebbbbeefeeeebbb
eeeeebbbeeebbbbeoffofeebb
bbbebbbbbebbbbbeffooooeeb
bbbebeeeeeeeebbefooofffeb
beeeeeffffffebeeffoooooeb
eeffffffffffeeeffooofofee
effffffgggffebefffofofffe
eefffffgggeeebeeefgggggge
befffffffeebbbbbefgggggge
beeefffffeeeeeeeefgggggge
bbbeeeefffffffffffgggggge
bbbbbbefffeeeeeeeefggggge
bbbbbeeffeebbbbbbefggggee
eebbbefffeeebbbbeeffffeeb
eebbeeffffeebbeeefffffebb
eebeeffoofeeeeeeffffffebb
eeeefoffffeeeeeeffffffeeb
eebeeffeeeebbbeeeefffffeb
eebbeeeebbbbbbbbbeeeefeeb
eebbbbbbbbbbbbbbbbbbeeebb
wh Uv_Seti 0 7 0/0 257/23
wh PA_2-013 22 19 257/23 0/0
beacon Gresoin 13 11

sector Dadaex:18,21
bbbbbbbbbbbbeeeebb
bbbbbbeeeeeeeffeeb
bbbbeeeffffffggfee
bbbeeggggggggggffe
bbbegggggggggggfee
bbbegggeeeeeeefeeb
bbbeggeebeebbefebb
eebeggeeeeebbefebb
eeeeffffffeeeefeeb
eebeggeeeeffffffee
bbbeggebbeeeeefffe
bbbeggebbbeebefffe
bbeeggeebbbbeefffe
bbeggggeeeeeegggfe
eeegggggggggggggee
eeeegggggggggggfeb
bebeeeeeeefggggfeb
bebbbbbbbeefffffeb
eeeeeebbbbeeeefeeb
effffebbbbbbbeeebb
eeeeeebbbbbbbbbbbb
wh Arexack 6 2 0/0 136/8 227/15
wh Pass_UNI-09 0 8 136/8 0/0 184/11
wh Pass_UNI-06 9 17 227/15 184/11 0/0

sector Lavebe:23,8
bbbeebbeeeeebbbbbbbbbbb
bbeeeebeeeeebbeebeebbbb
bbeffeeeeeeebeeeeeebeeb
bbeffeeeebeeeefeeeeeeee
beefeebeeeeeeeeebeeeeee
eeeeebbeeefebbbbeeeeeeb
eeebbbbbbeeeebeeeeebeee
eebbbbbbbbeeebeeeebbeee
wh Pass_UNI-06 1 6 0/0 363/21
wh Tigrecan 22 7 363/21 0/0

sector Let:22,34
bbbbbbbbbbbbbbbbeeeebb
bbbbbbbbbbbbeeeeeffeeb
bbbbbbeeeeeeeeeeeeffeb
bbbbeeefgggffebeeefeeb
bbbeefeegggfeebeeeeebb
bbbeffeegggfebbbbeebbb
bbbeeeefgggfeebeeeeebb
bbbbbbefgggffeeefffeeb
bbbbbeefgggfffffffofeb
bbeeeeffffffffofoofoeb
bbefffffffffffffooooee
beefffffffffffoooofoee
beffgggffffffffooofeeb
befggggffffffffoffeebb
befggggfffgggfffeeebbb
befgggggffgggfeeebbbbb
befggggggfgggfebbbbbbb
eeggggggggffeeebbbbbbb
efggggggggfeebbbbbbbbb
eeggggggggfebbbbbbbbbb
beefggggggfebbbbbbbbbb
bbeeggggggfebeebbbbbbb
bbbefggggffeeeeebbbbbb
bbbeeffffffebefeeebbbb
bbbbeffffffeeefffeebbb
beeeeffffffebeeffeebbb
befffffffffebbeeeebbbb
beeeeffffeeebbbbebbbbb
bbbbeefofeebbbbbebbbbb
bbbbbeffoeeeeebbebbbbb
bbeebeffoofffeeeeeeebb
beeeeefoooofffffffoeee
beeeeeeeefeeeefeeeffee
bbeebeebeeebbeeebeeeeb
wh Uv_Seti 19 1 0/0 209/14 318/25 388/32
wh Famida 5 3 209/14 0/0 275/23 345/30
wh Zeaay 16 25 309/25 266/23 0/0 203/14
wh Tigrecan 2 32 388/32 345/30 212/14 0/0
beacon Let 9 11

sector PA_2-013:20,17
eeeebeeeeebbeeeebbbb
eefeeeeeeeebeffeeeeb
befffeebeeeeeeeeeeee
beeeeebbbeeeeebbeeee
bbbebbbbbbbbbbbbebee
bbbebbbbbbbbbbbbebee
bbbebbbbbbbbbeeeeeee
bbbebbbeeebbeeeeeeee
beeeeeeefebbeeebbbbb
befmmfeeeebbbeeeebbb
beemmfebebbbbeeeeeeb
bbeeeeebebbbbbbeefeb
bbbebbbbebbbbbbbeeeb
bbeeebbbebbbbbbbbeeb
bbefebbeeeeebbbbeeeb
bbeeebbeeffeeeeeeeeb
bbbbbbbbeeeeeeeeeebb
wh Gresoin 1 0 0/0 296/17
wh Abeho 10 15 287/17 0/0

sector Pass_UNI-06:17,19
bbbeeebbbbbbbbbee
beeefeebbbbbbbeee
eeffffebbbbbbeeee
eeffffeebbbbbeeeb
befffffeeeebbbebb
beefffffffeebeeeb
bbeeeefffffeeeeeb
bbbbbeeeggfebeebb
bbbbbbbeggeebeebb
bbbbbbbeeeebbbbbb
bbbbbbbbeebbbeeeb
bbbbbbbeeeeeeefee
bbbbbbbeeeeeeeeee
bbbbbbbbbbbbbbbee
bbbbbeeeeeebbbbee
bbbbbeeeeeeeebeee
bbbbbbebbeefeeefe
bbbbbeeebbeeeeeee
bbbbbeeebbbeebeeb
wh Dadaex 3 0 0/0 232/16 137/11 461/28
wh Lavebe 16 0 232/16 0/0 114/6 523/28
wh Tigrecan 13 6 137/11 114/6 0/0 428/23
wh Qumia 6 18 461/28 523/28 428/23 0/0
beacon Pass-Io 4 4

sector Tigrecan:19,13
eeebbbbbeebbbbbbbbb
eeeeeebeeeeebbbbbbb
beeefeeefffeebbbbbb
bbbeffffffffebbeeee
beeeooooffffeeeeeee
eeffoggoooffffffffe
eefooggooffffffffee
beefoooofeeefffeeeb
bbeefofeeebeeefebbb
bbbefffebbbbbeeebbb
beeeffeebbbbbbbbbbb
beefeeebbbbbbbbbbbb
bbeeebbbbbbbbbbbbbb
wh Lavebe 0 0 0/0 156/12 114/6 185/14
wh Let 12 2 156/12 0/0 147/12 79/7
wh Pass_UNI-06 0 6 114/6 147/12 0/0 176/14
wh BU_5-773 14 9 185/14 79/7 176/14 0/0

sector Sobein:15,12
bbbeeeeeeebbbbb
bbeefffffeeebbb
beeffffffffeeeb
eeeeefffeeefeeb
efebeeeeebefebb
eeeebebbbeefeee
befeeebbbefeeee
eeffeeebeefebee
eeffffeeeffeebb
beeffeebeeefebb
bbeeeebbbbeeebb
bbbeebbbbbbeebb
wh BU_5-773#West 3 10 0/0 144/9
wh BU_5-773#East 12 11 144/9 0/0
beacon Sobein 6 2

sector Zeaay:27,14
beebbbbbbbbbbbbbbbbbbbbbeeb
beeeeebeeeebbbbbbbbbbbbeeeb
befffeeeffeebbbbeeeebbbeeeb
beegggfffffebeeefofeebbeebb
bbegggfffffeeefofoofebbeebb
bbegggfffffeeeffooofeeeeeeb
beegggfffggffffooofeeeeeeeb
eefffffffggeeeffoofebeebebb
eeffffffeeeeeefffofeebbbebb
beeeefffebeebeffofffeeeeeeb
bbbbefffeeeeeefffffffeeefee
beeeeffffeeebeefffffeebeeee
beefeeeeeebbbbeefeeeebbbbee
bbeeebbbbbbbbbbeeebbbbbbbbb
wh Let 1 1 0/0 327/25 143/11 204/19
wh Uv_Seti 24 1 327/25 0/0 316/23 182/11
wh BU_5-773 3 12 134/11 307/23 0/0 184/17
wh Iohofa 20 12 204/19 182/11 193/17 0/0
beacon Zeaay 7 5

sector Abeho:25,13
beeeeeeebbbeebbeeeeeeebbb
beffgggeebbeebeegggggeebb
eefgggggebeeeeegggggggeeb
egggggggeeefggfggggggggeb
eggggggggggggggggggggggeb
egggggggggggggggggfggggee
egggggggeeefgggggfffgggfe
eggggggeebeffffffeeeefffe
efgggggebeeeeeeeeebbeeffe
eegggggebeeebeebebbbbeeee
begggggebbbbbbbbebbbbbbbb
beefffeebbbbbbbeeeeeebbbb
bbeeeeebbbbbbbbeeeeeebbbb
wh PA_2-013 11 1 0/0 168/13
wh Olaso 24 8 168/13 0/0
beacon Abeho 18 4

sector BU_5-773:25,8
eeebeebbbbeeeebbbbbbeeebb
efeeeebbeeeffeeebbeeefeeb
effffebeeggggggeebeefffee
eefffeeefggggggfeebeffffe
befffeeffggggggooeeefeeee
beeffeefffeeeeeeffffeebbb
bbeeefffeeebbbbeefffebbbb
bbbbeeeeebbbbbbbeeeeebbbb
wh Sobein#West 4 0 0/0 58/4 243/16 270/20 106/7
wh Tigrecan 0 1 58/4 0/0 246/19 273/23 109/10
wh Sobein#East 19 1 243/16 246/19 0/0 49/4 150/9
wh Zeaay 23 1 270/20 273/23 49/4 0/0 172/13
wh Pass_UNI-07 10 6 106/7 109/10 150/9 172/13 0/0

sector Iohofa:24,16
beebeeeeeeeebbbbbbbbeebb
eeeeegggggfeeebbbbeeeeeb
effgggggggfffebbbeeeeeee
eefgggggggfffeebbefebefe
beefggggggffffeeeefebefe
bbeeffgggfffffffeeeebefe
bbbeeefffffeeefeeeebbefe
bbbbbefffffebeeebbbbbeee
bbbbbeeffffeebbbbbbbeeeb
bbbbbbeeefffeebbbbbeefeb
bbbbbbbbeffffeebbbbeefeb
bbbbbbbbeeefffeebbbbeeeb
bbbbbbbbbbeeeffeebbbbbbb
bbbbbbbbbbbbeeffebbbbbbb
bbbbbbbbbbbbbeefebbbbbbb
bbbbbbbbbbbbbbeeebbbbbbb
wh Zeaay 1 2 0/0 333/27 150/15
wh Olaso 21 10 333/27 0/0 301/22
wh Lagreen 16 14 159/15 310/22 0/0
beacon Iohofa 11 4

sector Olaso:25,20
bbbbbbbbbbbbeebbeeeebbbbb
bbbbbbbbbbeeeeebeefeeebbb
bbbbbbbbbeeggfeebeofoeebb
bbbbbbbbbeeggggeeeooffeeb
bbbbbbbbbbeggggebeofoooeb
eeebbbbbbbeggggeeeffoofeb
eeeebbbbeeegggffeeeooooee
beeebbbeefffffffebefofofe
bbeeebbeefffffffeeeofffee
bbeeebbbefffffffebeefofeb
beeeebbbefffffffeebeoooeb
eeffebeeeffffffffeeefofee
eefeebeeeefffffffebeefofe
beeebeeebeeffffffeebeefoe
bbeeeefebbeeffffffeebeeee
bbeeeeeebbbeeffffffeebbee
bbbeebeebeebeeeeffffeebbb
bbbbbeeeeeeeeebefffffeebb
bbbbbeeeeeefeebeeeffeeebb
bbbbbbbbbbeeebbbbeeeebbbb
wh Iohofa 0 5 0/0 249/15 330/24
wh Abeho 8 6 249/15 0/0 139/13
wh Veliace 21 18 330/24 139/13 0/0
beacon Olaso 13 11

sector Lagreen:16,20
bbbeeebbbbbbbbbb
beeefeebbbbbbbbb
befffeebbeebbbbb
eeffeebbeeeeebbb
efffebbbefffeeeb
eeffebbeeoooofeb
beffeeeeooooofee
eeffeeeffoooofoe
eeffebefffoofffe
beffeeefffffoffe
beefffggeeeffffe
bbeeefggebefffee
bbbbefffeeefffeb
bbbeefgggfffffee
bbbeffggggggffee
bbbeeeggggggfeeb
bbbbbeegggggfebb
bbbbbbeeggggfeeb
bbbbbbbeeefeeeeb
bbbbbbbbbeeebbbb
wh Iohofa 5 1 0/0 138/12 223/19
wh Uressce 3 13 138/12 0/0 143/11
wh WI_4-329 14 18 223/19 143/11 0/0
beacon Lagreen_Station 10 11

sector Veliace:25,16
bbbbbbbbbbbbbbbbbbeeebeee
bbbbeeeebbeebbbbbbeeeeeee
bbbeeffeeeeeeeebeebeeeeeb
bbbeffffffffffeeeeeeebbbb
bbbeeeeffeeeefggggggeebee
bbbbebeffebbefggggggfeeee
bbbeeeefeebeefggggffeebee
bbeeoffeebeeffgggfeeebbbb
bbefofeebeefffgggfebbbbbb
beeoffebeefggffffeebbbbbb
eeffeeebeeeggffffebbbbbbb
eefoebbbbbeggffffeebbeeee
beffeeeeeeefffffffebbeffe
beeeebbbbbeeeeefffeeeeffe
bbbeebbbbbbbbbeefeebbeffe
bbbbbbbbbbbbbbbeeebbbeeee
wh Olaso 4 2 0/0 118/10
wh WI_4-329 1 11 118/10 0/0
beacon Veliace 15 11

sector Pass_UNI-07:23,24
bbbbbbbbeeebbeeebbbbeeb
bbbbbbbeefeeeefeeebbeee
bbbbbeeeeeebbefeeeeeefe
bbbbeeeeebbbeefeeebbeee
bbbbeeebbbbeefffeebbbeb
bbbeeebbbbeefffeebbbbeb
bbbeeebbbeeffeeebbbeeee
eebeebbbbeeeeebbbbeeffe
eeeeeebbbeebeeeebeeffee
eebefeebbeeeeffeeeffeeb
bbbeffeebeefffggffffebb
bbbeeeeebbeeefggfffeebb
bbeeeeebbeeeefffeeeebbb
beeeeeebeefeeefeebbbbbb
beeebeeeefeebefebbbbbbb
bbeeeeffffebbefeebbbbbb
bbeeefffeeebbeffeebbbbb
bbbbeeeeebbbbeeeeebbbbb
bbbbbbbbbbbbeeebeeebbbb
bbbbbbbbbbbbeeeeeeebbbb
bbbbbbbbbbbbbeeeeebbbbb
bbbbbbbbbbbbbbbeebbbbbb
bbbbbbbbbbbbbbbeebbbbbb
bbbbbbbbbbbbbbbeebbbbbb
wh BU_5-773 14 0 0/0 190/10 257/14
wh Uressce 22 7 190/10 0/0 320/23
wh Ioquex 0 8 257/14 320/23 0/0

sector Uressce:20,17
bbbbbbbbeeeebbbbbbbb
bbbbeebeefeebbbbbbbb
bbeeeeeeffebbbbbbbbb
bbefeeeffeebbbeebbbb
beefebefeebbbeeebbbb
beffeeefebeeeeeebbbb
eeffgggfeeeffeebbbbb
eeefgggfggggfebbbeeb
bbeegggfggggfeebeeee
bbbegggfggggffeeeffe
bbeefffffggfffffffee
beefffffffeeeefffeeb
beefffffffebbeefeebb
bbeeeeffffeebbeeebbb
bbbbbeefffeebbbbbbbb
bbbbbbeeeeebbbbbbbbb
bbbbbbbbeebbbbbbbbbb
wh Lagreen 9 1 0/0 93/7 158/14
wh Pass_UNI-07 2 8 102/7 0/0 193/17
wh Miola 19 8 167/14 193/17 0/0
beacon Uressce 7 11

sector Miola:25,19
bbbbbbbbbbbbbbbeeebbbbbbb
bbbbeeeeeebbbeeefeebbbbbb
bbbeeffffeebeefooeebbbbbb
bbbeffffffebeffffebbbbbbb
bbbeefffffeeegggfeeebbbbb
bbbbeefffggggggggggeebbbb
bbbbeefffgggggggggggeeebb
bbbeefgggggggggggggggfeeb
bbeeffggggffgggggggggffee
eeefffgggggfffgggggggfffe
efffffggggggffffgggggfeee
efffeeeggggggggfgggggfebb
eeeeebeggggggggggggggfebb
eebbbbeegggggggggffffeebb
bbbbbbbegggggggggfffeebbb
bbbbbbbeegggggffeeefebbbb
bbbbbbbbeeffffeeebeeebbbb
bbbbbbbbbeeefeebbbbeebbbb
bbbbbbbbbbbeeebbbbbbbbbbb
wh WI_4-329 23 7 0/0 264/23 118/10
wh Uressce 0 12 264/23 0/0 238/21
wh Pass_UNI-08 20 17 118/10 238/21 0/0
beacon Miola 12 9

sector WI_4-329:16,21
bbbbbbbbbbeeebbb
beeeebeebeefeebb
beffeeeebeeffeeb
beeffffeebeffeeb
bbefffffeeefeebb
bbeeeeeffffeebbb
bbbebbeefggebbbb
beeeebbefggeebbb
beefebbeeffoeeeb
bbefeeeeefffofee
eeefebbbeeofoofe
eeeeebbbbeffooee
eebeebbbeefffoeb
eeeeebbbeffoofeb
eeefeebbeeffoeeb
eeeeeebbbeeffebb
eeeebbbbbbeffeeb
bbbbbbbbbbefffee
bbbbbbbbbbeefffe
bbbbbbbbbbbeeeee
bbbbbbbbbbbbeebb
wh Veliace 12 1 0/0 127/10 144/13 255/16
wh Lagreen 2 2 118/10 0/0 140/14 212/14
wh Pass_UNI-08 8 14 144/13 149/14 0/0 248/14
wh Miola 0 16 255/16 221/14 248/14 0/0

sector Pass_UNI-08:20,31
bbeeebbbbeeebbbbbbbb
beefeeebeefebbbbbeeb
eeeeeeeeefeebbbeeeeb
efebbeefffebbbeeffeb
eeeebbeeffeebeeffeeb
befeebbeggfeeeffoebb
beefebbeggffffoofeeb
beeeebbeeeeeffeeeeeb
eefebbbbeebeeeebbeeb
eefeebbeeebbeebbbbbb
beefebbeeeebbbbbbbbb
bbefebbbeeeebeeeeeeb
bbefebbbbeeeeefeefee
bbeeebbbbbeeeeeeeeee
beeebbbbbbbbbbbbbeee
eefeebbbbeebbeebbeee
eeffeebbbeeeeeeebbee
befffebbeeffeeeeeeee
beeffebbeffeebeeeeee
bbeeeebbeefebbbbeeee
bbbbeeebbeeeeeebbbbb
bbbbeeeebbeefoeeebbb
eeebbeeeebbeefooeebb
efebbbeeebbbefofeebb
efeebbeebeeeefofebbb
effebeeeeeeffffeebbb
effeeefeeeeffeeebbbb
effebeeebbeeeebbbbbb
eeeebbbbbbbebbbbbbbb
bbbbbbbbbbeeebbbbbbb
bbbbbbbbbbeeebbbbbbb
wh Miola 10 1 0/0 110/11 521/35
wh WI_4-329 17 2 119/11 0/0 586/37
wh Naos 11 30 530/35 586/37 0/0

sector Pass_EMP-10:25,25
bbeebbbbbbeeebbbbeeeeebbb
beeeebbbbbeeebbbbeeeeebbb
eeffeeebbbbebbbbbbbebbbbb
eeffffeeeeeeebbbbbeeebbbb
befeeeffffffebbbeeefeeebb
eefebeeeffeeebbeeffeefebb
effebbbeeeebbbbeeefeefebb
eefebbbbbbbbbbeeeefeeeeeb
beeeeeeeeeeeeeeffeeebefeb
bbefffeeeefffeeeeebbbefee
bbeeefebbeeeeeeebbbbeefee
bbbbeeebbbbeebbbbbbeeffeb
bbbbbeeebbbbbbbbbbeeffeeb
bbbbbeeebbbbbeeeeeeeeeebb
bbbbbeeebbbeeefffggebbbbb
beeeeeeebbeeffeeeggeebbbb
beeeeeebbbeeefebeeeeeeeee
bbebbebbbbbbeeeeeebeeeeee
bbebbebbeeebbeeffebeebbbb
beeeeeebeeebbbeefeebbbbbb
eeeeeeebbebbeebeefeebbbbb
eeebbbbbbebbeeebefeebbbbb
beeeeeebeeebefeeeeebbbbbb
beeeeeeeefeeefffeebbbbbbb
bbbbbeebeeebeeeeebbbbbbbb
wh Ceina 11 0 0/0 626/41 546/33
wh Pass_EMP-11 24 16 626/41 0/0 258/15
wh Anayed 9 23 537/33 249/15 0/0

sector Pass_EMP-11:15,22
bbbbbeeebbbbbbb
bbbbbeeebbbbbbb
bbbbbbebbbbbbbb
bbeeeeeeeebbbbb
beeffffffeeebbb
beeeeeeeeefebbb
beebbbebbeeebbb
beeebbebbbebbbb
beeebbebbeeebee
bbebbbebbefeeee
bbebbeeebeeebee
bbebbeeebbbbbee
beeebbeebeeebee
eefebbeeeefeeee
eeeebbeebeeebee
beebbeeebbebbbb
beeeeefebbebbbb
beebbeeebbebbbb
beeebeeeeeeebbb
beeebefffffeebb
bbeeeefeeefeebb
bbeeeeeebeeebbb
wh Sowace 6 0 0/0 362/20 371/20
wh Pass_EMP-10 2 20 362/20 0/0 145/10
wh Greliai 12 20 371/20 145/10 0/0

sector Zearla:17,16
bbbbbbbbeeebbbbbb
bbbbbbbbeeebbbbbb
bbbbbbbbbebbbbbbb
bbbeeebeeeeeeebbb
bbeefeeefffffeeeb
beefffffffffgggeb
beffffffeeefgggee
eefffffeebefgggge
effffffebeefgggge
eefffffebeffgggge
befofffebeefgggge
beeooffebbefgggge
bbeeoofebbefgggee
bbbefofeeeefgggeb
bbbeeeeebbeeefeeb
bbbbbeebbbbbeeebb
wh YS_3-386 14 14 0/0 149/9
wh Ackarack 5 15 149/9 0/0
beacon Zearla 5 6

sector Greliai:16,20
bbbbbbbbbbbbbeeb
beeebeebbeebeeee
beeeeeebeeebefee
bbeeefeeefeeefeb
bbbbefggggeeeeeb
bbbeefggggebeebb
bbbeffggggeeeeeb
beeeggggggffffeb
eeffggggggffffeb
eefffggffffffeeb
beeffffffffeeebb
bbeeeffffffebbbb
bbbbeeeffffeebbb
bbbbbbeeffffebbb
bbbbbbbeffffeeeb
bbbbbbeeeeeeeeeb
bbbbbeefeeebbeee
bbbbbefeeeebeefe
bbbbbefebbbbeeee
bbbbbeeebbbbeebb
wh Pass_EMP-08 14 1 0/0 189/12 215/17 224/17
wh Pass_EMP-11 2 2 189/12 0/0 201/16 215/16
wh Tiurio#West 6 18 206/17 192/16 0/0 127/10
wh Tiurio#East 13 18 224/17 215/16 136/10 0/0
beacon Greliai 8 10

sector Pass_EMP-08:25,21
bbbbbbeebbeebbbbbbbbbbbbb
bbbbeeeeeeeeebbbeeebbbbbb
bbbeeeeeeeffeebeefeebbbbb
eeeefeeebeeefebeeeeeebbbb
eeefeeeebbbeeebeebeeeebbb
eeeeebbbbbbbeeeeebbefebbb
bbbbbbbbbbbbeeeeebbefebbb
bbbbbbbbbbbbbbbbbbeefebee
bbbbeeeebbbeeebbbbeffeeee
bbeeeffeeeeefebbbbeffebee
beefffffeeefeebbbeeffebbb
beffeeeeebeeebbbbefeeebbb
beffebbeebbeebbbbefeeeebb
eefeebbeebeeebbbbeffffeeb
effebbeeeeeeebbbbeefffeeb
efeebbeeeeeebbbbbbeeeeebb
eeebbbeebeebeeeeebbeeeebb
bebbbbeeeeeeeeeeeeeeeeebb
eeebbbeffeeefeeeffffebbbb
eeeeeeefeebeeeeeeeffeebbb
beebbbeeebbeebbbbeeeeebbb
wh Greliai 0 4 0/0 402/24 751/49
wh Lianla 24 8 402/24 0/0 461/29
wh DP_2-354 1 15 742/49 452/29 0/0

sector Beeday:16,15
bbbbbeeeeeeeebbb
bbbbeeofoofoeeeb
bbbeeffoooofffee
bbbeeeeefooooffe
bbbbebbeffofofee
bbbeeebeeeeeeeeb
eebefebbebbbbebb
eeeefeebebbbbebb
eebeffeeeeebbebb
bbbeffffffeeeeeb
bbbeeffffffgggee
bbbbeefffffgggfe
bbbbbeeffffggeee
bbbbbbeeeefffebb
bbbbbbbbbeeeeebb
wh Ackarack 15 3 0/0 183/11
wh Watibe 13 14 183/11 0/0
beacon Beeday 8 11

sector Ackarack:14,20
bbbbbbbbbbeebb
bbbbbbbbbeeeeb
bbbbbbbbbeeeeb
bbbbbbbbbbbebb
beebbbbbbbbebb
eeeebbbbbbbebb
effeebbbbbbebb
eeffebbbbeeeeb
beffeeeeeeffeb
eeffebbbbemmee
efffeebbbemmfe
effofeebbeffee
effoooebbeeeeb
eeffofebbbeebb
beeffoeebbbbbb
bbefeeeebbbbbb
bbefebeeebbbbb
bbeeeeeeebbbbb
bbbeffeebbbbbb
bbbeeeebbbbbbb
wh Zearla 10 0 0/0 304/16 355/22
wh Beeday 1 4 304/16 0/0 167/14
wh Watibe 3 18 355/22 167/14 0/0

sector YS_3-386:14,20
eebbbbbbbbbbbb
eeeeebeeebbbbb
eeffeeefeebbbb
beeffffffeebbb
bbeffffeeeeebb
beeffffebefeee
eefffffeeeeeee
eefffffffeebbb
beeffffeeebbbb
bbefeeeebbeebb
eeeeebebeeeeeb
eeeebeeeeeeeee
beebbefeeebeee
bbbbbeeebbbeeb
bbbbbbeeebeeeb
bbbbbeefeeeeeb
bbeeeeeeebeebb
eeeeeeeeebeebb
eeeebeeeeeeebb
eebbbbbeebeebb
wh Zearla 0 0 0/0 175/13 137/11
wh Ayinti 13 5 175/13 0/0 165/12
wh Watibe 1 11 137/11 165/12 0/0

sector Ayinti:20,20
bbbbbbbbbbbbeeebbbbb
bbbeebbbbeeeefeeeebb
bbeeebbbeeffffeeeeeb
beefeeeeeffffeebefeb
beffffffffgggebeefeb
eeffgggggggggeeefeeb
eeefgggggggggeefeebb
bbefggggggggfeeeebbb
eeefggggggggeeeebbbb
eeffggggggggeeebbbbb
befffggggfffffebbbbb
befgggffffffffeebbbb
befgggfffffffffeebbb
befgggfffffffffeebbb
beefffffffeeeeeebbbb
bbefofffffebbeebbbbb
bbeooooffeebbeebbbbb
bbeefoooeebbeeeebbee
bbbeefeeebbbeffeeeee
bbbbeeebbbbbeeeebbee
wh Anayed 17 2 0/0 210/16
wh YS_3-386 1 8 210/16 0/0
beacon Ayinti 10 11

sector Anayed:15,16
bbbbbbbbbeebbee
beeebbbeeeeeeee
beeebeeeffofoee
bbebbeffoooofeb
beeeeeooooofoee
befffffofofoeee
eeffffffoeeeebb
effffffffebbbbb
eefffffffebbbbb
beeefffffeebbbb
bbbeffffffeebbb
beeeeeeffffebbb
beffebeefffeebb
beefeebeffffeeb
bbeeeebeefeeeeb
bbbbbbbbeeebbbb
wh Pass_EMP-10 2 1 0/0 95/5 184/13
wh Ayinti 0 6 95/5 0/0 148/13
wh RX_3-129 13 14 184/13 148/13 0/0
beacon Anayed_Base 5 10

sector Tiurio:25,14
eebbbbbbbbbbbbbbbbbeebbbb
eeeebbbbeebeeeebbbbeebbbb
eefeeeeeeeeefeebbeeeeeebb
beeeeefffebeeebbbeefffebb
bbbbbefffebbbbbeebeffeebb
bbeebefffebbeeeeeeeffebbb
beeeeefffeeeeggggfffeebbb
eefffffffebbeggggffeebbbb
eeeffffffebbeggggfeebeeee
bbeoffoffeeeefggfeebeefee
beeffooofeeeeffffebeeffeb
beffeeofeebbeffffeeeffeeb
eeeeeefeebbbeeeeeebeeeebb
eeebbeeebbbbbeebbbbbeebbb
wh Greliai#West 0 0 0/0 336/20 319/22 194/14
wh Greliai#East 19 0 336/20 0/0 165/12 309/20
wh Fawaol 22 12 319/22 165/12 0/0 292/22
wh RX_3-129 0 13 194/14 309/20 292/22 0/0

sector DP_2-354:16,14
bbbbbeeeeeebeebb
bbbeeeffffeeeeeb
bbeeeeeeeeeeefee
beefebbbebebeefe
beeeebbeeeeebeee
eeebbbeeoofeeeeb
efebbeefooofofeb
efebeeeeeofeeeee
efeeeeebeeeebefe
eeebeebbbebbeefe
bebbeebeeeeeeffe
eeeeeeeeffffffee
efffeeeeeeeeeeeb
eeeeebeebbbbbbbb
wh Pass_EMP-08 14 1 0/0 225/13
wh Fawaol 1 12 216/13 0/0

sector Watibe:21,15
bbbbbeeeebbbbbbbbbbbb
bbbbeefeebbeeebbbbbbb
beebeefebbeefeeeeebbb
beeebefeeeeffffffeebb
befeeefgggggfffffeebb
beeffffggggggffeeebbb
bbeffffggggggffebbeeb
beeffffffggggffeeeeeb
eefffeeefffffgggggfeb
effeeebeeffffgggggeeb
eeeebbbbeffffgggggebb
beebbbbeeffffffgggeeb
eeeebbbeeffffeeefeeee
eeeebbbbeeffeebeeeefe
bbbbbbbbbeeeebbbeeeee
wh YS_3-386 12 1 0/0 162/12 119/11 168/13
wh Beeday 1 2 162/12 0/0 137/11 236/19
wh CC_3-771 8 12 119/11 137/11 0/0 148/12
wh Oldain 20 14 168/13 236/19 148/12 0/0
beacon Watibe 16 5

sector RX_3-129:13,12
bbbbbbbbbbeeb
eeebbbbbbeeeb
eeeebbbbbefee
befeeeeeeefee
eefgggggggfeb
effgggggggfee
eefgggggggfee
beffeeeeeffeb
beffebebeffeb
eeffeeeeefeeb
eeeefffffeebb
eebeeeeeeebbb
wh Tiurio 11 0 0/0 174/10 179/11
wh Anayed 1 1 174/10 0/0 127/10
wh Edvea 0 11 179/11 127/10 0/0

sector Fawaol:22,25
bbbbbbbbbbbbeebbbbbbbb
bbbeeebbeeeeeeeebbbbbb
bbeeeebeeffffffeeebbbb
beefebeefffffffooeebbb
beefeeeffffffoooofebbb
bbeffffgggffffofooebbb
bbefoffggggggggfofebbb
bbeofffgggggggggfoebbb
bbeeefffggggggggffebbb
bbbbeeefffggggggfeebbb
bbbbbbeefffggggfeebbbb
bbbbbbbefffgggffebbbbb
bbbbbbbefffgggffebbbbb
beebbbeeffffffffebbbbb
eeeeeeefffffffffebbbbb
eeebbbeeffffffffeebbbb
bebbbbbefffffffffebbbb
eeebbbbeeeeeeffffeebbb
eeebbbbbebbbeeffeeebbb
bebbbbbbebbbbeefeeebbb
eeebbbbbebbbbbeeefeebb
eeebbbbeeeebbbbbefeebe
eeeeeeeeffeeeeeeefebbb
eebbbbbeeeebbbbbeeeebb
eebbbbbbbeebbbbbbeeebb
wh DP_2-354 13 0 0/0 126/9 267/23
wh Tiurio 4 1 126/9 0/0 247/22
wh Iowagre 18 23 267/23 247/22 0/0
beacon Fawaol 12 14

sector CC_3-771:20,10
bbbbbeeeebbbbbbbbbbb
bbeeeeffeebbeeebeeeb
eeeffffffeebefeeefee
eeggfeeeffeeefffffee
beggfebeefebefffeeeb
beeefeebeeeeeeeeebbb
bbbeeeebbefffebebbbb
bbbbbebbbeeffeeeebbb
bbbbeeebbbeeeeeeeeee
bbbbeeebbbbeebbeeeee
wh Watibe 18 2 0/0 143/8
wh Oldain 19 9 143/8 0/0

sector Oldain:18,18
bbbbbbbbbeebbbbbbb
bbbbbeeeeeeeeebbbb
bbbeeegggggggeebbb
eeeefggggggggeebbb
eefffggggggggebbbb
beeffggggggggeeeeb
bbefffgggggggfffee
bbeffffffffffooeee
beefffffeeeeoofebb
befffffeebbefeeebb
beefffeebbeeeebbbb
bbeffeebbeefebbbbb
bbeffebbeeffebbbbb
bbeefeeeefffeeeebb
bbbefffffffffffeeb
bbeeeeffeeeeffffeb
eeeeeeeeebbefeeeeb
eeeebbbbbbbeeebbbb
wh Watibe 1 3 0/0 176/14 206/17
wh CC_3-771 0 16 176/14 0/0 176/14
wh Miackio 14 16 206/17 176/14 0/0
beacon Oldain 5 8

sector Edvea:32,24
bbbbbeeebbbbbbbbbbbbbbbbbbbbbbbb
bbbbeefeeeeeebbbbbbeeebbeeeeebbb
bbbbefffoffoeeeeebeeeebbeeffeebb
bbbbeefffoooofofeeeeebeebeeeeebb
bbbbbeeeoffooofofffebeeeebeebbbb
bbbbbbbeeeffofofeeeeeeffeeeeebbb
bbbbbbbbbeeofofeebefffffffffebbb
bbbbbbbbbbeeeefebeefffffggggeeeb
bbeebeebbbeebefebeffffffggggggeb
beeeeeeebbeeeefebeffffffggggggeb
befffffeeeeffffebeffffffggggggee
befffgggffffffeebeffffffggggggee
beeffggggggggfebeefffffffgggggeb
bbeefggggggggfeeefffffffffgggeeb
bbbeffgggggggfebeffffffeeefeeebb
bbbeeefggggggfeeeffofffebeeebbbb
bbbbbeffffffffffeeefoffeebeeebbb
bbbbbeeeefeeeffeebeoooffeeefeeeb
bbbbbbeeeeebeeeebbeooooeeeefffeb
bbeebeefeebbbbbbbbefoooebbeeeeeb
beeebeffebbbbbbbbbeefofeebbbeebb
eefeeefeebbbbbbbbbbeeeofeeeebbbb
efeeeeeebbbbbbbbbbbbbeeeeeeebbbb
eeebbbbbbbbbbbbbbbbbbbbbbbbbbbbb
wh RX_3-129 28 1 0/0 234/18 369/27
wh Belati 28 19 234/18 0/0 351/27
wh Miackio 1 22 360/27 342/27 0/0
beacon Edvea 21 9

sector Iowagre:18,12
eeeebbbbeeeebbbbbb
eeeebbbeeofeeeebbb
bbebbbbeefooooeeeb
bbebbbbbeofoffffee
bbebbeeeeffffffffe
bbebbeefffffffffee
beeebbeeffffffffeb
eefeeebeefffffffee
effffeebeffeeeeeee
eeeeffeeefeebbbbee
bbbeeeeefeebbbbbbb
bbbbeebeeebbbbbbbb
wh Fawaol 5 4 0/0 147/1 106/7
wh Hource 17 7 147/12 0/0 196/16
wh Quaphi 1 8 97/7 187/16 0/0
beacon Iowagre 11 6

sector Hource:19,16
bbbbbbbbbbbbbeeebbb
bbbbbbbbbbeeeefeebb
bbbbbbbbbeefofofeeb
bbbbbbbbeefofoooeeb
bbbbbbbeefffffooebb
eeebeeeeffeeefffeee
efeeefffeeebeffeeee
effffffeebbeeffebee
eeeeeeeebbbefffeebb
bbbeebbbeeeeffffebb
bbbbbbbeeggggggfeeb
bbbeebbefgggggggfeb
bbeeeeeefgggggggeeb
bbefebbeeeffffeeebb
bbeeebbbbeeffeebbbb
bbeebbbbbbeeeebbbbb
wh Iowagre 0 6 0/0 207/18
wh Pass_EMP-09 18 6 207/18 0/0
beacon Hource_Station 12 7

sector Pass_EMP-09:25,25
bbbbbbbbbbeeebbbeebeebbbb
beeeeeebbbeeebbeeeeeeeebb
eeeeffeebbbebbbeeffeeeeeb
eeeefffeeeeeebbbeeeebefeb
befeeeeffffeebbeeebbbefee
eefebbeeffeebbbefeebeeeee
eefeebbeeeebbbeefeebeeebb
beefeebbbbbbbeeeeebbbeeee
bbeffeebbbbeeefebbbbeefee
bbeeffeeeeeefffeebbeeeeeb
bbbeeeffeeeeeeefebbefebbb
bbbbbeeeeeebebeeeebeeebee
bbbbbbbeeeeeeebefebbeeeee
eebeeebbbefffeeefeebeebee
eeeefeebbeefggeeeeebbbbbb
eebeffeebbeeggebbeeeeebbb
bbbeeeeefbbefeebeebeeeeeb
bbbbeeeffbeefebbeeeeeeeee
bbbeefeebbeffebbbbbbbbefe
beeeeeebbeefeebbeeeebeefe
beefebbbeeeeebbeeffeeeeee
bbefeeeeeeebbbbeeeeeffebb
bbeeefffeebbbbbbebbeeeebb
bbbbeefeebbbbbbeeebbeebbb
bbbbbeeebbbbbbbeeebbbbbbb
wh XC_3-261 11 0 0/0 566/39
wh Hource 0 14 566/39 0/0

sector Miackio:25,16
eeebbbbbbbbbbbbbbbbbbbeeb
eeeeeeeeeeeeeeeeeeeeeeeeb
beeeeeeeeeeeeeeeeeeeeeeee
eeebbbbbbbbbbbbbbbbbbbefe
efeeeeeeeeebeeeeebbbbeefe
efffffffffeeeffeebbeeeffe
eeffffffffffffeebbbeffffe
beffffffffggfeebbbeeffffe
befffgggggggeebbeeeffffee
beffggggggggebbeeffffffeb
beefggggggggebeefffffffeb
bbefggggggggeeefffffffeeb
bbeefggggggffffffffffeebb
bbbeefffffffffeeefeeeebbb
bbbbeeeeeeeeeeebeeebbbbbb
bbbbbbbbbbbeeeebbbbbbbbbb
wh Oldain 2 2 0/0 296/24
wh Edvea 21 2 296/24 0/0
beacon Miackio_I 7 6
beacon Miackio_II 19 10

sector Belati:25,16
bbbbbbbbeebbbbbbbbbbbbbbb
bbeeebeeeebbbbbeebbbbbbbb
beefeeeffeeeeeeeebbbbbbbb
befeefffeeeeeeeeebbbbbbbb
befeefffebbbbbbebbbbbbbbb
eefffeefeeebbbbebeebbbbbb
eeeeeeefffeeebbebeeeeebbb
bebbeeffffffeebebefofeebb
eeebbeeffffffeeeeeffofeee
efebbbeeeffgggggffooooofe
eeebbbbbeffgggggfffoooffe
bbbbbbbeeffgggggffoffofee
bbbbbbeefffgggggfffffffeb
bbbbbbeefffgggggfffffffee
bbbbbbbeefffffffeeeeeeeee
bbbbbbbbeeeeeeeeebbbbeebb
wh Edvea 2 2 0/0 221/14 262/22
wh ZS_3-798#North 16 2 221/14 0/0 212/14
wh ZS_3-798#South 24 14 262/22 212/14 0/0
beacon Belati 8 10

sector ZS_3-798:13,20
bbbbeeebbbbbb
bbbeefeeebbbb
beeeffffeebbb
eeffeeeefeebb
eefeebbeefeeb
befebeebeffeb
beeebeebeffee
bbeeebbeefffe
bbefeeeeffeee
bbefeeeefeebb
beeffffffebbb
beggfeeeeebbb
eeggfebeebbbb
efeeeeebbbbbb
efebeeebeebee
efeebeeeeeeee
eefeeeffeeeee
beeeeeeeebbee
bbbbeebeeeeee
bbbbeebeeeeee
wh Belati#North 2 2 0/0 118/10 177/14
wh Quaphi 12 6 118/10 0/0 153/13
wh Belati#South 1 16 177/14 153/13 0/0

sector Quaphi:17,14
bbbbbbbbbbeeeebbb
beeebbbbbeeffeebb
beeebbbbbeefffeeb
bbebbbbbbbeffggeb
bbebbbbbbbeffggee
beeebbbbbeefffffe
eefeeebbbefffffee
effffeebeefffffeb
efffffeeeffffffee
efofofffffffffffe
eoooeeeeeeefffffe
eefeebbebbeefffee
beeebbeeebbeefeeb
bbbbbbeeebbbeeebb
wh Iowagre 14 1 0/0 169/16
wh ZS_3-798 0 6 169/16 0/0
beacon Quaphi 13 9

sector Nex_0005:25,25
bbbbbbbbbbbbbbbeeeeeebbbb
bbbbbbbbbeeeeeeeffffebbbb
bbbbbbbbbegggggeeeeeebbbb
beeeeeeeeegggggeeeeeeebbb
beeeeeeeeeggfggeeeeefebbb
eeeeeeeeeegggggeeeeefeebb
efeeeeeeeegggggeeeeeeeeeb
eeeeeeeeeeeeeeeeeeeeeefeb
beeeeeebbbbeeeebbbeeeefeb
eeffeeeeebbbbbbbeeefffeeb
eefeeeffeeebbbbbefffffebb
beeebeeeefeebbbeeffffeebb
beeeebbeeffebbbeeeeeeebbb
beffebbeffeebbbeebeebbbbb
beefeebeffebbbbeebeebbbbb
bbeefeeeffeeeeeeeeeeeebbb
bbbeefffffeebbeefeeefeeeb
bbbbefffofoebbeffeeefffee
bbbbeefffooeeeeffeeeffeee
bbbbeefooooeeeffffeeeeeeb
bbbeeeeffofebefffeebbefee
bbeefeeeeefebefeeebbeefee
bbeffeeebeeeeefebbbbeeeeb
beefeebbbbbeeffebbbbbbbbb
beeeebbbbbbbeeeebbbbbbbbb
wh Canolin#East 20 21 0/0 299/20 299/19
wh Canolin#West 2 24 299/20 0/0 302/22
xh 12 4 290/19 293/22 0/0
beacon Hidden_Laboratory_Nex_0005 1 3

sector Quexho:17,14
bbbbbbbeebbbeeebb
bbbbbbeeeebbeeebb
bbbbeeeffeebbebbb
eeebeffmmfeeeeebb
bebbeeemmeefffebb
bebbeeeffeefffebb
eeeeefeeeeffffeeb
eefeefebbeeffggee
befeeeebbbeefggfe
eefffebbbbbefggfe
eefffebeeebefggee
beffeebefeeefffeb
beeeebbefebeeffee
bbeebbbeeebbeeeee
wh Tivea 2 12 0/0 214/15 232/16
wh Canolin 16 12 214/15 0/0 125/8
wh Veedfa 8 13 232/16 125/8 0/0

sector Canolin:16,15
bbbeeebbbbbbbbbb
bbeefeebbeeeeeeb
beefffebeeffffeb
beffffebefffffee
eeffffeeeffffffe
effffeebefffffee
eefffebbefffffeb
beffeebeeffffeeb
eefeebbefgggfebb
effebbeeggggeebb
efeebbefggggebbb
eeebbeefggggeebb
eebbbeffggggeebb
bbbbeeffeeeeebbb
bbbbeeeeebbbbbbb
wh Nex_0005#West 2 1 0/0 156/12 109/10 200/15
wh Nex_0005#East 14 1 156/12 0/0 195/15 153/13
wh Quexho 1 11 109/10 195/15 0/0 239/18
wh Phiandgre 4 14 200/15 153/13 239/18 0/0
beacon Canolin 11 5

sector FR_3-328:12,20
bbbbeeebbbbb
bbbbeeebeeeb
bbbbbebbefee
bbeeeeeeeeee
bbeffffffeee
beeffeeefffe
eegggeeeeeee
eggggeeeebbb
egggggffeeeb
egggggggffee
eggggggggffe
eeffggggggfe
beeeggggggfe
bbbeggggggfe
eeeeggggggfe
eeffggggggfe
beffggggggfe
eeffffffffee
effeeeeeeeeb
eeeebbbbbbbb
wh Pass_FED-08 5 1 0/0 97/7 236/17
wh Liaackti 11 6 97/7 0/0 192/14
wh Beurso 1 18 227/17 183/14 0/0

sector Liaackti:20,23
bbbeeeeeebbbbeeeeebb
bbeeffofeebbeefffeeb
beeffffoeebbefffffee
beeffffeebbeefffggee
bbeeeeeebbeeffffggeb
bbbeebbbbbeeeeeeeeeb
bbeeeeeeebbbeebbeebb
bbeeeeffeeebeebbbbbb
bbbbbeeeffeeeeeebbbb
bbbbbbbefffofffeeeeb
beeebeeeffoofffoofeb
eefeeefofoooofeeeeee
effebeefofofofebbeee
effebbeffffoffeeebee
effebeefeeefffffeebb
eeeebeeeebeeeeeefeeb
bbeebeebbbbeebbefeeb
bbbbbbbbeeeeeebeeebb
bbbbbbbbeeeefebbbbbb
bbbbbbbbbebeeebbbbbb
bbbbbeebbeeeebbbbbbb
bbbbbeeeeeeeebbbbbbb
bbbbbeebbebeeeebbbbb
wh FR_3-328 5 16 0/0 157/13 248/14
wh Andsoled 18 16 157/13 0/0 239/14
wh Enwaand 5 22 248/14 239/14 0/0

sector Andsoled:18,25
beeeebbbbeeeebbbbb
beeeebbbeeffeebbbb
bbbebbbbeffffeebbb
bbeeeebbeefffeebbb
beeffeebbefffeebbb
beggggeeeeffggeebb
eeggggggggfggggeeb
eeggggggggfgggggeb
eeggggggggfgggggee
eggggggggfggggggee
eggggggggfgggggeeb
egggggggfggggggebb
egggggfffggggggeee
eggggeeefggggffffe
eefffebefffeeeeeee
beffebbeeeeebeebbb
befeebbbebbbbbbbbb
beeebbbeeeeebbbbbb
bbbbbbeefeeeeebbbb
bbbbbeeffeeffeebbb
bbbeeeffffffeeebbb
bbbefffeeeffebbbbb
bbbeeffebefeebbbbb
bbbbeeeebeeebbbbbb
bbbbbeebbbbbbbbbbb
wh Tivea#North 17 13 0/0 188/16 214/15 206/16
wh Liaackti 1 17 188/16 0/0 221/14 213/15
wh Tivea#South 14 20 214/15 221/14 0/0 128/11
wh Enwaand 3 22 206/16 213/15 128/11 0/0
beacon Andsoled 11 2

sector Tivea:25,20
bbbbbbeeeeeeebbbbbbbbbbbb
bbbbeeegggffeeeebbbbbeebb
bbeeeggggggffffebbbbeeeeb
beeffgggggggggfeeeeeeffeb
eefffgggggggggfffeeffffeb
eefffgggggggggffffffffeeb
beffffggggggggffffffffebb
beeffffgggggfeeeeffffeebb
bbeeffffgggfeebbeeeeeebbb
bbbeeeeeefffebbbbbbbbbbbb
bbbbbeebeefeebbbbbbbbbbbb
bbbbbbbbbefebbbeebeeeeebb
bbbbbbbbbefeebeeeeefffeeb
bbbbbbbbeeffeeeffffffffee
bbbbbeeeeffffffffffoofffe
bbeeeeffffffeeeffooooffee
beefeeffffffebefoooooeeeb
beefeeffeeeeeeeffooffebbb
bbeeffeeebbeeeffoofoeebbb
bbbeeeebbbbbbeeeeeeeebbbb
wh Quexho 22 1 0/0 247/21 312/28 291/25
wh Andsoled#North 1 5 247/21 0/0 254/24 233/21
wh Veedfa 23 12 312/28 254/24 0/0 238/22
wh Andsoled#South 1 17 291/25 233/21 238/22 0/0
beacon Tivea 10 11

sector Veedfa:14,15
bbbbbbbbeebbbb
bbbbbbbeeeebbb
bbbbbbbeeeebbb
bbbbbbbbeebbbb
bbeeeebbeebbbb
beeefeeeeeebbb
beefffffffeebb
beffffffeeeeeb
beeeeeefebefee
bbeebbeeeeefee
bbbbbbbeeeeeeb
bbbeeebbeebbbb
eebefeeeeeebee
eeeeeeeeeeeeee
eeeeebeebeebee
wh Quexho 9 0 0/0 164/11 171/9
wh Tivea 1 6 164/11 0/0 147/12
wh Ladaen 13 9 171/9 147/12 0/0

sector Phiandgre:24,20
bbbbbbbeeeeeebbbbbbbbbbb
bbbbbbbeffffebbbeeeeebbb
bbbbbbbeeeffebeeeoooeebb
bbeebbbbbeeeebefoooooeeb
beeeeebbbbbebbefffooffeb
eefffeeebbbebbeffofoffeb
eefffffeebbebeefffffffee 
beefgggfeeeeeefffffffffe
bbefgggffeeeeeffffffffee
bbefgggffebbbeefffffeeeb
bbefgggffeebbbeeeeeeebbb
bbefffffffeebbbbbbebbbbb 
beeffffffffebeebbbebbbbb 
befffffffffeeeeeeeeebbbb
beefffffffgggggggggeebbb
bbeeeeefffgggggggggfeebb
bbbebbeeefgggggggggffebb
eeeeebbbeefffffggggeeebb
efffeebbbeffeeefffeebbbb
eeeeeebbbeeeebeeeeebbbbb
wh Canolin 2 3 0/0 243/20
wh Ladaen 20 17 243/20 0/0
beacon Phiandgre 6 12

sector Beurso:19,25
bbbeeeeebbbbeeebbbb
bbbefffeebbeefeebbb
bbbeffffeeeefeeebbb
bbeeffffffeeeebbbbb
bbeeffffffeeebbbbbb
bbbeeeefffffebbbbbb
eebeeeefffffeebbbbb
eeeeeeeffffffeebbbb
eebefeefffffooebbbb
bbbefeefffooofebeee
bbbeeffffffooeebeee
bbbbeeeffffoeebbbee
bbbbbbeefgggebbbbee
bbeeebbefgggeebbeee
eeefeeeefggggeebeee
effffeeefgggggebbeb
eefffebeefggggeeeee
beeeeebbefggggfffee
bbbbbbbeefggggfeeeb
bbbbbbeefffffeeebbb
eeebbbeeeeeeeebbbbb
efeeebbbeebbebbbbbb
effoeeeeeebeeebbbbb
eefffffffebeeebbbbb
beeeeeeeeebbbbbbbbb
wh FR_3-328 14 1 0/0 184/13 349/23
wh Pass_FED-11 1 7 184/13 0/0 316/21
wh Stein 17 10 349/23 316/21 0/0
beacon Beurso 8 4

sector Stein:16,16
bbbbbbeebbeeeebb
beeeeeeeebeefeeb
eeffffffebbeefee
eeffffffeebbeffe
befffffffeeeegge
beeeffffffeeegge
bbbeffffffebefee
bbbefffffeebeeeb
bbbeofffeebbbbbb
beeeooffebbbbbbb
befoofffeebbbbbb
beeofffffeebbbbb
bbefeeffffebeeeb
beefeeeeefebefeb
beeefeebeeeeefeb
bbbeeebbbeebeeeb
wh Enwaand 8 9 0/0 88/7
wh Daaze 1 14 88/7 0/0
beacon Stein 6 4

sector Enwaand:20,22
eeeeebbbeeebbbeeeeee
egggebbeefeebeegggge
egggeeeegggebeggggge
egggeeefgggeeeggggge
eeeeebeegggeeeggggee
bbebbbbeefeebeeeeeeb
beeebeebefebbbeebbbb
befebeeeefeebbeeeebb
eefeeeffgggebeeefeeb
effebeffgggeeeggffee
effebeefggggggggggfe
effebbeffgggggggggfe
eofeebeeegggggggggee
eefeebbbeggggggggfeb
beeebbeeefggggggfeeb
bbbbbbeeffgggggfeebb
bbbbbbbefffgggfeebbb
beeeeebeffffffeebbbb
eefffeeefffeeeebbbbb
eeeeeebeeeeebebbbbbb
bbbbbbbbbbbbeeebbbbb
bbbbbbbbbbbbeeebbbbb
wh Liaackti 9 0 0/0 169/11 159/13
wh Andsoled 19 10 169/11 0/0 144/12
wh Stein 8 13 159/13 144/12 0/0

sector Ladaen:20,23
bbbbbbbbbeeeebbbeebb
bbbbbbbbbeefebbeeeeb
beeeeeebbbefeeeeffee
beffffeebbeeebbefffe
eefffffeebbbbbbefffe
eeffffffeebbbeeefeee
befffffffebbbeeefebb
eefffffffeebbeeefebb
efffffgggfebeeeeeeeb
efffggggggeeefebefeb
eeffggggggebeeeeefee
beefggggggebbefffffe
bbeffggeeeebbeeffffe
bbeffggeebbbbbeeeffe
beeffggebbeeebeeefee
eeoffggeebefeeefffeb
eooofffoebeeebeefeeb
eoofffooebbbbbbeeebb
effffffoeebbbbbbbbbb
eeoffffffeebbeeeeebb
beeffffeeeeebefffeeb
bbeeeefebeeeeeffffeb
bbbbbeeebbeeeeeeeeeb
wh Veedfa 1 2 0/0 243/18 225/18 209/20
wh Phiandgre 19 2 243/18 0/0 138/12 306/21
wh PP_5-713_East 19 14 225/18 138/12 0/0 288/21
wh PP_5-713_West 7 22 209/20 306/21 288/21 0/0
beacon Ladaen 5 6

sector Daaze:17,15
bbeeeebbbbbbbbbbb
bbeffebeeeeeebbbb
beeffeeeffffeebbb
beffeebefgggfebbb
beeeebbefggggeeeb
bbeebbeegggggggee
bbbbbeefgggggggge
eebeeeffgggggggge
eeeeffffeeeggggge
eebefffeebeggggge
bbbefffebeeggggge
bbbeefeebeffffffe
bbbbeeebeefffffee
bbbbbbbeeffffffeb
bbbbbbbeeeeeeeeeb
wh Stein 13 2 0/0 162/12
wh Pass_FED-12 1 8 162/12 0/0
beacon Daaze 12 12

sector PP_5-713_East:15,13
bbbbbbbbbbbbbbb
bbbbbbbbbeeeebb
bbbbbbbbeefeebb
bbbbbbbbeffebbb
bbbbbbbbeffebee
bbbbbbbbeefeeee
bbbbbbbbbefebee
bbbbbbbbeefebbb
bbbbbbbbeffeeeb
bbbbbbeeefffeeb
bbbbbeeffggeebb
bbbbbeeffggebbb
bbbbbbeeeeeebbb
wh Ladaen 12 1 0/0 86/5 127/10
wh Pass_EMP-07 13 5 86/5 0/0 106/7
wh Oauress 6 11 127/10 106/7 0/0

sector PP_5-713_West:7,9
beeebbb
befeeeb
beeeeee
eeebeee
efebeee
efebeee
efeeeee
eefeeeb
beeebbb
wh Ladaen 2 0 0/0 97/7
wh Edqueth 0 7 97/7 0/0

sector Edqueth:17,10
beeeebbbbbbbbeeee
eeffebbbbbbbeeeee
effeebbbbbbbeeeee
eeeebbeebbbbbeeee
beebeeeeebeeebeee
bbbbefffebeeeeeee
bbbbeeffeeefeeeeb
bbbbbeeeeeeeeeeeb
bbbbbbeebeebeebbb
bbbbbbbbbbbbeebbb
wh PP_5-713_West 8 4 0/0 58/4
wh Ceina 6 8 58/4 0/0

sector Oauress:22,16
bbbbbeeebbbbeeeeeeeeeb
beebeefeeebeegggggggee
eeeeeffffeeeggggggggge
efffffggggggggggggggge
eeffffggggggggggggggge
beeeffggggggggggggggfe
bbbeeefffeeeegggggggee
bbbeeefffebbeefeeeffeb
bbbefffffeebbefebeeeeb
bbeeffffffeebeeeebbbbb
bbeffffffffeebefeeebbb
bbeeffffffeeeeefeeeebb
bbbeffffffeeffffeefebb
bbbeeeeffffeeeeeffeebb
bbbbbbeeeeeebbbeeeebbb
bbbbbbbbbbbbbbbbbeebbb
wh PP_5-713_East 2 1 0/0 197/17
wh Sowace 18 13 197/17 0/0
beacon Oauress 6 10

sector Ceina:16,15
bbbeeeebbbeebbbb
bbbeeeebbbeeeeeb
bbbbbeeebbeffoeb
bbbbeefebeefooee
bbbeeffeeeffffee
beeeffeebeefeeeb
eeffffebbbeeebbb
efffffeeebbebbbb
eeffffffeeeeebbb
beffffffeeeeeebb
beeffffeebbefeeb
bbeeeeeebbbeffee
bbeebbebbbbeeefe
bbbbbeeebbbbbeee
bbbbbeeebbbbbbbb
wh Edqueth 1 5 0/0 107/8 185/14
wh Pass_EMP-10 6 13 107/8 0/0 163/10
wh Sowace 15 13 185/14 163/10 0/0
beacon Ceina 4 8

sector Sowace:19,21
bbbbbeeeebbbbbbbbbb
bbbeeeofeebbbbbbbbb
beeefooffebbbeebbbb
beffffoffeebeeeebbb
beffffffffeeeffeebb
eeffffffeeebeeggeeb
efgggfffebbbbeggfeb
eegggfeeeeebeefffee
begggfeeeeebeeffffe
eeeeeeeeebbbbefffee
eeebeebbbbbeeeffeeb
bebbbbbbbbbefeeeebb
bebbbbbbeeeefebeeeb
eeeebeeeeffffeeefee
effeeeeeeefeeeffffe
eeffffeeeefebeeefee
beeeeeffffeebbbeeeb
bbeebeeeeeebbbbbbbb
bbbbbbbbebbbbbbbbbb
bbbbbbbeeebbbbbbbbb
bbbbbbbeeebbbbbbbbb
wh Oauress 17 5 0/0 177/15 176/14
wh Ceina 4 16 177/15 0/0 77/5
wh Pass_EMP-11 8 19 176/14 77/5 0/0

sector Enioar:21,13
bbbbbbbeeebbbbbbbbbbb
beeebbbeeebbbbbbeebbb
eefeebbbebbbbbeeeebbb
eeffeeeeeeeeeeeffeebb
beffffffffffffffeeebb
beefgggfffffffffebbbb
bbeegggfffffffffeebee
bbbegggeeeffffggfeeee
bbeeffeebefeeeggfebee
beeoofebbefebeeeeebbb
beeooeebbefeeeebbbbbb
bbeofebbbeeffeebbbbbb
bbeeeebbbbeeeebbbbbbb
wh Pass_FED-09 20 7 0/0 143/8
wh Liaface 12 12 143/8 0/0
beacon Enioar_Station 16 4

sector Pass_FED-09:23,17
bbbbeebbbbbbbbbbbbeebbb
bbbeeeeeeeeeebbbbeeeebb
bbeeeeeeeeefebbbeeffeeb
bbeeebbeebeeeebbeeffeeb
bbbeebbbbbbefebbbeefebb
bbbeebbbbbbeeebbbbeeebb
eebeebeeebbbeebbbeeebbb
eeeeeeefeebbeebbbeeebbb
eebeebeefebbeeeebbeebee
bbbbbbbeeebbeefeeeeeeee
bbbbbbbeeebbbeeeeeeebee
bbbbbbeeeebbbbbbbbeebbb
bbbbbeefebbbbbbeebeeebb
bbbbbefeebeeeeeeeeefeeb
bbbbbefebeeeefeeefeeeeb
bbbbbeeeeefeeeebeeebbbb
bbbbbbeeeeeeeebbbeebbbb
wh Enioar 0 7 0/0 467/26 372/21
wh Faexze 22 9 467/26 0/0 162/9
wh Pass_FED-10 18 16 372/21 162/9 0/0

sector Liaface:20,20
bbbbbbbbbeebbbbbbbbb
bbbbbbbbeeeebbbbbbbb
bbbbbbbeeffeeebbbbbb
bbeeeeeefffffeeebbbb
beefggggggfffffeebbb
befgggggggfggggfeebb
beggggggggfggggffebb
eegggggggffggggffeeb
eggggggffffffeeeffee
egggggfffffffebefffe
egggggfffffffebeeffe
eggggggfffffeebbeffe
eggggggfffffebbeeofe
eefggggffffeebeeoffe
befoofffffeebbefoffe
beooooffeeebbeeoffee
befoffffebbbbefofoeb
beeeeeefeeeeeefffeeb
bbeebbeeebbbbeeffebb
bbbbbbbbbbbbbbeeeebb
wh Enioar 10 0 0/0 217/19 218/19
wh Inioen#West 2 18 217/19 0/0 212/14
wh Inioen#East 16 19 218/19 212/14 0/0
beacon Liaface 8 9

sector Inioen:13,14
bbbbbeeeebeee
eebbeefoeeeee
eebeefoofffeb
eebeeooooffee
eebbefofofffe
eeebeofffffee
eeeeeffffffeb
beefffffffeeb
bbefffffffebb
bbefffffffeeb
bbefffffffeeb
bbeefffffeebb
bbbeeefeeebbb
bbbbbeeebbbbb
wh Liaface#East 12 0 0/0 213/15 138/12
wh Liaface#West 0 1 213/15 0/0 164/11
wh VM_3-326 3 12 138/12 164/11 0/0
beacon Inioen 6 8

sector VM_3-326:25,10
bbbbbbbbbbbbbbbbbbbbbbeeb
bbbbeeeeeeebbbbeebbeeeeeb
bbbeegggggeebbeeebeeeeeee
bbbefgggggfebeefeeeeebeee
eebefgggggfeeeffebeebbbee
eeeefgggggffeeefebeebeeee
eebefgggggffebefeeeeeeeee
bbbeffffffffebeeebeefeebb
bbeeeeeefffeebbeebbeeebbb
bbeeebbeeeeebbbbbbbbbbbbb
wh Inioen 11 2 0/0 79/7
wh Wamien 11 9 79/7 0/0

sector Wamien:25,15
bbbbbeebbbbbbbbbbbbbbbbbb
bbeeeeeebbbbbbbeeeeebbbbb
beefeeeeeeeebeeefffeebbbb
eefeebefgggeeeffffffeebbb
eefebeefggggfffffffffebee
beeeeeffgggggggffffffeeee
bbeeffffgggggggffffffebee
bbbeeefffgggggggfffffebbb
bbbbbeeeefggggggfffffeebb
beeeeeebeffffgggffffofeeb
eeffffeeeffffffffffooofeb
efffffffeeefeeefeeeooooeb
eefffffeebeeebefebefofeeb
beefffeebbbeebeeebeefoebb
bbeeeeebbbbbbbbeebbeeeebb
wh VM_3-326 2 1 0/0 274/22 175/13
wh Pass_FED-10 24 5 274/22 0/0 145/10
wh UF_3-555 15 13 175/13 145/10 0/0
beacon Wamien_I 17 4
beacon Wamien_II 4 12

sector Pass_FED-10:19,20
bbbbeeeeeeeeeebbbbb
bbbeeffeeefffeebbbb
bbbeefeebeeefeebbbb
bbbbeeebbbbeeebbbbb
eeebbeeebbbbebbbbbb
efebbeeebbeeeeeebee
eeeebbebbeeffeeeeee
beeebbebbeeffeeebee
eeebbbebbbeeeffebbb
efebbeeeebbbeefeebb
efeeeeffeeebbeeeeeb
eeeeeeffffebbeeefeb
beebbeeggfebbeeeeee
bbbbbbeggfeebbeeefe
bbbbbeefeeeeebeeffe
bbbbeefeebeeeebeffe
bbbbeeeebeeefeeefee
bbbbbebbbeeefffeeeb
bbbbeeebbbbeeeeebbb
bbbbeeebbbbbeebbbbb
wh Pass_FED-09 9 0 0/0 304/16 181/10 312/19
wh Wamien 1 5 295/16 0/0 418/26 239/14
wh Lave 18 6 181/10 427/26 0/0 351/22
wh Ureneth 5 19 312/19 248/14 351/22 0/0

sector UF_3-555:14,14
bbbbeeeeebbbbb
bbbbefffeeebbb
bbbeefffffeebb
bbbeeeeeeffeeb
eeeeebebeffeeb
eeeeebebeeeebb
eeeebbebbeeeee
beebbbebeefeee
beebbeeeeffeee
beeeeefeeefffe
befffffebeffee
befffffeeefeeb
beeffeeeeeeebb
bbeeeebbeebbbb
wh Wamien 4 0 0/0 172/10 154/10
wh Leesti 2 10 163/10 0/0 128/11
wh Qumiin 13 10 154/10 137/11 0/0

sector Qumiin:18,20
eeeeebeebbbeeeebbb
efffeeeeebeefeebbb
effeebefebeeeebbbb
eeeebbefebbebbbbbb
bebbbbefeeeeebbbee
bebbeeefffffebeeee
bebeefggggffeeeffe
bebefgggggffffffee
beeeggggggfffffeeb
eeefggggggfffeeebb
effggggggfeeeebbbb
efggggggfeebeebbee
efgggggffebeeeeeee
efgggffffeeefebbee
eefffeeefffffeebbb
beeffebeefffffeebb
bbeefeebeffffffeeb
bbbeeeebeefeeeefee
bbbbbeebbeeebbeefe
bbbbbbbbbbbbbbbeee
wh Ureneth 17 5 0/0 189/17 187/16 185/14
wh UF_3-555 0 10 189/17 0/0 98/8 189/17
wh Xewao 5 18 187/16 98/8 0/0 166/13
wh Ayqugre 17 19 185/14 189/17 166/13 0/0
beacon Qumiin_Station 9 11

sector Ureneth:18,17
bbbbbbbbbbeeebbbbb
bbbbeeeebbeeebbbbb
bbbeeeeebbbebbbbbb
bbeefebbeebebbbbbb
beeffeeeeeeeeebbbb
eefffebbeffffeeebb
effffeeeeffffffebb
effofebbeffffffeeb
eefffeeeefffffffeb
beeooebeefffffffee
bbefoeeefffffffoee
bbeooebeffffffooeb
beeofebeffffoofeeb
beoooebeeffoofoebb
befoeebbeeffofeebb
beeeebbbbeeeeeebbb
bbbbbbbbbbbeebbbbb
wh Pass_FED-10 11 0 0/0 221/14 195/15
wh Qumiin 0 5 221/14 0/0 146/11
wh Ayqugre 9 15 195/15 146/11 0/0
beacon Ureneth 11 7

sector Leesti:15,16
bbbbbbbbeeebeee
bbbbbbeeefeeeee
bbbbbeegggggfeb
bbbbeegggggggee
bbbeefgggggggfe
eebeffgggggffee
eeeeffffffffeeb
eebeffffffffebb
bbbeffffffffebb
bbbeffffffffeeb
bbeegggfeeeefee
bbefgggeebbeffe
beefgggebbeeffe
beeffffeebeefee
bbeeeeeeebbeeeb
bbbbbbbeebbbbbb
wh UF_3-555 14 0 0/0 192/15
wh Faedho 8 15 192/15 0/0
beacon Leesti 8 7

sector Xewao:16,16
bbbbbbbbbbbbeebb
bbbeeeebbbbeeeeb
bbeeffeeeeeefeeb
beefmmebbbbeeebb
beefmmebbbbbbbbb
bbeeeeebbbbeeebb
bbbebeeeeeeefeeb
bbbebeebbbbeeeee
bbbebbbbbbeeeeee
bbbebbbbbeefffeb
beeeebbbeeeeefeb
eeffeebbeeebefee
eeffeebbeebbeffe
beeeebbbeeebeffe
bbbbbbbbeeeeeeee
bbbbbbbbbeeeeebb
wh Qumiin 13 1 0/0 302/16 335/20
wh Faedho 2 12 293/16 0/0 326/20
wh Ayqugre 15 13 335/20 335/20 0/0

sector Ayqugre:16,14
bbeebbbbbeeebbbb
beeeebbeeefeebbb
befeebeeffffebbb
beeebeefffffeebb
bbeeeefffffffeeb
bbeffffffffgggeb
beefggggggggggee
eeffggggggggggge
eeeeggggggggggge
bbbefgggggggggge
eebefgggggggggge
eeeefffffggggeee
eeffffeeeeefeebb
beeeeeebbbeeebbb
wh Ureneth 10 0 0/0 125/8 162/12 154/12
wh Qumiin 2 1 125/8 0/0 160/11 157/11
wh Xewao 1 10 162/12 160/11 0/0 98/8
wh RA_3-124 9 12 154/12 157/11 98/8 0/0
beacon Ayqugre 9 4

sector Faedho:14,25
bbbbeebeebbbbb
bbeeeeeeebbbbb
beefffffeebbbb
befffffffeeebb
beefffffffeebb
bbeeeeefggebbb
bbbbebefggeebb
bbeeeeeffffebb
bbeefffffffeeb
bbbefffeefffeb
bbbeeeeeeffeeb
bbbbebefggfebb
bbbbebeeggfebb
bbbbebbeggfebb
bbbeeeeeffeebb
beeegggfeeebbb
eeeggggfebbbbb
efggggggeebbbb
efggggggfeebbb
eeggggggffebee
begggggfffeeee
beeeefeeeeebee
beebefebeebbbb
bbbeefeebbbbbb
bbbeeeeebbbbbb
wh Leesti 4 0 0/0 97/7 277/24
wh Xewao 11 3 97/7 0/0 257/21
wh JG_2-013 4 24 277/24 257/21 0/0
beacon Faedho_Station 6 6

sector Pass_FED-08:14,23
bbbbbbeeebbbbb
bbbbbbeeebbbbb
bbbbbbbebbbbee
bbbbeeeeebbeee
bbbeeeeeeeeefe
beeeeebeebbeee
eeeeebbeebbbeb
eeebbbbeebbbeb
beeebbbeebbbeb
beeebeebbbeeee
bbeeeeeebbefee
bbeeeeeebeefeb
bbeebeebbeefee
bbeebeebbbeeee
beeebeebbbbbee
beeebeebeebbee
bbeeeeeeeeeeee
bbeffffffebbee
bbeeeeeeeebbbb
bbbeebbbebbbbb
bbbbbbbbebbbbb
bbbbbbbeeebbbb
bbbbbbbeeebbbb
wh Ook 7 0 0/0 409/22
wh FR_3-328 8 22 409/22 0/0

sector Aedce:18,20
eeeebbbbbbbbbbbbbb
effeeeebbbbbbbbbbb
eeoofoeebbbbbbbbbb
befoofoeebbbbbbbbb
beefooffeebbbbbbbb
bbeooooofebbbbbbbb
bbefooofeebbbbbeee
beeofoffebbbeeeefe
beffoffeebbeeffeee
befffffebeeefffebb
befffffeeefffffeeb
beefffffffffffffeb
bbeffeeeefffgggfeb
bbeffebbefffgggeeb
bbefeebeefffgggebb
beefebbeffffgggebb
eeffeeeeffffffeebb
effffffffeeeefebbb
eeeeeeffeebbeeebbb
beebbeeeebbbbbbbbb
wh RA_3-124 16 7 0/0 168/15
wh Tiafa 1 18 177/15 0/0
beacon Aedce_Station 8 12

sector RA_3-124:12,12
bbbbbbeeeebb
bbeeebeefeeb
bbeeeebeffee
bbbeeeeefffe
eeebefffffee
efeeefeeffee
eeefffeeffee
bbeffffffeeb
beeeeeeeeebb
beeebbebbbbb
bbbbbeeebbbb
bbbbbeeebbbb
wh Ayqugre 6 0 0/0 124/7 155/11
wh Aedce 0 5 124/7 0/0 125/8
wh Pass_FED-11 6 11 155/11 125/8 0/0

sector JG_2-013:20,8
bbbbbeeebbbbbbbbbbbb
eeeeeefebbeeebeeeeeb
eefffffeeeefeeefffee
beefffffeeffffffeeee
bbefeeefeeffffggebee
bbeeebefffeeeeggeebb
bbbbbbeeeeebbeeeeebb
bbbbbbbbbeebbbbbbbbb
wh Faedho 11 1 0/0 117/9
wh Hobeex 3 5 117/9 0/0

sector Tiafa:24,27
beeebbbbbbbbeebbbbbbbbbb
eefebbbbeeeeeeeeebbeeeeb
eooeebbeefffffffeeeeffeb
eoooebeefffgggggfeeeeeeb
eefoeeeffffgggggfebbeebb
beefeeffffffgggggebeeebb
bbeeffffffffgggggeeefeeb
bbeeffffffffgggggfffofee
beefffffffffgggggffooofe
begggffffffffggggfoooofe
eeggggffffeeeefffffoofee
eggggggffeebeeeeofffoeeb
eggggggfeebbebbeeoofeebb
eggggggeebbeeebbeeefebbb
eegggggebbeefeebbbefeebb
beggggfebbeeofeeebeffeeb
beggggfeebbeeofoeeefffeb
begggggfeebbeooofoffffee
eegggggfeebbeoofoeeefffe
efffgggfebbeefofeebefffe
eeeeffffebbeeeeeebeefffe
eebeffffeebbbbebbbeggffe
bbeefffffebbbeeebeeggffe
beeeeefffebbeefebefffffe
eeeebefffeebeffebeffffee
eeebbeefffeeeffeeefeeeeb
eebbbbeeeeeeeeeeeeeeeebb
wh Aedce 21 2 0/0 282/21 364/28
wh Ollaffa 13 23 291/21 0/0 193/13
wh Hobeex 0 26 373/28 193/13 0/0
beacon Tiafa 9 7

sector Hobeex:19,14
bbbbbbbbbeebbbeeebb
bbeeebbbeeeebeefeeb
beefeeebeffeeefffeb
eeoofoeeefeebeeffee
efooofofofebbbeggfe
eooofoeeefeebeeggfe
efofooebeffeeefggfe
eeeeeoebefffffffffe
bbbbefeeefffffffffe
bbbeefffffffffffffe
bbbefffffeeeffffffe
bbbeeffffebefffffee
bbbbeeefeebeefffeeb
bbbbbbeeebbbeeeeebb
wh JG_2-013 10 0 0/0 96/6 148/13
wh Tiafa 16 0 96/6 0/0 166/13
wh SF_5-674 7 13 148/13 166/13 0/0
beacon Hobeex 14 10

sector Ollaffa:17,14
bbbbbbbbbbbbbbbbb
bbbeebbeeebbbbbbb
bbeeeebefeebbbbbb
beeffeeeffebbbbbb
eeffffffffeeeebbb
efffffeeeeeffeeeb
effffeebebefgggee
eefffebeeeefgggge
befffeeefffggggge
beefffffffgggggge
bbeeeffffggggggee
beeeeeeefggggggeb
beffeebeeggggeeeb
beeeebbbeeeeeebbb
wh Tiafa 8 1 0/0 146/11
wh SF_5-674 2 12 137/11 0/0
beacon Ollaffa_Station 8 8

sector Pass_FED-11:22,17
bbbbbbbbbbbbbbbeeebbbb
bbeeeeeeeeeebbbeeebbbb
beefeeeeeeeeebbbebbbbb
beefebbbbbefeeeeeeebbb
bbeeebbbbbeefffeeeeebb
bbbeebbbbbbeeeeebeeebb
bbbeeebeebbbeebbbbbbbb
beeefeeeebbbbbbeebbbbb
eeeeeeeeebbbeeeeeeebee
efebeebebbbeefffffeeee
efebbbbebbbeeeeffeebee
efeebbbebbbeebeeeebbbb
efeebbbebbbeeebbbbbbbb
efebbbbebeeefeeeebbbbb
efeeebbebeffeeeeeeebbb
eeffeeeeeeeeebbeeeebbb
beeeeeeeeeebbbbeebbbbb
wh RA_3-124 16 0 0/0 651/39 602/35
wh Beurso 21 9 651/39 0/0 201/12
wh Pass_FED-12 17 15 602/35 201/12 0/0

sector SF_5-674:13,22
bbbbbbbeeebbb
bbbbbbeefebbb
bbbbbeefeebee
bbbbeefeebeee
bbbbefeebeeee
bbbeefebeeeeb
bbbeffeeefebb
eebeffffffeeb
eeeeffeeefeeb
eebeffebeeebb
bbbeefeeeebbb
bbbbeefffebee
bbbbbefffeeee
bbbbbeffeebee
bbbbeeffeebbb
bbeeeffffeebb
bbefeeffffeee
bbeeeeeeefffe
bbbeeeebeffee
bbbbbebbeeeeb
bbbeeeebbbbbb
bbbeeeebbbbbb
wh Hobeex 7 1 0/0 86/5 193/13 189/18
wh Ollaffa 12 2 86/5 0/0 201/12 224/17
wh Pass_FED-12 12 12 193/13 201/12 0/0 135/9
wh Soolti 10 19 189/18 224/17 135/9 0/0

sector Pass_FED-12:21,22
bbbbbbbbbbbbbbeeebbbb
bbbbbeeeeeeebeefeebbb
bbbbeefffffeeeffeebbb
bbbeeeeeeefeeefeebbbb
bbbeeebbbeeebeeebbbbb
bbbeebbbbbbbbbebbbbbb
bbbeebbbbbbbbbebbbbbb
bbbeebbbbbeebeeeeebee
bbbeebbbbeeeeefffeeee
bbbeeeebbeffeeeffebee
eebeffebbeeeebeffebbb
eeeeffeebbbebbeffeebb
eebefffebbbebbeeeeeeb
bbbeeeeebbbebbbeeefeb
bbeeeeebbbbebbbeeeeeb
beefeeebbbbebbeeebeeb
eefeebbbeebebbefebeeb
efeebeeeeeeeebefeeeeb
efebeeeefeefeeefffeeb
eeeeefeefeeeefeeeeebb
beeffffeefeeeeebeebbb
bbeeeeeeeeebbeebbbbbb
wh Pass_FED-11 16 0 0/0 192/12 326/20
wh Daaze 20 8 192/12 0/0 430/25
wh SF_5-674 0 11 326/20 430/25 0/0

sector Soolti:21,20
bbbbbbbbbeebbbbbbbbbb
beeeeebeeeeebbbbbbeeb
eefffeeefffeebbeeeeeb
eefgggffffffebbeeeeeb
befgggggggfeebeeebeeb
beegggggggfebbefeeeee
bbegggggggfebeeeeeeee
bbegggggggfeeefebbeeb
bbeggggggggfffeebbbbb
beegggggggggffebeebbb
befgggfgggggffeeeeebb
befffffffgggffffffebb
beeffffffffffffffeebb
bbefffffffffffoooebbb
bbefffffffffoooofeebb
bbeefeeeeffffoooofebb
bbbeeebbeeffffoofeebb
bbbbbbbbbeeffofoeebbb
bbbbbbbbbbeeeeeeebbbb
bbbbbbbbbbbeebbbbbbbb
wh Ceanze#North 19 1 0/0 254/18 182/11
wh SF_5-674 1 3 254/18 0/0 199/17
wh Ceanze#South 18 12 182/11 199/17 0/0
beacon Soolti 6 12

sector Ceanze:15,17
eeebeeeeebbbbbb
eeebeeeeeebeebb
beeeeebefeeeeeb
beeeeebeeeeeeeb
bbbebbbbeebeebb
bbbebbbbeeeeeeb
bbeeebeeeeeefee
bbefeeeffebeffe
bbeeebeefeeeffe
bbbebbbeeffffee
bbbebeebeffffeb
beeeeeeeeffffeb
eefeefffffffeeb
eeeeefeeeeeeebb
bbeefeebbebbbbb
bbbeeebbeeebbbb
bbbbbbbbeeebbbb
wh Soolti#North 0 0 0/0 229/13
wh Soolti#South 1 13 229/13 0/0
beacon Ceanze_Station 8 10

sector ZU_3-239:13,24
bbbbbeeebbbbb
bbbbbeeebbbbb
bbbbbbebbbbbb
bbbeeeeeeeebb
beeeffffffeeb
beffffffffeeb
beofffffeeebb
eefoffeeebbbb
efoooeebbbeee
eeoofebbeeefe
befofeeeefffe
eefffebbefffe
effffeebeffee
efffffebeeeeb
efeeefebbeebb
efebefeebbbbb
eeebeffeebbbb
eebeeeeeebbbb
bbbefebeebbbb
bbeefeeeeebbb
beefffeeeebbb
beeeeeebbbbbb
bbbbbbbbbbbbb
bbbbbbbbbbbbb
wh Silaad 0 17 0/0 162/9
wh Fadaphi 9 20 162/9 0/0

sector Greenso:20,16
eeeeeebbbbbeebbbbbbb
eoffeebbbeeeeeeebbbb
effeebbbeefffffeebbb
eeeebbbbefffffeeebbb
bbebbbbeefffffebbbbb
bbebbbeeffffffeeeebb
bbebeeeffffffffffeee
beeeefgggfffffffffee
begggggggeeeeeeefeeb
eegggggggebeebbeeebb
efggggggfeebbbbbbbbb
efggggggffeeeeeeeebb
eeggggffeeeffeeeeeee
beffffeeebeffebbeffe
beeefeebbbeeeeeeefee
bbbeeebbbbbbeeeeeeeb
wh Nex_0006#North 15 2 0/0 174/14 257/18
wh Fadaphi 1 14 174/14 0/0 234/18
wh Nex_0006#South 19 14 257/18 234/18 0/0
beacon Greenso 12 5

sector Nex_0006:25,25
bbbbeeeeebeeeeebbbbbbbbbb
eeeeefffeeefffeeeeebbbbbb
eeffffeeefffffffffeeebbbb
beffeeebeffeeeeeffffebbbb
beeeebbeefeebbbeeeffeebbb
bbeebbeefeebbbbbbeeefeebb
bbbbbeefeebbeebbbbbeefebb
bbbeeefeebbeeeebbeebefeeb
beeefeeebbeeffeebeeeeffeb
eefffebbbeeffffeeeeeeefeb
efffeebeeeffffffeeeebeeeb
effeebbefffeeeeefffeeeebb
efeebbbeffeebbeeffffffeeb
eeebbeeefeebbeefeeeeefeeb
eebbeefffebbeeffebebeeebb
bbbbefffeebeeffeebebbbbbb
bbbeefggebbeeeeebbebbbbbb
bbbeefggeebbbbbbbbebbbbbb
bbbbeefffeeebbbbbbebeeeeb
bbbbbeeefffeeeeeeeeeeffee
bbbbbbbeeffffgggggggffffe
bbbbbbbbeefffgggggggfffee
bbbbbbbbbeeffgggggggffeeb
bbbbbbbbbbeeefffffffeeebb
bbbbbbbbbbbbeeeeeeeeebbbb
wh Greenso#North 1 2 0/0 205/16 479/38 335/29
wh Greenso#South 0 14 205/16 0/0 508/40 364/31
wh Propus 24 19 479/38 508/40 0/0 222/15
xh 13 15 326/29 355/31 213/15 0/0

sector Propus:16,20
bbbbbbbeeebbbeeb
bbbbbbbeeebbbeeb
bbbbbbbbebbbbeee
bbbbbbeeeeebeefe
bbbbeeeffeebeeee
bbbbeffffebbeeee
eeeeefofoeebefee
eefffoooffeeefeb
beefoffoooebefeb
bbefooffofeeefeb
bbeffoooffebeeeb
beefffofffeebebb
eeffffeeeffeeeeb
efffffebefffffee
effffeebeffffffe
eefffebbeffffffe
befffeeeefffffee
beeefebbefffffeb
bbbeeebbeefffeeb
bbbbbbbbbeeeeebb
wh Nex_0006 1 6 0/0 119/11
wh Elnath 3 17 119/11 0/0
beacon Propus 12 15

sector JO_4-132:20,20
bbbbbbbbbeeebbbbbbbb
eeebbbbbbeeebbbbbbbb
efeebbbbbbebbbbbbbbb
effeebbbeeeeeeebbbbb
eeeeebbeefffffebbbbb
bbbebbbeffffffeebbbb
bbbebbbeefffggfebbbb
bbeeebbbeeeeggfeebbb
bbeeeeeebbbeggfeebbb
bbbefffeebeeggfebbbb
eebeffffeeefffeebbbb
eeeefffffffffeebbbbb
eebeefffeeeffebbbbbb
bbbbeeffebeefebbbbee
bbbbbeefeebefeebbeee
bbbbbbeffeeeffebbefe
bbbbbbeeeeefffeeeefe
bbbbbbbebbeffeebbeee
bbbbbbeeebeeeebbbbee
bbbbbbeeebeebbbbbbee
wh Bewaack 13 12 0/0 124/7
wh Pass_FED-13 7 18 124/7 0/0

sector Bewaack:14,25
beeeeebbbbeebb
beeffebbbeeeeb
bbeeeebeeeffee
bbbbebbefffffe
bbbbebbeeffffe
bbbeeeebeffffe
bbeeffeeeffffe
beefggggggffee
beefggggggffeb
bbefggggggfeeb
beeffffffffebb
beeeeeeffffebb
bbbbbbeffffeeb
beebeeefffffee
eeebeffffffffe
eeeeeffffffffe
beffffffffffee
befoofofffffeb
befoooofffffeb
befooffeeeffeb
beefoooebeeeeb
bbefoofeebeebb
bbeefoffeebbbb
bbbefeeeeebbbb
bbbeeebbbbbbbb
wh Miayda#North 11 0 0/0 150/10 256/22
wh JO_4-132 2 10 150/10 0/0 185/14
wh Miayda#South 9 22 256/22 185/14 0/0
beacon Bewaack 9 13

sector Miayda:25,17
bbbbbeeeeeeeeeeebbbbbbbbb
bbeeeefffffffffeeeeeebbbb
bbefffggggggggggffffeeebb
beeffgggggggggggggggffeee
befggggggggggggggggggfffe
eefgggggfeeefgggggggggffe
eefggggeeebeeeggggggggffe
befggggebbbbbegggggggffee
beeegggebeebbeeggggggeeeb
bbbeeefebeeebbeggggggeebb
bbbbbefeeefebbeggggggeeeb
beeeeefebeeebeegggggggfee
eefffffebbbbbeggggggggffe
effffffeeebeeeggggggggfee
eeeffffffeeeffggggggggfeb
bbeeefffeeefffffffffffeeb
bbbbeeeeebeeeeeeeeeeeeebb
wh Silaad 24 3 0/0 263/24 307/24 128/10
wh Bewaack#North 0 5 263/24 0/0 154/10 307/24
wh Bewaack#South 0 13 307/24 154/10 0/0 272/24
wh Xeho 24 13 128/10 307/24 272/24 0/0

sector Silaad:25,20
eeeeebbeeeeeeeebbbbbbbbbb
efffeebeeeffffeeebbbbbeeb
effffeeeeeffffffebbbbeeee
eeeffeeeffffffffeebbeeffe
bbeefeeefffffffffebeeffee
bbbeffoffffffffffeeefffeb
bbeefofoofffffffffffffeeb
beefofooofffeeeeeeeeeeebb
befofooooooeebebeebeebbbb
beeeeeeeoeeebbebbbbbbbbbb
bbbebebefebbbbebbbbbbbbbb
bbbebebefeebbeeebbeeeebbb
beeeeeeeggeebefebeeffeeeb
eeffffggggfebeeebefggffeb
efffffggggeebbebbefggggee
efffffffggebeeeeeefggggfe
eeefffffggeeeffgggfggggfe
bbeeeeeefffffffgggfggggee
bbbbbbbeeefffffffffeeeeeb
bbbbbbbbbeeeeeeeeeeebbbbb
wh Miayda 1 1 0/0 220/22 311/25
wh ZU_3-239 23 2 229/22 0/0 339/24
wh Fadaphi 23 13 320/25 339/24 0/0
beacon Silaad_I 13 4
beacon Silaad_II 3 14

sector Fadaphi:24,25
bbbbbbbbbbeeeebbbbbbbbbb
bbbbbbbbbbeffebbbbbbbbbb
bbbbbbbbbeeffeebbbbbbbbb
bbbbbbbbbeffffebeeeeeeeb
bbbbbbbbbefgggeeefffffee
bbbbbbbbeeggggfffffffffe
bbbbbbbbefgggggggggffeee
bbbbbbbeefgggggggggfeebb
bbbbbbeeffgggggggggeebbb
bbbeeeeffffggggggfeebbbb
bbeeffeeefffffffeeebbbbb
bbefffebefffffeeebbbbbbb
bbeeeeeeefffffebbbbbbbbb
bbbbbefffffffeebbbbbbbbb
bbbbeeffffffeebeeebbbbbb
bbbeeffeeeefebeefeebbbbb
bbbeffeebbefeeefffeeebbb
bbbefeebbeefffffeeefeebb
beeefebeeeffofeeebeffeeb
befffeeefofofeebbeefffeb
eeffffffoooooebbeeffeeeb
effeeefooooofebbeefeebbb
eefebeoofoofeebbbeeebbbb
beeebeeffeeeebbbbbbbbbbb
bbbbbbeeeebbbbbbbbbbbbbb
wh ZU_3-239 12 0 0/0 138/12 163/14 234/22 261/22
wh Greenso 22 4 138/12 0/0 228/20 249/23 245/19
wh Silaad 2 11 163/14 228/20 0/0 147/12 225/18
wh Oucanfa 1 22 234/22 249/23 147/12 0/0 226/19
wh Cegreeth 18 22 261/22 245/19 225/18 226/19 0/0
beacon Fadaphi 11 11

sector Elnath:18,25
bbbbbbbeeeeebbbbbb
bbbbbbeefffebbeeee
bbbbbeeffeeebeeffe
bbeeeeffeebbbefffe
beefffffebbbbeefee
beffggggeeebbbeeeb
eefgggggggebbbbebb
effgggggggeeebbebb
effgggggggffeeeeeb
effgggggggffffffee
eefgggeeeffffffffe
befffeebeeeffffffe
eefffebbbbeffffffe
effffebbbbeefffffe
effffeeebbbeffffee
eefffffeeebeefffeb
befffffffebbeffeeb
beeffffffeebeeeebb
bbeeeeefffeebeebbb
bbbbbbeffffeebbbbb
bbeebbefffffebbeee
eeeeeeefffffeeeefe
eefffffffffeebbeee
beeffffeeefebbbbee
bbeeeeeebeeebbbbee
wh Propus 10 1 0/0 302/26 245/23
wh AB_5-848 0 21 311/26 0/0 98/8
wh Algol 8 23 254/23 98/8 0/0
beacon Elnath 14 13

sector Xeho:16,17
eeebbbeeeebbeebb
eeeeebeeeebeeeeb
beefeeeebbbeeeeb
bbefeeeeeeeeebbb
eeefebeffeeeeeeb
eeeeebemmebeefee
eebeeeemmebbeeee
bbbeeeeffeebeebb
beeeebeeefeeeeeb
beefebbbefffffeb
bbeeeeeeeeeeffee
bbbeefffeebeeeee
bbbbeefeebeeebee
bbbbbeeebbefeebb
bbbbbbbbbbeefeeb
bbbbbbbbbbbeeeeb
bbbbbbbbbbbbeebb
wh Miayda 0 0 0/0 220/13 268/16
wh Oucanfa 13 1 220/13 0/0 240/15
wh Edmial 12 16 268/16 240/15 0/0

sector Oucanfa:15,15
bbbbbbeeeebbbbb
bbbbbeeffebbbbb
bbbbbeeffeebbbb
bbbbbbefffeebbb
eeebbbeefffebbb
efeebbbeeffeebb
eefeeebbeeffeeb
beeffeebeefeeeb
bbeeffeeefeebbb
bbbeeffffeebeeb
eebbeeffeebeeeb
eeebbeeeebeefee
efeebbeebeeeeee
eeeeeeeeeeeebee
bbeeeeeebeebbee
wh Fadaphi 6 0 0/0 179/17
wh Xeho 0 4 179/17 0/0

sector Cegreeth:18,22
bbbbbbbbbeeeeeebbb
bbbbbeeeeeffffeeee
bbbbeeggggeeeefffe
bbbbefggggebbeffee
bbeeefggffeeeefeeb
beefffffeeefffeebb
befffeeeebeeeeebbb
eefffebeebbbbbbbbb
eefffeebbbbbbbbbbb
beeffeebbbbbbbbbbb
bbeeeebbbbbbbbbbbb
bbbeebbbbbbbbbbbbb
eebeebbbbbbbbbbbbb
eeeeebbbbbbbbbbbbb
eebeeebbbbbbbbbbbb
bbbeeebbbbbbbbbbbb
bbbbeeebbbbbbbbbbb
bbbbefeeeeeebbbbbb
bbbbeefffffeeeeebb
bbbbbeeefffffffeeb
bbbbbbbeeeefffeeeb
bbbbbbbeebeeeeebbb
wh Fadaphi 4 2 0/0 153/13 330/24 280/19
wh AB_5-848#North 17 2 153/13 0/0 427/31 377/26
wh AB_5-848#South 16 20 330/24 427/31 0/0 117/9
wh Edmial 7 21 280/19 377/26 117/9 0/0

sector Cegreeth_East:18,22
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbeeeebbbbb
bbbbbbbbbeffebeebb
bbbbbbbbeebfebeeee
bbbbbbbeefboeeeffe
bbbbbbbeffboebefee
bbbbbbbeeeefebeeeb
bbbbbbbbbbeeebbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbb
wh AB_5-848 17 11 0/0

sector AB_5-848:18,14
bbeeeebbbbeeeeebbb
beeffeeebeefffeebb
beeffffeeefggffeee
bbeeeffffffggffffe
bbbbeefffffggffffe
bbbbbeeeeeeffffffe
bbbbbbeebbeffffffe
beebbbbbbeeffffffe
eeebeebbbeefeeeffe
efeeeeeebbefebefee
effffffeeeefeeefeb
eeffffffffffeeeeeb
beeeeefffffeebeebb
beebbeeeeeeebbbbbb
wh Elnath 14 0 0/0 148/13 93/7 216/18 138/12
wh Cegreeth#North 1 1 148/13 0/0 136/10 273/21 206/17
wh Cegreeth_East 9 7 93/7 136/10 0/0 155/11 105/6
wh Cegreeth#South 1 8 216/18 273/21 155/11 0/0 185/14
wh Vecelia 15 12 138/12 206/17 105/6 185/14 0/0

sector Algol:19,25
bbbbbeeebbbbbbbbbee
bbbbbefeeebbbbbbeee
bbbbbeeffeebbbbeefe
bbbbbbeeffeebbbeffe
eebbbbbefffeeeeefee
eebbeebefffebbbeeeb
eeeeeeeefffeebbbbbb
eeffffffffffebbbbbb
befffeeeffffebbbbbb
eefffebeefffebbbbbb
effffebbeeffebeebbb
eefffeebbeffeeeebbb
beeeefeebeffebeebbb
bbbbeeeeeeffebbbbee
bbbbbbefffffeeebeee
bbbbeeefffffffeeefe
beeeeffoffffffeeefe
eefoooeeeeffeeebeee
efooofebbeeeebbbbee
eeeoooebbeeebbbbbbb
bbeeffeeeefebbbbbbb
bbbeeofffffeebbbbbb
bbbbeeefffeeebbbbbb
bbbbbbeefeebbbbbbbb
bbbbbbbeeebbbbbbbbb
wh Elnath 6 1 0/0 128/11 248/23
wh Pass_UNI-09 14 11 137/11 0/0 185/14
wh Vecelia 8 24 257/23 185/14 0/0

sector Pass_FED-13:16,21
bbbbbbbeeebbbbbb
bbbbbbbeeebbbbbb
bbbbbbbbebbbeeeb
bbbbeeeeeeeeefeb
bbbeegggfeeeeeeb
beeefgggeeeebeeb
beeeeffeebbbeeee
beebefeebbeeefee
beebeeebeeeffeeb
eeeeeebeefeeeebb
eeffeebefeebbbbb
beffebeeeebbbbbb
beeeeeefebeeeebb
bbbeeeeeeeeffeeb
bbbbeebeeeffffeb
bbbbbbeeeeffffee
bbbbbbeeeeffffee
bbbbbbbbbeeeeeeb
bbbbbbbbbbebbbbb
bbbbbbbbbeeebbbb
bbbbbbbbbeeebbbb
wh JO_4-132 8 0 0/0 304/20
wh GV_4-652 10 20 304/20 0/0

sector Edmial:17,16
beeeebbbbbbbbbbbb
eeffeebbbbbbeeebb
effffebbbbbeefebb
effffebbbbbeffeeb
effffebbbbeegggee
eefffeebbeeggggge
beffffeeeefggggge
beffffeeeefggggge
eefffeebbefffeeee
efffeebbbefffebbb
efffebbeeefffeebb
eeffeeeeffffffeeb
befffffffffffffeb
beffffffffffffeeb
beeeffffffffffebb
bbbeeeeeeeeeeeebb
wh Xeho 1 0 0/0 182/11
wh Cegreeth 12 2 182/11 0/0
beacon Edmial 11 12

sector Vecelia:15,26
eebbeebbbbbbbbb
eebeeeeeeeeebbb
eeeefffffffeebb
eeefffffffffebb
eeefffffffffeeb
eeeeffffffffeeb
bbeeggggfffeebb
beeggggggeeebbb
eegggggggebbbbb
efgggggggebbbbb
efgggggggeebbbb
eeggggggggeebbb
beggggggggfeebb
beggggggggoeebb
eefgggggggeebbb
efoogggffeebeeb
eoeeefofeebeeeb
efebeoooebeefeb
eeeeeeeeeeeeeeb
befeeebeeefebbb
beeeeeeefeeebbb
bbeeeeeeeebbbbb
bbbeebbebbbbbbb
bbbbbbeeebbbeee
bbbbbbefeeeeefe
bbbbbbeeebbbeee
wh AB_5-848 0 0 0/0 76/4 342/23
wh Algol 4 1 76/4 0/0 309/22
wh Aandti 7 23 342/23 309/22 0/0
beacon Vecelia 9 4

sector Pass_UNI-09:20,15
bbeeeeebbbbeeeebbbbb
beefffebbbeeffeeeebb
eeffffeebeeffffffeeb
effeeefeeeffeeeeffee
eggebeeffffeebbefffe
eggebbeeeeeebbeeeeee
eefeebbbbeebbeeeebeb
beffeebbbbbbbeeebbeb
beeffebbbbbeeeebbeee
bbeefebeebbeooeebefe
bbbefeeeeeeeoooebeee
eebefeeeebbefofebbbb
eeeefebeebbeefeebbbb
eebeeeebbbbbeeebbbbb
bbbbeeebbbbbbbbbbbbb
wh Dadaex 18 9 0/0 372/21
wh Algol 0 12 381/21 0/0`;