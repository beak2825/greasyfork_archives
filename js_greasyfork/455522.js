// ==UserScript==
// @name         Tab News - Sistema de Seguir Usuarios
// @namespace    cedroca-scripts
// @version      2.0
// @description  Sistema para Seguir Usuarios, tendo Notificação simples de Novos Posts
// @author       Diegiwg (Diego Queiroz)
// @run-at       document-start
// @match        https://www.tabnews.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tabnews.com.br
// @downloadURL https://update.greasyfork.org/scripts/455522/Tab%20News%20-%20Sistema%20de%20Seguir%20Usuarios.user.js
// @updateURL https://update.greasyfork.org/scripts/455522/Tab%20News%20-%20Sistema%20de%20Seguir%20Usuarios.meta.js
// ==/UserScript==

const TEMPO_DE_ATUALIZACAO_DOS_POSTS = 60_000;
const TEMPO_DE_ATUALIZACAO_DA_GUI = 200;

class BancoDeDados {
    constructor() {
        this.instancia = window.localStorage;
    }

    set(nome_usuario, valor) {
        const usuario = `tabnews-sistema-seguir-usuarios-${nome_usuario}`;
        this.instancia.setItem(usuario, JSON.stringify(valor));
    }

    get(nome_usuario) {
        const usuario = `tabnews-sistema-seguir-usuarios-${nome_usuario}`;
        return JSON.parse(this.instancia.getItem(usuario));
    }

    remove(nome_usuario) {
        const usuario = `tabnews-sistema-seguir-usuarios-${nome_usuario}`;
        this.instancia.removeItem(usuario);
    }

    usuarios_seguidos() {
        const usuarios = [];
        Object.keys(this.instancia).forEach((item) => {
            if (item.indexOf("tabnews-sistema-seguir-usuarios-") !== -1)
                usuarios.push(
                    item.replace("tabnews-sistema-seguir-usuarios-", "")
                );
        });
        return usuarios;
    }
}

async function fazer_requisicao_para_api(nome_usuario, pagina) {
    return await (
        await fetch(
            `https://www.tabnews.com.br/api/v1/contents/${nome_usuario}?strategy=new&page=${pagina}`
        )
    ).json();
}

async function buscar_posts_por_usuario(nome_usuario, pagina) {
    const resposta_da_api = await fazer_requisicao_para_api(
        nome_usuario,
        pagina
    );

    return resposta_da_api.filter((item) => {
        return item.title !== null;
    });
}

async function atualizar_dados_de_usuario(banco_de_dados, nome_usuario) {
    let dados_do_usuario = banco_de_dados.get(nome_usuario) || {
        existe: false,
        posts: {},
    };

    const posts = dados_do_usuario.posts;

    let pagina = 1;
    let continuar_loop = true;
    while (continuar_loop) {
        const resultado = await buscar_posts_por_usuario(nome_usuario, pagina);
        if (resultado.length === 0) continuar_loop = false;

        resultado.forEach((post) => {
            if (posts[post.id] !== undefined) return (continuar_loop = false);

            post.novo = dados_do_usuario.existe;
            posts[post.id] = post;
        });

        pagina++;
    }

    dados_do_usuario.existe = true;
    banco_de_dados.set(nome_usuario, dados_do_usuario);
}

function buscar_novos_posts_dos_usuarios_seguidos(banco_de_dados) {
    banco_de_dados
        .usuarios_seguidos()
        .forEach((nome_usuario) =>
            atualizar_dados_de_usuario(banco_de_dados, nome_usuario)
        );
}

