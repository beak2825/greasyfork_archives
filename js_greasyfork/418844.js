// ==UserScript==
// @name         Krunker Hack - Aim Assist & Esp & Anti-Afk & Damage Hack!
// @namespace    https://github.com/Cyper-New
// @version      3.0
// @description  Krunker.io Aim Assist & Esp & Anti-AFK
// @author       Cyper#6887
// @match        *://krunker.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418844/Krunker%20Hack%20-%20Aim%20Assist%20%20Esp%20%20Anti-Afk%20%20Damage%20Hack%21.user.js
// @updateURL https://update.greasyfork.org/scripts/418844/Krunker%20Hack%20-%20Aim%20Assist%20%20Esp%20%20Anti-Afk%20%20Damage%20Hack%21.meta.js
// ==/UserScript==

/*!

 * @copyright (c) Cyper 2020 ~ 2021

 * @version (v2)

 * @license (MIT)

 * @PackageFile {-43 | 7 | -16}

 */



~(function Klass(global) {


    if (!("Symbol" in global || "includes" in Array.prototype)) return alert('Browser Does Not Support ES6!');



    const modules = new Array({});

    class Modules {
        static exports(module, ...args) {
            if (typeof module !== 'string' && typeof args !== 'object' && !modules[module])
                return (function() {
                    var ErrorMessage = new Error("Failed to Export the Module Or The Module Already Defined.");
                    ErrorMessage.code = ("ERR_EXPORTS_MODULE");
                    return (ErrorMessage);
                })();

            modules[module] = (args);

        }
        static import(module) {
            if (typeof module !== 'string' && modules[module])
                return (function() {
                    var ErrorMessage = new Error("Failed to Find the Module Or The Module Not Defined.");
                    ErrorMessage.code = ("ERR_IMPORT_MODULE");
                    return (ErrorMessage);
                })();

            return (modules && module && modules[module].length ? modules[module] : modules[module][0x0]);

        }
        static remove(module) {
            if (typeof module !== 'string' && modules[module])
                return (function() {
                    var ErrorMessage = new Error("invaild Module Or The Module Not Defined.");
                    ErrorMessage.code = ("ERR_REMOVE_MODULE");
                    return (ErrorMessage);
                })();

            return (modules && module && delete modules[module]);

        }
    }


    document["Modules"] = (Modules);

    var HookList = new Map()

        .set("WorldObj", {
            regex: /(this\['\w+'\]\=function\(\w+\,\w+\,\w+\,\w+\)\{this\['recon'\]\=\w+)/,
            execute: "$&,document.Modules&&document.Modules.exports(\"WorldObj\",arguments[0x1]),document.Modules.exports(\"JrIQ0\",arguments[0x0]),document.Modules.exports(\"Me\",this),document.onPlaying(arguments)"
        })
        .set("RecoilAnimY", {
            regex: /(\+\w+\['(\w+)'\]\*\w+\['\w+'\]\+0.1\*\w+\['\w+'\]\,0x0)/,
            index: "2"
        })
        .set("Anti-AFK", {
            regex: /(0x15f90)/i,
            execute: "1e99"
        })
        .set("CanSee", {
            regex: /(\]&&\w+\['(\w+)'\]&&(\w+\['(\w+)'\])(\)\{))/,
            index: "4"
        })
        .set("JumpVel", {
            regex: /(\w+\['exports'\]\['jumpVel'\]\=(.+?)\,)/,
            index: "2"
        })
        .set("CrouchDst", {
            regex: /(\w+\['exports'\]\['crouchDst'\]\=(.+?)\,)/,
            index: "2"
        })
        .set("CrouchVal", {
            regex: /(\]\/\(\w+\=\=this\['(\w+)'\]&&\w+\['\w+'\]\?\w+\:\w+\);this\['\w+'\]\=aw)/,
            index: "2"
        })
        .set("ObjInstance" , {
            regex: /(\]&&\w+\['(\w+)'\]&&(\w+\['(\w+)'\])(\)\{))/,
            index: "2"
        })
        .set("ESP", {
            regex: /(\]&&(\w+\['\w+'\])&&(\w+\['(\w+)'\])(\)\{))/,
            execute: "]&&$2$5if(!$3&&document.ESP==\"ON\")return;"
        });



    class LoadScript {
        constructor(core) {

            this.Modfied = this.Patch(core);

        }

        Patch(core) {
            for (var [...Hooks] of HookList) {

                if (!(Hooks[0x1].regex.exec(core)))

                    return confirm("Failed to Extract " + Hooks[0x0] + "\n Click \"OK\" to Reload The Page.") && location.reload();

                else {

                    if (Hooks[0x1].index)

                        Modules.exports(Hooks[0x0], core.match(Hooks[0x1].regex)[Hooks[0x1].index]);

                    else if (Hooks[0x1].execute)

                        core = core.replace(Hooks[0x1].regex, Hooks[0x1].execute);

                }
                (console.log.name == "log" && console.log || console.dir)(`Extracted ${Hooks[0x0]} Successfully!`);

            }
            return core;
        }
    }


