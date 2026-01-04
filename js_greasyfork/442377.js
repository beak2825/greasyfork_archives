// ==UserScript==
// @name		KWD
// @license     MIT
// @version		1.0
// @description	Kogama World Decoder
// @author		0vC4
// @namespace   https://greasyfork.org/users/670183
// @match       http://*/*
// @match       https://*/*
// @grant		none
// @run-at		document-start
// ==/UserScript==





const KWD = (() => {
    const worker = new Worker(window.URL.createObjectURL(new Blob(["onmessage=" + (e => {
        let arr = e.data.buffer;
        let world = {
            inv: [],
            obj: [],
            link: [],
            olink: [],
            runtime: []
        };


        function gett(arr, l = 1) {
            if (!arr.i) arr.i = 0;
            arr.i += l;
            return arr.slice(arr.i - l, arr.i);
        };


        const WorldObjectCode = { PlayModeAvatar: 0, CubeModel: 1, PointLight: 2, TriggerBox: 3, Mover: 4, Path: 5, PathNode: 6, SpawnPoint: 7, CubeModelPrototypeTerrain: 8, Group: 9, Action: 10, BlueprintActivator: 11, ParticleEmitter: 12, SoundEmitter: 13, BlueprintFire: 14, BlueprintSmoke: 15, BlueprintExplosion: 16, Flag: 17, TestLogicCube: 18, Battery: 19, ToggleBox: 20, Negate: 21, And: 22, Explosives: 23, TextMsg: 24, Fire: 25, Smoke: 26, TimeTrigger: 27, Teleporter: 28, Goal: 29, PickupItemHealthPack: 30, PickupItemCenterGun: 31, CubeModelTerrainFineGrained: 32, PressurePlate: 33, PickupItemImpulseGun: 34, PickupItemBazookaGun: 35, PickupItemRailGun: 36, PickupItemSpawner: 37, Skybox: 38, SpawnPointRed: 39, SpawnPointGreen: 40, SpawnPointYellow: 41, SpawnPointBlue: 42, ModelToggle: 43, WaterPlane: 44, Blueprint: 45, PulseBox: 46, RandomBox: 47, SentryGun: 48, CollectibleItem: 49, MovingPlatformNode: 50, WaterPlanePreset: 51, LightPreset: 52, Ghost: 53, PickupCubeGun: 54, CheckPoint: 55, HoverCraft: 56, WorldObjectSpawnerVehicle: 57, MonoPlane: 58, JetPack: 59, RoundCube: 60, AdvancedGhost: 61, HamsterWheel: 62, KillLimit: 63, OculusKillLimit: 64, CountingCube: 65, Jakob4: 118, Jakob5: 119, Jakob6: 120, Jakob7: 121, Jakob8: 122, Jakob9: 123, Jakob10: 124, Jakob11: 125, Jakob12: 126, Jakob13: 127, Jakob14: 128, Jakob15: 129, GamePoint: 130, GamePassProgressionDataObject: 131, Christian3: 132, BuildModeAvatar: 133, AvatarSpawnRoleCreator: 134, GameOptionsDataObject: 135, Christian7: 136, Christian8: 137, Christian9: 138, Christian10: 139, Christian11: 140, Christian12: 141, Christian13: 142, Christian14: 143, Christian15: 144, CameraSettings: 145, GravityCube: 146, GameCoin: 148, GameCoinChest: 149, Theme: 150, Caspar7: 151, Caspar8: 152, Caspar9: 153, Caspar10: 154, Caspar11: 155, Caspar12: 156, Caspar13: 157, Caspar14: 158, Caspar15: 159, ShrinkGun: 160, TeamEditor: 161, TriggerCube: 162, Thomas4: 163, CollectTheItemCollectableInstance: 164, ShootableButton: 165, UseLever: 166, CollectTheItemDropOff: 167, CollectTheItemCollectable: 168, CollectTheItem: 169, WindTurbine: 170, GlobalSoundEmitter: 171, Mathias3: 172, Mathias4: 173, Mathias5: 174, Mathias6: 175, Mathias7: 176, Mathias8: 177, Mathias9: 178, Mathias10: 179, TimeAttackFlag: 180, GamePointChest: 181, Marcus3: 182, Marcus4: 183, Marcus5: 184, Marcus6: 185, Marcus7: 186, Marcus8: 187, Marcus9: 188, Marcus10: 189 };
        const WorldObjectType = Object.fromEntries(Object.entries(WorldObjectCode).map(a => a.reverse()));
        const take = arr => new DataView(Uint8Array.from(arr).buffer);
        const r7bit = arr => { let r = 0, e = 0; for (; 35 != e;) { let f = arr[arr.i + e / 7]; if (r |= (127 & f) << e, 0 == (128 & f)) return [r, e / 7 + 1]; e += 7 } };

        const getCubes = arr => {
            let chunk = [];

            let num = take(gett(arr, 4)).getInt32();
            for (let i = 0; i < num; i++) {
                let cube = {};
                cube.x = take(gett(arr, 2)).getInt16();
                cube.y = take(gett(arr, 2)).getInt16();
                cube.z = take(gett(arr, 2)).getInt16();
                cube.flags = gett(arr);
                if ((cube.flags & 1) == 0) cube.shape = gett(arr, 8);
                if ((cube.flags & 2) == 0) cube.materials = gett(arr, 6);
                else cube.id = gett(arr);
                chunk.push(cube);

                for (let i2 = 1; i2 < (cube.flags >> 2); i2++) {
                    let clone = Object.assign({}, cube);
                    if ((cube.flags & 1) == 0) clone.shape = [...cube.shape];
                    if ((cube.flags & 2) == 0) clone.materials = [...cube.materials];
                    clone.x += i2;
                    chunk.push(clone);
                }
            }

            return chunk;
        };
        const takeString = arr => {
            let Slen = r7bit(arr);
            gett(arr, Slen[1]);
            return new TextDecoder().decode(new Uint8Array([...gett(arr, Slen[0])]));
        };
        const takeHashTable = arr => {
            let params = {};
            let num = take(gett(arr, 4)).getInt32();
            if (num > 1e3) throw "Hashtable size limit";
            for (let i = 0; i < num; i++) {
                let key = takeString(arr);
                let type = take(gett(arr)).getUint8();
                let value = 0;
                let len2 = 0;
                switch (type) {
                    case 0:
                        value = take(gett(arr, 4)).getInt32();
                        break;
                    case 1:
                        value = [];
                        len2 = take(gett(arr, 4)).getInt32();
                        for (let i = 0; i < len2; i++) {
                            value.push(take(gett(arr, 4)).getInt32());
                        }
                        break;
                    case 2:
                        value = take(gett(arr, 4)).getFloat32();
                        break;
                    case 3:
                        value = [];
                        len2 = take(gett(arr, 4)).getInt32();
                        for (let i = 0; i < len2; i++) {
                            value.push(take(gett(arr, 4)).getFloat32());
                        }
                        break;
                    case 5:
                        value = take(gett(arr)).getUint8() > 0;
                        break;
                    case 6:
                        value = [];
                        len2 = take(gett(arr, 4)).getInt32();
                        for (let i = 0; i < len2; i++) {
                            value.push(take(gett(arr)).getUint8() > 0);
                        }
                        break;
                    case 7:
                        value = takeString(arr);
                        break;
                    case 8:
                        value = takeHashTable(arr);
                        break;
                    case 9:
                        value = take(gett(arr)).getUint8();
                        break;
                    case 10:
                        value = take(gett(arr, 8)).getBigInt64();
                        break;
                    case 11:
                        value = [];
                        len2 = take(gett(arr, 4)).getInt32();
                        for (let i = 0; i < len2; i++) {
                            value.push(take(gett(arr, 8)).getBigInt64());
                        }
                        break;
                }
                params[key] = value;
            }
            return params;
        };

        num = take(gett(arr, 4)).getInt32();
        for (let i = 0; i < num; i++) {
            let cubeModel = {}

            cubeModel.id2 = take(gett(arr, 4)).getInt32();
            cubeModel.scale = take(gett(arr, 4)).getFloat32();
            cubeModel.profileId = take(gett(arr, 4)).getInt32();
            cubeModel.cubes = getCubes(gett(arr, take(gett(arr, 4)).getInt32()));

            world.inv.push(cubeModel);
        }

        num = take(gett(arr, 4)).getInt32();
        for (let i = 0; i < num; i++) {
            let id1 = take(gett(arr, 4)).getInt32();
            let groupId = take(gett(arr, 4)).getInt32();
            let itemId = take(gett(arr, 4)).getInt32();
            let type = take(gett(arr, 4)).getInt32();
            type = WorldObjectType[type] || type;
            let posX = take(gett(arr, 4)).getFloat32();
            let posY = take(gett(arr, 4)).getFloat32();
            let posZ = take(gett(arr, 4)).getFloat32();
            let rotX = take(gett(arr, 4)).getFloat32();
            let rotY = take(gett(arr, 4)).getFloat32();
            let rotZ = take(gett(arr, 4)).getFloat32();
            let rotW = take(gett(arr, 4)).getFloat32();
            let scaleX = take(gett(arr, 4)).getFloat32();
            let scaleY = take(gett(arr, 4)).getFloat32();
            let scaleZ = take(gett(arr, 4)).getFloat32();
            let data = takeHashTable(arr);
            let owner = take(gett(arr)).getUint8();
            let ownerId = null;
            if ((owner & 1) != 0) ownerId = take(gett(arr, 4)).getInt32();
            if ((owner & 2) != 0) ownerId = take(gett(arr, 4)).getInt32();
            let data2 = takeHashTable(arr);

            world.obj.push({
                id1, groupId, itemId, type,
                pos: { x: posX, y: posY, z: posZ },
                rot: { x: rotX, y: rotY, z: rotZ, w: rotW },
                scale: { x: scaleX, y: scaleY, z: scaleZ },
                data, owner, ownerId, data2
            });
        }

        num = take(gett(arr, 4)).getInt32();
        for (let i = 0; i < num; i++) {
            let id3 = take(gett(arr, 4)).getInt32();
            let input = take(gett(arr, 4)).getInt32();
            let output = take(gett(arr, 4)).getInt32();
            world.link.push({ id3, input, output });
        }

        num = take(gett(arr, 4)).getInt32();
        for (let i = 0; i < num; i++) {
            let id3 = take(gett(arr, 4)).getInt32();
            let input = take(gett(arr, 4)).getInt32();
            let output = take(gett(arr, 4)).getInt32();
            world.olink.push({ id3, input, output });
        }

        num = take(gett(arr, 4)).getInt32();
        for (let i = 0; i < num; i++) { // Runtime
            let hit = {};

            let code = gett(arr);
            if (code == 1 || code == 2 || code == 5) { // cube
                hit.id = code == 1 ? gett(arr) : -1;
                if (code == 1) hit.flags = 7;
                hit.x = take(gett(arr, 2)).getInt16();
                hit.y = take(gett(arr, 2)).getInt16();
                hit.z = take(gett(arr, 2)).getInt16();
                hit.type = 'cube';
                hit.action = hit.id >= 0 ? 2 : 0;
            } else if (code == 3 || code == 4 || code >= 6 && code <= 10 || code == 15 || code == 16) { // explosion
                hit.x = take(gett(arr, 2)).getInt16();
                hit.y = take(gett(arr, 2)).getInt16();
                hit.z = take(gett(arr, 2)).getInt16();
                hit.type = 'exp';
            }

            world.runtime.push(hit);
        }

        world.invWorld = world.inv.find(inv => inv.id2 == 238);
        world.invGun = world.inv.find(inv => inv.id2 >= 1000 && inv.profileId == -1);

        self.postMessage(world);
    }).toString()], { type: "text/javascript" })))

    return {
        buffer: [],
        push(arr) {
            while (arr.flat().length != arr.length) arr = arr.flat();
            this.buffer.push(...arr);
            return this;
        },
        then(callback) {
            worker.postMessage({ buffer: this.buffer });
            this.buffer = [];
            worker.onmessage = e => callback(e.data);
            return this;
        },
    }
})();