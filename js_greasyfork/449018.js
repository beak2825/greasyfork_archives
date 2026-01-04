// ==UserScript==
// @name         699_uzii
// @match        https://*.tankionline.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @version      1.0
// @author       AIM
// @description  Yeet
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/914747
// @downloadURL https://update.greasyfork.org/scripts/449018/699_uzii.user.js
// @updateURL https://update.greasyfork.org/scripts/449018/699_uzii.meta.js
// ==/UserScript==


function setStyle()

{

    let colors = ImGui.GetStyle().Colors;



    ImGui.GetStyle().WindowTitleAlign.x = 0.5;



    colors[ImGui.Col.Text] = new ImGui.Vec4(0.95, 0.96, 0.98, 1.00);

    colors[ImGui.Col.TextDisabled] = new ImGui.Vec4(0.36, 0.42, 0.47, 1.00);

    colors[ImGui.Col.WindowBg] = new ImGui.Vec4(0.11, 0.15, 0.17, 1.00);

    colors[ImGui.Col.ChildBg] = new ImGui.Vec4(0.15, 0.18, 0.22, 1.00);

    colors[ImGui.Col.PopupBg] = new ImGui.Vec4(0.08, 0.08, 0.08, 0.94);

    colors[ImGui.Col.Border] = new ImGui.Vec4(0.08, 0.10, 0.12, 1.00);

    colors[ImGui.Col.BorderShadow] = new ImGui.Vec4(0.00, 0.00, 0.00, 0.00);

    colors[ImGui.Col.FrameBg] = new ImGui.Vec4(0.20, 0.25, 0.29, 1.00);

    colors[ImGui.Col.FrameBgHovered] = new ImGui.Vec4(0.12, 0.20, 0.28, 1.00);

    colors[ImGui.Col.FrameBgActive] = new ImGui.Vec4(0.09, 0.12, 0.14, 1.00);

    colors[ImGui.Col.TitleBg] = new ImGui.Vec4(0.09, 0.12, 0.14, 0.65);

    colors[ImGui.Col.TitleBgActive] = new ImGui.Vec4(0.08, 0.10, 0.12, 1.00);

    colors[ImGui.Col.TitleBgCollapsed] = new ImGui.Vec4(0.00, 0.00, 0.00, 0.51);

    colors[ImGui.Col.MenuBarBg] = new ImGui.Vec4(0.15, 0.18, 0.22, 1.00);

    colors[ImGui.Col.ScrollbarBg] = new ImGui.Vec4(0.02, 0.02, 0.02, 0.39);

    colors[ImGui.Col.ScrollbarGrab] = new ImGui.Vec4(0.20, 0.25, 0.29, 1.00);

    colors[ImGui.Col.ScrollbarGrabHovered] = new ImGui.Vec4(0.18, 0.22, 0.25, 1.00);

    colors[ImGui.Col.ScrollbarGrabActive] = new ImGui.Vec4(0.09, 0.21, 0.31, 1.00);

    colors[ImGui.Col.CheckMark] = new ImGui.Vec4(0.28, 0.56, 1.00, 1.00);

    colors[ImGui.Col.SliderGrab] = new ImGui.Vec4(0.28, 0.56, 1.00, 1.00);

    colors[ImGui.Col.SliderGrabActive] = new ImGui.Vec4(0.37, 0.61, 1.00, 1.00);

    colors[ImGui.Col.Button] = new ImGui.Vec4(0.20, 0.25, 0.29, 1.00);

    colors[ImGui.Col.ButtonHovered] = new ImGui.Vec4(0.28, 0.56, 1.00, 1.00);

    colors[ImGui.Col.ButtonActive] = new ImGui.Vec4(0.06, 0.53, 0.98, 1.00);

    colors[ImGui.Col.Header] = new ImGui.Vec4(0.20, 0.25, 0.29, 0.55);

    colors[ImGui.Col.HeaderHovered] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.80);

    colors[ImGui.Col.HeaderActive] = new ImGui.Vec4(0.26, 0.59, 0.98, 1.00);

    colors[ImGui.Col.Separator] = new ImGui.Vec4(0.20, 0.25, 0.29, 1.00);

    colors[ImGui.Col.SeparatorHovered] = new ImGui.Vec4(0.10, 0.40, 0.75, 0.78);

    colors[ImGui.Col.SeparatorActive] = new ImGui.Vec4(0.10, 0.40, 0.75, 1.00);

    colors[ImGui.Col.ResizeGrip] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.25);

    colors[ImGui.Col.ResizeGripHovered] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.67);

    colors[ImGui.Col.ResizeGripActive] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.95);

    colors[ImGui.Col.Tab] = new ImGui.Vec4(0.11, 0.15, 0.17, 1.00);

    colors[ImGui.Col.TabHovered] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.80);

    colors[ImGui.Col.TabActive] = new ImGui.Vec4(0.20, 0.25, 0.29, 1.00);

    colors[ImGui.Col.TabUnfocused] = new ImGui.Vec4(0.11, 0.15, 0.17, 1.00);

    colors[ImGui.Col.TabUnfocusedActive] = new ImGui.Vec4(0.11, 0.15, 0.17, 1.00);

    colors[ImGui.Col.PlotLines] = new ImGui.Vec4(0.61, 0.61, 0.61, 1.00);

    colors[ImGui.Col.PlotLinesHovered] = new ImGui.Vec4(1.00, 0.43, 0.35, 1.00);

    colors[ImGui.Col.PlotHistogram] = new ImGui.Vec4(0.90, 0.70, 0.00, 1.00);

    colors[ImGui.Col.PlotHistogramHovered] = new ImGui.Vec4(1.00, 0.60, 0.00, 1.00);

    colors[ImGui.Col.TextSelectedBg] = new ImGui.Vec4(0.26, 0.59, 0.98, 0.35);

    colors[ImGui.Col.DragDropTarget] = new ImGui.Vec4(1.00, 1.00, 0.00, 0.90);

    colors[ImGui.Col.NavHighlight] = new ImGui.Vec4(0.26, 0.59, 0.98, 1.00);

    colors[ImGui.Col.NavWindowingHighlight] = new ImGui.Vec4(1.00, 1.00, 1.00, 0.70);

    colors[ImGui.Col.NavWindowingDimBg] = new ImGui.Vec4(0.80, 0.80, 0.80, 0.20);

    colors[ImGui.Col.ModalWindowDimBg] = new ImGui.Vec4(0.80, 0.80, 0.80, 0.35);

}



// utils.h.js



class Utils

{

    getRootElement      = null; // args: void

    getRootObject       = null; // args: void

    getRenderElement    = null; // args: void

    getRandomArbitrary  = null; // args: void



    isNotOpenChat       = null; // args: void

    isParkourMode       = null; // args: void

    isNotKillZone       = null; // args: 1 - world, 2 - position {x, y, z}

    isGameReady         = null; // args: void

    isPlayerEnemy       = null; // args: 1 - localPlayer, 2 - player



    getPlayers          = null; // args: 1 - world, 2 - localPlayer, 3 - isOnlyEnemy (= false)

    getPlayerById       = null; // args: 1 - world, 2 - localPlayer, 3 - playerId

    getPlayerName       = null; // args: 1 - player



    getBodyById         = null; // args: 1 - world, 2 - localPlayer, 3 - playerId

    getPlayerBody       = null; // args: 1 - player

}



utilsObjects =

{

    rootElement: null,

    rootObject: null

}



class ImGui_Var

{

    constructor(value)

    {

        this.value = value;

        this.access = (value = this.value) => this.value = value;

    };

}

// utils.c.js



Utils.getRootElement = function ()

{

    if (utilsObjects.rootElement)

    {

        return utilsObjects.rootElement;

    }



    if (!document.getElementById("root"))

    {

        return null;

    }



    return utilsObjects.rootElement = document.getElementById("root")._reactRootContainer;

}



Utils.getRootObject = function ()

{

    if (utilsObjects.rootObject)

    {

        utilsObjects.rootObject.store.state.shop.enabled = true;



        return utilsObjects.rootObject;

    }



    let rootElement = Utils.getRootElement();



    if (!rootElement)

    {

        return null;

    }



    if (!rootElement.hasOwnProperty("_internalRoot"))

    {

        return null;

    }



    return utilsObjects.rootObject = rootElement._internalRoot.current.memoizedState.

        element.type.prototype;

}



Utils.getRenderElement = function ()

{

    return document.getElementsByClassName("sc-bwzfXH hjlOfi").item(0);

}



Utils.getRandomArbitrary = function (min, max)

{

    return Math.random() * (max - min) + min;

}



Utils.isNotOpenChat = function ()

{

    return (document.getElementsByClassName("sc-bwzfXH iokmvL").item(0) == null);

}



Utils.isParkourMode = function ()

{

    let rootObject = Utils.getRootObject();



    if (!rootObject)

        return false;



    return rootObject.store.state.battleStatistics.isParkourMode;

}



Utils.isNotKillZone = function (world, position)

{

    if (!Utils.isParkourMode())

    {

        return true;

    }



    if (!world)

        return false;



    let bounds = world.entities_0.array_hd7ov6$_0.at(0).components_0.array.at(0).bounds;



    if (!bounds)

        return false;



    if (position.x != 0 && (position.x >= bounds.maxX || position.x <= bounds.minX))

        return false;



    if (position.y != 0 && (position.y >= bounds.maxY || position.y <= bounds.minY))

        return false;



    return true;

}



Utils.isGameReady = function ()

