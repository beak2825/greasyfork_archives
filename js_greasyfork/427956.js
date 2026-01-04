// ==UserScript==
// @name         WME Wazer Creater
// @namespace    https://greasyfork.org/users/783417
// @version      2021.06.14.04
// @description  Creates Wazer Comments
// @author       njs923
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/427956/WME%20Wazer%20Creater.user.js
// @updateURL https://update.greasyfork.org/scripts/427956/WME%20Wazer%20Creater.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* ecmaVersion 2017 */
/* global require */
/* global $ */
/* global _ */
/* global WazeWrap */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    const wazerMainPoints = [[-825.626518426463,108.92926579900086],[-813.6832328271121,261.8033223003149],[-787.4080043267459,510.22366420179605],[-720.5256046261638,686.984292101115],[-608.2587193250656,849.4129771981388],[-450.60734852589667,985.5664338013157],[-290.56732052750885,1076.3354048961774],[-46.92429292574525,1152.7724331999198],[172.83216337487102,1169.4930330999196],[394.9772767741233,1133.6631761016324],[574.1265617739409,1076.3354048961774],[762.8304753750563,947.347919696942],[958.7003602739424,744.3120633009821],[1039.914702873677,569.9400926018134],[1087.687845574692,414.6773789068684],[1092.4651597738266,221.1961511010304],[1051.8579884748906,30.103580403141677],[937.2024460732937,-192.0415329998359],[769.9964467734098,-359.24753239937127],[566.3634261749685,-476.88889610022306],[523.9314865749329,-495.24297410435975],[465.40938657335937,-519.1295454027131],[406.88728697411716,-534.6558167971671],[335.22757297568023,-547.7934309970587],[249.23591617494822,-553.7650738982484],[163.27753487415612,-557.5060744965449],[-259.5147778261453,-552.7287601968274],[-312.363816825673,-486.7444393970072],[-394.77248792536557,-428.22233960032463],[-452.10025912337005,-417.47338250279427],[-532.1202731262892,-416.279054004699],[-599.002672823146,-438.97129670344293],[-668.2737297285348,-481.96712509635836],[-747.0994151253253,-609.7602817993611],[-754.2653865255415,-687.3916386011988],[-739.9334437251091,-776.966281099245],[-696.9376153256744,-845.0430093985051],[-637.9721384253353,-898.2501378972083],[-547.8003316260874,-934.6771591976285],[-478.5292747244239,-940.0516377994791],[-402.68941072560847,-924.5253663919866],[-331.62686102464795,-885.7096879947931],[-265.9387898258865,-812.855645397678],[-242.0522185266018,-751.3477242002264],[-235.62820652499795,-693.6595310987905],[141.77962067350745,-691.2708738045767],[148.34842777438462,-745.6128235943615],[168.65201337449253,-804.7320876931772],[224.18829177506268,-874.6003088001162],[299.4309914726764,-924.1649442994967],[400.35175537504256,-940.288379999809],[492.9122192747891,-924.1649442994967],[568.1549189724028,-879.9747873991728],[629.0656758733094,-811.3008947996423],[660.7153829764575,-725.9064021995291],[660.7153829764575,-645.8863882990554],[646.3834400735795,-583.7813027957454],[824.9355608746409,-478.68038909882307],[951.5343888737261,-364.0248466953635],[1054.2466456741095,-251.75796139240265],[1123.5177025739104,-122.7704761987552],[1197.5660736747086,68.3220945019275],[1223.8413021750748,242.6940652988851],[1219.0639878734946,438.5639502014965],[1180.8454737737775,586.6606925027445],[1085.2991883736104,804.0284917028621],[941.9797603748739,961.6798625066876],[815.3809322733432,1083.5013763038442],[664.8955328743905,1169.4930330999196],[478.58027647435665,1248.3187185013667],[289.87636287510395,1286.5372326010838],[134.61364927329123,1296.0918611995876],[-27.81503582559526,1286.5372326010838],[-185.46640662662685,1253.0960328010842],[-307.2879205234349,1202.9342330014333],[-462.55063412711024,1119.331233303994],[-603.4814050253481,1023.7849480006844],[-708.5823189262301,921.072691200301],[-794.5739757250994,811.1944630956277],[-866.233689725399,672.6523493025452],[-911.6181753259152,522.1669499026611],[-933.1160895265639,386.0134933060035],[-953.7182572241873,140.27805820014328],[-978.7991571258754,51.89774420205504],[-1021.79498552531,-6.624355601146817],[-1051.6531997267157,-28.122269799932837],[-1086.2887281253934,-35.28824120294303],[-1143.6164993252605,-35.28824120294303],[-1194.9726277254522,-55.591826799325645],[-1236.7741275262088,-95.00466950144619],[-1253.4947274252772,-142.7778121996671],[-1253.4947274252772,-197.71692620031536],[-1227.2194990254939,-255.04469739831984],[-1167.5030706264079,-329.0930685997009],[-1040.90424262546,-436.58263960201293],[-911.9167573284358,-522.574296399951],[-742.3221009261906,-596.6226676004007],[-671.856715425849,-483.1614536959678],[-851.0060004256666,-407.9187539992854],[-987.1594570279121,-318.34411150496453],[-1085.0943995267153,-221.60349759459496],[-1130.4788851253688,-165.47005490213633],[-1055.2361854258925,-164.2757263975218],[-979.9934856258333,-139.19482649862766],[-927.4430287256837,-96.19899809546769],[-855.7833147253841,4.124601501971483]];
    const wazerLEyePoints = [[-148.03461312502623,644.3344240998849],[-204.16805572621524,635.9741241019219],[-259.1071698255837,591.7839671028778],[-275.8277697265148,545.2051529996097],[-275.8277697265148,497.43201029952615],[-256.718512725085,448.46453910227865],[-224.47164142504334,410.24602500442415],[-181.47581302560866,394.719753597863],[-131.31401322595775,392.33109650202096],[-95.48415622673929,405.4687107009813],[-59.65429922565818,436.52125339768827],[-32.184742126613855,474.7397675970569],[-28.601756425574422,528.4845530986786],[-38.15638502500951,576.2576958006248],[-66.8202706258744,615.6705384999514],[-105.03878472559154,638.362781200558]];
    const wazerREyePoints = [[445.5466845743358,661.0550239980221],[389.4132419731468,652.6947239981964],[346.4174134749919,622.8365099001676],[318.9478564746678,575.063367200084],[317.75352787412703,535.6505244988948],[320.1421850733459,509.37529599666595],[338.0571135748178,469.962453299202],[360.7493562735617,440.1042390950024],[407.3281704746187,413.8290107017383],[450.32399887405336,409.0516964001581],[501.6801271736622,423.3836391996592],[536.3156556747854,453.24185340013355],[563.7852126751095,498.62633889820427],[570.9511840734631,553.5654530003667],[555.4249126743525,603.7272528009489],[501.6801271736622,652.6947239981964]];
    const wazerSmilePoints = [[-229.2489556260407,266.92659699730575],[-261.4958269260824,259.7606255989522],[-286.57672692649066,237.06838279496878],[-296.1313554253429,203.6271829046309],[-292.54836972616613,174.9632973028347],[-269.8561269249767,102.10925470199436],[-214.91701282560825,8.951626505702734],[-148.03461312502623,-51.959130394272506],[-62.042956326156855,-108.09257299825549],[25.143029073253274,-134.36780149769038],[108.74602877348661,-151.0884013948962],[168.46245707385242,-147.5054156994447],[246.09381387382746,-140.33944429829717],[352.3890563733876,-111.67555869650096],[428.8260846734047,-73.45704459864646],[512.4290842749178,-2.991659101098776],[560.2022269740701,60.30775489844382],[596.0320839732885,130.77314030285925],[604.3923839740455,183.32359729986638],[594.8377553746104,214.3761400040239],[568.562526974827,234.67972560133785],[537.5099841747433,241.84569700062275],[504.0687843747437,232.29106849897653],[482.57087017409503,216.76479709986597],[470.62758447416127,178.5462829992175],[447.9353416748345,130.77314030285925],[396.579213373363,68.6680548992008],[347.61174207367003,30.44954070355743],[295.06128517352045,7.757298002950847],[197.1263426747173,-23.29524479713291],[101.58005737327039,-23.29524479713291],[16.782729076221585,-1.7973305964842439],[-56.07131352648139,38.8098406996578],[-114.59341322630644,96.13761190045625],[-148.03461312502623,146.29941170383245],[-164.75521302595735,201.23852579668164],[-171.92118442431092,239.45703989826143],[-195.8077558260411,259.7606255989522]];

    let center;
    function bootstrap(tries=1) {
        if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready)
        {
            init();
        }
        else if (tries < 1000)
        {
            setTimeout(function () {bootstrap(++tries);}, 200);
        }
    }

    bootstrap();

    function init(){
        W.selectionManager.events.register("selectionchanged", null, addButtons);
        console.log("WME Wazer Creater " + GM_info.script.version);
    }

    function addButtons(){
        if (WazeWrap.hasMapCommentSelected())
        {
            let mapComment = WazeWrap.getSelectedFeatures()[0];
            const lockRegion = $('.lock-edit-region');

            const regionDiv = $('<div class="wazer-creater-region"/>');
            const mainDiv = $('<div class="form-group"/>');
            mainDiv.append($('<label class="wazer-creater-label control-label">Wazer Creater (center unset)</label>'));
            const controlsDiv = $('<div class="controls"/>');
            controlsDiv.append($('<div><button id="wazerCreatorSetCenter" class="waze-btn wazerCreatorSetCenterButton" type="button">Set Center for Wazer</button></div>'));
            controlsDiv.append($('<div><button id="wazerCreatorCreateBody" class="waze-btn wazerCreatorCreateBodyButton" type="button">Create Wazer body</button></div>'));
            controlsDiv.append($('<div><button id="wazerCreatorCreateLEye" class="waze-btn wazerCreatorCreateLEyeButton" type="button">Create left Wazer eye</button></div>'));
            controlsDiv.append($('<div><button id="wazerCreatorCreateREye" class="waze-btn wazerCreatorCreateREyeButton" type="button">Create right Wazer eye</button></div>'));
            controlsDiv.append($('<div><button id="wazerCreatorCreateSmile" class="waze-btn wazerCreatorCreateSmileButton" type="button">Create Wazer smile</button></div>'));

            mainDiv.append(controlsDiv);
            regionDiv.append(mainDiv);
            lockRegion.before(regionDiv);

            if (center)
            {
                $('.wazer-creater-label').text('Wazer Creater');
                setButtons(true);
            }
            else
            {
                setButtons(false);
            }

            $('.wazerCreatorSetCenterButton').on('click', setCenter);
            $('.wazerCreatorCreateBodyButton').on('click', createWazerBody);
            $('.wazerCreatorCreateLEyeButton').on('click', createWazerLEye);
            $('.wazerCreatorCreateREyeButton').on('click', createWazerREye);
            $('.wazerCreatorCreateSmileButton').on('click', createWazerSmile);
        }
    }

    function setCenter(){
        if (WazeWrap.hasMapCommentSelected())
        {
            let mapComment = WazeWrap.getSelectedFeatures()[0];
            let model = mapComment.model;
            center = model.geometry.getCentroid();
            $('.wazer-creater-label').text('Wazer Creater');
            setButtons(true);
        }
    }

    function setButtons(enabled){
        if (enabled){
            $('.wazerCreatorCreateBodyButton').removeAttr("disabled");
            $('.wazerCreatorCreateLEyeButton').removeAttr("disabled");
            $('.wazerCreatorCreateREyeButton').removeAttr("disabled");
            $('.wazerCreatorCreateSmileButton').removeAttr("disabled");
        }
        else{
            $('.wazerCreatorCreateBodyButton').attr("disabled");
            $('.wazerCreatorCreateLEyeButton').attr("disabled");
            $('.wazerCreatorCreateREyeButton').attr("disabled");
            $('.wazerCreatorCreateSmileButton').attr("disabled");
        }
    }

    function updateCommentForWazer(points){
        if (WazeWrap.hasMapCommentSelected())
        {
            var mapComment = WazeWrap.getSelectedFeatures()[0];
            let model = mapComment.model;
            //getPointsArray(model.geometry)
            let newerGeo = getWazerWKT(points);
            let UO = require("Waze/Action/UpdateObject");
            W.model.actionManager.add(new UO(model, { geometry: newerGeo }));
        }
    }

    function getPointsArray(geometry){
        let vertices = geometry.getVertices();
        let str = '[';
        for(let x = 0; x < vertices.length; x++)
        {
            str += `[${vertices[x].x-center.x},${vertices[x].y-center.y}],`;
        }
        str = str.slice(0, -1);
        str += ']';
        console.log(str);
    }

    function createWazerBody(){ updateCommentForWazer(wazerMainPoints); }
    function createWazerLEye(){ updateCommentForWazer(wazerLEyePoints); }
    function createWazerREye(){ updateCommentForWazer(wazerREyePoints); }
    function createWazerSmile(){ updateCommentForWazer(wazerSmilePoints); }

    function getWazerWKT(points){
        let wktText = 'POLYGON((';
        for (let i=0; i < points.length; i++){
            wktText += `${center.x + points[i][0]} ${center.y + points[i][1]},`;
        }
        wktText = wktText.slice(0, -1)
        wktText += '))';
        return OpenLayers.Geometry.fromWKT(wktText);
    }
})();
