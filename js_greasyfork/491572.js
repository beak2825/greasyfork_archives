function FC_login(url, data, locale) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Language': locale
        },
        body: JSON.stringify(data)
    });
}

function FC_getStakeUser(url, session) {
    let payload = {
        query:"query UserMeta($name: String, $signupCode: Boolean = false) {\n  user(name: $name) {\n    id\n    name\n    isMuted\n    isRainproof\n    isBanned\n    createdAt\n    campaignSet\n    selfExclude {\n      id\n      status\n      active\n      createdAt\n      expireAt\n    }\n    signupCode @include(if: $signupCode) {\n      id\n      code {\n        id\n        code\n      }\n    }\n  }\n}\n",
        variables:{}
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': session,
        },
        body: JSON.stringify(payload)
    });
}

function FC_ConversionRate(url, session) {
    let payload = {
        query: "query CurrencyConversionRate {\n  info {\n    currencies {\n      name\n      eur: value(fiatCurrency: eur)\n      jpy: value(fiatCurrency: jpy)\n      usd: value(fiatCurrency: usd)\n      ars: value(fiatCurrency: ars)\n      brl: value(fiatCurrency: brl)\n      cad: value(fiatCurrency: cad)\n      clp: value(fiatCurrency: clp)\n      cny: value(fiatCurrency: cny)\n      dkk: value(fiatCurrency: dkk)\n      idr: value(fiatCurrency: idr)\n      inr: value(fiatCurrency: inr)\n      krw: value(fiatCurrency: krw)\n      mxn: value(fiatCurrency: mxn)\n      pen: value(fiatCurrency: pen)\n      php: value(fiatCurrency: php)\n      pln: value(fiatCurrency: pln)\n      rub: value(fiatCurrency: rub)\n      try: value(fiatCurrency: try)\n      vnd: value(fiatCurrency: vnd)\n    }\n  }\n}\n"
        ,variables: {}
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': session,
        },
        body: JSON.stringify(payload)
    });
}