{

    let rootObject = Utils.getRootObject();



    if (!rootObject)

    {

        return false;

    }



    if (!rootObject.store.state.battleStatistics.battleLoaded)

    {

        return false;

    }



    let localPlayer = GameObjects.getLocalPlayer();



    if (!localPlayer)

    {

        return false;

    }



    if (localPlayer.length == 0)

    {

        return false;

    }



    return true;

}



Utils.isPlayerEnemy = function(localPlayer, player)

{

    if (!player || !localPlayer)

    {

        return null;

    }



    if (!player.at(0))

    {

        return null;

    }



    let team = player.at(0).team;



    if (!team)

    {

        return null;

    }



    let name$ = team.name$;



    if (!name$)

    {

        return null;

    }



    if (localPlayer.at(0).team.name$ != "NONE" && localPlayer.at(0).team.name$ == name$)

    {

        return false;

    }



    return true;

}



Utils.getPlayers = function(world, localPlayer, isOnlyEnemy = false)

{

    if (!world || !localPlayer)

    {

        return null;

    }



    let bodies = world.physicsScene_0.bodies_0.toArray();



    if (!bodies)

    {

        return null;

    }



    let playersArray = [];



    for (let i = 0; i < bodies.length; i++)

    {

        if (!bodies.at(i))

        {

            continue;

        }



        let data = bodies.at(i).data;



        if (!data)

        {

            continue;

        }



        let components_0 = data.components_0;



        if (!components_0)

        {

            continue;

        }



        components_0 = components_0.array;



        if (!components_0)

        {

            continue;

        }



        if (components_0.length == 0)

        {

            continue;

        }



        if (isOnlyEnemy)

        {

            if (Utils.isPlayerEnemy(localPlayer, components_0) == false)

            {

                continue;

            }

        }



        if (localPlayer != components_0)

        {

            playersArray.push(components_0);

        }

    }



    return playersArray;

}



Utils.getPlayerById = function(world, localPlayer, playerId)

{

    if (!world || !localPlayer || !playerId)

    {

        return null;

    }



    let playersArray = Utils.getPlayers(world, localPlayer);



    if (!playersArray)

    {

        return null;

    }



    if (playersArray.length == 0)

    {

        return null;

    }



    for (let i = 0; i < playersArray.length; i++)

    {

        for (let n = 0; n < playersArray.at(i).length; n++)

        {

            if (playersArray.at(i).at(n).__proto__.hasOwnProperty("userId"))

            {

                if (playerId == playersArray.at(i).at(n).userId)

                {

                    return playersArray.at(i);

                }

            }

        }

    }



    return null;

}



Utils.getPlayerName = function(player)

{

    if (!player)

    {

        return null;

    }



    if (player.length == 0)

    {

        return null;

    }



    let configuration_0;



    for (let i = 0; i < player.length; i++)

    {

        if (player.at(i).hasOwnProperty("configuration_0"))

        {

            configuration_0 = player.at(i).configuration_0;

            break;

        }

    }



    if (!configuration_0)

    {

        return null;

    }



    if (!configuration_0.userName)

    {

        return null;

    }



    return configuration_0.userName;

}



Utils.getBodyById = function(world, localPlayer, playerId)

{

    if (!world || !localPlayer || !playerId)

    {

        return null;

    }



    let player = Utils.getPlayerById(world, localPlayer, playerId);



    if (!player)

    {

        return null;

    }



    for (let i = 0; i < player.length; i++)

    {

        if (player.at(i).__proto__.hasOwnProperty("tankBody_0"))

        {

            tankBody_0 = player.at(i).tankBody_0;



            if (!tankBody_0)

            {

                return null;

            }



            return tankBody_0;

        }

    }



    return null;

}



Utils.getPlayerBody = function(player)

{

    if (!player)

    {

        return null;

    }



    for (let i = 0; i < player.length; i++)

    {

        if (player.at(i).__proto__.hasOwnProperty("tankBody_0"))

        {

            tankBody_0 = player.at(i).tankBody_0;



            if (!tankBody_0)

            {

                return null;

            }



            return tankBody_0;

        }

    }



    return null;

}

// gameObjects.h.js



class GameObjects

{

    // World

    getWorld                = null; // args: void

    getGameActions          = null; // args: void

    getMines                = null; // args: void



    // Tank

    getLocalPlayer          = null; // args: void

    getPhysicsComponent     = null; // args: void

    getHealthComponent      = null; // args: void

    getCamera               = null; // args: void

    getTrackedChassis       = null; // args: void

    getSpeedCharacteristics = null; // args: void



    // Weapon

    getStrikerComponent     = null; // args: void

}

// gameObjects.c.js



gameObjects =

{

    localPlayer: null,

    world: null,

    gameActions: null,

    mines: null,

    physicsComponent: null,

    healthComponent: null,

    camera: null,

    trackedChassis: null,

    speedCharacteristics: null,

    strikerComponent: null

}



GameObjects.getWorld = function ()

{

    if (gameObjects.world)

    {

        return gameObjects.world;

    }



    let rootObject = Utils.getRootObject();



    if (!rootObject)

    {

        return null;

    }



    let subs = rootObject.store.subscribers.toArray();



    if (!subs)

    {

        return null;

    }



    let world = subs.find(element => element["tank"] != null && element["tank"].hasOwnProperty("world"));



    if (!world)

    {

        return null;

    }



    return gameObjects.world = world.tank.world;

}



GameObjects.getGameActions = function ()

{

    if (gameObjects.gameActions)

    {

        return gameObjects.gameActions;

    }



    let world = this.getWorld();



    if (!world)

    {

        return null;

    }



    return gameObjects.gameActions = Array.from(world.inputManager.input.gameActions_0.map);

}



GameObjects.getMines = function ()

{

    if (gameObjects.mines)

    {

        return gameObjects.mines;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    let gameMode_0 = localPlayer.at(0).gameMode_0.components_0.array;



    if (!gameMode_0)

    {

        return null;

    }



    return gameObjects.mines = gameMode_0.at(15);

}



GameObjects.getLocalPlayer = function ()

{

    if (gameObjects.localPlayer)

    {

        return gameObjects.localPlayer;

    }



    let world = this.getWorld();



    if (!world)

    {

        return null;

    }



    let bodies = world.physicsScene_0.bodies_0.toArray();



    for (let i = 0; i < bodies.length; i++)

    {

        if (bodies.at(i).data.isPossessed == true)

        {

            return gameObjects.localPlayer = bodies.at(i).data.components_0.array;

        }

    }



    gameObjects.world = null;



    return null;

}



GameObjects.getPhysicsComponent = function ()

{

    if (gameObjects.physicsComponent)

    {

        return gameObjects.physicsComponent;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("tankPhysicsComponent_0"))

        {

            return gameObjects.physicsComponent = localPlayer.at(i).tankPhysicsComponent_0;

        }

    }



    return null;

}



GameObjects.getHealthComponent = function ()

{

    if (gameObjects.healthComponent)

    {

        return gameObjects.healthComponent;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("health"))

        {

            return gameObjects.healthComponent = localPlayer.at(i);

        }

    }



    return null;

}



GameObjects.getCamera = function ()

{

    if (gameObjects.camera)

    {

        return gameObjects.camera;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("followCamera_0"))

        {

            return gameObjects.camera = localPlayer.at(i).followCamera_0.currState_0;

        }

    }



    return null;

}



GameObjects.getTrackedChassis = function ()

{

    if (gameObjects.trackedChassis)

    {

        return gameObjects.trackedChassis;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("trackedChassis_0"))

        {

            return gameObjects.trackedChassis = localPlayer.at(i).trackedChassis_0.params_0;

        }

    }



    return null;

}



GameObjects.getSpeedCharacteristics = function ()

{

    if (gameObjects.speedCharacteristics)

    {

        return gameObjects.speedCharacteristics;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("speedCharacteristics_0") &&

        localPlayer.at(i).__proto__.hasOwnProperty("maxSpeedSmoother_0"))

        {

            return gameObjects.speedCharacteristics = localPlayer.at(i);

        }

    }



    return null;

}



GameObjects.getStrikerComponent = function ()

{

    if (gameObjects.strikerComponent)

    {

        return gameObjects.strikerComponent;

    }



    let localPlayer = this.getLocalPlayer();



    if (!localPlayer)

    {

        return null;

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).__proto__.hasOwnProperty("strikerWeapon_0"))

        {

            strikerData.type = "striker";

            return gameObjects.strikerComponent = localPlayer.at(i).strikerWeapon_0;

        }

        else if (localPlayer.at(i).hasOwnProperty("scorpioData_7x2wz0$_0"))

        {

            strikerData.type = "scorpion";

            return gameObjects.strikerComponent = localPlayer.at(i);

        }

    }



    return null;

}

// airBreak.h.js



class FlyHack

{

    process = null; // args: 1 - localPlayer

}



const flyHack =

{

    isKeyPressed: false,

    state: new ImGui_Var(false),

    speed: new ImGui_Var(50),

    position: { x: 0, y: 0, z: 0 }

}



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 103 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        flyHack.isKeyPressed = true;

    }

})



