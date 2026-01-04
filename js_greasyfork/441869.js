// ==UserScript==
// @name        KPD
// @license     MIT
// @version     1.1
// @description Kogama Packet Decoder
// @author      0vC4
// @namespace   https://greasyfork.org/users/670183
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @run-at      document-start
// ==/UserScript==





const KPD = (() => {
	const code2type = code => Object.fromEntries(Object.entries(code).map(a=>a.reverse()));

	const PhotonCode = {ClientKey:1,ModeKey:2,ServerKey:1,InitEncryption:0,Ping:1,Ok:0};
	const MVOpCode = {RegisterWorldObject:0,UnregisterWorldObject:1,UpdateWorldObject:2,UpdateWorldObjectData:3,UpdateWorldObjectDataPartial:4,RemoveWorldObjectDataPartial:5,TransferOwnership:6,UpdatePrototype:7,UpdatePrototypeScale:8,AddLink:9,RemoveLink:10,PublishPlanet:11,AddPrototypeToInventory:12,RemoveItemFromInventory:13,UpdateInventorySlots:14,RequestFriendshipByProfileId:15,RequestAcceptFriendship:16,RequestRejectFriendship:17,TriggerBoxEnter:18,TriggerBoxExit:19,LockHierarchy:20,UploadScreenshot:21,RequestWoUniquePrototype:22,ReportCaptureFlag:23,ResetLogicChunk:24,UpdateWorldObjectRunTimeData:25,UpdateLineOfFire:26,WorldObjectRPCOperation:27,PostGameMsg:28,SetTeam:29,AddObjectLink:30,RemoveObjectLink:31,TransferWorldObjectsToGroup:32,CloneWorldObjectTree:33,AddPlanetToPlanet:34,PurchaseProduct:35,GetNextGameBatch:36,RequestBuiltInItem:37,AddItemToWorld:38,AddWorldObjectToInventory:39,AddWorldObjectToInventoryDev:40,SetActiveAvatar:41,ResetAvatar:42,GetMarketPlaceItem:43,AddItemToMarketPlace:44,RemoveItemFromMarketPlace:45,SetAvatarAccessorySlot:46,AttachWorldObjectToSeat:47,DetachWorldObjectFromVehicle:48,SpawnVehicleWithDriver:49,ClientLog:50,UpdateAvatarAccessoryOffset:51,RuntimeEvent:52,ResetTerrain:53,AddAvatarToAvatarShopInventory:54,DeleteAvatarFromShopInventory:55,LevelChanged:56,Ban:57,Syncronize:58,SwitchAvatar:59,SyncronizePing:60,JoinNotification:61,UploadBytes:62,Notification:63,CloneWorldObjectTreeWithPosition:64,CloneTempWorldObjectWithOriginalReference:65,LogicActivateRequest:66,AdminOperation:67,OwnerOperation:68,ResetFirstTimeEvents:83,SetFirstTimeEvent:84,OverrideFirstTimeEvent:85,GetResetAvatar:86,ClaimPlayingNewGameRewardedGold:87,PostChatMsg:88,SetSayChatBubbleVisible:93,ReportReachedTimeAttackFlag:94,RequestAccessoryData:95,UnEquipAccessory:96,SetHighlightToSeen:97,ResetHighlights:98,UpdateAvatarAccessoryScale:99,GetThemesData:100,SetMouseSensitivity:101,StartSessionTime:102,ResetPlayerPlanetData:103,GetHighScoreList:104,SetGamePassTierOperation:105,SetGamePassTierToSeenOperation:106,SetEarningsReportToSeenOperation:107,GetTopHighScoreList:108,ClaimGamePointWelcomeReward:109,UpdateGold:110,SetActiveSpawnRole:111,CustomDevCommands:112,CreateSpawnRole:113,GetAvatarBodies:114,SetSpawnRoleBody:115,TogglePreviewTierOperation:116,ClaimRewardedAdXP:117,IncrementStatRequest:118,Undefined:119,Join:255,Leave:254,RaiseEvent:253,SetProperties:252,GetProperties:251,Ping:249};
	const MVECode = {NoCodeSet:0,UnregisterWorldObject:1,UpdateWorldObject:2,UpdateWorldObjectData:3,UpdateWorldObjectDataPartial:4,RemoveWorldObjectDataPartial:5,TransferOwnership:6,UpdateNetworkInput:7,RegisterPrototype:8,UnregisterPrototype:9,UpdatePrototype:10,UpdatePrototypeScale:11,UpdateTerrain:12,AddLink:13,RemoveLink:14,RemoveItemFromInventory:15,FriendRequest:16,FriendUpdate:17,TriggerBoxEnter:18,TriggerBoxExit:19,TriggerBoxStayBegin:20,TriggerBoxStayEnd:21,Clone:22,LockHierarchy:23,BlueprintCreationDone:24,WoUniquePrototype:25,GameStateChange:26,SyncAvatarStatus:27,ResetLogicChunk:28,UpdateWorldObjectRunTimeData:29,PickupItemStateChange:30,UpdateLineOfFire:31,WorldObjectRPCEvent:32,XPReceivedEvent:33,PostGameMsgEvent:34,SetTeam:35,AddObjectLink:36,RemoveObjectLink:37,TransferWorldObjectsToGroup:38,CloneWorldObjectTree:39,GetGameBatch:40,GameQueryReady:41,PostWinnerReport:42,CollectiblePickedUp:43,SetWorldObjectsToPurchasedEvent:44,AchievementUnlockedEvent:45,AttachWorldObjectToSeat:46,DetachWorldObjectFromVehicle:47,SpawnVehicleWithDriver:48,Reward:49,RuntimeEvent:50,ResetTerrainEvent:51,UpdateGameStat:52,UpdateGameStatType:53,UpdateAvatarMetaData:54,LevelChanged:55,GameBoostEvent:56,NotificationEvent:57,RequestMaterials:58,GetPlanetOwnershipTypes:59,GetItemCategories:60,SetupUserPlayMode:61,GameSnapshotData:62,SetActorReady:63,RequestFriends:64,GetItemInventory:65,GetItemShopInventory:66,GetBuiltInItemBusinessData:67,LargeDBQueryAvatarShopInventory:68,InitializeAvatarEdit:69,GetActiveAvatar:70,PendingByteDataBatch:71,SwitchAvatar:72,SyncronizePing:73,StartRewardCountDown:74,RewardIsReady:75,NumberOfPendingRewards:76,JoinNotification:77,CloneWorldObjectTreeWithPosition:78,CloneTempWorldObjectWithOriginalReferenceEvent:79,LogicObjectFiringStateChange:80,LogicFrame:81,CollectTheItemDropOff:82,LogicFastForward:83,LogicFastForwardEventImmediate:84,ForceDetachWorldObjectFromVehicle:85,XPReward:86,GetProfileMetaData:87,ServerError:88,SetSayChatBubbleVisible:89,GetPublishedPlanetProfileData:90,PlayerPlanetData:91,PlayerPlanetRemote:92,HighScores:93,GoldRewardedForLevel:94,NextLevelGoldReward:95,PlayerTierStateCalculatorChanged:96,GetProjectEarnings:97,TopHighScores:98,GetKogamaVat:99,GetSubscriptionPerksData:100,SetupUserAvatarEdit:101,SetupUserBuildMode:102,SetActiveSpawnRole:103,ReplicateSpawnRoleData:104,SetSpawnRoleBody:105,XPRewardedAdReady:106,Join:255,Leave:254,PropertiesChanged:253};
	const GpCode = {
		Unknown: 0,
		Null: 42,
		Dictionary: 68,
		StringArray: 97,
		Byte: 98,
		Custom: 99,
		Double: 100,
		EventData: 101,
		Float: 102,
		Hashtable: 104,
		Integer: 105,
		Short: 107,
		Long: 108,
		IntegerArray: 110,
		Boolean: 111,
		OperationResponse: 112,
		OperationRequest: 113,
		String: 115,
		ByteArray: 120,
		Array: 121,
		ObjectArray: 122
	};

	const GpType = code2type(GpCode);
	const MVEType = code2type(MVECode);
	const MVOpType = code2type(MVOpCode);
	const PhotonType = code2type(PhotonCode);





	const take = arr => new DataView(Uint8Array.from(arr).buffer);
	const put = (num, typed) => [...new Uint8Array(typed.of(num).buffer).reverse()];
	const GpValue = {
		get: {
			Unknown: arr => ({Type: GpType[arr.shift()], Value: null}),
			Null: arr => ({Type: GpType[arr.shift()], Value: null}),
			Dictionary: arr => {
				let Type = GpType[arr.shift()];
				let TKey = GpType[arr.shift()];
				let TValue = GpType[arr.shift()];
				let Size = take(arr.splice(0,2)).getInt16();
				let Value = [];

				let i = 0;
				while (i++ < Size) {
					if (!(TKey == "Unknown" || TKey == "Null")) arr.unshift(GpCode[TKey]);
					let key = GpValue.get[GpType[arr[0]]](arr);

					if (!(TValue == "Unknown" || TValue == "Null")) arr.unshift(GpCode[TValue]);
					let value = GpValue.get[GpType[arr[0]]](arr);

					Value.push([key, value]);
				}

				return {Type, TKey, TValue, Size, Value,
					get (key) {
						let slot = this.Value.find(s=>s[0].Value == key);
						if (slot) return slot[1];
						return null;
					},
					keys () {
						return this.Value.map(s=>s[0].Value);
					},
					set (key, value) {
						let slot = this.Value.find(s=>s[0].Value == key.Value);
						if (slot) slot[1] = value;
						else this.Value.push([key, value]);
					}
				};
			},
			StringArray: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			Byte: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,1)).getUint8()}),
			Custom: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			Double: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,8)).getFloat64()}),
			EventData: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			Float: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,4)).getFloat32()}),
			Hashtable: arr => {
				let Type = GpType[arr.shift()];
				let Size = take(arr.splice(0,2)).getInt16();
				let Value = [];

				let i = 0;
				while (i++ < Size) {
					let key = GpValue.get[GpType[arr[0]]](arr);
					let value = GpValue.get[GpType[arr[0]]](arr);
					Value.push([key,value]);
				}

				return {Type, Size, Value};
			},
			Integer: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,4)).getInt32()}),
			Short: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,2)).getInt16()}),
			Long: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,8)).getBigInt64()}),
			IntegerArray: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			Boolean: arr => ({Type: GpType[arr.shift()], Value: take(arr.splice(0,1)).getUint8() > 0}),
			OperationResponse: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			OperationRequest: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			},
			String: arr => {
				let Type = GpType[arr.shift()];
				let Size = take(arr.splice(0,2)).getInt16();
				let Value = new TextDecoder().decode(Uint8Array.from(arr.splice(0, Size)));
				return {Type, Size, Value};
			},
			ByteArray: arr => {
				let Type = GpType[arr.shift()];
				let Size = take(arr.splice(0,4)).getInt32();
				let Value = Uint8Array.from(arr.splice(0, Size));
				return {Type, Size, Value};
			},
			Array: arr => {
				let Type = GpType[arr.shift()];
				let Size = take(arr.splice(0,2)).getInt16();
				let TValue = GpType[arr.shift()];
				let Value = [];

				let i = 0;
				while (i++ < Size) {
					arr.unshift(GpCode[TValue]);
					let value = GpValue.get[GpType[arr[0]]](arr);
					Value.push(value);
				}

				return {Type, Size, TValue, Value};
			},
			ObjectArray: arr => {
				/*
								let Type = GpType[arr.shift()];
								let Size = take(arr.splice(0,2)).getInt16();
								let Value = [];

								let i = 0;
								while (i++ < Size) {
									let value = GpValue.get[arr[0]](arr);
									Value.push(value);
								}

								return {Type, Size, Value};
				*/
				console.log(GpType[arr[0]], arr.slice(0));
			}
		},



		set: {
			Unknown: data => [GpCode[data.Type]],
			Null: data => [GpCode[data.Type]],
			Dictionary: data => {
				let arr = [GpCode[data.Type], GpCode[data.TKey], GpCode[data.TValue], ...put(data.Size, Int16Array)];

				for (let slot of data.Value) {
					let key = GpValue.set[slot[0].Type](slot[0]);
					if (!(data.TKey == "Unknown" || data.TKey == "Null")) key.splice(0,1);

					let value = GpValue.set[slot[1].Type](slot[1]);
					if (!(data.TValue == "Unknown" || data.TValue == "Null")) value.splice(0,1);

					arr.push(...key, ...value);
				}

				return arr;
			},
			StringArray: data => [GpCode[data.Type]],
			Byte: data => [GpCode[data.Type], ...put(data.Value, Uint8Array)],
			Custom: data => [GpCode[data.Type]],
			Double: data => [GpCode[data.Type], ...put(data.Value, Float64Array)],
			EventData: data => [GpCode[data.Type]],
			Float: data => [GpCode[data.Type], ...put(data.Value, Float32Array)],
			Hashtable: data => {
				let arr = [GpCode[data.Type], ...put(data.Size, Int16Array)];

				for (let slot of data.Value) {
					let key = GpValue.set[slot[0].Type](slot[0]);
					let value = GpValue.set[slot[1].Type](slot[1]);
					arr.push(...key,...value);
				}

				return arr;
			},
			Integer: data => [GpCode[data.Type], ...put(data.Value, Int32Array)],
			Short: data => [GpCode[data.Type], ...put(data.Value, Int16Array)],
			Long: data => [GpCode[data.Type], ...put(data.Value, BigInt64Array)],
			IntegerArray: data => [GpCode[data.Type]],
			Boolean: data => [GpCode[data.Type], ...put(data.Value > 0, Uint8Array)],
			OperationResponse: data => [GpCode[data.Type]],
			OperationRequest: data => [GpCode[data.Type]],
			String: data => [GpCode[data.Type], ...put(data.Size, Int16Array), ...new TextEncoder().encode(data.Value)],
			ByteArray: data => [GpCode[data.Type], ...put(data.Size, Int32Array), ...data.Value],
			Array: data => {
				let arr = [GpCode[data.Type], ...put(data.Size, Int16Array), GpCode[data.TValue]];

				for (let value of data.Value) {
					arr.push(...GpValue.set[value.Type](value).slice(1));
				}

				return arr;
			},
			ObjectArray: data => [GpCode[data.Type]]
		}
	};





	const typeOf = packet => {
		const MagicNumber = packet[0];
		if (MagicNumber == 0xF0) return "Ping";
		
		const flag = packet[1]&127;
		const code = packet[2];
		if (flag == 7 && code == PhotonCode.Ping) return "Ping";

		return {
			1: "Connected",
			2: MVOpType[code],
			3: MVOpType[code],
			4: MVEType[code],
			6: "Ping",
			7: MVOpType[code],
			8: "UnknownMessage",
			9: "Unknown"
		}[flag] || "Unknown";
	};





	const getParams = packet => {
		const data = {};

		const size = take(packet.splice(0,2)).getInt16();
		let i = 0;

		while (i < size) {
			data[packet.shift()] = GpValue.get[GpType[packet[0]]](packet);
			i++;
		}

		return data;
	};
	const decode = packet => {
		const type = typeOf(packet);
		if (type == "Ping" || type == "Unknown" || type == "Connected") return null;

		const flag = packet[1]&127;
		if (flag != 1 && (packet[1]&128) > 0) return null; //need decrypt message

		const data = {};
		data.magicNumber = packet.shift();
		data.flag = packet.shift();
		if (flag == 8) {
			data.message = GpValue.get[GpType[packet[0]]](packet);
			return data;
		}

		data.opCode = (flag == 4 ? MVEType : MVOpType)[packet.shift()];
		if (flag == 3 || flag == 7) {
			data.returnCode = take(packet.splice(0,2)).getInt16();
			data.debugMessage = GpValue.get[GpType[packet[0]]](packet);
		}
		data.params = getParams(packet);

		return data;
	};





	const setParams = data => {
		const packet = [];

		packet.push(...put(Object.keys(data.params).length, Int16Array));

		for (const slot in data.params) {
			const value = data.params[slot];
			packet.push(+slot, ...GpValue.set[value.Type](value));
		}

		return packet;
	};
	const encode = data => {
		if (typeof data == null) return null;
		if (typeof data !== 'object') return [...data];

		const packet = [];
		packet.push(data.magicNumber, data.flag);

		const flag = data.flag&127;
		if (flag == 8) {
			packet.push(...GpValue.set[data.message.Type](data.message));
			return packet;
		}

		packet.push((flag == 4 ? MVECode : MVOpCode)[data.opCode]);
		if (flag == 3 || flag == 7) {
			packet.push(...put(data.returnCode, Int16Array));
			packet.push(...GpValue.set[data.debugMessage.Type](data.debugMessage));
		}
		packet.push(...setParams(data));

		return packet;
	};





	return {
		typeOf,
		decode,
		encode
	};
})();
// 0vC4#7152