function gerar_html_menu_seguidos(banco_de_dados) {
    const node_menu = document.querySelector('[role="menu"] li:nth-child(3)');
    const node_seguidos = document.querySelector("#menu-seguidos");

    if (node_menu === null) return;

    const html = (novos_posts) => {
        return `<li items="0" id="menu-seguidos" class="Item__LiBox-sc-yeql7o-0 ipvwXw"><a class="Link-sc-hrxz1n-0 bnQotb Link-sc-hrxz1n-0 bnQotb" href="/seguidos"><div data-component="ActionList.Item--DividerContainer" class="Box-sc-1gh2r6s-0 hwTILH"><span id="react-aria-20" class="Box-sc-1gh2r6s-0 kfLORv">Usuarios seguidos: novos conteúdos (${novos_posts})</span></div></a></li>`;
    };

    let novos_posts = 0;
    const usuarios = banco_de_dados.usuarios_seguidos();
    usuarios.forEach((nome_usuario) => {
        const dados = banco_de_dados.get(nome_usuario);
        const posts = Object.keys(dados.posts);
        posts.forEach((post) => {
            if (dados.posts[post].novo) novos_posts++;
        });
    });

    if (node_menu != null && node_seguidos == null)
        return (node_menu.outerHTML += html(novos_posts));

    if (node_seguidos.attributes.items !== novos_posts) {
        node_seguidos.attributes.items = novos_posts;
        node_seguidos.querySelector(
            "span"
        ).textContent = `Usuarios seguidos: novos conteúdos (${novos_posts})`;
    }
}

function gerar_html_botao_seguir(banco_de_dados) {
    const node_nome_usuario = document.querySelector(".Pagehead-sc-17d52hr-0");
    if (node_nome_usuario === null) return;
    const nome_usuario = node_nome_usuario.textContent.trim();
    const dados_usuario = banco_de_dados.get(nome_usuario);

    const node_botao_seguir = document.querySelector("#node-seguir");
    if (node_botao_seguir === null)
        return (node_nome_usuario.outerHTML += `<div id="node-seguir"></div>`);

    if (node_botao_seguir.className !== "node-seguir-style") {
        node_botao_seguir.style = `
            width: 100px;
            height: 30px;
            border: 1px solid rgb(20, 21, 22);
            border-radius: 20px;
            background-color: rgb(36, 41, 47);
            color: rgb(255, 255, 255);
            text-align: center;
        `;

        node_botao_seguir.className = "node-seguir-style";

        node_botao_seguir.onclick = () => {
            if (node_botao_seguir.textContent === "Seguir") {
                atualizar_dados_de_usuario(banco_de_dados, nome_usuario);
            } else {
                banco_de_dados.remove(nome_usuario);
            }
        };
    }

    if (dados_usuario === null) node_botao_seguir.textContent = "Seguir";
    else node_botao_seguir.textContent = "Seguindo";
}

function gerar_html_pagina_seguidos(banco_de_dados) {
    if (document.URL !== "https://www.tabnews.com.br/seguidos") return;
    const node_principal = document.querySelector(".kraPei");
    if (node_principal.id === "page-load") return;

    document.title = "Usuarios Seguidos";
    node_principal.innerHTML = "<ul></ul>";
    const node_lista_posts = node_principal.querySelector("ul");

    const usuarios = banco_de_dados.usuarios_seguidos();
    usuarios.forEach((nome_usuario) => {
        const dados = banco_de_dados.get(nome_usuario);
        const posts = Object.keys(dados.posts);
        posts.forEach((post_id) => {
            const post = dados.posts[post_id];
            let background = "#989898";
            if (post.novo) {
                background = "#d0d0d0";
                post.novo = false;
            }

            node_lista_posts.innerHTML += `
                <li style="
                        background: ${background};
                        color: #fff;
                        text-transform: capitalize;
                        padding: 10px;
                        border-radius: 10px;
                        margin-bottom: 10px;
                    ">
                <a href="https://www.tabnews.com.br/${post.owner_username}/${post.slug}">"${post.title}"</a>, postado por <a href="https://www.tabnews.com.br/${post.owner_username}">${post.owner_username}</a></li>
            `;
        });
        banco_de_dados.set(nome_usuario, dados);
    });

    node_principal.id = "page-load";
}

const banco_de_dados = new BancoDeDados();

setInterval(() => {
    gerar_html_menu_seguidos(banco_de_dados);
    gerar_html_botao_seguir(banco_de_dados);
    gerar_html_pagina_seguidos(banco_de_dados);
}, TEMPO_DE_ATUALIZACAO_DA_GUI);

setInterval(() => {
    buscar_novos_posts_dos_usuarios_seguidos(banco_de_dados);
}, TEMPO_DE_ATUALIZACAO_DOS_POSTS);