FlyHack.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    if (flyHack.isKeyPressed)

    {

        flyHack.isKeyPressed = false;



        flyHack.state.value = !flyHack.state.value;



        if (flyHack.state.value)

        {

            flyHack.position.x = physicsComponent.body.state.position.x;

            flyHack.position.y = physicsComponent.body.state.position.y;

            flyHack.position.z = physicsComponent.body.state.position.z;

        }

        else

        {
            

            physicsComponent.body.movable = true;

            physicsComponent.body.state.velocity.x = 0;

            physicsComponent.body.state.velocity.y = 0;

            physicsComponent.body.state.velocity.z = 0;



            physicsComponent.body.state.angularVelocity.x = 0;

            physicsComponent.body.state.angularVelocity.y = 0;

            physicsComponent.body.state.angularVelocity.z = 0;

        }

    }



    if (!flyHack.state.value)

    {

        return;

    }



    if (KeyPressing.isKeyPressed(38 /*key: Up*/) && Utils.isNotOpenChat())

    {

        let position =

        {

            x: 0,

            y: flyHack.position.y + flyHack.speed.value,

            z: 0

        };



        if (Utils.isNotKillZone(world, position))

        {

            flyHack.position.y = position.y;

        }

    }



    if (KeyPressing.isKeyPressed(40 /*key: Down*/) && Utils.isNotOpenChat())

    {

        let position =

        {

            x: 0,

            y: flyHack.position.y - flyHack.speed.value,

            z: 0

        };



        if (Utils.isNotKillZone(world, position))

        {

            flyHack.position.y = position.y;

        }

    }



    if (KeyPressing.isKeyPressed(37 /*key: Left*/) && Utils.isNotOpenChat())

    {

        let position =

        {

            x: flyHack.position.x - flyHack.speed.value,

            y: 0,

            z: 0

        };



        if (Utils.isNotKillZone(world, position))

        {

            flyHack.position.x = position.x;

        }

    }



    if (KeyPressing.isKeyPressed(39 /*key: Right*/) && Utils.isNotOpenChat())

    {

        let position =

        {

            x: flyHack.position.x + flyHack.speed.value,

            y: 0,

            z: 0

        };



        if (Utils.isNotKillZone(world, position))

        {

            flyHack.position.x = position.x;

        }

    }



    if (KeyPressing.isKeyPressed(74 /*key: J*/) && Utils.isNotOpenChat())

    {

        flyHack.position.z += flyHack.speed.value;

    }



    if (KeyPressing.isKeyPressed(75 /*key: K*/) && Utils.isNotOpenChat())

    {

        flyHack.position.z -= flyHack.speed.value;

    }



    if (KeyPressing.isKeyPressed(101 /*key: F*/) && Utils.isNotOpenChat())

    {

        if (flyHack.speed.value > 1)

            flyHack.speed.value -= 2;

    }



    if (KeyPressing.isKeyPressed(102 /*key: V*/) && Utils.isNotOpenChat())

    {

        flyHack.speed.value += 2;

    }



    if(flyHack.speed.value >= 300){

    flyHack.speed.value = 300

    }



    physicsComponent.body.movable = false;

    physicsComponent.body.state.position.x = flyHack.position.x;

    physicsComponent.body.state.position.y = flyHack.position.y;

    physicsComponent.body.state.position.z = flyHack.position.z;



    physicsComponent.body.state.orientation.w = 0;

    physicsComponent.body.state.orientation.z = 0;

    physicsComponent.body.state.orientation.x = 0;

    physicsComponent.body.state.orientation.y = 0;



    physicsComponent.body.state.angularVelocity.x = 0;

    physicsComponent.body.state.angularVelocity.y = 0;

    physicsComponent.body.state.angularVelocity.z = 0;

}







class AirBreak

{

    process = null; // args: 1 - localPlayer

}



airBreak =

{

    enabled: new ImGui_Var(true),

    isShiftPressed: false,

    state: false,

    airWalk: new ImGui_Var(false),

    speed: new ImGui_Var(70),

    position: { x: 0, y: 0, z: 0 }

}

// airBreak.c.js



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 16 && e.location == 2 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        airBreak.isShiftPressed = true;

    }

})



let dt = 0.033;

let startSpeed =

{

    forward: 0,

    right: 0,

    up: 0

};



AirBreak.process = function (localPlayer)

