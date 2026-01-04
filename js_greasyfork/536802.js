// ==UserScript==
// @name        ExoticaZ Tag Inserter
// @namespace   Violentmonkey Scripts
// @match       https://exoticaz.to/edit/torrent/*
// @grant       GM_addStyle
// @version     1.1
// @author      PornFactory
// @description Adds an "Insert Tags" button next to the Tags field on ExoticaZ torrent edit page. Allows pasting comma/space-separated tag names, which are then mapped to IDs and added.
// @run-at      document-end
// @icon        https://i.exoticaz.to/images/favicon.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536802/ExoticaZ%20Tag%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/536802/ExoticaZ%20Tag%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ##################################################################################
    // # IMPORTANT: PASTE YOUR FULL TAG-ID MAPPING LIST BETWEEN THE BACKTICKS BELOW     #
    // # Format: displayName(alias1,alias.name,alias2)[ID]                              #
    // # OR: displayName[ID] (if no aliases)                                            #
    // # Each entry on a new line. The matching is case-insensitive for tag names.      #
    // ##################################################################################
    const tagIdMapString = `
japanese(japan,jav,tokyo,jp,lang.japanese,janpanese)[2]
creampie(nakadashi,impregnation,cum.inside,load.inside,cream.pie,creampies,cum.in.pussy)[100]
big.tits(big.natural.tits,busty,breasts,big.boobs,bigtits,bigboobs,big.breast.natural.tits,busty.fetish,big.chest,big.breast,big.breasts,big.tit,large.breasts,kyonyu,big.tits.lover,big.natural.breast,big.naturals)[41]
amateur(self.shot,sex.scandal,only.amateur,amature)[32]
slender(slim,slender.beauty,slim.body,thin)[78]
wife(married.woman,married,housewife)[251]
blowjob(only.blowjob)[1905]
ads()[1556]
toys(sextoy,vibrator,sex.toys,remote.control.vibrator,toy,pussy.beads,breast.pump,clit.pump,cow.milker,double.breast.pump,electronic.breast.training.machine,anal.toys)[44]
threesome(3p,threesomes,threesome.foursome,3p.4p)[142]
mature(mature.woman,granny,gilf,grey.hair)[230]
gonzo()[343]
squirting(squirt,shiofuki)[187]
facial(facial.cumshot,cum.on.face,cumshot,cum.on.mouth,cum.in.face,facials,cof)[165]
schoolgirl(schoolgirls,school.uniform,school.girls,sailor.suit,school.girl,schoolgirl.uniform)[86]
shaved(shaved.pussy,paipan,hairless,clean.pussy,bald.pussy,shaved.vagina)[2027]
masturbation(masturbate,mastrubation,pussy.masturbation,masterbation,selffuck)[141]
fingering(fingerbang,pussy.fingering,finger.fuck)[188]
anal(anal.play,anal.fingering,hard.anal,assfuck,anal.plug,anal.beads,anal.insert,anal.insertion,anal.sex,anus)[38]
boob.job(tit.fuck,breast.play,paizuri,titty.fuck,boobjob,titfuck,tittyfuck,tits.job)[566]
pov(some.pov,eye.contact,subjective,cowgirl.pov,missionary.pov)[105]
cosplay(superhero,costume,heroine,hero,anime.character,chun.li,sailor.moon,mai.shiranui,boa.hancock,santa,hatsune.miku,rezero,re.zero,anikos,cosplayers,cosplayer,santa.outfit,rainbows.six,rainbow.six,bayonetta,animal.ears)[71]
cuckold()[393]
kissing(tongue.kissing,kiss,kiss.kiss)[370]
big.ass(big.butt,bigass,bigbutt,huge.butt,big.asses,big.ass.lover,bubblebutt)[31]
hairy.pussy(bush,pubic.hair)[383]
incest(sister,step.mom,mother.son,step.father,relatives,incest.roleplay,step.brother,step.daughter,step.sister,son,step.family,sisters.roleplay,family.roleplay,father.fucks.daughter)[184]
handjob()[1969]
deep.throat(deepthroat,deep.throating)[218]
voyeur(hidden.cam,window.peep,hacked.camera,hidden,hidden.camera,peeping.tom,spying,candid,spy.cam,remote.control.camera,spycam)[456]
virtual.reality(vr,3d,oculus,gearvr,vrporn,psvr,rift,vive,virtualsex)[462]
small.tits(small.natural.breasts,flat.chest,small.breasts,tiny.tits,small.boobs,small.natural.tits)[40]
uniform()[90]
cunnilingus()[1968]
story(drama,plot)[802]
face.mask(mask)[644]
teen(18.year.old,young,teens)[59]
shame(humiliation,embarrassment)[96]
oil.or.lotion(oily,lotion.play,hard.lotion,oil)[83]
orgy(promiscuity,group,group.sex,groupsex,promiscuous)[98]
lingerie(erotic.wear,panties,underwear,panty,panty.shot,garter.belt)[229]
office.lady(secretary,office.girl,office.attire,realestate.agent)[217]
pick.up(reverse.pickup,pickup,nampa,sharking,nanpa,seduction,seduce,pickup.girl,picking.up.girls)[661]
gyaru(ganguro,gal)[1965]
older.sister(elder.sister,oneesan)[1231]
milf(mother,friend.mom,mom)[231]
college.girl(college,college.student,university,female.college.student)[115]
home.made(homemade)[1565]
affair()[574]
lesbian(lesbianism)[91]
fetish(other.fetish,kinky,pervert)[70]
massage(foot.massage)[167]
pantyhose(stockings,silk.stocking)[133]
cheating(friend.wife,ntr,netorare,cheating.wife)[153]
medium.tits()[215]
petite(short.women,height.below.150cm,height.below.140cm,spinner,tiny)[79]
compilation(best.of,actress.best.compilation)[132]
bdsm(sadomasochism,harsh.bdsm,masochist,sadism,masochism,masochist.man)[192]
documentary()[144]
black.hair(dark.hair)[464]
chinese(china)[5]
69(69.style,sixty.nine,sixtynine)[264]
orgasm()[56]
av.debut(debut,gravure.to.jav,newcomer,first.shot,first.appearance,debut.production)[803]
cum.in.mouth(open.mouth.facial,cim,cuminmouth)[221]
outdoors(outdoor,outside,barn)[300]
male.female(one.on.one,1on1,actor.actress)[728]
bathing.suit(swimsuits,swimsuit,one.piece,school.swimsuit,speedo,swimming.wear,competition.swimsuit)[578]
big.cock(huge.cock,bigdick,huge.dick,big.dick,large.dick,big.penis)[234]
spa.resort.or.inn(hot.spring,public.bath,sento,bath.house,onsen,bathhouse,hotspring,resort,bathing,sauna,soapland,ryokan,soapland.girl)[536]
solo(sole.female,solo.female,solo.action,solo.cumming)[43]
blonde(blond,blondes,brown.honey.blond)[58]
pale.skin()[498]
bondage(ropes.ties,tied.up,ropes,suspension,tied,rope.bondage,shibari,kinbaku)[1938]
60fps(60.fps)[647]
dirty.talk(dirty.talking,dirty.words)[104]
restraint(handcuffs,restrained,restraints,restrain)[276]
bukkake(ggg)[82]
chubby(thick)[1046]
dildo()[377]
teacher(female.teacher,male.teacher,private.tutor,tutor)[109]
pee(urination,golden.shower,bed.piss,bed.wetting,bedwetting,piss.drinking,pee.drinking,outdoor.pissing,piss,goldenshower,pissing,wetting)[414]
tall.girl(tall)[253]
brunette(brown.hair,chestnut,burnette)[60]
closeup(close.ups)[505]
natural.tits(natural,natural.breasts)[37]
legs.spread()[403]
idol()[102]
couple(coulples,couples)[149]
maid(cleaner,cleaning.lady,french.maid,housekeeper)[87]
face.hidden(no.face)[704]
nurse(nurse.uniform)[110]
tattoos(tattoo,tatoo)[66]
gang.bang(gangbang,4.on.1)[81]
glasses(specs)[101]
interracial()[33]
leg.fetish(foot.licking,cum.on.foot,foot.fetish,cum.on.feet,foot.worship,foot,feet)[914]
big.vibrator(magicwand,electric.massager,fucking.machine,sybian,huge.vibrators,hitachi.magic.wand,big.toys)[267]
shower()[512]
bride(newlywed,young.wife,wedding)[827]
ass.fetish(ass.worship,butt.fetish)[1698]
salon(massage.parlor)[629]
public(exhibitionism,exposure,public.nudity,public.exposure,public.sex,flashing)[145]
portrait.mode(mobile.porn,mobile,mobil,phone.porn,vertical.phone.format)[875]
ebony(black)[34]
model(online.model)[193]
bathroom(bath,bathtub)[581]
hotel(love.hotel)[579]
hostess(club.hostess,escort)[718]
ffm.threesome()[361]
redhead(red.hair,ginger)[157]
footjob()[239]
harem(reverse.gangbang,harlem,two.girls,fffm)[99]
cum.swallowing(swallow,swallowing)[265]
rimming(asslick,ass.licking,female.rimming.male,rimjob)[390]
nympho(perverted.woman,chijo,chijyo,nymphomaniac)[143]
mmf.threesome(mmf)[380]
rubbing(clit.rubbing,clit.stimulation,pussy.rubbing)[1025]
foursome(4p)[235]
big.black.cock(bbc)[506]
face.sitting(facesitting)[270]
lolita(loli,rori,petite.lolita)[415]
fair.skin()[2255]
asian.female.white.male(wmaf)[39]
breast.milk(hucow,lactation)[783]
athletic(fit,fitness)[1641]
spread.pussy()[384]
student()[627]
dating(date)[147]
leaked(thefappening,uncensored.leaked,uncensored.leak,leak)[919]
cherry.boy(virgin.man)[140]
thai(thailand,bangkok,thai.girl,thais)[4]
sweating(sweat)[238]
virgin(defloration)[250]
small.ass()[1507]
webcam(camgirl,cam,live.broadcast,vip.show)[547]
double.penetration(dual.penetration,double.dildo.penetration,dp,airtight)[313]
condom()[956]
rape(rape.fantasy)[237]
traditional.dress(kimono,yukata,traditional.wear,shrine.maiden,miko)[842]
medium.ass()[216]
gravure()[422]
prostitute(prostitutes,hooker)[35]
bikini()[1018]
shy(innocent)[1030]
training()[168]
blind.fold(blindfold)[561]
older.younger(older.male.younger.female,older.female.younger.female,older.female.younger.male,old.man,cross.generation)[45]
ball.licking(ball.sucking)[1549]
various.professions()[1960]
latin(latina)[725]
taiwanese(taiwan)[10]
youthful(bloomers,jailbait)[75]
scat(poo,poop,solo.scat,shit,corprophagy,defecation,scatology,lesbian.scat,shit.eating,shit.smear)[1161]
monthly.pack()[2066]
rough.sex(rough,painful)[746]
fake.tits()[463]
korean(korea)[3]
short.haircut(short.hair)[1742]
swimming.pool(pool)[557]
beach()[327]
female.boss()[465]
femdom(domination,pegging,woman.fucks.man,sm.queen,dom)[425]
sport(athlete,teen.sport,exercise,sports,gymnast,workout)[154]
tease()[549]
venue(bar,restaurant,club,theater,stage,pub.bar,night.club,cafe)[814]
tanned(tan.lines,sun.tan,tanning,tanlines)[80]
yearly.pack()[2065]
confinement(chains)[275]
cross.dressing()[261]
abuse()[274]
fan.appreciation(home.visit,tour.bus,contest,thanksgiving,fan.appreciation.home.visit)[126]
gym.clothes(gymnastic.cloth)[240]
skinny(skeleton.ribcage,skeleton.bones)[618]
office()[120]
dance(dancing,pole.dance,twerking)[408]
muscular(muscle)[262]
first.time()[504]
socks(knee.socks,loose.socks)[723]
fishnet(fishnet.stockings)[345]
toilet()[515]
live.action()[1286]
enema(enma)[269]
piercings(piercing,pierced.nipples)[845]
spread.cheeks()[1583]
torture()[135]
cum.on.tits(cum.on.chest,cum.on.boobs)[431]
undressing()[1186]
casting(fake.agent,female.agent)[57]
russian()[61]
subtitle.english(english.subs)[792]
fantasy.or.sci.fi(fantasy,medieval,elf)[117]
asian.female.black.male()[178]
bunny.girl()[255]
parody()[73]
high.heels(stilettos,highheels,heels,high.heel.boots)[836]
gape(gaping,gapes)[376]
drug(drugged,substance.use)[874]
boss()[1179]
spanking(caning,otk.spanking,wooden.ruler,figging,birching,belting)[1533]
police(detective,female.investigator,female.detective)[513]
decensored(unmasking,mosaic.removed,javplayer,ai.decensored)[1390]
bbw(big.beautiful.woman,xlgirls)[541]
gagging()[1655]
car.sex(in.car)[241]
strap.on()[136]
various.actress(various.models)[585]
doctor(school.clinic,examination)[112]
interview()[916]
store(convenience.store,shop,supermarket,department.store,boutique,clerk,store.clerk,shop.clerk,delivery)[812]
disc.image(iso)[1924]
variety()[92]
yoga()[1585]
scissoring(tribadism,scisorring,tribbing)[560]
slave()[402]
art()[1085]
vintage(retro,classic,vintage.style)[304]
stripping(striptease)[773]
neighbour(neighbor)[1688]
mini.skirt(miniskirt)[841]
couch()[2097]
pregnant()[406]
anal.creampie(creampie.anal,cum.inside.ass)[797]
immediate.sex(immediate.saddle,skip.foreplay,surprise.sex,impromptu.sex)[1947]
christmas()[1813]
flight.attendant(air.hostess,stewardess)[491]
asian.male.white.female(amwf)[1040]
watermark(foreign.watermark)[438]
prone.bone(pronebone)[434]
european()[67]
latex(rubber,latex.suit)[93]
hospital(clinic)[111]
upskirt()[952]
fisting(self.fisting)[246]
cum.on.stomach()[598]
public.transport(train,school.bus,metro,bus)[780]
subjectivity()[1528]
molestation(groping,grope,molester)[404]
american()[530]
girlfriend()[2209]
gym()[556]
subtitle.chinese(chinese.sub,chinese.subtitles)[752]
filipino(filipina,philippines,pinoy)[8]
piledriver()[379]
ass.to.mouth(a2m,asstomouth)[891]
various.worker()[1563]
forced(forced.oral,forced.sex)[401]
princess()[252]
mouth.gag(gag,mouth.bondage)[587]
sloppy()[1068]
submissive()[1409]
cum.on.pussy(pussy.bukkake)[1034]
leotards(leotard)[257]
nipple.play(sensitive.nipples,nipple.clamps)[1341]
reluctant.or.tsundere(reluctant)[186]
body.licking(eye.licking,armpit.licking,face.licking)[575]
photoshoot()[2077]
prank(pranks)[89]
role.play(roleplay)[715]
pigtails(twin.tails)[665]
drunk()[263]
messy()[107]
french()[526]
celeb(celebrity,famous.names)[717]
sleep(passed.out)[759]
dressing.room(fitting.room,locker.room)[883]
anchor(reporter,announcer)[116]
horror(evil)[805]
soap(soap.bubble)[649]
cheerleader()[795]
punishment()[1021]
hypnotism(hypnotised,hypno,hypnotized,hypnosis,mind.control,brainwash)[85]
czech()[442]
bonus.scene(behind.the.scene,bts,makingof)[893]
mixed.asian()[688]
cum.drinking(gokkun,drinking.cum)[657]
missionary.sex()[2200]
buttplug()[1701]
widow()[200]
long.legs()[1430]
face.fuck()[1256]
indian(india,desi,uk.indian)[6]
hookup()[1620]
aunt()[747]
smoking()[550]
instructor()[1808]
vomit(puke)[397]
multiple.creampies(cumdump)[1013]
ahegao()[1380]
quickie()[922]
doggystyle.sex()[2377]
flexible(contortionist,splits,standing.splits)[978]
object.insertion(bottle.insertion,brush)[1514]
glamour()[953]
leather()[474]
lightly.tattooed()[1705]
cum.on.ass()[222]
jeans(denim.shorts,jean.shorts)[980]
shota(shotacon)[729]
babysitter()[597]
double.anal(dap)[1326]
race.queen(r.queen)[248]
ai.upscaled(topaz.ai)[1770]
daddy()[2194]
panties.to.side(panties.to.the.side)[471]
classroom()[436]
pussy.juice(grool)[1054]
brazilian(brazil)[49]
western.release()[594]
multiple.orgasms(uncontrollable.orgasm)[1819]
spanish()[159]
non.nude(no.nude)[424]
wax(candles,hot.wax)[1152]
femboy()[2301]
time.freeze(motionless,time.stop)[88]
soapy.massage(nuru.massage)[539]
cat.girl(cat.cosplay,nekomimi,cat.ears,catgirl)[156]
stranger()[1379]
cum.play()[1497]
aphrodisiac(pheromones)[645]
saliva(drool)[1635]
tit.sucking()[1475]
collar()[982]
colorful.hair(neon.hair)[1657]
glory.hole(gloryhole)[420]
swingers(wife.swap)[443]
reality()[130]
submissive.men()[1735]
brother()[2195]
vietnamese(vietnam)[7]
joi(jerk.off.instructions)[2083]
speculum()[278]
edge()[1888]
asmr()[870]
remastered()[1850]
apron(naked.apron)[430]
audition()[1004]
black.actor()[1550]
cum.swap(cum.kissing,cum.swapping,snowballing)[417]
shaving()[1489]
leash()[583]
bizarre(weird,alt.porn,post.porn)[730]
singaporean(singapore)[12]
waitress()[244]
romantic()[1580]
british()[1762]
twins()[732]
gloves()[908]
blowgang()[1953]
goth(gothic)[721]
cum.on.back()[1823]
scandal()[1578]
german(germany)[675]
italian()[936]
minipack()[1014]
nun(vestal)[832]
ponytails()[1780]
spitting()[399]
egg.vibrator()[1645]
nose.hook()[1348]
tickling(ticklish)[272]
discipline()[1534]
dungeon(sex.dungeon,torture.chamber,vault)[811]
nerd()[511]
game.show()[152]
big.clit()[1017]
choking(airplay,breath.play)[1149]
saddle()[1633]
shemale.on.female(transgirl.on.female)[1569]
sex.with.clothes()[1609]
long.hair()[2256]
whipping(leather.strapping)[1542]
prison()[128]
braces()[285]
canadian()[736]
anal.gaping()[2203]
twinks()[990]
sensual()[2334]
hungarian(hungary)[441]
succubus()[1376]
ukrainian(ukraine)[63]
deepfake(ai.generated.works)[1383]
uncut()[1591]
spit.roast()[378]
father.in.law()[314]
cousin()[1621]
monster.cum(fake.cum)[776]
tour()[1894]
hong.kong(hongkong)[949]
crying()[642]
perky()[1798]
sister.in.law()[1667]
mixed.race()[599]
classmate()[628]
catsuit()[94]
slapping()[1787]
anal.fisting()[737]
female.pov()[1979]
muslim(hijab)[1686]
double.vaginal(double.pussy.penetration)[1012]
violence(battle)[969]
futanari(futa,hermaphrodite)[775]
tentacles(shokushu,tentacle)[118]
wrestling(wwe)[740]
human.doll(mannequin)[124]
cfnm()[1607]
library()[809]
triple.penetration(three.holes)[554]
spooning()[325]
hair.pulling()[405]
stuck()[2261]
grinding(assjob)[1622]
food(smoothies)[2108]
witch()[635]
hunks(jocks,hunk)[1874]
no.makeup(suppin)[1738]
colorcorrection()[2315]
sloppy.blowjob()[2149]
festive(santa.hat,new.year)[1606]
stripper()[2162]
camel.toe(cameltoe)[834]
boyish(tomboy)[1743]
magic.mirror()[1525]
subtitles(subtitle)[1358]
huge.tits()[2231]
shemale.on.male()[1998]
puffy.nipples()[1797]
forced.orgasm()[1574]
see.through(x.ray)[1399]
blackmail()[108]
shemale.on.shemale(transgirl.on.transgirl)[1804]
trimmed()[2214]
tantric()[1350]
sneaky.sex(sneaky)[2233]
period(menstruation,bloody.creampie)[1267]
underwater()[920]
colombian()[1595]
surprise.creampie(unauthorized.creampie)[1749]
ear.cleaning()[630]
detention()[626]
tight.dress()[245]
honeymoon()[902]
blue.eyes()[2336]
indonesian(indonesia)[11]
industrial(factory,warehouse)[864]
throat.fucking(irrumatio)[659]
ex.girlfriend()[1451]
ninja(female.ninja)[655]
g.spot()[686]
big.white.cock(bwc)[2193]
freckles()[519]
inverted.nipples()[1803]
cervix()[1704]
nudist(nude.nudism.cloths.free.living,cloths.free.living,naturists)[1395]
nightvision()[910]
romanian()[742]
demon()[2171]
strawberry.blond()[520]
trans.cumshot(trans.ejaculation)[2279]
freeuse()[2166]
hairy.armpits()[1327]
furry()[1096]
egirl(twitch)[1767]
milking()[2248]
arab()[1612]
soundcorrection()[2325]
vaginal.camera()[584]
magazine()[1826]
stand.and.carry()[2169]
all.girl()[2159]
reverse.rape()[426]
cum.on.cock()[2132]
prolapse()[2109]
lookalike()[1055]
thighjob()[223]
mexican()[48]
gangster(yakuza)[613]
garage()[1052]
chastity.cage(cock.cage)[2309]
tenant()[1508]
brown.eyes()[2317]
fart()[1215]
malaysian()[1367]
braids()[1603]
leggings()[2332]
edited()[2211]
first.anal()[2276]
whipped.cream()[1996]
only.handjob()[1906]
huge.toys(big.dildo)[2484]
diaper(abdl)[757]
black.female.white.male()[30]
abs()[2130]
dehummer()[2313]
interactive()[514]
suffocation(strangled,erotic.asphyxiation)[1691]
cum.on.clothes()[1608]
bottomless()[1005]
comedy()[1498]
dark.nipples(dark.areolas)[1673]
fivesome()[2135]
pool.table()[1504]
tampon()[1523]
greek()[531]
homeless()[745]
swedish()[532]
dutch()[703]
grandpa()[2190]
sex.slave()[2148]
white.female.black.male()[2327]
short.clips()[1890]
paddling()[1536]
panty.stuffing()[412]
panty.sniffing()[388]
vanilla()[2362]
clapping.cheeks()[2384]
alien()[2269]
medium.natural.tits()[2340]
younger.sister()[2236]
split.screen(splitscreen)[155]
gamer.girl()[2278]
hair.bangs()[2142]
hazel.eyes()[2346]
full.collection()[440]
big.fake.tits()[2237]
pierced()[2266]
asian.female.white.female()[2102]
midget()[844]
yandere()[1605]
gypsy()[2117]
females.only()[2548]
hairy.ass()[1893]
martial.arts()[605]
no.panties()[2222]
halloween()[2527]
thigh.high.socks()[2281]
acrobatic()[1490]
provocation()[1087]
myanmar()[1492]
polish()[2476]
category.iii(cat3,category.3,cat.3)[596]
school.boy()[2369]
latino()[2265]
delinquent()[634]
screaming()[2498]
vampire()[2219]
caretaker()[1858]
frame.interpolation()[2311]
dirty.old.man()[2175]
green.eyes()[2356]
australian()[2263]
neck.choker()[734]
pussy.to.mouth()[2440]
singing()[548]
torn.clothes()[1786]
curls()[2251]
bridesmaid()[492]
tongue.ring()[1697]
beauty.filter()[2529]
self.portrait()[1768]
hen.party()[137]
body.paint()[1656]
screens.and.covers()[1331]
cruising()[2112]
small.dick(small.cock)[2241]
swag()[1703]
subtitle.japanese()[750]
rusty.trombone()[283]
innie.pussy()[2361]
portuguese()[2145]
hole.cutout()[760]
wedding.dress()[2491]
jerking.off()[2474]
downblouse()[2410]
fancam()[2475]
kigurumi()[1781]
only.cunnilingus()[1907]
black.female.asian.male()[503]
only.masturbation()[1908]
punk()[2172]
peruvian()[1597]
cum.on.glasses()[2213]
self.anal()[2204]
laotian(laos)[669]
pussy.lineup()[2253]
hime.haircut()[625]
priest()[833]
wrist.restraints()[2215]
shaved.head(bald.woman)[2070]
cum.on.figures()[2373]
selfsuck()[1678]
austrian()[1405]
gasmask()[2480]
slovakian()[1377]
body.sushi(nyotaimori,eating.off.body)[770]
cambodian(cambodia)[13]
toy.insertion()[2492]
asian.male.latina.female()[1964]
kazakhstan()[2316]
electric.stimulation()[2282]
female.transformation()[1801]
sugarbaby()[1091]
body.measurement()[1759]
cock.worship()[2446]
murrsuit()[2557]
braless()[2494]
breathplay()[2479]
noise.reduction()[2312]
water.insertion()[1515]
sissification()[2114]
dreadlocks()[2198]
booth.girl()[2069]
identical.twins()[2242]
scottish()[2223]
teabagging()[280]
male.stripper()[1411]
evening.wear()[2275]
sumata()[2050]
throatpie()[2483]
orgasm.denial()[2115]
cat.boy()[2357]
marked.for.deletion()[615]
air.mattress()[2229]
grey.eyes()[2352]
huge.fake.tits()[2238]
milking.table()[2249]
maid.cafe()[2212]
pakistani()[2485]
nose.ring()[2119]
kidnapping()[2220]
mongolian()[863]
light.brown.hair()[2354]
age.play()[2466]
maledom()[2388]
ecuadorian()[1598]
center.spread.girls()[2280]
cesarean.scar()[2057]
eight.at.once()[2202]
super.skinny()[2267]
cfnf(clothed.female.naked.female)[2507]
streaker()[2490]
premenstrual()[391]
babyface()[2496]
subtitle.spanish()[1959]
body.mods(forked.tongue)[1777]
    `;
    // ##################################################################################
    // # END OF TAG-ID MAPPING LIST                                                     #
    // ##################################################################################

    let tagIdMapping = {}; // This will be populated by parseTagIdMap

    /**
     * Parses the multiline string of tag-to-ID mappings.
     * @param {string} mapStr - The string containing tag mappings.
     * @returns {object} An object where keys are lowercase tag names/aliases
     *                   and values are objects { id: 'ID', name: 'OriginalDisplayName' }.
     */
    function parseTagIdMap(mapStr) {
        const parsedMap = {};
        if (!mapStr || mapStr.trim() === '') {
            console.warn("Violentmonkey Script: Tag ID map string is empty.");
            return parsedMap;
        }
        const lines = mapStr.trim().split('\n');
        // Regex to match:
        // 1. displayName(aliases)[ID]  OR
        // 2. displayName[ID]
        const lineRegex = /^(.*?)\s*\((.*?)\)\[(.*?)\]$|^(.+?)\[(.*?)\]$/;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            const match = line.match(lineRegex);
            if (match) {
                let displayName, aliasesStr, id;
                if (match[1] !== undefined) { // Matched format with aliases: displayName(aliases)[ID]
                    displayName = match[1].trim();
                    aliasesStr = match[2].trim();
                    id = match[3].trim();
                } else { // Matched format without aliases: displayName[ID]
                    displayName = match[4].trim();
                    aliasesStr = ""; // No aliases
                    id = match[5].trim();
                }

                const tagEntry = { id: id, name: displayName };

                // Add display name (main key)
                parsedMap[displayName.toLowerCase()] = tagEntry;

                // Add aliases
                if (aliasesStr) {
                    aliasesStr.split(/[,;\s]+/).forEach(alias => {
                        alias = alias.trim();
                        if (alias) {
                            parsedMap[alias.toLowerCase()] = tagEntry; // Alias points to the same entry
                        }
                    });
                }
            } else {
                console.warn("Violentmonkey Script: Could not parse tag map line:", line);
            }
        });
        console.log("Violentmonkey Script: Parsed Tag ID Map:", parsedMap);
        return parsedMap;
    }

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    callback(el);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    GM_addStyle(`
        #userscript_insert_tags_button {
            margin-left: 10px;
            padding: .25rem .5rem; /* Similar to .btn-sm */
            font-size: .8203125rem; /* Similar to .btn-sm */
            line-height: 1.5;
            border-radius: .2rem; /* Similar to .btn-sm */
            border: 1px solid #9954bb; /* --info color from page */
            background-color: #f8f9fa; /* A light background */
            color: #9954bb; /* --info color */
            cursor: pointer;
            vertical-align: middle; /* Align with other form elements */
        }
        #userscript_insert_tags_button:hover {
            background-color: #e2e6ea;
            border-color: #8542a7; /* Darker info */
        }
        /* Dark mode adjustments (basic) */
        body[data-darkreader-mode] #userscript_insert_tags_button {
            background-color: #2a2e30; /* Darker background */
            color: #a86ec5;       /* Lighter info text */
            border-color: #6f378b;   /* Darker info border */
        }
        body[data-darkreader-mode] #userscript_insert_tags_button:hover {
            background-color: #343a40;
            border-color: #8542a7;
        }
    `);

    waitForElement('label[for="tag_ids"]', function(tagsLabel) {
        tagIdMapping = parseTagIdMap(tagIdMapString);
        if (Object.keys(tagIdMapping).length === 0) {
            console.warn("Violentmonkey Script: Tag ID map is empty or failed to parse. The 'Insert Tags' button may not be effective.");
        }

        const insertTagsButton = document.createElement('button');
        insertTagsButton.type = 'button';
        insertTagsButton.id = 'userscript_insert_tags_button';
        insertTagsButton.textContent = 'Insert Tags';
        insertTagsButton.title = 'Click to paste a list of tag names to add.';

        tagsLabel.insertAdjacentElement('afterend', insertTagsButton);

        insertTagsButton.addEventListener('click', function() {
            if (Object.keys(tagIdMapping).length === 0) {
                alert("Tag ID map is not loaded. Please check the script and paste your tag list into the `tagIdMapString` variable.");
                return;
            }

            const pastedTags = prompt("Paste your tags here (separated by comma):", "");
            if (pastedTags === null || pastedTags.trim() === '') {
                return; // User cancelled or entered nothing
            }

            const selectElement = $('#tag_ids');
            if (!selectElement.length || typeof $.fn.select2 !== 'function') {
                alert("Error: Select2 element for tags (#tag_ids) not found or jQuery/Select2 is not properly initialized on the page.");
                console.error("Select2 element #tag_ids not found or jQuery/Select2 not available.");
                return;
            }

            const inputTagNames = pastedTags.split(/[,;\s]+/)
                                        .map(tag => tag.trim().toLowerCase()) // Normalize input to lowercase
                                        .filter(tag => tag); // Remove any empty strings

            let currentSelectedIds = selectElement.val() || [];
            if (!Array.isArray(currentSelectedIds)) {
                currentSelectedIds = [currentSelectedIds];
            }
            // Ensure all existing selected IDs are strings for consistent comparison
            currentSelectedIds = currentSelectedIds.map(String);

            let idsToSelect = [...currentSelectedIds]; // Start with already selected IDs
            let newOptionsAddedCount = 0;
            let notFoundTags = [];

            inputTagNames.forEach(tagNameLower => {
                const tagInfo = tagIdMapping[tagNameLower];

                if (tagInfo) {
                    const { id, name: displayNameForOption } = tagInfo; // 'name' is the original display name for the option text

                    if (!idsToSelect.includes(id)) { // Check if ID is not already in the list to be selected
                        idsToSelect.push(id);

                        // Check if an option with this ID value already exists in the select dropdown
                        if (selectElement.find(`option[value="${id}"]`).length === 0) {
                            // Option doesn't exist, create and append it
                            // The text for the new option should be the 'displayNameForOption'
                            const newOption = new Option(displayNameForOption, id);
                            selectElement.append(newOption);
                            newOptionsAddedCount++;
                            console.log(`Violentmonkey Script: Added new option to dropdown: '${displayNameForOption}' (ID: '${id}')`);
                        }
                    }
                } else {
                    notFoundTags.push(tagNameLower); // Store original case if needed, but lowercase is fine for reporting
                    console.warn(`Violentmonkey Script: Tag "${tagNameLower}" not found in ID map.`);
                }
            });

            if (notFoundTags.length > 0) {
                alert("The following tags were not found in your ID map and were ignored:\n" + notFoundTags.join(", "));
            }

            idsToSelect = [...new Set(idsToSelect)]; // Ensure all IDs in the final list are unique

            selectElement.val(idsToSelect).trigger('change.select2'); // Update Select2 with the new set of IDs
            if (newOptionsAddedCount > 0) {
                 console.log(`Violentmonkey Script: Added ${newOptionsAddedCount} new <option> element(s) to the dropdown.`);
            }
            console.log("Violentmonkey Script: Updated selected tags to IDs:", idsToSelect);
        });
    });
})();