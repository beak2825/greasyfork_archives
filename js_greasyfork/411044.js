// ==UserScript==
// @name         gp-builder
// @namespace    https://grepolis.com
// @version      1.0
// @description  Grepolis Builder
// @author       Tiago Marques
// @match        https://*.grepolis.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/411044/gp-builder.user.js
// @updateURL https://update.greasyfork.org/scripts/411044/gp-builder.meta.js
// ==/UserScript==

const isCuratorEnabled = Game.premium_features.curator > Date.now() / 1000;
const blackList = [];

const buildingTownGroupName = null;
let buildingTownGroupId = -1;

const maxTimeBetweenRuns = 1000 * 60 * 10;
const minTimeBetweenRuns = 1000 * 60 * 5;
const timeBetweenRunsDifference = maxTimeBetweenRuns - minTimeBetweenRuns;

const maxTimeBetweenBuildings = 5000;
const minTimeBetweenBuildings = 1000;
const timeBetweenBuildingsDifference = maxTimeBetweenBuildings - minTimeBetweenBuildings;

const instructions = [
	{
		lumber: 20,
		stoner: 20,
		ironer: 20,
		storage: 15,
		farm: 10,
		barracks: 5,
		academy: 13,
		main: 25
	}, {
		lumber: 40,
		stoner: 40,
		ironer: 40,
		storage: 35,
		farm: 20
	}, {
		temple: 30,
		market: 30,
		hide: 10,
        academy: 36,
        farm: 45
	}, {
        docks: 30,
        statue: 1,
        thermal: 1,
        barracks: 30,
        //wall: 0,
		//theater: 0,
		//tower: 0,
		//trade_office: 0,
		//oracle: 0,
		//library: 0
    }
];

const compareResources = (resources, resources2) => {
	return (
		(resources.wood + resources.iron + resources.stone) >=
		(resources2.wood + resources2.iron + resources2.stone)
	);
};

const hasEnoughtResources = (town, resourcesNeeded) => {
	const resources = ITowns.towns[town].resources();
	if (resources.wood < resourcesNeeded.wood) return false;
	if (resources.iron < resourcesNeeded.iron) return false;
	if (resources.stone < resourcesNeeded.stone) return false;
	return true;
};

const isBlackListed = (name, level, town) => {
	return !!blackList.find(element => (
		element.name === name &&
		element.level === level &&
		element.town === town
	));
};

const townShouldBuild = (name, level, town, buildingData) => {
	return (
		!isBlackListed(name, buildingData.next_level, town) &&
		!buildingData.has_max_level &&
		hasEnoughtResources(town, buildingData.resources_for) &&
		buildingData.next_level <= level
	);
};

const findBuildingOrder = (targets, buildingData, townID) => {
	return Object.entries(targets).reduce((order, [name, level]) => {
		const data = buildingData[name];
		return (
			townShouldBuild(name, level, townID, data) &&
			(
				!order ||
				compareResources(buildingData[order.name].resources_for, data.resources_for)
			)
		) ? {
		    name: name,
		    level: data.next_level,
		    town: townID
		} : order;
	}, null);
};

const findBuildingsTargets = buildingData => {
	return instructions.find(targets => {
		return !!Object.entries(targets).find(([name, level]) => {
			return !buildingData[name].has_max_level && buildingData[name].next_level <= level;
		});
	});
};

const getOrders = () => {
	const models = Object.values(MM.getModels().BuildingBuildData || {});
	return models.reduce((orders, {attributes}) => {
		const townID = attributes.id;
		const buildingData = attributes.building_data;

		if (
			attributes.is_building_order_queue_full ||
			(isCuratorEnabled && !ITowns.town_group_towns.hasTown(buildingTownGroupId, townID))
		) return orders;

		const buildingsTargets = findBuildingsTargets(buildingData);
		console.log(`Name: ${ITowns.towns[townID].name}`, buildingsTargets);
		if (!buildingsTargets) return orders;

		const order = findBuildingOrder(buildingsTargets, buildingData, townID);
		if (order) orders.push(order);
		return orders;
	}, []);
};

const buildOrder = async order => {
	return new Promise((resolve, reject) => {
		gpAjax.ajaxPost('frontend_bridge', 'execute', {
			model_url: 'BuildingOrder',
			action_name: 'buildUp',
			arguments: {building_id: order.name},
			town_id: order.town
		}, false, {
			success: resolve,
			error: reject
		});
	});
};

const updateTownGroup = buildingTownGroupName => {
	const buildingTownGroup = ITowns.town_groups.models.find(model => model.getName() === buildingTownGroupName);
	if (buildingTownGroup) buildingTownGroupId = buildingTownGroup.id;
};

const freeze = time => new Promise(resolve => setTimeout(resolve, time));

const build = async () => {
	const orders = getOrders();
	console.log(orders);
	if (orders.length === 0) return;
	for (const order of orders) {
		try {
			await buildOrder(order);
			console.log(`Building ${order.name} level ${order.level} in ${ITowns.towns[order.town].name}`);
		} catch(error) {
			console.log(order);
			blackList.push(order);
		}
		const delay = Math.floor(Math.random() * timeBetweenBuildingsDifference) + minTimeBetweenBuildings;
		await freeze(delay);
	}
	await build();
};

const run = async () => {
	const delay = Math.floor(Math.random() * timeBetweenRunsDifference) + minTimeBetweenRuns;
	await build();
	await freeze(delay);
	await run();
};

jQuery.Observer(GameEvents.game.load).subscribe(async () => {
	await freeze(2000);
	if (buildingTownGroupName && isCuratorEnabled) updateTownGroup(buildingTownGroupName);
	run();
});