{

    if (!airBreak.enabled.value)

    {

        return;

    }



    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    let trackedChassis = GameObjects.getTrackedChassis();



    let camera = GameObjects.getCamera();



    if (!camera)

    {

        return;

    }



    let bodies = world.physicsScene_0.bodies_0.array_hd7ov6$_0;



    if (!bodies)

    {

        return;

    }



    if (!airBreak.state.value && trackedChassis)

    {

        trackedChassis.maxRayLength = 50;

        trackedChassis.dampingCoeff = 2000;

        trackedChassis.springCoeff = 16000;

    }



    if (airBreak.isShiftPressed)

    {

        airBreak.isShiftPressed = false;



        airBreak.state = !airBreak.state;



        startSpeed =

        {

            forward: 0,

            right: 0,

            up: 0

        };



        if (airBreak.state)

        {

            airBreak.position.x = physicsComponent.body.state.position.x;

            airBreak.position.y = physicsComponent.body.state.position.y;

            airBreak.position.z = physicsComponent.body.state.position.z;

        }

        else

        {

            physicsComponent.body.state.velocity.x = 0;

            physicsComponent.body.state.velocity.y = 0;

            physicsComponent.body.state.velocity.z = 0;



            physicsComponent.body.state.angularVelocity.x = 0;

            physicsComponent.body.state.angularVelocity.y = 0;

            physicsComponent.body.state.angularVelocity.z = 0;



            for (let i = 0; i < bodies.length; i++)

            {

                bodies.at(i).state.velocity.x = 0;

                bodies.at(i).state.velocity.y = 0;

                bodies.at(i).state.velocity.z = 0;



                bodies.at(i).state.angularVelocity.x = 0;

                bodies.at(i).state.angularVelocity.y = 0;

                bodies.at(i).state.angularVelocity.z = 0;



                bodies.at(i).movable = true;

            }

        }

    }



    if (!airBreak.state)

    {

        return;

    }



    dt = world.physicsScene_0.dt;



    let direction = camera.direction;



    if (!airBreak.airWalk.value)

    {

        if (KeyPressing.isKeyPressed(87 /*key: W*/) && Utils.isNotOpenChat())

        {

            startSpeed.forward += (airBreak.speed.value - startSpeed.forward) * dt;



            let position =

            {

                x: airBreak.position.x + startSpeed.forward * Math.sin(-direction),

                y: airBreak.position.y + startSpeed.forward * Math.cos(-direction),

                z: 0

            };



            if (Utils.isNotKillZone(world, position))

            {

                airBreak.position.x = position.x;

                airBreak.position.y = position.y;

            }

        }

        else

        {

            if (Utils.isParkourMode())

            {

                if (startSpeed.forward > 0)

                {

                    startSpeed.forward += (0 - startSpeed.forward) * (dt * 1.3);



                    let position =

                    {

                        x: airBreak.position.x + startSpeed.forward * Math.sin(-direction),

                        y: airBreak.position.y + startSpeed.forward * Math.cos(-direction),

                        z: 0

                    };



                    if (Utils.isNotKillZone(world, position))

                    {

                        airBreak.position.x = position.x;

                        airBreak.position.y = position.y;

                    }

                }

            }

            else

            {

                startSpeed.forward = 0;

            }

        }



        if (KeyPressing.isKeyPressed(83 /*key: S*/) && Utils.isNotOpenChat())

        {

            startSpeed.forward -= (airBreak.speed.value - (-startSpeed.forward)) * dt;



            let position =

            {

                x: airBreak.position.x + startSpeed.forward * Math.sin(-direction),

                y: airBreak.position.y + startSpeed.forward * Math.cos(-direction),

                z: 0

            };



            if (Utils.isNotKillZone(world, position))

            {

                airBreak.position.x = position.x;

                airBreak.position.y = position.y;

            }

        }

        else

        {

            if (Utils.isParkourMode())

            {

                if (startSpeed.forward < 0)

                {

                    startSpeed.forward -= (0 - (-startSpeed.forward)) * (dt * 1.3);



                    let position =

                    {

                        x: airBreak.position.x + startSpeed.forward * Math.sin(-direction),

                        y: airBreak.position.y + startSpeed.forward * Math.cos(-direction),

                        z: 0

                    };



                    if (Utils.isNotKillZone(world, position))

                    {

                        airBreak.position.x = position.x;

                        airBreak.position.y = position.y;

                    }

                }

            }

            else

            {

                if (startSpeed.forward < 0)

                {

                    startSpeed.forward = 0;

                }

            }

        }



        if (KeyPressing.isKeyPressed(65 /*key: A*/) && Utils.isNotOpenChat())

        {

            startSpeed.right -= (airBreak.speed.value - (-startSpeed.right)) * dt;



            let position =

            {

                x: airBreak.position.x + startSpeed.right * Math.sin(-(direction - Math.PI / 2)),

                y: airBreak.position.y + startSpeed.right * Math.cos(-(direction - Math.PI / 2)),

                z: 0

            };



            if (Utils.isNotKillZone(world, position))

            {

                airBreak.position.x = position.x;

                airBreak.position.y = position.y;

            }

        }

        else

        {

            if (Utils.isParkourMode())

            {

                if (startSpeed.right < 0)

                {

                    startSpeed.right -= (0 - (-startSpeed.right)) * (dt * 1.3);



                    let position =

                    {

                        x: airBreak.position.x + startSpeed.right * Math.sin(-(direction - Math.PI / 2)),

                        y: airBreak.position.y + startSpeed.right * Math.cos(-(direction - Math.PI / 2)),

                        z: 0

                    };



                    if (Utils.isNotKillZone(world, position))

                    {

                        airBreak.position.x = position.x;

                        airBreak.position.y = position.y;

                    }

                }

            }

            else

            {

                if (startSpeed.right < 0)

                {

                    startSpeed.right = 0;

                }

            }

        }



        if (KeyPressing.isKeyPressed(68 /*key: D*/) && Utils.isNotOpenChat())

        {

            startSpeed.right += (airBreak.speed.value - startSpeed.right) * dt;



            let position =

            {

                x: airBreak.position.x + startSpeed.right * Math.sin(-(direction - Math.PI / 2)),

                y: airBreak.position.y + startSpeed.right * Math.cos(-(direction - Math.PI / 2)),

                z: 0

            };



            if (Utils.isNotKillZone(world, position))

            {

                airBreak.position.x = position.x;

                airBreak.position.y = position.y;

            }

        }

        else

        {

            if (Utils.isParkourMode())

            {

                if (startSpeed.right > 0)

                {

                    startSpeed.right += (0 - startSpeed.right) * (dt * 1.3);



                    let position =

                    {

                        x: airBreak.position.x + startSpeed.right * Math.sin(-(direction - Math.PI / 2)),

                        y: airBreak.position.y + startSpeed.right * Math.cos(-(direction - Math.PI / 2)),

                        z: 0

                    };



                    if (Utils.isNotKillZone(world, position))

                    {

                        airBreak.position.x = position.x;

                        airBreak.position.y = position.y;

                    }

                }

            }

            else

            {

                startSpeed.right = 0;

            }

        }

    }





    if (KeyPressing.isKeyPressed(74 /*key: J*/) && Utils.isNotOpenChat())

    {

        startSpeed.up += (airBreak.speed.value - startSpeed.up) * dt;



        airBreak.position.z += startSpeed.up;

    }

    else

    {

        if (Utils.isParkourMode())

        {

            if (startSpeed.up > 0)

            {

                startSpeed.up += (0 - startSpeed.up) * (dt * 1.3);

                airBreak.position.z += startSpeed.up;

            }

        }

        else

        {

            startSpeed.up = 0;

        }

    }



    if (KeyPressing.isKeyPressed(75 /*key: K*/) && Utils.isNotOpenChat())

    {

        startSpeed.up -= (airBreak.speed.value - (-startSpeed.up)) * dt;



        airBreak.position.z += startSpeed.up;

    }

    else

    {

        if (Utils.isParkourMode())

        {

            if (startSpeed.up < 0)

            {

                startSpeed.up -= (0 - (-startSpeed.up)) * (dt * 1.3);

                airBreak.position.z += startSpeed.up;

            }

        }

        else

        {

            startSpeed.up = 0;

        }

    }



    if (KeyPressing.isKeyPressed(81 /*key: J*/) && Utils.isNotOpenChat())

    {

        startSpeed.up += (airBreak.speed.value - startSpeed.up) * dt;



        airBreak.position.z += startSpeed.up;

    }

    else

    {

        if (Utils.isParkourMode())

        {

            if (startSpeed.up > 0)

            {

                startSpeed.up += (0 - startSpeed.up) * (dt * 1.3);

                airBreak.position.z += startSpeed.up;

            }

        }

        else

        {

            startSpeed.up = 0;

        }

    }



    if (KeyPressing.isKeyPressed(75 /*key: K*/) && Utils.isNotOpenChat())

    {

        startSpeed.up -= (airBreak.speed.value - (-startSpeed.up)) * dt;



        airBreak.position.z += startSpeed.up;

    }

    else

    {

        if (Utils.isParkourMode())

        {

            if (startSpeed.up < 0)

            {

                startSpeed.up -= (0 - (-startSpeed.up)) * (dt * 1.3);

                airBreak.position.z += startSpeed.up;

            }

        }

        else

        {

            startSpeed.up = 0;

        }

    }



    if (KeyPressing.isKeyPressed(69 /*key: K*/) && Utils.isNotOpenChat())

    {

        startSpeed.up -= (airBreak.speed.value - (-startSpeed.up)) * dt;



        airBreak.position.z += startSpeed.up;

    }

    else

    {

        if (Utils.isParkourMode())

        {

            if (startSpeed.up < 0)

            {

                startSpeed.up -= (0 - (-startSpeed.up)) * (dt * 1.3);

                airBreak.position.z += startSpeed.up;

            }

        }

        else

        {

            startSpeed.up = 0;

        }

    }



    if (KeyPressing.isKeyPressed(111 /*key: LEFT*/) && Utils.isNotOpenChat())

    {

        if (airBreak.speed.value > 1)

            airBreak.speed.value -= 2;

    }



    if (KeyPressing.isKeyPressed(106 /*key: RIGHT*/) && Utils.isNotOpenChat())

    {

        airBreak.speed.value += 2;

    }



    if(airBreak.speed.value >= 300){

airBreak.speed.value = 300

    }



    if (!airBreak.airWalk.value)

    {

        for (let i = 0; i < bodies.length; i++)

        {

            bodies.at(i).state.velocity.x = 0;

            bodies.at(i).state.velocity.y = 0;

            bodies.at(i).state.velocity.z = 0;



            bodies.at(i).state.angularVelocity.x = 0;

            bodies.at(i).state.angularVelocity.y = 0;

            bodies.at(i).state.angularVelocity.z = 0;



            bodies.at(i).movable = false;

        }



        physicsComponent.body.state.position.x = airBreak.position.x;

        physicsComponent.body.state.position.y = airBreak.position.y;



        physicsComponent.body.state.velocity.x = 0;

        physicsComponent.body.state.velocity.y = 0;

        physicsComponent.body.state.angularVelocity.z = 0;



        if (syncData.deSyncData.state.value && syncData.deSyncData.teleportToRealPosition.value)

        {

            physicsComponent.body.state.orientation.w = syncData.deSyncData.orientation.w;

            physicsComponent.body.state.orientation.z = syncData.deSyncData.orientation.z;

        }

        else

        {

            physicsComponent.body.state.orientation.w = Math.sin(-(camera.direction - Math.PI) / 2);

            physicsComponent.body.state.orientation.z = Math.cos(-(camera.direction - Math.PI) / 2);

        }

    }

    else

    {

        for (let i = 0; i < bodies.length; i++)

        {

            bodies.at(i).movable = true;

        }



        if (trackedChassis)

        {

            trackedChassis.maxRayLength = 1e+100;

            trackedChassis.dampingCoeff = 0;

            trackedChassis.springCoeff = 0;

        }

    }



    physicsComponent.body.state.position.z = airBreak.position.z;



    physicsComponent.body.state.angularVelocity.x = 0;

    physicsComponent.body.state.angularVelocity.y = 0;

    physicsComponent.body.state.velocity.z = 0;



    physicsComponent.body.state.orientation.x = 0;

    physicsComponent.body.state.orientation.y = 0;

}



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 104 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        airBreak.airWalk.value = !airBreak.airWalk.value;

    }

})

// clicker.h.js



class Clicker

{

    process = null; // args: 1 - localPlayer

}

// clicker.c.js



let autoHealing = new ImGui_Var(false);

let autoMining = new ImGui_Var(false);

let autoSupplies = new ImGui_Var(true);



supplyMap =

{

    firstAID: null,

    mine: null

};



Clicker.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let gameActions = GameObjects.getGameActions();



    if (!gameActions)

    {

        return;

    }



    let healthComponent = GameObjects.getHealthComponent();



    if (!healthComponent)

    {

        return;

    }



    if (!supplyMap.firstAID || !supplyMap.mine)

    {

        for (let i = 0; i < localPlayer.length; i++)

        {

            if (localPlayer.at(i).hasOwnProperty("supplyTypeConfigs_0"))

            {

                let map = localPlayer.at(i).supplyTypeConfigs_0.map_97q5dv$_0.

                    internalMap_uxhen5$_0.backingMap_0;



                for (let key in map)

                {

                    if (map[key].key_5xhq3d$_0.name$ == "FIRST_AID")

                    {

                        supplyMap.firstAID = map[key]._value_0._value_0;

                    }



                    if (map[key].key_5xhq3d$_0.name$ == "MINE")

                    {

                        supplyMap.mine = map[key]._value_0._value_0;

                    }

                }



                break;

            }

        }

    }





    if (autoHealing.value)

    {

        gameObjects.localPlayer.at(37).sendState_0(gameObjects.localPlayer.at(37).tankPhysicsComponent_0.getInterpolatedBodyState());

        supplyMap.firstAID.onUserActivatedSupply();

        supplyMap.mine.onUserActivatedSupply();

    }

    else if (!healthComponent.isFullHealth() && healthComponent.alive && autoSupplies.value)

    {

        supplyMap.firstAID.onUserActivatedSupply();

        supplyMap.mine.onUserActivatedSupply();

    }



    if (autoSupplies.value)

    {

        gameActions.at(6).at(1).wasPressed = true;

        gameActions.at(6).at(1).wasReleased = true;



        gameActions.at(7).at(1).wasPressed = true;

        gameActions.at(7).at(1).wasReleased = true;



        gameActions.at(8).at(1).wasPressed = true;

        gameActions.at(8).at(1).wasReleased = true;

    }



    if (autoMining.value)

    {

        gameActions.at(9).at(1).wasPressed = true;

        gameActions.at(9).at(1).wasReleased = true;



        gameActions.at(10).at(1).wasPressed = true;

        gameActions.at(10).at(1).wasReleased = true;

        supplyMap.firstAID.onUserActivatedSupply();

        supplyMap.mine.onUserActivatedSupply();

    }

}



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 35 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        autoMining.value = !autoMining.value;

    }

})



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 36 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        autoHealing.value = !autoHealing.value;

    }

})



