    window.sortEntities = (...options) => {
        var optionMatchMap = {};
        for(let i in game.world.entities) {
            let match = [];
            let ei = game.world.entities[i].targetTick;
            let opCount = 0;

            options.forEach((option => {
                option.attrs.forEach((attr => {
                    try {
                        match.push(ei[attr.name] === attr.eq);
                    } catch {
                        match.push(false);
                    };
                }));
                if(match.includes(true)) {
                    optionMatchMap[opCount] = {
                        eq: match,
                        uid: i
                    };
                };
                opCount++;
            }));
        };
        return optionMatchMap;
    };