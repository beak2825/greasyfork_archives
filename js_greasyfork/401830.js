var mock = {
    sentence: (max = 4) => {
        const spc = ` `;
        const src = [
            `make it bark`, `rub face`, `always hungry`,
            `rub face`, `make it bark`, `midnight zoomies`,
            `cough hairball`, `chase mice`, `run in circles`,
            `destroy dog`, `spit up`, `let me out`, `let me in`,
        ];
        let output = ``;
        for (let i = 0; i < max; i++) {
            output += src[mock.rnd(src.length - 1)] + spc;
        }
        return output;
    },
    user: function () {
        var firstName = ["Roosevelt", "Kacy", "Wilbert", "Kory", "Freddy", "Addie", "Cherie", "Troy", "Iluminada", "Scot", "Tona", "Orval", "Shondra", "Monica", "Shauna", "Kimbery", "Waylon", "Pura", "Brian", "Emilee"];
        var lastName = ["Lomanto", "Deckert", "Arrowood", "Juhasz", "Kennan", "Pizzo", "Canales", "Choe", "Pavlick", "Weatherford", "Pentz", "Hughey", "Kieser", "Stabile", "Griffy", "Lechuga", "Langlais", "Mcguigan", "Niday", "Bridgeforth"];
        var randomFirst = mock.rnd(firstName.length);
        var randomLast = mock.rnd(lastName.length);
        var randomPhone = mock.rnd();
        var randomDate = mock.rnd(10);
        return {
            id: mock.uuid(),
            first: firstName[randomFirst],
            last: lastName[randomLast],
            full: firstName[randomFirst] + " " + lastName[randomLast],
            email: firstName[randomFirst] + "." + lastName[randomLast] + "@gmail.com",
            phone: randomPhone,
            date: (randomDate + 1) + "/15/201" + randomDate
        };
    },
    rnd: (mx = 10000000) => {
        return Math.floor(Math.random() * mx);
    },
    uuid: () => {
        const windowObj = window;
        const winCrypto = windowObj.crypto || windowObj.msCrypto;
        if (winCrypto) {
            let index = winCrypto.getRandomValues(new Uint32Array(1))[0];
            index = +`${index}`.substr(0, 1);
            const uuid = winCrypto.getRandomValues(new Uint32Array(10))[index];
            return uuid;
        } else {
            return mock.rnd();
        }
    },
    tableRow: function (howMany) {
        if (howMany == null) howMany = 1;
        var dataArray = [];
        for (var intI = 0; intI < howMany; intI++) {
            var user = mock.user();
            dataArray.push({
                data: [
                    user.id,
                    user.full,
                    "Eget Incorporated",
                    "9557",
                    user.date,
                    user.email,
                    user.phone,
                    "<a href='//www.dell.com'>Dell Home Page</a>"
                ],
                details: user.full + " details"
            });
        }
        return dataArray;
    }
};