// boxTeleport.h.js



class BoxTeleport

{

    process = null; // args: 1 - localPlayer

}

// boxTeleport.c.js



let boxTeleport = new ImGui_Var(false);



BoxTeleport.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    let camera = GameObjects.getCamera();



    if (!camera)

    {

        return;

    }



    if (boxTeleport.value)

    {

        let triggers = world.triggers_0.triggers_0.array;



        if (triggers && triggers.length != 0)

        {

            for (let i = 0; i < triggers.length; i++)

            {

                if (triggers.at(i).enabled)

                {

                    let triggerPosition = triggers.at(i).bonus_0;



                    if (!triggerPosition)

                    {

                        continue;

                    }



                    if (!triggerPosition.hasOwnProperty("_bonusMesh_0"))

                    {

                        continue;

                    }



                    triggerPosition = triggerPosition._bonusMesh_0.object3d.aabb;



                    if (!triggerPosition)

                    {

                        continue;

                    }



                    physicsComponent.body.state.position.x = triggerPosition.center.x;

                    physicsComponent.body.state.position.y = triggerPosition.center.y;

                    physicsComponent.body.state.position.z = triggerPosition.maxZ;



                    physicsComponent.body.state.orientation.w = Math.sin(-(camera.direction - Math.PI) / 2);

                    physicsComponent.body.state.orientation.z = Math.cos(-(camera.direction - Math.PI) / 2);

                    physicsComponent.body.state.orientation.x = 0;

                    physicsComponent.body.state.orientation.y = 0;



                    physicsComponent.body.state.angularVelocity.x = 0;

                    physicsComponent.body.state.angularVelocity.y = 0;

                    physicsComponent.body.state.angularVelocity.z = 0;



                    physicsComponent.body.state.velocity.x = 0;

                    physicsComponent.body.state.velocity.y = 0;

                    physicsComponent.body.state.velocity.z = 0;

                }

            }

        }

    }

}

// noKnockback.h.js



class NoKnockback

{

    init = null; // args: 1 - localPlayer

}

// noKnockback.c.js



noKnockbackMply = new ImGui_Var(1);



NoKnockback.init = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    physicsComponent.body.addWorldForce_f5o1bj$ = function(t, e, n)

    {

        n *= noKnockbackMply.value;



        var o = n * e.x

          , i = n * e.y

          , r = n * e.z;

        this.forceAccum_0.x = this.forceAccum_0.x + o,

        this.forceAccum_0.y = this.forceAccum_0.y + i,

        this.forceAccum_0.z = this.forceAccum_0.z + r;

        var s = this.state.position

          , a = t.x - s.x

          , c = t.y - s.y

          , u = t.z - s.z;

        this.torqueAccum_0.x = this.torqueAccum_0.x + (c * r - u * i),

        this.torqueAccum_0.y = this.torqueAccum_0.y + (u * o - a * r),

        this.torqueAccum_0.z = this.torqueAccum_0.z + (a * i - c * o)

    }

}

// sync.h.js



class Sync

{

    init = null; // args: 1 - localPlayer

}

// sync.c.js



syncData =

{

    state: new ImGui_Var(false),

    rapidUpdate: new ImGui_Var(true),

    antiMine: new ImGui_Var(true),

    antiMineHeight: new ImGui_Var(60),

    randomTeleport: new ImGui_Var(false),

    spinner: new ImGui_Var(false),



    antiStrikerHackData:

    {

        state: new ImGui_Var(true),

        process: null

    },



    fakeLagData:

    {

        state: new ImGui_Var(false),

        process: null,

        temp: false,

        position: { x: 0, y: 0, z: 0 },

        distance: new ImGui_Var(300)

    },



    deSyncData:

    {

        state: new ImGui_Var(false),

        temp: false,

        orientation: { w: 0, x: 0, y: 0, z: 0 },

        position: { x: 0, y: 0, z: 0 },

        teleportToRealPosition: new ImGui_Var(false)

    }

};



Sync.init = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    localPlayer.at(37).runAfterPhysicsUpdate_mx4ult$ = function (t)

    {

        if (syncData.rapidUpdate.value)

        {

            this.sendState_0(this.tankPhysicsComponent_0.getInterpolatedBodyState());

        }

        else

        {

            if (this.tankPhysicsComponent_0.collidesWithOtherTanks) {

                var e, n = this.tankPhysicsComponent_0.collidingTanksBodies;

                e = n.size;

                for (var o = 0; o < e; o++)

                    this.serverInterface_0.handleCollisionWithOtherTank_mx4ult$(n.get_za3lpa$(o).state.velocity.z)

            }

            var i = this.tankPhysicsComponent_0.getInterpolatedBodyState();

            this.needImmediateUpdate_0 = this.needImmediateUpdate_0 || this.needHighPriorityUpdate_0(i),

            (this.needImmediateUpdate_0 || this.needUpdate_0 && this.sentDeltaTime_0 > 329 || this.needLowPriorityUpdate_0(i) && this.sentDeltaTime_0 > 2e3) && this.sendState_0(i)

        }

    }



    document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 105 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        syncData.rapidUpdate.value = !syncData.rapidUpdate.value;

    }

})



    localPlayer.at(37).sendState_0 = function(t)

    {

        if (KeyPressing.isKeyPressed(46 /*key: DELETE*/) && Utils.isNotOpenChat())

        {

            t.position.z = 99999;

            this.sendUpdate_0(t, this.world.physicsTime);

            return;

        }



        if (syncData.state.value)

        {

            if (syncData.spinner.value)

            {

                t.orientation.w = Utils.getRandomArbitrary(-1, 1);

                t.orientation.x = Utils.getRandomArbitrary(-1, 1);

                t.orientation.y = Utils.getRandomArbitrary(-1, 1);

                t.orientation.z = Utils.getRandomArbitrary(-1, 1);

            }



            if (syncData.antiMine.value)

            {

                t.position.z += syncData.antiMineHeight.value;

            }



            if (syncData.fakeLagData.process(this, t, physicsComponent) == true)

            {

                return;

            }



            if (syncData.deSyncData.process(this, t, physicsComponent) == true)

            {

                return;

            }



            syncData.antiStrikerHackData.process();



            if (syncData.randomTeleport.value)

            {

                let bounds = world.entities_0.toArray().at(0).components_0.array.at(0).bounds;



                t.position.x = Utils.getRandomArbitrary(bounds.minX, bounds.maxX);

                t.position.y = Utils.getRandomArbitrary(bounds.minY, bounds.maxY);



                if (syncData.antiMine.value)

                {

                    t.position.z = bounds.maxZ + 500 + syncData.antiMineHeight.value;

                }

                else

                {

                    t.position.z = bounds.maxZ + 500;

                }



            }

        }



        this.sendUpdate_0(t, this.world.physicsTime);

    }



}



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 96 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        syncData.state.value = !syncData.state.value;

    }

})





document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 220 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        syncData.randomTeleport.value = !syncData.randomTeleport.value;

    }

})

// antiStrikerHack.c.js



tempV = 1600;

tempB = 500;



syncData.antiStrikerHackData.process = function ()

{

    if (!syncData.antiStrikerHackData.state.value)

    {

        return;

    }



    let localPlayer = GameObjects.getLocalPlayer();



    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let playersArray = Utils.getPlayers(world, localPlayer);



    if (!playersArray)

    {

        return;

    }



    if (playersArray.length == 0)

    {

        return;

    }



    for (let i = 0; i < playersArray.length; i++)

    {

        for (let n = 0; n < playersArray.at(i).length; n++)

        {

            let shellCache;

            let striker;



            if (playersArray.at(i).at(n).hasOwnProperty("shellCache_0"))

            {

                striker = playersArray.at(i).at(n);



                if (!striker.rocketLauncherCC_0)

                {

                    continue;

                }



                if (striker.rocketLauncherCC_0.salvoSize != 8)

                {

                    continue;

                }



                shellCache = playersArray.at(i).at(n).shellCache_0.itemsInUse.toArray();



                if (!playersArray.at(i).at(n).tempTimeout)

                {

                    playersArray.at(i).at(n).tempTimeout = null;

                }



                if (!playersArray.at(i).at(n).tempState)

                {

                    playersArray.at(i).at(n).tempState = false;

                }

            }

            else

            {

                continue;

            }



            if (playersArray.at(i).at(n).tempState == true)

            {

                continue;

            }



            for (let i = 0; i < shellCache.length; i++)

            {

                shellCache.at(i).components_0.array.at(1).direction.x = 0;

                shellCache.at(i).components_0.array.at(1).direction.y = 0;

                shellCache.at(i).components_0.array.at(1).direction.z = 0;

            }



            if (playersArray.at(i).at(n).tempTimeout == null && shellCache.length == 8)

            {

                playersArray.at(i).at(n).tempTimeout = setTimeout(() =>

                {

                    playersArray.at(i).at(n).tempState = syncData.randomTeleport.value = true;



                    setTimeout(() =>

                    {



                        playersArray.at(i).at(n).tempTimeout = null;

                        playersArray.at(i).at(n).tempState = true;

                    }, 500);



                    setTimeout(() =>

                    {

                        playersArray.at(i).at(n).tempState = false;

                    }, 1000);

                }, 1600);

            }



            break;

        }

    }

}

