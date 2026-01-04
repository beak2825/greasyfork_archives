const config = {
    "endpoint_user": "https://ggmax.com.br/api/user",
    "endpoint_auth": "https://ggmax.com.br/api/auth",
    "endpoint_orders": "https://ggmax.com.br/api/orders",
    "endpoint_announcements": "https://ggmax.com.br/api/announcements",
}
async function refreshToken(ref_token) {
    ref_token = ref_token.replace('Bearer ', '');
    let body = JSON.stringify({
        refresh_token: ref_token
    });
    var req = await fetch(`${config.endpoint_auth}/refresh-token`, {
        "headers": {
            "content-type": "application/json",
        },
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    let json = await req.json();
    return json;
}

class user {
    constructor() {
        this.data = () => {
            let cookies = document.cookie.split('; ');
            let authData = cookies.find(cookie => cookie.startsWith('auth='));
            authData = JSON.parse(decodeURIComponent(authData.split('=')[1]));
            return {
                token: authData.accessToken,
                refreshToken: authData.refreshToken
            }
        }
    }
    cookies() {
        return {
            get: (cname) => {
                let name = cname + "=";
                let decodedCookie = decodeURIComponent(document.cookie);
                let ca = decodedCookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            },
            set: (cname, cvalue) => {
                document.cookie = `${encodeURIComponent(cname)}=${encodeURIComponent(cvalue)}`;
            }
        }
    }

    async refresh() {
        let data = this.data();
        const json = await refreshToken(data.refreshToken);

        if (json.success) {
            this.cookies().set('auth._refresh_token.local', json.data.token);
        }
    }

    async data() {
        let data = this.data();
        return data;
    }


}