class getClosestEnemy {

   static getEnemy( Me ) {

        this.Me = (Me);

        var WorldObj = Modules.import("WorldObj")[0x0];

        var Enemy;

        WorldObj.players.list.forEach(function(Player) {

            if (Player &&

                Player[Modules.import("CanSee")] &&

                Player[Modules.import("ObjInstance")] &&

                Player.active &&

                Player.health &&

                Player.id !== Me.id &&

                !Me.team || Me.team !== Player.team

            )

                Enemy = Player;

        }.bind(this));

        let EnemyDirectionY = (Enemy && this.getYDirection(Me.z, Me.x, Me.y, Enemy.y, Enemy.z, Enemy.x));

        let EnemyDirectionX = (Enemy && this.getXDirection(Me , Enemy , Enemy));

        return ({

          EnemyDirectionY: EnemyDirectionY,

          EnemyDirectionX: EnemyDirectionX,

          Entity : Enemy

        });

    }


   static getYDirection(fromZ, fromX, toZ, toX) {


        return (Math.atan2(fromX - toX , fromZ - toZ ) || 0x0) * 0x3E8;

    }

   static getXDirection( { x: fromX, y: fromY, z: fromZ }, {x: toX, y: toY, z: toZ} , Enemy) {

       const JumpVel = Number(Modules.import("JumpVel"));

       const CrouchDst = Number(Modules.import("CrouchDst"));

       const CrouchVal = Modules.import("CrouchVal");


       toY -= ((Enemy[CrouchVal] * CrouchDst) + (this.Me[CrouchVal] * CrouchDst)) + (Enemy.jumpBobY * JumpVel);


        var r = Math.abs(fromY - toY),

            Distance = this.getDistance(fromX, fromY, fromZ, toX, toY, toZ);

        return ((Math.asin(r / Distance) * (fromY > toY ? -0x1 : 0x1)) || 0x0) - (this.Me[Modules.import("RecoilAnimY")] * 0.29) * 0x3E8;
    }

    static getDistance(fromX, fromY, fromZ, toX, toY, toZ) {

        const xD = (fromX - toX);

        const yD = (fromY - toY);

        const zD = (fromZ - toZ);

        return Math.hypot(xD, yD, zD);

    }

}



    class AimAssist {

       static Handler( Inputs , Me ) {

           this.Inputs = (Inputs);

           this.Me = (Me);

           this.Enemy = (getClosestEnemy.getEnemy( this.Me ));

           const {EnemyDirectionX , EnemyDirectionY , Entity} = (this.Enemy);

          if ( this.Inputs[0x6] && this.Enemy && Entity && (EnemyDirectionX && EnemyDirectionY) ) {


                this.Me = (null);

                this.Enemy = (null);


                return this.lookAt(EnemyDirectionX, EnemyDirectionY), (this.Inputs);

            }

        }

      static lookAt(xDir, yDir) {

            this.Inputs[0x2] = (xDir);

            this.Inputs[0x3] = (yDir);

        }



    }

    global.Function = new Proxy(Function, {

        construct(Target, Arguments) {

            const Structure = function(...TrackedFunction) {

                var KrunkerCore = (Arguments.length == 0x3 && Arguments[0x2]);


                if (KrunkerCore) {

                    const {
                        Modfied
                    } = new LoadScript(KrunkerCore);

                    Arguments[0x2] = Modfied

                };

                try {

                    return new Target(...Arguments).apply(this, TrackedFunction);

                } catch (error) {

                    error.stack = error.stack.replace(/(.*)/g, "no\n");

                    throw error;

                }

            }

            return (Structure);
        }

    });


document.ESP = "OFF";

    addEventListener("keydown", function({ keyCode }) {

        switch (keyCode) {

            case 113: // F2

               (document.ESP == "OFF") ? document.ESP ="ON" : document.ESP ="OFF";

            break;

        }

    });


    const onPlaying = () => {

        if (document.readyState == "complete" && Object.keys(modules).length == 0xA) {

            const {

                Me,
                JrIQ0: Inputs,

            } = (modules);


             AimAssist.Handler( Inputs[0] , Me[0] );



        } else {

            confirm("Failed to Inject\n Click (OK) to Reload Page.");
        }



    }

    document.onPlaying = (onPlaying);



})(window);

//....................../´¯/)
//....................,/¯../
//.................../..../
//............./´¯/'...'/´¯¯`·¸
//........../'/.../..../......./¨¯\
//........('(...´...´.... ¯~/'...')
//.........\.................'...../
//..........''...\.......... _.·´
//............\..............(
//..............\.............\...
// © Made By (~~ ## Cyper ) 2020 - 2021


/**

	 Developer :  Cyper#6887

**/