// fakeLag.c.js



function calculateDistance(p1, p2)

{

    var a = p2.x - p1.x;

    var b = p2.y - p1.y;

    var c = p2.z - p1.z;



    return Math.sqrt(a * a + b * b + c * c);

}



syncData.fakeLagData.process = function (ecx, t, physicsComponent)

{

    if (syncData.fakeLagData.temp && !syncData.fakeLagData.state.value)

    {

        syncData.fakeLagData.temp = false;



        syncData.fakeLagData.position.x = t.position.x;

        syncData.fakeLagData.position.y = t.position.y;

        syncData.fakeLagData.position.z = t.position.z;



        ecx.sendUpdate_0(t, ecx.world.physicsTime);



        return true;

    }

    else if (!syncData.fakeLagData.temp && syncData.fakeLagData.state.value)

    {

        syncData.fakeLagData.temp = true;



        syncData.fakeLagData.position.x = t.position.x;

        syncData.fakeLagData.position.y = t.position.y;

        syncData.fakeLagData.position.z = t.position.z;



        ecx.sendUpdate_0(t, ecx.world.physicsTime);



        return true;

    }



    if (syncData.fakeLagData.state.value)

    {

        let distance = calculateDistance(syncData.fakeLagData.position, physicsComponent.body.state.position);



        t.velocity.z += Infinity;



        if (distance >= syncData.fakeLagData.distance.value)

        {

            syncData.fakeLagData.position.x = t.position.x;

            syncData.fakeLagData.position.y = t.position.y;

            syncData.fakeLagData.position.z = t.position.z;



            ecx.sendUpdate_0(t, ecx.world.physicsTime);



            return true;

        }

        else

        {

            return true;

        }

    }



    return false;

}

// deSync.c.js



function getDeSyncState(t)

{

    syncData.deSyncData.position.x = t.position.x;

    syncData.deSyncData.position.y = t.position.y;

    syncData.deSyncData.position.z = t.position.z;



    syncData.deSyncData.orientation.w = t.orientation.w;

    syncData.deSyncData.orientation.x = t.orientation.x;

    syncData.deSyncData.orientation.y = t.orientation.y;

    syncData.deSyncData.orientation.z = t.orientation.z;

}



syncData.deSyncData.process = function (ecx, t, physicsComponent)

{

    if (KeyPressing.isKeyPressed(76 /*key: L*/) && Utils.isNotOpenChat())

    {

        getDeSyncState(t);

        ecx.sendUpdate_0(t, ecx.world.physicsTime);

        return true;

    }



    if (syncData.deSyncData.temp && !syncData.deSyncData.state.value)

    {

        syncData.deSyncData.temp = false;



        getDeSyncState(t);

        ecx.sendUpdate_0(t, ecx.world.physicsTime);

        return true;

    }

    else if (!syncData.deSyncData.temp && syncData.deSyncData.state.value)

    {

        syncData.deSyncData.temp = true;



        getDeSyncState(t);

        ecx.sendUpdate_0(t, ecx.world.physicsTime);

        return true;

    }



    if (syncData.deSyncData.state.value)

    {

        if (syncData.deSyncData.teleportToRealPosition.value && !airBreak.state)

        {

            physicsComponent.body.state.position.x = syncData.deSyncData.position.x;

            physicsComponent.body.state.position.y = syncData.deSyncData.position.y;

            physicsComponent.body.state.position.z = syncData.deSyncData.position.z;



            physicsComponent.body.state.orientation.w = syncData.deSyncData.orientation.w;

            physicsComponent.body.state.orientation.x = syncData.deSyncData.orientation.x;

            physicsComponent.body.state.orientation.y = syncData.deSyncData.orientation.y;

            physicsComponent.body.state.orientation.z = syncData.deSyncData.orientation.z;



            physicsComponent.body.state.angularVelocity.x = 0;

            physicsComponent.body.state.angularVelocity.y = 0;

            physicsComponent.body.state.angularVelocity.z = 0;



            physicsComponent.body.state.velocity.x = 0;

            physicsComponent.body.state.velocity.y = 0;

            physicsComponent.body.state.velocity.z = 0;

        }



        return true;

    }



    return false;

}





// stick.h.js



class Stick

{

    process = null; // args: 1 - localPlayer

}

// stick.c.js



stickData =

{

    state: new ImGui_Var(false),

    target: null

};



Stick.process = function (localPlayer)

{

    if (!stickData.state.value)

    {

        return;

    }



    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    let camera = GameObjects.getCamera();



    if (!camera)

    {

        return;

    }



    if (!stickData.target)

    {

        return;

    }



    physicsComponent.body.state.position.x = stickData.target.state.position.x;

    physicsComponent.body.state.position.y = stickData.target.state.position.y;

    physicsComponent.body.state.position.z = stickData.target.state.position.z;



    physicsComponent.body.state.orientation.w = stickData.target.state.orientation.w;

    physicsComponent.body.state.orientation.z = stickData.target.state.orientation.z;

    physicsComponent.body.state.orientation.x = stickData.target.state.orientation.x;

    physicsComponent.body.state.orientation.y = stickData.target.state.orientation.y;



    physicsComponent.body.state.angularVelocity.x = 0;

    physicsComponent.body.state.angularVelocity.y = 0;

    physicsComponent.body.state.angularVelocity.z = 0;



    physicsComponent.body.state.velocity.x = 0;

    physicsComponent.body.state.velocity.y = 0;

    physicsComponent.body.state.velocity.z = 100000;

}

// other.h.js



class Other

{

    process = null; // args: 1 - localPlayer

}

// other.c.js



let gravity = new ImGui_Var(-1000);

let noCollision = new ImGui_Var(true);

let speedHack = new ImGui_Var(true);



let speedHackTempValue =

{

    acceleration: 0,

    deceleration: 0,

    state: false

};



Other.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    let speedCharacteristics = GameObjects.getSpeedCharacteristics();



    if (!speedCharacteristics)

    {

        return;

    }



    let maxSpeedSmoother_0 = speedCharacteristics.maxSpeedSmoother_0;

    let speedCharacteristics_0 = speedCharacteristics.speedCharacteristics_0;



    if (speedHack.value)

    {

        if (maxSpeedSmoother_0 && speedCharacteristics_0)

        {

            maxSpeedSmoother_0.currentValue = 1e+100;



            if (false && speedCharacteristics_0.acceleration < 5000)

            {

                speedHackTempValue.acceleration = speedCharacteristics_0.acceleration;

            }



            if (speedCharacteristics_0.deceleration < 1000)

            {

                speedHackTempValue.deceleration = speedCharacteristics_0.deceleration;

            }



            //speedCharacteristics_0.acceleration = 5000;

            speedCharacteristics_0.deceleration = 1000;



            speedHackTempValue.state = true;

        }

    }

    else if (speedHackTempValue.state == true)

    {

        if (maxSpeedSmoother_0 && speedCharacteristics_0)

        {

            maxSpeedSmoother_0.currentValue = maxSpeedSmoother_0.targetValue;



            //speedCharacteristics_0.acceleration = speedHackTempValue.acceleration;

            speedCharacteristics_0.deceleration = speedHackTempValue.deceleration;



            speedHackTempValue.state = false;

        }

    }



    world.physicsScene_0.gravity.z = gravity.value;



    if (noCollision.value)

    {

        physicsComponent.tankCollisionBox.collisionMask = 76;

    }

    else

    {

        physicsComponent.tankCollisionBox.collisionMask = 75;

    }

}

// removeMines.h.js



class RemoveMines

{

    process = null; // args: 1 - localPlayer

}

// removeMines.c.js



let removeMines = new ImGui_Var(true);



RemoveMines.process = function (localPlayer)

{

    if (!removeMines.value)

    {

        return;

    }



    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let mines = GameObjects.getMines();



    if (!mines)

    {

        return;

    }



    var n;

    for (n = mines.minesByUser_0.keys.iterator(); n.hasNext();)

    {

        var o = n.next();

        mines.removeAllMines_0(o)

    }

}



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 100 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        removeMines.value = !removeMines.value;

    }

})



// striket.h.js



class Striker

{

    init = null; // args: 1 - localPlayer

    process = null; // args: 1 - localPlayer

}

// striker.c.js



strikerData =

{

    aimBot: new ImGui_Var(true),

    shellsTeleport: new ImGui_Var(true),

    noLaser: new ImGui_Var(true),

    state: false,

    salvoRocketsCount: 8,

    shellsTimeout: null,

    type: "striker",

    shellCache: null,

    getTargetWithScope: new ImGui_Var(true)

};



Striker.init = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let striker = GameObjects.getStrikerComponent();



    if (!striker)

    {

        return;

    }



    if (strikerData.type == "striker")

    {

        strikerData.salvoRocketsCount = striker.salvoRocketsCount;



        if (striker.targetingSystem_0 && striker.targetingSystem_0.targetingSystem_vutpoz$_0)

        {

            let targetingSystem_0 = striker.targetingSystem_0.targetingSystem_vutpoz$_0;



            if (targetingSystem_0.directionCalculator_0 &&

                targetingSystem_0.directionCalculator_0.targetingSectorsCalculator_0)

            {

                let targetingSectorsCalculator_0 = targetingSystem_0.directionCalculator_0.

                    targetingSectorsCalculator_0;



                targetingSectorsCalculator_0.maxElevationAngle_0 = 100000;

                targetingSectorsCalculator_0.minElevationAngle_0 = -100000;

            }

        }

    }

    else

    {

        strikerData.salvoRocketsCount = striker.scorpioData_0.secondarySalvoSize;

    }



    striker.lockTarget_gcez93$ = function (t, e, n)

    {

        if (strikerData.aimBot.value)

        {

            strikerData.getTargetWithScope.value ? targetId = e : t.targetId = targetId;

            this.lockTarget_gcez93$$default(t, targetId);

            return true;

        }

        else

        {

            return void 0 === e && (e = null), n ? n(t, e) : this.lockTarget_gcez93$$default(t, e);

        }

    }



    for (let i = 0; i < localPlayer.length; i++)

    {

        if (localPlayer.at(i).hasOwnProperty("shellCache_0"))

        {

            strikerData.shellCache = localPlayer.at(i).shellCache_0.itemsInUse.array_hd7ov6$_0;

            break;

        }

    }

}



Striker.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let striker = GameObjects.getStrikerComponent();



    if (!striker)

    {

        return;

    }



    if (!strikerData.shellCache)

    {

        return;

    }



    if (strikerData.type == "striker" && strikerData.noLaser.value)

    {

        striker.stopAiming();

    }



    if (!strikerData.shellsTeleport.value)

    {

        return;

    }



    if (!targetId)

    {

        return;

    }



    if (KeyPressing.isKeyPressed(82 /*key: R*/) && Utils.isNotOpenChat())

    {

        strikerData.state = true;

    }



    if (!strikerData.state && strikerData.shellCache.length == strikerData.salvoRocketsCount)

    {

        if (!strikerData.shellsTimeout)

        {

            strikerData.shellsTimeout = setTimeout(() => { strikerData.state = true; strikerData.shellsTimeout = null; },

            strikerData.type == "striker" ? 1000 : 2000);

        }

    }



    let targetBody = Utils.getBodyById(world, localPlayer, targetId);



    if (!targetBody)

    {

        return;

    }



    if (!targetBody.state)

    {

        return;

    }



    if (!targetBody.state.position)

    {

        return;

    }



    if (strikerData.state)

    {

        for (let i = 0; i < strikerData.shellCache.length; i++)

        {

            strikerData.shellCache.at(i).components_0.array.at(1).direction.x = 0;

            strikerData.shellCache.at(i).components_0.array.at(1).direction.y = 0;

            strikerData.shellCache.at(i).components_0.array.at(1).direction.z = 0;



            strikerData.shellCache.at(i).components_0.array.at(1).position.x = targetBody.state.position.x;

            strikerData.shellCache.at(i).components_0.array.at(1).position.y = targetBody.state.position.y;

            strikerData.shellCache.at(i).components_0.array.at(1).position.z = targetBody.state.position.z;

        }



        if (strikerData.shellCache.length == 0)

        {

            strikerData.state = false;

        }

    }

    else

    {

        for (let i = 0; i < strikerData.shellCache.length; i++)

        {

            strikerData.shellCache.at(i).components_0.array.at(1).direction.x = 0;

            strikerData.shellCache.at(i).components_0.array.at(1).direction.y = 0;

            strikerData.shellCache.at(i).components_0.array.at(1).direction.z = 0;

        }

    }

}

// wallHack.h.js



class WallHack

{

    process = null; // args: 1 - localPlayer

}

// wallHack.c.js



espData =

{

    enabled: new ImGui_Var(true),

    colorEnemy: 16711680,

    colorTarget: 16777215,

    colorTeam: 3145472,

    onlyEnemy: new ImGui_Var(false),

    boxGlow: new ImGui_Var(true)

};



function drawEsp(player, color)

{

    if (!player)

    {

        return;

    }



    if (player.length == 0)

    {

        return;

    }



    let weaponSkin;

    let weaponChildren;

    let hull;

    let hullChildren;



    for (let i = 0; i < player.length; i++)

    {

        if (player.at(i).__proto__.hasOwnProperty("weaponSkin_0"))

        {

            weaponSkin = player.at(i).weaponSkin_0.root;

            weaponChildren = weaponSkin.children_ich852$_0.array;

            hull = player.at(i).weaponSkin_0.hullSkinComponent_0.hull;

            hullChildren = hull.children_ich852$_0.array;

            break;

        }

    }



    if (!weaponSkin || !hull || !weaponChildren || !hullChildren)

    {

        return;

    }



    if (color == 0)

    {

        weaponSkin.outlined = false;

        hull.outlined = false;



        for (let i = 0; i < weaponChildren.length; i++)

        {

            weaponChildren.at(i).outlined = false;

        }



        for (let i = 0; i < hullChildren.length; i++)

        {

            hullChildren.at(i).outlined = false;

        }



        return;

    }



    weaponSkin.outlined = true;

    weaponSkin.outlineBold = false;

    weaponSkin.outlineColor = color;



    hull.outlined = true;

    hull.outlineBold = false;

    hull.outlineColor = color;



    for (let i = 0; i < weaponChildren.length; i++)

    {

        weaponChildren.at(i).outlined = true;

        weaponChildren.at(i).outlineBold = false;

        weaponChildren.at(i).outlineColor = color;

    }



    for (let i = 0; i < hullChildren.length; i++)

    {

        hullChildren.at(i).outlined = true;

        hullChildren.at(i).outlineBold = false;

        hullChildren.at(i).outlineColor = color;

    }

}



WallHack.process = function (localPlayer)

{

    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let playersArray = Utils.getPlayers(world, localPlayer);



    if (!playersArray)

    {

        return;

    }



    if (playersArray.length == 0)

    {

        return;

    }



    for (let i = 0; i < playersArray.length; i++)

    {

        if (!espData.enabled.value)

        {

            drawEsp(playersArray.at(i), 0);

            continue;

        }



        if (Utils.getPlayerById(world, localPlayer, targetId) == playersArray.at(i))

        {

            drawEsp(playersArray.at(i), espData.colorTarget);

            continue;

        }



        if (Utils.isPlayerEnemy(localPlayer, playersArray.at(i)))

        {

            drawEsp(playersArray.at(i), espData.colorEnemy);

            continue;

        }



        if (!espData.onlyEnemy.value)

        {

            drawEsp(playersArray.at(i), espData.colorTeam);

        }

        else

        {

            drawEsp(playersArray.at(i), 0);

        }

    }



    let triggers = world.triggers_0.triggers_0.array;



    if (triggers && triggers.length != 0)

    {

        for (let i = 0; i < triggers.length; i++)

        {

            if (!triggers.at(i).enabled)

            {

                continue;

            }



            if (!triggers.at(i).bonus_0)

            {

                continue;

            }



            let bonusMesh = triggers.at(i).bonus_0.bonusMesh;



            if (!bonusMesh)

            {

                continue;

            }



            let object3d = bonusMesh.object3d;



            if (!object3d)

            {

                continue;

            }



            let bonusData_0 = triggers.at(i).bonus_0.bonusData_0;



            if (!bonusData_0)

            {

                continue;

            }



            object3d.outlineColor = bonusData_0.bonusLight.lightColor.color;



            if (!espData.boxGlow.value || !espData.enabled.value)

            {

                object3d.outlined = false;

                continue;

            }



            object3d.outlineBold = false;

            object3d.outlined = true;

        }

    }

}

// cheatMenu.c.js



class CheatMenu

{

    draw = null; // args: 1 - time

}



class Tabs

{

    localPlayer = null; // args: void

    weapon = null; // args: void

    visuals = null; // args: void

    players = null; // args: void

    misc = null; // args: void

}



(async function() { await ImGui.default(); })();

// cheatMenu.c.js



document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;



let menuShow = true, menuInit = false;



document.addEventListener('keyup', (e) =>

{

    if (e.keyCode == 45 && Utils.isGameReady() && Utils.isNotOpenChat())

    {

        menuShow = !menuShow;

    }

})



CheatMenu.draw = function (time)

{

    if (!menuInit && typeof(window) !== "undefined" &&

    document.getElementsByClassName("sc-bdVaJa jKLJbX").item(0))

    {

        ImGui.CreateContext();

        setStyle();

        ImGui_Impl.Init(document.getElementsByClassName("sc-bdVaJa jKLJbX").item(0));

        menuInit = true;



        return;

    }



    if (!menuShow)

    {

        return;

    }



    ImGui_Impl.NewFrame(time);

    ImGui.NewFrame();



    document.exitPointerLock();



    ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);

    ImGui.SetNextWindowSize(new ImGui.ImVec2(587, 300), ImGui.Cond.FirstUseEver);

    ImGui.Begin("Akz", null, ImGui.WindowFlags.NoCollapse | ImGui.WindowFlags.NoResize);



    if (ImGui.BeginTabBar("##tabbar", ImGui.TabBarFlags.None))

    {

        if (ImGui.BeginTabItem("Local Tank"))

        {

            Tabs.localPlayer();



            ImGui.EndTabItem();

        }



        if (ImGui.BeginTabItem("Weapon"))

        {

            Tabs.weapon();



            ImGui.EndTabItem();

        }



        if (ImGui.BeginTabItem("Visuals"))

        {

            Tabs.visuals();



            ImGui.EndTabItem();

        }



        if (ImGui.BeginTabItem("Other Players"))

        {

            Tabs.players();



            ImGui.EndTabItem();

        }



        if (ImGui.BeginTabItem("FPS Hack"))

        {

            Tabs.misc();



            ImGui.EndTabItem();

        }



        ImGui.EndTabBar();

    }



    ImGui.End();



    ImGui.EndFrame();

    ImGui.Render();

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

}

// localPlayer.tab.js



Tabs.localPlayer = function ()

{

    ImGui.Checkbox("AirBreak [R. Shift]", airBreak.enabled.access);

    ImGui.SameLine();

    ImGui.SliderInt("##airBreak.speed", airBreak.speed.access, 1, 300);

    ImGui.Checkbox("AirWalk", airBreak.airWalk.access);
    

    ImGui.Checkbox("Fly Hack", flyHack.state.access);
    
    ImGui.SameLine();
    
    ImGui.SliderInt("##flyhack.speed", flyHack.speed.access, 1, 300);


    ImGui.Checkbox("Anti Aim", syncData.state.access);



    if (syncData.state.value)

    {

        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Anti Mine", syncData.antiMine.access);



        if (syncData.antiMine.value)

        {

            ImGui.SameLine();

            ImGui.InputInt("Height", syncData.antiMineHeight.access, 10, 10);

        }



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Random Teleport", syncData.randomTeleport.access);



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Fake Position", syncData.deSyncData.state.access);



        if (syncData.deSyncData.state.value)

        {

            ImGui.SameLine();

            ImGui.Checkbox("Teleport To Real Position", syncData.deSyncData.teleportToRealPosition.access);

        }



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Fake Lag", syncData.fakeLagData.state.access);



        if (syncData.fakeLagData.state.value)

        {

            ImGui.SameLine();

            ImGui.InputInt("Distance", syncData.fakeLagData.distance.access, 100, 100);

        }



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Spinner", syncData.spinner.access);



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Anti Striker Hack", syncData.antiStrikerHackData.state.access);

    }



    ImGui.Checkbox("Fast Clicker", autoHealing.access);

    ImGui.SameLine();

    ImGui.Checkbox("Normal Clicker", autoMining.access);

    ImGui.SameLine();

    ImGui.Checkbox("Supplies", autoSupplies.access);



    ImGui.Checkbox("Ignore Tanks", noCollision.access);



    ImGui.SliderInt("Gravity", gravity.access, -1000, 1000);



    ImGui.SliderFloat("No Knockback", noKnockbackMply.access, 0, 2);



    ImGui.Checkbox("Box Teleport", boxTeleport.access);



    ImGui.Checkbox("SpeedHack", speedHack.access);



    ImGui.Checkbox("Rapid Update", syncData.rapidUpdate.access);

}

// weapon.tab.js



Tabs.weapon = function ()

{

    ImGui.Text("Striker / Scorpion");



    ImGui.Checkbox("Aimbot##striker", strikerData.aimBot.access);



    ImGui.SameLine();



    ImGui.Checkbox("No Laser##striker", strikerData.noLaser.access);



    ImGui.SameLine();



    ImGui.Checkbox("Shells Teleport##striker", strikerData.shellsTeleport.access);



    ImGui.Checkbox("Lock Target With Scope", strikerData.getTargetWithScope.access);



    ImGui.Separator();

}

// visuals.tab.js



const rgbToHex = (v) => [parseInt((255 * v[0]).toFixed(1)),

    parseInt((255 * v[1]).toFixed(1)), parseInt((255 * v[2]).toFixed(1))].map(x => {

    const hex = x.toString(16)

    return hex.length === 1 ? '0' + hex : hex

}).join('')



colorEnemyRGB = new ImGui_Var([0.6, 0, 0.3]);

colorTeamRGB = new ImGui_Var([0.6, 0.6, 1]);

colorTargetRGB = new ImGui_Var([0.4, 1, 0.4]);



Tabs.visuals = function ()

{

    ImGui.Checkbox("Glow ESP", espData.enabled.access);



    if (espData.enabled.value)

    {

        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Only Enemies", espData.onlyEnemy.access);

        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.Checkbox("Box ESP", espData.boxGlow.access);



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.ColorEdit3("Color Enemy", colorEnemyRGB.value);

        espData.colorEnemy = parseInt(rgbToHex(colorEnemyRGB.value), 16);



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.ColorEdit3("Color Team", colorTeamRGB.value);

        espData.colorTeam = parseInt(rgbToHex(colorTeamRGB.value), 16);



        ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);

        ImGui.ColorEdit3("Color Target", colorTargetRGB.value);

        espData.colorTarget = parseInt(rgbToHex(colorTargetRGB.value), 16);

    }

}

// players.tab.js



let selected = new ImGui_Var(-1);

let targetId;

let onlyEnemy = new ImGui_Var(false);



Tabs.players = function ()

{

    let localPlayer = GameObjects.getLocalPlayer();



    if (!localPlayer)

    {

        return;

    }



    let world = GameObjects.getWorld();



    if (!world)

    {

        return;

    }



    let physicsComponent = GameObjects.getPhysicsComponent();



    if (!physicsComponent)

    {

        return;

    }



    let camera = GameObjects.getCamera();



    if (!camera)

    {

        return;

    }



    ImGui.Checkbox("Only Enemies", onlyEnemy.access);



    let playersArray = Utils.getPlayers(world, localPlayer, onlyEnemy.value);



    if (!playersArray)

    {

        return null;

    }



    if (playersArray.length == 0)

    {

        return null;

    }



    for (let i = 0; i < playersArray.length; i++)

    {

        if (!playersArray.at(i))

        {

            continue;

        }



        if (playersArray.at(i).length == 0)

        {

            continue;

        }



        if (ImGui.Selectable(Utils.getPlayerName(playersArray.at(i)), selected.value === i))

        {

            selected.value = i;

        }

    }



    ImGui.Separator();



    if (selected.value >= 0)

    {

        if (!playersArray.at(selected.value))

        {

            return;

        }



        if (playersArray.at(selected.value).length == 0)

        {

            return;

        }



        ImGui.Text(`Selected Player: ${Utils.getPlayerName(playersArray.at(selected.value))}`);



        let playerBody = Utils.getPlayerBody(playersArray.at(selected.value));



        if (!playerBody)

        {

            return;

        }



        if (ImGui.Button("Teleport To Selected Player"))

        {

            if (!playerBody)

            {

                return;

            }



            let position = playerBody.state.position;



            if (position)

            {

                physicsComponent.body.state.position.x = position.x;

                physicsComponent.body.state.position.y = position.y;

                physicsComponent.body.state.position.z = position.z;



                physicsComponent.body.state.orientation.w = Math.sin(-(camera.direction - Math.PI) / 2);

                physicsComponent.body.state.orientation.z = Math.cos(-(camera.direction - Math.PI) / 2);

                physicsComponent.body.state.orientation.x = 0;

                physicsComponent.body.state.orientation.y = 0;



                physicsComponent.body.state.angularVelocity.x = 0;

                physicsComponent.body.state.angularVelocity.y = 0;

                physicsComponent.body.state.angularVelocity.z = 0;



                physicsComponent.body.state.velocity.x = 0;

                physicsComponent.body.state.velocity.y = 0;

                physicsComponent.body.state.velocity.z = 0;

            }

        }



        if (ImGui.Button("Set Target"))

        {

            for (let i = 0; i < playersArray.at(selected.value).length; i++)

            {

                if (playersArray.at(selected.value).at(i).__proto__.hasOwnProperty("userId"))

                {

                    targetId = playersArray.at(selected.value).at(i).userId;

                    break;

                }

            }

        }



        ImGui.Checkbox("Stick", stickData.state.access);



        if (stickData.state.access)

        {

            stickData.target = playerBody;

        }

    }

}

// misc.tab.js



Tabs.misc = function ()

{

    ImGui.Checkbox("Remove Mines", removeMines.access);

}

// content.c.js



// Data

let init = false;

let frameCounter = 0;



function reset()

{

    init = airBreak.state = stickData.state.value = syncData.state.value = syncData.fakeLagData.temp =

    menuInit = false;



    menuShow = true;



    stickData.target = null;



    gameObjects =

    {

        localPlayer: null,

        world: null,

        gameActions: null,

        mines: null,

        physicsComponent: null,

        healthComponent: null,

        camera: null,

        trackedChassis: null,

        speedCharacteristics: null,

        strikerComponent: null

    }



    supplyMap =

    {

        firstAID: null,

        mine: null

    };



    ImGui_Impl.Shutdown();

    ImGui.DestroyContext();

}



function mainEvent(time)

{

    //try

    //{

        if (!init && Utils.isGameReady())

        {

            // init code

            let localPlayer = GameObjects.getLocalPlayer();



            if (localPlayer)

            {

                init = true;



                Sync.init(localPlayer);

                Striker.init(localPlayer);

                NoKnockback.init(localPlayer);

            }

        }

        else if (init && !Utils.isGameReady())

        {

            reset();

        }



        if (init)

        {

            let localPlayer = GameObjects.getLocalPlayer();



            // process functions

            Stick.process(localPlayer);

            AirBreak.process(localPlayer);

            Other.process(localPlayer);

            BoxTeleport.process(localPlayer);

            Clicker.process(localPlayer);

            FlyHack.process(localPlayer);



            frameCounter++;



            if (frameCounter >= 2)

            {

                Striker.process(localPlayer);

                RemoveMines.process(localPlayer);

                WallHack.process(localPlayer);

                frameCounter = 0;

            }



            CheatMenu.draw(time);

        }

    /*}

    catch (e)

    {

        Utils.errorLog(e);

        reset();

    }*/



    requestAnimationFrame(mainEvent);

}



requestAnimationFrame(mainEvent);



console.clear();